import { createClient } from "@libsql/client";

export const client = createClient({
  url: import.meta.env.VITE_DB_URI,
  authToken: import.meta.env.VITE_DB_TOKEN,
});
