'use client';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import PostCard from "../(comps)/postCard";
import TextCard from "../(comps)/textCard";


let token;
let decoded;

// Get token from local storage
function getToken() {
    if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
    decoded = jwtDecode(token);
    }
    return decoded;
}


export default function CookieTest() {
    const [texts, setTexts] = useState([]);
    const router = useRouter();
    const url = 'http://127.0.0.1:8000/';


    // Get texts from the server
    function getTexts() {
        decoded = getToken();
        fetch(`${url}texts?user_id=${decoded.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {setTexts(data)
        return data;
        }
        )
        .catch(error => console.log(error));
    }


    

    useEffect(() => {
        getTexts();
    }, []);



    return (
        <div className="space-y-6 w-full p-10 max-w-[900px]">
            {   
            texts.length > 0 
            ?
                texts.sort((a, b) => b.id - a.id).map((text) => (
                    <TextCard
                        text={text}
                        getTexts={getTexts}
                    />
                ))
            :
                null
            }
            <div className="pt-16 pb-40 h-10 w-full flex flex-row justify-center">
                <PlusCircle className="animate-pulse hover:animate-none size-20 stroke-[1.5px] hover:text-primary hover:cursor-pointer transition duration-[6000ms]" onClick={() => router.push('/write')} />
            </div>
        </div>
    )
}