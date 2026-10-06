# E-Commerce Setup Guide

Documentation complète pour la configuration du système e-commerce BtoC avec Drupal Commerce.

## Architecture

**Stack :**
- Drupal 11.4.8 (backend CMS)
- Drupal Commerce 3.3.10 (e-commerce engine)
- Stripe 2.2.2 (payment gateway)
- PayPal 2.1.3 (payment gateway)
- Tailwind CSS 4.3 (storefront styling)

## Produit

### Type de contenu : `product`

Type de contenu unique pour gérer **tous les produits physiques** de l'e-commerce.

### Champs

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | Text | ✅ | Nom du produit |
| `body` | Rich Text | ✅ | Description longue |
| `field_sku` | String | ✅ | Code produit unique (identifiant) |
| `field_price` | Decimal | ✅ | Prix en euros (2 décimales) |
| `field_stock` | Integer | ✅ | Quantité disponible |
| `field_images` | Image | ✅ | Galerie d'images (illimitée) |
| `field_weight` | Decimal | ⚠️ | Poids en kg (pour frais de port) |
| `field_categories` | Taxonomy | ⚠️ | Catégories/Tags (à implémenter) |
| `field_dimensions` | String | ⚠️ | Dimensions H x L x P (à implémenter) |

✅ = Implémenté  
⚠️ = À faire

### Exemple de produit

```yaml
Title: "Laptop Pro 15"
SKU: "LP-15-2024"
Price: 1299.99
Stock: 45
Images: [image1.jpg, image2.jpg, image3.jpg]
Weight: 2.5
Categories: [Electronics, Computers, Laptops]
Dimensions: "35.9 x 24.7 x 1.7 cm"
```

## Module : ecommerce_product

**Chemin :** `web/modules/custom/ecommerce_product/`

### Activation

```bash
make drush en ecommerce_product
```

### Configuration

Tous les champs sont définis dans `config/install/` sous forme de fichiers YAML :

```
config/install/
├── node.type.product.yml                    # Type de contenu
├── field.storage.node.field_*.yml           # Définitions de champs
└── field.field.node.product.field_*.yml     # Instances de champs
```

### Mise à jour de la configuration

Après ajout/modification de champs via l'admin UI :

```bash
make drush config:export
```

## Paiements

### Stripe

**Status :** À configurer

**Configuration :**
1. Créer compte Stripe (https://stripe.com)
2. Récupérer keys (API Secret & Publishable Key)
3. Admin > Commerce > Payments > Gateways
4. Ajouter "Stripe" gateway
5. Configurer keys

```bash
# Activation
make drush en commerce_stripe
```

### PayPal

**Status :** À configurer

**Configuration :**
1. Créer compte PayPal Business
2. Récupérer credentials (Client ID, Secret)
3. Admin > Commerce > Payments > Gateways
4. Ajouter "PayPal" gateway
5. Configurer credentials

```bash
# Activation
make drush en commerce_paypal
```

## Commandes utiles

```bash
# Voir l'état du système
make system

# Voir les types de contenu
make drush node:types

# Créer un produit de test
make drush node:create \
  --type=product \
  --title="Test Product" \
  --uid=1

# Exporter la configuration
make drush config:export

# Importer la configuration
make drush config:import

# Vider le cache
make drush cache:rebuild
```

## Composants SDC (À faire)

Frontend components pour l'affichage des produits :

```
web/themes/custom/tailwind/components/
├── product-card.component.yml           # Fiche produit (listing)
├── product-detail.component.yml         # Page produit
├── product-variant-selector.component.yml # Sélecteur variante
├── price-display.component.yml          # Affichage prix
├── stock-indicator.component.yml        # Indicateur dispo
├── add-to-cart-button.component.yml     # Bouton panier
├── cart-summary.component.yml           # Résumé panier
├── checkout-form.component.yml          # Formulaire checkout
└── order-confirmation.component.yml     # Confirmation commande
```

## Structure URLs

```
/products                      Listing produits
/products/[sku]               Page produit
/cart                          Panier
/checkout                      Checkout
/account/orders                Mes commandes
/account/order/[id]            Détail commande
```

## Processus d'achat

```
1. Browse products → /products
2. View product → /products/[sku]
3. Add to cart → POST /cart
4. View cart → /cart
5. Checkout → /checkout
6. Select payment → Stripe / PayPal
7. Pay → Payment gateway
8. Confirmation → /account/order/[id]
9. Email notification → Customer
```

## Branche de développement

```
Branch: feature/e-commerce
Status: Work in progress
Last commit: Product fields configuration
```

Voir les commits :
```bash
git log feature/e-commerce
```

## Prochaines étapes

**Phase 1 (Structure) - EN COURS ✅**
- ✅ Drupal Commerce install
- ✅ bcmath PHP extension
- ✅ Product content type
- ✅ Product fields

**Phase 2 (Paiements) - À FAIRE**
- ⏳ Stripe configuration
- ⏳ PayPal configuration
- ⏳ Order management

**Phase 3 (Frontend) - À FAIRE**
- ⏳ SDC components
- ⏳ Product listing page
- ⏳ Product detail page
- ⏳ Shopping cart
- ⏳ Checkout flow

**Phase 4 (Contenu) - À FAIRE**
- ⏳ Blog/articles
- ⏳ FAQ
- ⏳ Policies

## Ressources

- **Drupal Commerce Docs:** https://docs.drupalcommerce.org/
- **Stripe Docs:** https://stripe.com/docs
- **PayPal Docs:** https://developer.paypal.com/
- **Drupal 11:** https://www.drupal.org/docs/11

## Notes

- Tous les produits sont **physiques** (pas de produits numériques)
- Stock est géré par produit (pas de variantes de stock)
- Paiements via **Stripe** et **PayPal** uniquement
- Livraison basée sur **poids** du produit
- Multilingual support (EN/FR) via Drupal built-in

---

Last updated: 2026-10-06  
Branch: `feature/e-commerce`  
Status: Work in progress
