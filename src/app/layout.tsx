// The real root layout (<html>/<body>) is app/[locale]/layout.tsx, so each
// language gets its own <html lang>. This file only exists because
// app/not-found.tsx needs a parent layout.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
