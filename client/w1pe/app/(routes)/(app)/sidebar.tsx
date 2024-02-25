"use client";
import { MenuOutlined } from "@ant-design/icons";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    return (
        <aside className="flex flex-col items-center justify-start w-1/6  h-full bg-red-0 text-slate-600">
            <div className="flex flex-col items-center">
                <Link href='/'>W1PE</Link>
                <MenuOutlined />
            </div>
            <nav className="flex flex-col items-center">
                <Link href='#'><Button variant="link">Text</Button></Link>
                <Link href='#'><Button variant="link">Settings</Button></Link>
            </nav>
        </aside>
    );
    }