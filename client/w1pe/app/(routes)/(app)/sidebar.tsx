"use client";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    const router = useRouter();
    return (
        <aside className="flex flex-col items-center justify-start w-1/6  h-full bg-red-0 text-slate-600">
            <div className="flex flex-col items-center">
                <Link href='/'>W1PE</Link>
                <MenuOutlined />
            </div>
            <nav className="flex flex-col items-center">
                <Button variant="link" onClick={() => router.push('/dashboard')}>Dashboard</Button>
                <Button variant="link" onClick={() => router.push('/gallery')}>Gallery</Button>
                <Button variant="link" >Settings</Button>

            </nav>
        </aside>
    );
    }