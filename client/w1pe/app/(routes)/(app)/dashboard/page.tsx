'use client';
import { useEffect, useState } from 'react';
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SyncOutlined } from '@ant-design/icons';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
 } from '@/components/ui/form';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { toast } from 'sonner';

import { XOutlined } from '@ant-design/icons';
import { Facebook } from 'lucide-react';
import { CopyIcon } from 'lucide-react';


const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});


export default function Dashboard() {
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [text_id, setTextId] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }
  , []);

  function postText(values) {
    fetch('http://127.0.0.1:8000/texts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      
      setTextId(data.id);
      return data.id;
      
    }).then(id => {
      getPosts(id);
    })
    .catch(error => {
      console.log(error);
    });

  }

  function getPosts(textid) {
    fetch(`http://127.0.0.1:8000/posts?text_id=${textid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPosts(data);
        setGenerating(false);
      })
      .catch(error => {
        console.log(error);
        setGenerating(false);
      });
  }

  function onSubmit(values) {
    setGenerating(true);
    const token = localStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    values['user_id'] = decoded.id;
    values['posted'] = false;

    postText(values);
    
    
  }

  // function to copy post to clipboard on click
  function copyPost(postcontent) {
    navigator.clipboard.writeText(postcontent);
    toast.success('Copied to clipboard');
  }
  

  return (
    <main className="flex min-h-screen flex-col h-full pt-6 pr-4 pl-4 items-center justify-between">
      <div className='w-full h-1/4 flex flex-col justify-around'>
      </div>
      <div className='w-full h-1/2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='h-full flex flex-col justify-around'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
              <FormItem >
                  <FormControl>
                  <Input  placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage/>
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
              <FormItem className="h-5/6">
                  <FormControl>
                  <Textarea className='h-full' placeholder="Text" {...field} />
                  </FormControl>
                  <FormMessage/>
              </FormItem>
              )}
            />
            <Button
              type="submit"
            >
              Generate {generating ? <SyncOutlined className='pl-2 pr-2' spin /> : null}
            </Button>
          </form>
        </Form>
      </div>
      <div className='w-full h-1/4 flex flex-col justify-around'>
        <ScrollArea className="w-full h-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
              {posts.map((posts) => (
                <Card key={posts.id} className="w-[50rem] h-[15rem] flex flex-col justify-around">
                  <CardHeader>
                    <CardTitle className='w-full flex flex-row justify-between'>
                      {posts.platform_id == 1 ? <XOutlined/> : <Facebook/>} 
                      <Button variant='outline' size='icon' onClick={() => copyPost(posts.content)}><CopyIcon></CopyIcon> </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='h-full whitespace-pre-wrap'>
                    <p className='w-full'>{`${posts.content.slice(0, 240)} ${posts.content.length > 240 ? "..." : ""}`}</p>
                  </CardContent>
                  <CardFooter>
                    <p>Published on ?</p>
                  </CardFooter>
                </Card>
              ))}
            <ScrollBar orientation='horizontal' />
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}