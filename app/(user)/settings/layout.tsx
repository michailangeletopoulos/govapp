// app/dashboard/layout.tsx
"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full flex-col p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
            <nav className="grid gap-4 text-sm text-muted-foreground">
              <Link href="/settings" className={pathname === '/settings' ? "font-semibold text-primary" : ""}>
                Άλλαξε Email
              </Link>
              <Link href="/settings/reset_password" className={pathname === './reset_password/password' ? "font-semibold text-primary" : ""}>
                Άλλαξε κωδικό
              </Link>
            </nav>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}