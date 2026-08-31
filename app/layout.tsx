import "./globals.css";

/**
 * Deliberately a passthrough.
 *
 * The real `<html>` / `<body>` live in `app/[locale]/layout.tsx`, which is the
 * only place that knows the locale and can set `lang` correctly. Adding
 * html/body here would nest two documents and break the lang attribute — do
 * not "fix" it. `app/page.tsx` and `app/not-found.tsx` render outside the
 * locale segment, so they each emit their own document for the same reason.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
