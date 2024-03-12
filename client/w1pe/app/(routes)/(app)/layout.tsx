"use client";

import Sidebar from "./sidebar";
import { Toaster } from "@/components/ui/sonner";
import HeadNav from "../(main)/headNav";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="min:h-dvh">
          <HeadNav
          main={true}
          />
          <div className="flex min-h-[500px] flex-row items-start justify-between">
          <Sidebar />
          <div className="w-5/6 flex flex-row justify-center h-full">
          {children}
          </div>
          <div className="flex flex-col items-center justify-start w-1/6"></div>
          </div>
          <Toaster/>
        </main>
    );
    }