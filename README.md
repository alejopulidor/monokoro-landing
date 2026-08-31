# Monokoro — Landing

Sitio público de Monokoro: dólares digitales por WhatsApp, para Colombia.

## Requisitos

- Node 20+ (probado en 24)
- pnpm 10+

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000 → redirige a /es/
```

## Build

```bash
pnpm build      # export estático a ./out/
npx serve out   # previsualizar el build
```

`pnpm typecheck` y `pnpm lint` corren TypeScript y ESLint sin construir.

## Estructura

| Ruta | Qué es |
| --- | --- |
| `app/[locale]/` | Home, blog (`/aprende`) y páginas legales |
| `components/site/` | Chrome compartido: nav, footers, marca, efectos |
| `components/home/` | Las secciones de la landing, una por archivo |
| `components/blog/` | Índice y cuerpo de artículos |
| `content/` | Copy estructurado: artículos del blog y FAQ |
| `lib/config.ts` | Tasas, número de WhatsApp, URLs — **única fuente de verdad** |
| `lib/nav.ts` | Qué páginas existen y cuáles siguen apagadas |
| `messages/` | Copy de las páginas legales y metadatos |

Las notas de arquitectura, las decisiones que parecen raras pero no lo son, y
los placeholders pendientes están en [`CLAUDE.md`](./CLAUDE.md).

## Estado

Implementado: la landing principal (`Monokoro v5`), el blog y sus tres
artículos. Pendientes: las páginas de Tarjeta y Negocios — sus enlaces están
apagados en `lib/nav.ts` hasta que existan.
