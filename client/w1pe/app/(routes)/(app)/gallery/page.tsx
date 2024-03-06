'use client';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

import { Facebook, CopyIcon } from "lucide-react";
import { XOutlined } from "@ant-design/icons";
import { toast } from "sonner";


let token;
let decoded;

function getToken() {
    if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
    decoded = jwtDecode(token);
    }
    return decoded;
}


export default function CookieTest() {
    const [texts, setTexts] = useState([]);
    const [posts, setPosts] = useState([]);
    const url = 'http://127.0.0.1:8000/';

    function gettexts() {
        decoded = getToken();
        fetch(`${url}texts?user_id=${decoded.id}&limit=500`, {
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

    function getPosts() {
        decoded = getToken();
        fetch(`${url}posts?user_id=${decoded.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {setPosts(data)})
        .catch(error => console.log(error));
        }

    useEffect(() => {
        gettexts();
        getPosts();
    }, []);

    function copyPost(content) {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard');
    }

    return (
        <div className="space-y-6 w-full p-10 max-w-[900px]">
            {
                texts.map((text) => (
                    <Card key={text.id} className="w-full border-l-primary border-r-0 border-t-0 border-b-0 shadow-md hover:shadow-lg" >
                        <CardHeader>
                            <CardTitle>
                                {text.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{text.content.slice(0,500) + '...'}</p>
                        </CardContent>
                        <CardFooter className="w-full">
                            <ScrollArea className="w-full whitespace-nowrap rounded-md ">
                                <div className="flex w-full space-x-4 p-2">
                                    {
                                        posts.filter(item => item.text_id == text.id).map((post) => (
                                            post ?
                                            <Card key={post.id} className="w-[25rem] h-[11rem] flex flex-col justify-around border-0 shadow-none hover:shadow-md">
                                                <CardHeader>
                                                    <CardTitle className='w-full flex flex-row justify-between items-center'>
                                                        {post.platform_id == 1 ? <XOutlined className="text-lg"/> : <Facebook className="size-6" />} 
                                                        <CopyIcon onClick={() => copyPost(post.content)} className="size-5 hover:text-primary hover:cursor-pointer"></CopyIcon>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-[0.65rem] whitespace-pre-wrap">{post.content.slice(0,240) + '...'}</p>
                                                </CardContent>
                                            </Card>
                                            : null
                                        ))
                                    
                                    }
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>                        
                        </CardFooter>
                    </Card>
                ))
            }
        </div>
    )
}