FROM php:8.4-apache

# System libraries and PHP extensions required by Drupal 11 (gd for image
# processing, intl, opcache, pdo_mysql, zip, apcu for caching).
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libwebp-dev \
        libfreetype6-dev \
        libicu-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
    && docker-php-ext-install -j"$(nproc)" \
        gd \
        intl \
        opcache \
        pdo_mysql \
        zip \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && a2enmod rewrite headers \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && rm -rf /var/lib/apt/lists/*

# Bundle Composer so `composer install` can run inside the container.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Point the vhost DocumentRoot at the relocated Drupal webroot (web/).
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# Raise default PHP limits for Drupal (memory, uploads, execution time).
COPY php.ini /usr/local/etc/php/conf.d/drupal.ini

WORKDIR /var/www/html
