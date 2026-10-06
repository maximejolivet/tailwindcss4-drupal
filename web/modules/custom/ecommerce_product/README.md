# E-commerce Product

Module pour créer le type de contenu et les champs produit pour l'e-commerce BtoC.

## Structure du produit

Type de contenu: **product**

### Champs:
- `title` - Nom du produit
- `body` - Description produit
- `field_sku` - SKU (identifiant unique)
- `field_price` - Prix
- `field_stock` - Stock disponible
- `field_images` - Galerie d'images
- `field_categories` - Catégories (taxonomy)
- `field_weight` - Poids
- `field_dimensions` - Dimensions (H x L x P)

## Installation

1. Activer le module: `drush en ecommerce_product`
2. Créer les champs via l'interface Drupal admin
3. Exporter la configuration: `drush config:export`

## Prochaines étapes

- Créer les champs via l'admin UI
- Exporter la configuration dans `config/install/`
- Créer les composants SDC pour l'affichage des produits
- Configurer l'intégration Commerce
