'use client';

import React from "react";
import { XOutlined } from "@ant-design/icons";
import { CopyIcon, Facebook } from "lucide-react";

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';


export default function PostGallery(props) {
    const posts = props.posts;

    // function to copy post to clipboard on click
    function copyPost(postcontent) {
    navigator.clipboard.writeText(postcontent);
    toast.success('Copied to clipboard');
    }

  return (
    <ScrollArea className="w-full h-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
            {posts.length > 0 ? posts.map((posts) => (
            <Card key={posts.id} className="w-[40rem] h-full flex flex-col justify-around shadow-slate-400">
                <CardHeader>
                <CardTitle className='w-full flex flex-row justify-between'>
                    {posts.platform_id == 1 ? <XOutlined/> : <Facebook/>} 
                    <Button variant='outline' size='icon' onClick={() => copyPost(posts.content)}><CopyIcon></CopyIcon> </Button>
                </CardTitle>
                </CardHeader>
                <CardContent className='h-full whitespace-pre-wrap'>
                <p className='w-full'>{`${posts.content.slice(0, 500)} ${posts.content.length > 240 ? "..." : ""}`}</p>
                </CardContent>
                <CardFooter>
                <p className="color-red-300">
                    Not published
                </p>
                </CardFooter>
            </Card>
            )): null}
        <ScrollBar orientation='horizontal' />
        </div>
    </ScrollArea>
  );
}