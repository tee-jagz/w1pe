"use client";
import React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Linkedin } from "lucide-react";
import { XOutlined, FacebookOutlined, LinkedinOutlined, InstagramOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import HeadNav from "../headNav";

const formSchema = z.object({
  email: z.string().email(),
});

const iconStyles = {
  fontSize: "1.5rem",
};

export default function Home() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`http://127.0.0.1:8000/users/checkemail?email=${values.email}`)
    .then((response) => 
    {response.status == 404 ? router.push('/signup') : response.status == 200 ? router.push('/login'): response.json()}).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error('Error:', error
      )}
    );
  }


  useEffect(() => {
    fetch("http://127.0.0.1:8000/posts?limit=10").then((response) => response.json()).then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <>
      <header className="h-dvh w-3/4 flex flex-col justify-center">
        <HeadNav></HeadNav>
        <div className="flex lg:flex-row flex-col justify-center w-full h-5/6">
            <div className="lg:w-2/3 w-full lg:min-w-[600px] min-w-[300px] h-full flex flex-col lg:items-end items-center lg:pr-10 justify-center">
              <Card className="lg:w-4/5 w-full border-0 shadow-transparent">
                <CardHeader>
                  <CardTitle className="lg:text-7xl text-6xl sm:text-4xl">Write Once, Post Everywhere</CardTitle>
                  <CardDescription className="lg:text-3xl text-2xl sm:text-xl">Seamlessly synchronize your social media storytelling.</CardDescription>
                </CardHeader>
                <CardContent className="lg:text-xl text-lg sm:text-md">
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
            <div className="lg:w-1/3 w-full min-w-[320px] h-full flex flex-col justify-center lg:items-start items-center lg:pl-10">
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
                      <Button className="w-full mt-1 mb-0 text-lg pt-5 pb-5" type="submit">Start generating contents →</Button>
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
      
      <div className="w-full pb-10 pl-10 pr-10 relative lg:top-[-10rem] top-[-5rem] max-[450px]:top-0">
        <div className="mb-4 flex flex-row align-middle items-center justify-center space-x-5">
          <h2 className="opacity-60">featured socials</h2>
          <Facebook></Facebook>
          <InstagramOutlined style={iconStyles}></InstagramOutlined>
          <Linkedin></Linkedin>
          <XOutlined style={iconStyles}></XOutlined>
        </div>
        <div className="w-full flex flex-row justify-center">
          <Carousel className="flex flex-wrap w-5/6 space-y-4 space-x-2 p-4">
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem key={post.id} className="lg:basis-1/3 sm:basis-1 md:basis-1/2">                
                  <Card className="shrink-0 h-74">
                    <CardHeader>
                      <CardTitle>{post.platform_id == 1 ? <XOutlined></XOutlined>: <Facebook></Facebook>}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{`${post.content.slice(0, 240)} ${post.content.length > 240 ? "..." : ""}`}</p>
                    </CardContent>
                    <CardFooter>
                      <p>Published on ?</p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
          </Carousel>
        </div>
      </div>
    </>
  );
}
