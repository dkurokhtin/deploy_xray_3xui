# Развёртывание Xray и 3X-UI

Этот проект представляет докеризированную установку Xray-сервера с панелью 3X-UI. Все конфигурационные файлы и сертификаты подключаются через тома.

## Быстрый запуск

```bash
git clone <repo_url>
cd server-deploy
cp .env.example .env
docker-compose up -d
node register.js
node updateBalancer.js
```

Вспомогательные скрипты регистрируют сервер в базе MongoDB и обновляют конфигурацию балансировщика нагрузки.

## Переменные окружения

Список необходимых переменных, таких как `MONGODB_URI`, `XUI_PASSWORD`, `BALANCER_IP`, `SERVER_REGION` и `XRAY_PRIVATE_KEY`, смотрите в `.env.example`.

## Тома

- `./certs` – должен содержать `certificate.crt` и `private.key`, монтируемые в `/certs` (файлы не хранятся в репозитории).
- `./xray` – содержит `config.json`, используемый Xray.
- `./3x-ui/db` – постоянные данные панели 3X-UI.
