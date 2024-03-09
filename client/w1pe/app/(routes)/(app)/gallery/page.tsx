'use client';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { TrashIcon } from "lucide-react";
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
        .then(data => {setTexts(data.reverse())
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
                texts.map((text) => (
                    <TextCard
                        text={text}
                        getTexts={getTexts}
                    />
                ))
            }
            <div className="h-10"></div>
        </div>
    )
}