### Hexlet tests and linter status:
[![Actions Status](https://github.com/greenkerokero/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/greenkerokero/ai-for-developers-project-386/actions)

# Booking API & Frontend

Система бронирования встреч. Состоит из трёх частей:

- **TypeSpec** — API-контракт, единый источник правды (`main.tsp` → `tsp-output/openapi/openapi.yaml`)
- **Backend** — Django REST API на порту `3000` (`backend/`)
- **Frontend** — React/Vite SPA на порту `5173` (`frontend/`)

---

## Требования

| Инструмент | Версия |
|---|---|
| Node.js | 24.x (см. `.nvmrc`) |
| Python | 3.12+ |
| uv | последняя ([astral.sh/uv](https://docs.astral.sh/uv/)) |

---

## Быстрый старт (бэкенд + фронтенд)

### 1. Node.js

```bash
# Если используете nvm:
source ~/.nvm/nvm.sh
nvm install && nvm use
```

### 2. TypeSpec — компиляция контракта

```bash
# В корне проекта
npm install
npm run compile
```

Генерирует `tsp-output/openapi/openapi.yaml`.

### 3. Бэкенд

```bash
# Установить uv (если не установлен)
curl -LsSf https://astral.sh/uv/install.sh | sh

cd backend

# Установить зависимости Python
uv sync

# Запустить сервер на http://localhost:3000
uv run python manage.py runserver 3000
```

### 4. Фронтенд (в новом терминале)

```bash
cd frontend
npm install --legacy-peer-deps

# Режим с реальным бэкендом (localhost:3000)
npm run dev
```

Фронтенд будет доступен по адресу **http://localhost:5173**.

---

## Режимы запуска фронтенда

| Команда | Описание |
|---|---|
| `npm run dev` | Vite dev-сервер, запросы к бэкенду на `localhost:3000` |
| `npm run dev:mock` | Vite + Prism mock (статика), бэкенд не нужен |
| `npm run dev:mock:dynamic` | Vite + Prism (динамические случайные данные) |

> При `dev:mock` / `dev:mock:dynamic` — Prism запускается на порту `4010`,
> Vite проксирует на него `/owner/*` и `/public/*`.

---

## Обновление TypeScript-типов после изменения контракта

Если вы правили `.tsp`-файлы, выполните в следующем порядке:

```bash
# 1. Перекомпилировать TypeSpec → OpenAPI
npm run compile          # в корне проекта

# 2. Перегенерировать TS-типы из OpenAPI
cd frontend
npm run generate:api
```

---

## Структура проекта

```
.
├── main.tsp                  # Точка входа TypeSpec
├── models/                   # TypeSpec-модели
├── routes/                   # TypeSpec-маршруты
├── tsp-output/openapi/       # Сгенерированный openapi.yaml (не редактировать)
├── backend/                  # Django REST API
│   ├── config/               # Django-проект (settings, urls)
│   ├── booking_api/
│   │   ├── views/            # Thin views (1 файл = 1 TypeSpec-интерфейс)
│   │   ├── services/         # Бизнес-логика
│   │   ├── storage.py        # In-memory хранилище
│   │   └── serializers.py    # DRF-сериализаторы
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/                 # React + Vite SPA
    └── src/
        ├── api/generated/    # TS-типы из OpenAPI (не редактировать)
        ├── pages/
        └── components/
```

---

## API эндпоинты (порт 3000)

| Метод | Путь | Описание |
|---|---|---|
| GET/PUT | `/owner/availability` | Расписание доступности |
| GET/POST | `/owner/event-types` | Типы событий |
| GET/PUT/DELETE | `/owner/event-types/{slug}` | Управление типом |
| GET | `/owner/bookings` | Список бронирований |
| GET | `/owner/bookings/{id}` | Детали бронирования |
| POST | `/owner/bookings/{id}` | Отмена бронирования |
| GET | `/public/event-types` | Публичный список типов |
| GET | `/public/event-types/{slug}` | Детали типа |
| GET | `/public/event-types/{slug}/slots` | Доступные слоты (14 дней) |
| POST | `/public/event-types/{slug}/bookings` | Создать бронирование |

Полная спецификация: [`tsp-output/openapi/openapi.yaml`](./tsp-output/openapi/openapi.yaml)