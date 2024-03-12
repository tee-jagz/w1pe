import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




import Link from "next/link";
import { getUser } from "../(app)/(comps)/utils";
import { LogOut } from "lucide-react";
import { toast } from "sonner";


export default function HeadNav(props) {
  const main = props.main;
  const [user, setUser] = useState({});
  const router = useRouter();

  const dropMenuItemStyle = "w-full space-x-6 hover:text-primary cursor-pointer"
  const iconStyle = "size-6 stroke-[1.5px]  text-secondary-foreground hover:cursor-pointer"

  useEffect(() => {
    setUser(getUser());
    console.log(getUser());
  }, []);

  function logout() {
    localStorage.removeItem('access_token');
    router.push('/')
  }


  if(!main) {
  return (
    <head className="flex flex-row justify-between align-middle items-center backdrop-blur-sm pr-16 pl-10 pt-2.5 pb-2.5 m-0 fixed top-0 w-dvw">
    <Link href="/"><h1>W1PE</h1></Link>
    <div className="flex flex-row justify-between">
      <nav className="w-40 h-[100%] flex flex-row justify-around ">
        <Button variant={"link"}>Billing</Button>
        <Button variant={"link"}>Library</Button>
      </nav>
      <Button>Generate Post →</Button>
    </div>
  </head>
  );
}

return (
  <head className="flex flex-row items-center justify-between z-10 backdrop-blur-sm backdrop-opacity-90 sticky top-0 h-16 pl-10 pr-10">
    <Link href={"/gallery"}>
      <p className="pl-10 text-2xl text-primary">W1PE</p>
    </Link>
    <div className="flex flex-row items-center z-50 space-x-6 justify-end w-max h-full hover:cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row justify-between items-center space-x-1 hover:text-primary duration-300 transition-all ease-in-out">
          <Avatar>
            <AvatarFallback className="bg-accent">{(user.first_name ? user.first_name.slice(0,1) : null) + (user.last_name ? user.last_name.slice(0,1) : null)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-around items-start">
          <h1 className="text-md font-medium">{user.username}</h1>
          <p className="text-xs">{user.email}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-max h-max min-w-40">
          <DropdownMenuItem onClick={() => logout()} className={dropMenuItemStyle}>
            <LogOut className={iconStyle} /> <p>Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p>{user.credit + " "} Credits</p>
    </div>
  </head>
);
}