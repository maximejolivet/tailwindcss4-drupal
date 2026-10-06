import { readFileSync, existsSync } from 'fs';
import { globSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const themeRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const files = globSync('components/**/*.component.yml', { cwd: themeRoot });

let errors = 0;

function fail(file, message) {
  errors += 1;
  console.error(`\x1b[31m✗\x1b[0m ${file}: ${message}`);
}

for (const relFile of files) {
  const file = path.join(themeRoot, relFile);
  const base = relFile.replace(/\.component\.yml$/, '');
  let definition;

  try {
    definition = yaml.load(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(relFile, `invalid YAML — ${error.message}`);
    continue;
  }

  if (!definition || typeof definition !== 'object') {
    fail(relFile, 'empty or non-object component definition');
    continue;
  }

  if (!definition.name) {
    fail(relFile, 'missing required key "name"');
  }
  if (!definition.status) {
    fail(relFile, 'missing required key "status"');
  }

  const props = definition.props;
  if (props) {
    if (props.type !== 'object') {
      fail(relFile, 'props.type must be "object"');
    }
    if (!('properties' in props)) {
      // Drupal core's ComponentValidator::nullifyClassPropsSchema() assumes
      // `properties` is always present once `type: object` is set, and
      // throws PHP warnings (foreach on null, undefined array key) at
      // render time otherwise. Components with no props still need an
      // explicit empty `properties: {}`.
      fail(relFile, 'props is missing "properties" (use "properties: {}" if the component has no props)');
    }
    for (const [propName, propSchema] of Object.entries(props.properties ?? {})) {
      if ('enum' in propSchema && 'default' in propSchema && !propSchema.enum.includes(propSchema.default)) {
        fail(relFile, `props.properties.${propName}.default ("${propSchema.default}") is not in its own enum`);
      }
      if (!('type' in propSchema)) {
        fail(relFile, `props.properties.${propName} is missing "type"`);
      }
    }
  }

  if (!existsSync(path.join(themeRoot, `${base}.twig`))) {
    fail(relFile, `missing sibling template ${base}.twig`);
  }
  if (!existsSync(path.join(themeRoot, `${base}.README.md`)) && !existsSync(path.join(path.dirname(file), 'README.md'))) {
    fail(relFile, `missing README.md documenting props/slots for ${path.dirname(relFile)}`);
  }
}

if (files.length === 0) {
  console.error('No *.component.yml files found under components/ — nothing validated.');
  process.exit(1);
}

if (errors > 0) {
  console.error(`\n${errors} component schema error(s) found.`);
  process.exit(1);
}

console.log(`\x1b[32m✓\x1b[0m ${files.length} component schema(s) valid.`);
