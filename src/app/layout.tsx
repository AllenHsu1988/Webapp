import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A fullstack Next.js Todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
