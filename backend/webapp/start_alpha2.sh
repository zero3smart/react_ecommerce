
uwsgi --ini app.ini -s /tmp/yesplz.sock --manage-script-name --mount /=app:app --socket 0.0.0.0:5000 --protocol=http --enable-threads

