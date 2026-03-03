macOS Environment

Create a file named .lando.local.yml at the root of your project to configure the Lando node service to use Node x64 :

```yaml
services:
  node:
    overrides:
      build:
        context: .
        dockerfile: docker/Dockerfile.x64
```
