release: DJANGO_SETTINGS_MODULE=home.settings.prod python manage.py migrate
web: gunicorn home.wsgi.prod --log-file -
