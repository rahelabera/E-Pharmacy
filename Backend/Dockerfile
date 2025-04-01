FROM php:8.2.12-fpm

# Install required system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install bcmath \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl gd zip



# Set working directory
WORKDIR /var/www/html

# Copy the application files
COPY . .

# Install Composer and dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html



# Expose port 80
EXPOSE 80

# Start PHP-FPM and Nginx
CMD ["php-fpm"]
