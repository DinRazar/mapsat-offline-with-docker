#!/bin/bash

# Остановка и удаление старого контейнера (если он существует)
sudo docker stop my-node-app || true
sudo docker rm my-node-app || true
# Импортируем образ из файла my-node-app.tar
docker load -i my-node-app.tar

# Запускаем контейнер в фоновом режиме с перенаправлением порта
docker run -d -p 3000:3000 --name my-node-app my-node-app

# Открытие браузера с локальным адресом
xdg-open http://localhost:3000  # Для Linux
# open http://localhost:3000  # Для macOS
