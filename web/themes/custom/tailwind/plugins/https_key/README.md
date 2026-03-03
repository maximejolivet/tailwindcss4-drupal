## Certificat SSL local :

Memo: Expires August 24, 2027 🗓

```yaml
brew install mkcert
brew install nss # if you use Firefox

mkcert localhost
```

This generates two files in the current directory:

**localhost.pem** → the public certificate (to be used as cert)

**localhost-key.pem** → the private key (to be used as key)
