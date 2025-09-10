FROM php:8.2-fpm

# 必要なライブラリ
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libonig-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

EXPOSE 8000
