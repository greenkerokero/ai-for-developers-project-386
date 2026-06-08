### Hexlet tests and linter status:
[![Actions Status](https://github.com/greenkerokero/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/greenkerokero/ai-for-developers-project-386/actions)

# Booking API & Frontend

Это проект системы бронирования встреч (Booking API), состоящий из TypeSpec спецификаций API и React/Vite фронтенда.

## Требования

- Актуальная LTS версия Node.js (рекомендуется v24.x или выше, совместимая с `.nvmrc`).
- `npm`

## Установка и запуск

1. Установите и активируйте нужную версию Node.js (версия 24). Если вы используете `nvm`, выполните следующие команды:
   ```bash
   # Загружаем nvm в текущую сессию терминала (если nvm command not found)
   source ~/.nvm/nvm.sh
   
   # Устанавливаем и используем версию из .nvmrc (Node 24)
   nvm install
   nvm use
   ```

2. Установите зависимости в корне проекта (для TypeSpec). Обязательно убедитесь, что активна Node.js версии 24, иначе npm выдаст ошибку `EBADENGINE`:
   ```bash
   npm install
   ```

3. Скомпилируйте TypeSpec в OpenAPI:
   ```bash
   npm run compile
   ```
   *Это сгенерирует спецификацию API в `tsp-output/openapi/openapi.yaml`.*

4. Перейдите в папку фронтенда и установите его зависимости:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

5. Запустите проект в режиме mock-сервера (Vite + Prism):
   ```bash
   npm run dev:mock
   ```
   *Frontend будет доступен по локальному адресу Vite (обычно `http://localhost:5173`), а mock-сервер Prism запустится на порту `4010`.*

## Дополнительные скрипты фронтенда

- `npm run dev:mock:dynamic` — запуск с динамическими данными Prism (генерация случайных данных на основе OpenAPI).
- `npm run generate:api` — перегенерация TypeScript типов клиента после изменения TypeSpec спецификации.
- `npm run build` — сборка проекта для продакшена.