FROM php:7.4-fpm

ARG INSTALL_XDEBUG="false"
ARG INSTALL_COMPOSER="true"

# Get the repository set up for postgresql
# Required to use GPG below
# Add postgresql repository
RUN apt-get update && apt-get install -my gnupg2 \
    && echo 'deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
    # Add postgresql GPG
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get update \
    && apt-get install -y \
    bzip2 \
    exiftool \
    git-core \
    imagemagick \
    libbz2-dev \
    libc-client2007e-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libkrb5-dev \
    libldap2-dev \
    libmagickwand-dev \
    libmemcached-dev \
    libpng-dev \
    libpq-dev \
    libxml2-dev \
    libicu-dev \
    libzip-dev \
    msmtp \
    openssl \
    postgresql-client \
    pv \
    unzip \
    xfonts-base \
    xfonts-75dpi \
    zlib1g-dev \
    && pecl install apcu \
    && pecl install imagick \
    && pecl install memcached \
    && pecl install oauth \
    && pecl install redis \
    && if [ "${INSTALL_XDEBUG}" = "true" ]; then pecl install xdebug; fi \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure imap --with-imap-ssl --with-kerberos \
    && docker-php-ext-enable apcu \
    && docker-php-ext-enable imagick \
    && docker-php-ext-enable memcached \
    && docker-php-ext-enable oauth \
    && docker-php-ext-enable redis \
    && docker-php-ext-install \
    bcmath \
    bz2 \
    calendar \
    exif \
    gd \
    imap \
    opcache \
    pdo \
    pdo_pgsql \
    zip \
    intl \
    gettext \
    # Install composer
    && if [ "${INSTALL_COMPOSER}" = "true" ]; \
    then \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; \
    php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"; \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer; \
    php -r "unlink('composer-setup.php');"; \
    mkdir -p /var/www/.composer; \
    chown -R www-data:www-data /var/www/.composer; \
    fi \
    # Create drush and drupal console symlink so it can be accessed from anywhere in the container
    && ln -s /var/www/html/vendor/drush/drush/drush /usr/local/bin/drush \
    # Change the shell for login as www-data user
    && chsh -s /bin/bash www-data \
    # Clean up
    && apt-get -y clean \
    && apt-get -y autoclean \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/lib/cache/* \
    && rm -rf /var/lib/log/* \
    && rm -rf /tmp/*

COPY rootfs /

# when you run bash, this is where you'll start, and where drush will be able to run from.
WORKDIR /var/www/html

USER www-data
