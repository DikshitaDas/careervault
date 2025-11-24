#!/bin/bash
echo "Installing CareerFlow Resume Builder..."
composer install && php artisan app:install && echo "Installation complete! Run 'php artisan serve' to start the server."
