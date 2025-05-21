## Environnement MacOs

Création du fichier `.lando.local.yml` à la racine pour configurer le service `node` de lando en node x64:

```yaml
services:
  node:
    overrides:
      build:
        context: .
        dockerfile: docker/Dockerfile.x64
```
