# housing-calculation

Compare the total monthly cost of different housing alternatives. Runs entirely in the browser; data is stored in `localStorage`.

**Stack:** Vite · React · TypeScript · Mantine · Zustand · React Hook Form + Zod · Recharts · Vitest

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # unit tests for the cost model
npm run build
```

## Structure

- `src/domain/` – framework-free cost model (`calculations.ts`), types, form schema
- `src/store/` – Zustand store, persisted to `localStorage`
- `src/components/` – UI
