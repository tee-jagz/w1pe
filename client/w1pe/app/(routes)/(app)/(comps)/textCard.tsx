'use client';
import { use, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "./utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PostCard from "./postCard";

let token;
let decoded;
const url = 'http://127.0.0.1:8000/';

export default function TextCard(props) {
    const [posts, setPosts] = useState([]);
    const text = props.text;
    const getTexts = props.getTexts;
    
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
            response.status == 204 && getTexts();
            toast.success('Text deleted');
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
        <Card key={text.id} className="w-full hover:border-l-primary border-r-0 border-t-0 border-b-0 shadow-md shadow-[#ebe1e1] hover:shadow-lg hover:shadow-[#ebe1e1]" >
            <CardHeader className="flex flex-row justify-between w-full items-start">
                <CardTitle className="w-5/6">
                    {text.title}
                </CardTitle>
                <TrashIcon className="size-6 hover:text-primary hover:cursor-pointer" onClick={() => {
                    handleDelete(text.id);
                }
                } />
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