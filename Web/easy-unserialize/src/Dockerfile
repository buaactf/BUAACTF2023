FROM nrstech/php-7.4-apache

ADD ./src /var/www/html

RUN chmod -R 755 /var/www/html & \
    chown -R root:root /var/www/html & \ 
    chmod 644 /var/www/html/flag

EXPOSE 80

