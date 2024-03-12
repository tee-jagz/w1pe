'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyIcon, TrashIcon, Facebook, Send } from "lucide-react";
import { XOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { FacebookShareButton, TwitterShareButton } from "react-share";

import { useTheme } from 'next-themes';

const url = 'http://127.0.0.1:8000/';
let token: string | null = null;

// Get token from local storage
function getToken() {
    if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
    }
    return token;
}

export default function PostCard(props: any) {
    const post = props.post;
    const getPosts = props.getPosts;
    const large = props.large;
    const { theme } = useTheme();
    const shadowColor = theme === "dark" ? "hover:shadow-[#0d0404]" : "hover:shadow-[#ebe1e1]";

    // Copy post to clipboard
    function copyPost(content: string) {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard');
    }

    // Delete post
    function deletePost(id: number) {
        token = getToken();
        fetch(`${url}posts/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.status == 204){
                getPosts()
                toast.success('Post deleted')
            } else {
                toast.error('Error deleting post');
            }
        })
        .catch(error => {
            console.log(error);
            toast.error('Error deleting post');        
        });
    }
    

    return (
        !large ?
        <Card key={post.id} className={`w-[25rem] h-[11rem] flex flex-col justify-around border-0 shadow-none hover:shadow-md ${shadowColor} duration-500 transition-all ease-in-out`}>
            <CardHeader>
                <CardTitle className='w-full flex flex-row justify-between items-center'>
                    {post.platform_id == 1 ? <XOutlined className="text-lg"/> : <Facebook className="size-6 stroke-[1.5px]" />} 
                    <div className='flex flex-row space-x-3'>
                        <CopyIcon onClick={() => copyPost(post.content)} className="size-5 hover:text-primary hover:cursor-pointer"></CopyIcon>
                        {
                        post.platform_id == 1 
                        ?
                        <TwitterShareButton url={post.content} >
                            <Send className="size-5 hover:cursor-pointer hover:stroke-slate-500"></Send>
                        </TwitterShareButton>
                        :
                        <FacebookShareButton url={'x.com'} hashtag={post.content.slice(0, post.content.length)} >
                            <Send className="size-5 hover:cursor-pointer hover:stroke-slate-500"></Send>
                        </FacebookShareButton>
                        }
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-[0.65rem] whitespace-pre-wrap">{post.content.slice(0,240) + '...'}</p>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
                <TrashIcon onClick={() => deletePost(post.id)} className="size-5 hover:cursor-pointer hover:stroke-slate-500"></TrashIcon>
            </CardFooter>
        </Card>
        :
        <Card key={post.id} className={`w-full h-max flex flex-col justify-around border-0 shadow-sm shadow-shadowcolor hover:shadow-md ${shadowColor}`}>
            <CardHeader>
                <CardTitle className='w-full flex flex-row justify-between items-center'>
                    {post.platform_id == 1 ? <XOutlined className="text-xl"/> : <Facebook className="size-7 stroke-[1.5px]" />} 
                    <div className='flex flex-row space-x-3'>
                        <CopyIcon onClick={() => copyPost(post.content)} className="size-7 hover:text-primary hover:cursor-pointer"></CopyIcon>
                        {
                        post.platform_id == 1 
                        ?
                        <TwitterShareButton url={post.content} >
                            <Send className="size-7 hover:cursor-pointer hover:stroke-slate-500"></Send>
                        </TwitterShareButton>
                        :
                        <FacebookShareButton url={'x.com'} hashtag={post.content.slice(0, post.content.length)} >
                            <Send className="size-7 hover:cursor-pointer hover:stroke-slate-500"></Send>
                        </FacebookShareButton>
                        }
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-md whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
                <TrashIcon onClick={() => deletePost(post.id)} className="size-7 hover:cursor-pointer hover:stroke-slate-500"></TrashIcon>
            </CardFooter>
        </Card>
    );
}