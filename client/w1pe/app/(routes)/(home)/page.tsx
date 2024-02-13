"use client";
import React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    console.log(values);
  }


  useEffect(() => {
    fetch("http://127.0.0.1:8000/").then((response) => response.json()).then((data) => {
      setData(data);
    });
    fetch("http://127.0.0.1:8000/posts").then((response) => response.json()).then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <main className="flex min-h-screen h-[1000px] flex-col items-center justify-between">
      <header className="h-[80%] w-3/4 bg-red-0">
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
        <div className="flex flex-row justify-center w-full h-5/6 bg-slate-0">
            <div className="w-2/3 h-full flex flex-col items-end pr-10 justify-center">
              <Card className="w-4/5 border-0 shadow-transparent">
                <CardHeader>
                  <CardTitle>Write Once, Post Everywhere</CardTitle>
                  <CardDescription>Seamlessly synchronize your social media storytelling.</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3>Elevate your social presence by composing a single post and sharing it across all platforms with a single click. W1PE is your gateway to effortless, unified social media management.</h3>
                  <ul>
                    <li>📝 Craft Your Message: Write your content once and let W1PE adapt it for each social media platform’s unique format.</li>
                    <li>🔁 Sync Across Platforms: Whether it’s Twitter’s brevity, Facebook’s detail, or Instagram’s visuals, post everywhere simultaneously.</li>
                    <li>📊 Analyze and Optimize: Gain insights with our analytics to make your next post even more impactful.</li>
                    <li>🛠️ Customize with Ease: Tailor your message with platform-specific preferences for hashtags, mentions, and more.</li>
                    <li>🌐 Expand Your Reach: Maximize your audience engagement by targeting multiple platforms without the extra workload.</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p>Join the revolution of streamlined social media management</p>
                </CardFooter>
              </Card>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-start pl-10">
              <Card className="w-4/5 pt-10 pb-10 pl-5 pr-5">
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
                      <Button className="w-full mt-1 mb-0" type="submit">Start converging your content with W1PE today! →</Button>
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
      
      <div className="w-full pb-10 pl-10 pr-10">
        <ScrollArea className="flex w-full rounded-md border">
          <div className="flex space-x-4 p-4 w-max">
            {posts.map((post) => (
              
              <Card key={post.id} className="shrink-0 w-96">
                <CardHeader>
                  <CardTitle>{post.platform_id}</CardTitle>
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
