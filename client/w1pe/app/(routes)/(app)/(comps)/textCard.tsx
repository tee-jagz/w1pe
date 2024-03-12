'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrashIcon, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "./utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import PostCard from "./postCard";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

let token;
let decoded;
const url = 'http://127.0.0.1:8000/';

export default function TextCard(props) {
    const [posts, setPosts] = useState([]);
    const { theme } = useTheme();
    const text = props.text;
    const getTexts = props.getTexts;
    const shadowColor = theme == "dark" ? "#0d0404" : "#ebe1e1";
    
    // Get posts from the server
    function getPosts() {
        decoded = getToken();
        fetch(`${url}posts?text_id=${text.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {setPosts(data)})
        .catch(error => console.log(error));
    }


    // Delete text from the server
    function deleteText(id) {
        fetch(`${url}texts/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            if(response.status == 204){
                getTexts()
                getPosts()
                toast.success('Text deleted')
            } else {
                toast.error('Error deleting text');
            }
        })
        .catch(error => {
            console.log(error)
            toast.error('Error deleting text');
        });
    }

    function handleDelete(id) {
        deleteText(id);   
    }


    useEffect(() => {
        getPosts();
    }, []);


    return (
        <Card key={text.id} className={`w-full h-max hover:border-l-primary border-r-0 border-t-0 border-b-0 shadow-md shadow-[${shadowColor}] hover:shadow-lg hover:shadow-[${shadowColor}] duration-500 transition-all ease-in-out`} >
            <CardHeader className="flex flex-row justify-between w-full items-start">
                <CardTitle className="w-5/6">
                    {text.title}
                </CardTitle>
                <div className='flex flex-row space-x-4'>
                    <Link href={`/write?text_id=${text.id}`} >
                    <SquarePen
                    className="size-6 hover:text-primary hover:cursor-pointer"
                    />
                    </Link>
                    <TrashIcon 
                    className="size-6 hover:text-primary hover:cursor-pointer" 
                    onClick={() => {
                        handleDelete(text.id);
                    }
                    } />
                </div>
                
            </CardHeader>
            <CardContent>
                <p>{text.content.slice(0,500) + '...'}</p>
            </CardContent>
            <CardFooter className="w-full h-max">
                <ScrollArea className="w-full h-max whitespace-nowrap rounded-md ">
                    <div className="flex w-full h-[12.5rem] space-x-4 p-2">
                        {
                            posts.filter(item => item.text_id == text.id).sort((a, b) => b.id - a.id).map((post) => (
                                post ?
                                        <PostCard
                                        post={post}
                                        getPosts={getPosts}
                                        />
                                : null
                            ))
                        
                        }
                    </div>
                    <ScrollBar orientation="horizontal" colour="primary" className="h-1.5 opacity-20" />
                </ScrollArea>                        
            </CardFooter>
        </Card>
    );
}