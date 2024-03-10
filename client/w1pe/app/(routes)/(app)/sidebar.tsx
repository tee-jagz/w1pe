"use client";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";

import { Sparkles, GalleryVertical, Settings2, MoonStar, Sun } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    // const buttonStyle = `w-full flex flex-row ${open ? "justify-start  space-x-5" : "justify-center"} text-primary-foreground text-lg`
    const buttonStyle = `flex flex-row ${open ? "w-5/6 justify-start  space-x-5" : "self-center justify-center"} text-lg`
    const iconStyle = "size-6 stroke-[1.5px] hover:text-primary text-secondary-foreground hover:cursor-pointer"
    const textStyle = open ? "" : "hidden"
    const subStyle = open ? "mt-6 cursor-default text-sm ml-5 mb-3" : "self-center mt-6 mb-3 cursor-default text-xs"
    const shadowColor = theme == "dark" ? "shadow-[#0d0404]" : "shadow-[#ebe1e1]"

    
    function toggleSidebar() {
        setOpen(!open);
    }

    return (
        // <aside className={`flex flex-col items-center justify-start ${open ? "w-1/6 min-w-48" : "w-[100px] min-w-32"}  max-w-64  h-max shadow-md ml-2 mt-20 shadow-[#b07474] bg-primary text-primary-foreground pt-5 pb-10`}>
        <aside className={`flex flex-col items-center sticky top-10 justify-start ${open ? "w-1/6 min-w-48" : "w-[100px] min-w-32"} bg-accent max-w-64  h-max shadow-lg ml-2 mt-20 ${shadowColor} pt-5 pb-10`}>
            <div className="flex flex-col items-start w-full mb-10 pt-4 pl-5 pr-5">
                <Link href='/' className={`text-xl mb-4 ${open ? "" : "self-center"}`}>{open ? "W1PE" : "W"}</Link>
                <MenuOutlined onClick={()=> toggleSidebar()} className={`text-xl ${open ? "" : "self-center"}`} />
            </div>
            <nav className="flex flex-col items-start w-full">
                <p className={subStyle}>WORKSPACE</p>
                <Button className={buttonStyle} variant="link" onClick={() => router.push('/gallery')}> <GalleryVertical className={iconStyle} /> <p className={textStyle}>Gallery</p></Button>
                <Button className={buttonStyle} variant="link" onClick={() => router.push('/write')}> <Sparkles className={iconStyle} /> <p className={textStyle}>Write</p></Button>
                <p className={subStyle}>HELP</p>
                <Button className={buttonStyle} variant="link" > <Settings2 className={iconStyle} />  <p className={textStyle}>Settings</p></Button>

            </nav>

            <div className={`flex flex-row  ${open ? "items-start pl-5" : "justify-center"} w-full mt-10`}>
                {theme == "dark" ? <Sun className={iconStyle} onClick={() => setTheme("light")} /> : <MoonStar className={iconStyle} onClick={() => setTheme("dark")} />}
                {/* <p className={textStyle}>{theme == "dark" ? "Light" : "Dark"}</p> */}
            </div>
        </aside>
    );
    }