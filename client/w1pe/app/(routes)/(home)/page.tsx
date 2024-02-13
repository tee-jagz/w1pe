"use client";
import React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Twitter, Linkedin, XIcon } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email(),
});

export default function Home() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`http://127.0.0.1:8000/users/checkemail?email=${values.email}`)
    .then((response) => 
    {response.status == 404 ? console.log(response) : response.json()}).then((data) => {
      
      console.log(data);
    });
  }


  useEffect(() => {
    fetch("http://127.0.0.1:8000/posts?limit=10").then((response) => response.json()).then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <header className="h-dvh w-3/4 flex flex-col justify-center">
        <head className="flex flex-row justify-between align-middle items-center pr-16 pl-10 pt-2.5 pb-2.5 m-0 fixed top-0 w-dvw">
          <h1>W1PE</h1>
          <div className="flex flex-row justify-between">
            <nav className="w-40 h-[100%] flex flex-row items-center justify-around ">
              <Button variant={"link"}>Billing</Button>
              <Button variant={"link"}>Library</Button>
            </nav>
            <Button>Generate Post →</Button>
          </div>
        </head>
        <div className="flex lg:flex-row flex-col justify-center w-full h-5/6 bg-slate-0">
            <div className="lg:w-2/3 w-full lg:min-w-[600px] min-w-[400px] h-full flex flex-col lg:items-end items-center lg:pr-10 justify-center">
              <Card className="lg:w-4/5 w-full border-0 shadow-transparent">
                <CardHeader>
                  <CardTitle className="lg:text-7xl text-6xl">Write Once, Post Everywhere</CardTitle>
                  <CardDescription className="lg:text-3xl text-2xl">Seamlessly synchronize your social media storytelling.</CardDescription>
                </CardHeader>
                <CardContent className="lg:text-xl text-lg">
                  <h3 className="mb-4">Elevate your social presence by composing a single post and sharing it across all platforms with a single click. W1PE is your gateway to effortless, unified social media management.</h3>
                  <ul>
                    <li className="mb-2">📝 Write once, W1PE adapts your message for all social platforms</li>
                    <li className="mb-2">🔁 Post your content across Twitter, Facebook, Instagram, and more with one click (Coming Soon)</li>
                    <li className="mb-2">📊 Use analytics to refine and enhance the impact of your posts (Comming Soon)</li>
                    <li className="mb-2">🛠️  Easily customize messages with hashtags, mentions, and platform preferences</li>
                    <li>🌐 Reach wider audiences on multiple platforms, effortlessly and efficiently</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p>Join the revolution of streamlined social media management</p>
                </CardFooter>
              </Card>
            </div>
            <div className="lg:w-1/3 w-full min-w-[400px] h-full flex flex-col justify-center lg:items-start items-center lg:pl-10">
              <Card className="w-full lg:w-4/5  pt-10 pb-10 pl-5 pr-5">
                <CardContent className="mb-0 p-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Type your email..." {...field} />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />                  
                      <Button className="w-full mt-1 mb-0 text-lg pt-5 pb-5" type="submit">Start generating your contents →</Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-row justify-center mt-1 w-full opacity-60">
                  <p>If you already have an account, we'll log you in</p>
                </CardFooter>
              </Card>
            </div>
          </div>
      </header>
      
      <div className="w-full pb-10 pl-10 pr-10 relative lg:top-[-10rem] top-[-5rem]">
        <div className="mb-4 flex flex-row align-middle items-center justify-center space-x-5">
          <h2 className="opacity-60">featured socials</h2>
          <Facebook></Facebook>
          <Twitter></Twitter>
          <Instagram></Instagram>
          <Linkedin></Linkedin>
          <XIcon></XIcon>
        </div>
        <ScrollArea className="flex w-full rounded-md border">
          <div className="flex space-x-4 p-4 w-max">
            {posts.map((post) => (
              
              <Card key={post.id} className="shrink-0 w-[40rem]">
                <CardHeader>
                  <CardTitle>{post.platform_id == 1 ? <Twitter></Twitter> : <Facebook></Facebook>}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter>
                  <p>Published on ?</p>
                </CardFooter>
              </Card>
              
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  );
}
