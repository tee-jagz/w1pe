import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Home from "./(home)/page";


export default function HeadNav() {
  return (
    <head className="flex flex-row justify-between align-middle items-center pr-16 pl-10 pt-2.5 pb-2.5 m-0 fixed top-0 w-dvw">
    <Link href="/"><h1>W1PE</h1></Link>
    <div className="flex flex-row justify-between">
      <nav className="w-40 h-[100%] flex flex-row items-center justify-around ">
        <Button variant={"link"}>Billing</Button>
        <Button variant={"link"}>Library</Button>
      </nav>
      <Button>Generate Post →</Button>
    </div>
  </head>
  );
}