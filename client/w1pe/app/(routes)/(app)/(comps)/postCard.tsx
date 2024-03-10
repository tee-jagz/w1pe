'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyIcon, TrashIcon, Facebook } from "lucide-react";
import { XOutlined } from "@ant-design/icons";
import { toast } from "sonner";

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
        <Card key={post.id} className={`w-[25rem] h-[11rem] flex flex-col justify-around border-0 shadow-none hover:shadow-md ${shadowColor}`}>
            <CardHeader>
                <CardTitle className='w-full flex flex-row justify-between items-center'>
                    {post.platform_id == 1 ? <XOutlined className="text-lg"/> : <Facebook className="size-6 stroke-[1.5px]" />} 
                    <CopyIcon onClick={() => copyPost(post.content)} className="size-5 hover:text-primary hover:cursor-pointer"></CopyIcon>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-[0.65rem] whitespace-pre-wrap">{post.content.slice(0,240) + '...'}</p>
            </CardContent>
            <CardFooter className="flex flex-row justify-end">
                <TrashIcon onClick={() => deletePost(post.id)} className="size-5 hover:cursor-pointer hover:stroke-slate-500"></TrashIcon>
            </CardFooter>
        </Card>
    );
}