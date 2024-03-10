"use client";

import Sidebar from "./sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="flex min-h-[500px] h-dvh flex-row items-start justify-between">
            <Sidebar />
            <div className="w-5/6 flex flex-row justify-center h-full">
            {children}
            </div>
            <div className="flex flex-col items-center justify-start w-1/6"></div>
            <Toaster/>
        </main>
    );
    }