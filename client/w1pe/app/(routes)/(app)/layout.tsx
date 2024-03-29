"use client";

import Sidebar from "./sidebar";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="flex min-h-[500px] h-dvh flex-row items-center justify-between">
            <Sidebar />
            <div className="w-5/6 h-full">
            {children}
            </div>
        </main>
    );
    }