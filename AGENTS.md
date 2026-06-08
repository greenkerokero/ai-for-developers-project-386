# AGENTS.md — Фронтенд (Booking API)

> Краткие инструкции для AI-агентов. Контракт: `tsp-output/openapi/openapi.yaml`.

## 1. Правила
- Пиши тесты только на позитивные сценарии (не проверяй ошибки) и в основном интеграционные. обязан быть тестовый метод
- В тестах проверяй только код возврата и если надо данные в базе
- Если видишь изменения, которые ты не делал, игнорируй их
- Исправляй причину, а не следствие
- Минимум ручных типов, максимум из существующих API
- Минимум ручной реализации, всегда смотрим готовое (в проекте и в библиотеках на гитхабе)
- Код должен быть статически типизированным
- Нельзя создавать обычные методы (не экшены) в контроллерах
- Пиши тесты только когда просят
- Разделяй получение и использование. Что-то получили записали в переменную, дальше передаем

## 2. Стек

TypeScript (strict) · Vite · React 18 · React Router v6 · shadcn/ui (Radix + Tailwind CSS) ·
TanStack Query v5 · openapi-typescript + openapi-fetch · Zod + react-hook-form ·
Prism + concurrently · Vitest + RTL + MSW · ESLint + Prettier · sonner

## 3. Структура `frontend/src/`

```
src/
├── api/
│   ├── generated/openapi.d.ts   # НЕ редактировать — генерируется скриптом
│   ├── client.ts                # настроенный openapi-fetch
│   ├── query-keys.ts            # фабрика ключей TanStack Query
│   ├── *.queries.ts             # useQuery-хуки (booking, event-type, slot…)
│   └── *.mutations.ts           # useMutation-хуки
├── components/
│   ├── ui/                      # shadcn/ui (устанавливать через CLI)
│   └── layout/                  # PublicLayout, OwnerLayout
├── hooks/                       # use-pagination.ts, use-debounce.ts
├── lib/                         # utils.ts, formatters.ts, validators.ts (Zod)
└── pages/
    ├── public/                  # event-types-page, event-type-detail-page, booking-page
    └── owner/                   # dashboard-page, event-types-page, event-type-form-page,
                                 # event-type-edit-page, availability-page
```

## 4. Кодогенерация и клиент

После изменений TypeSpec → OpenAPI: `npm run generate:api`
(`openapi-typescript ../tsp-output/openapi/openapi.yaml -o src/api/generated/openapi.d.ts`).

API-клиент: `createClient<paths>({ baseUrl: import.meta.env.VITE_API_URL ?? "" })`.
`VITE_API_URL` — пусто при `dev:mock` (Vite proxy), URL бэкенда в остальных режимах.

## 5. Mock-сервер (Prism)

`npm run dev:mock` — Prism (статика) + Vite. `npm run dev:mock:dynamic` — динамические данные.
Vite проксирует `/owner/*` и `/public/*` на `http://localhost:4010`.

## 6. Маршруты

| Путь | Компонент |
|---|---|
| `/` | EventTypesPage |
| `/:slug` | EventTypeDetailPage |
| `/:slug/book` | BookingPage |
| `/owner` | DashboardPage |
| `/owner/event-types` | OwnerEventTypesPage |
| `/owner/event-types/new` | EventTypeFormPage |
| `/owner/event-types/:slug/edit` | EventTypeEditPage |
| `/owner/availability` | AvailabilityPage |

Публичные → `<PublicLayout>`, owner → `<OwnerLayout>`. `QueryClientProvider` в `App.tsx` (`staleTime: 5 min`, `retry: 1`).

## 7. Паттерны API

Query-хук: `useQuery({ queryKey: queryKeys.X.list(params), queryFn: async () => { const { data, error } = await apiClient.GET("..."); if (error) throw error; return data; } })`.
Mutation-хук: `useMutation` + `queryClient.invalidateQueries` в `onSuccess`.

| Мутация | Инвалидируемые ключи |
|---|---|
| Создание/обновление/удаление EventType | `queryKeys.eventTypes.all` |
| Создание Booking | `queryKeys.slots.byEventType(slug)` + `queryKeys.bookings.all` |
| Отмена Booking | `queryKeys.bookings.all` + `queryKeys.slots.all` |
| Обновление Availability | `queryKeys.availability.all` + `queryKeys.slots.all` |

## 8. Формы и ошибки

Формы: Zod-схема в `src/lib/validators.ts` → `useForm<T>({ resolver: zodResolver(schema) })` → shadcn `<Form>`.
Типы — `z.infer<typeof schema>`, не дублировать вручную.

Ошибки: middleware в `client.ts` — `toast.error` при `status >= 500`;
`<ErrorBoundary>` на уровне layout-групп; не подавлять ошибки TanStack Query.

## 9. TypeScript

- `strict: true` обязателен; рекомендуется `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Без `any` — `unknown` + narrowing; явный комментарий при исключении
- Явные return types у API-функций, хуков и утилит верхнего уровня
- `as const` для query-key кортежей; не кастовать `as T` там, где тип выводится
- Типы из `openapi.d.ts` — `components["schemas"]["X"]`, не дублировать вручную
- Discriminated unions вместо boolean-флагов и опциональных полей
- `type` для union/intersection, `interface` для расширяемых объектов
- Всегда `import type { … }` для импортов типов

## 10. Именование и команды

| Сущность | Стиль |
|---|---|
| Файлы компонентов | kebab-case `.tsx` |
| Экспорт компонентов | PascalCase, named export |
| Хуки | `use-*` файл / `use*` экспорт |
| API-файлы | `resource.queries.ts` / `.mutations.ts` |
| Страницы | `name-page.tsx` / `NamePage` |
| Zod-схемы | `camelCaseSchema` |
| Query keys | `queryKeys.scope.action()` |
| Тесты | рядом с файлом, `*.test.ts(x)` |

Без `default export` кроме lazy-страниц. Алиас `@/` → `src/`. Conventional commits.

- `dev` / `dev:mock` / `dev:mock:dynamic` — Dev-сервер ± Prism
- `generate:api` — типы; `build` — сборка; `lint` / `format` / `test` — качество
- `tsc --noEmit` — проверка типов
