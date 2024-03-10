'use client';
import React, { use } from "react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import HeadNav from "../headNav";


const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = localStorage.getItem('email');
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email ? email : "",
            password: "",
        },
    });
    let formData = new FormData();

    


    function onSubmit(values) {
        formData.append('username', values.email.toLowerCase());
        formData.append('password', values.password);
       


        fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token){
            localStorage.setItem('access_token', data.access_token);
            router.push('/gallery');
        }   else {
            console.log(data)
        }
        })
        .catch(error => console.log(error));
    }

    

    return (
        <>
            <HeadNav />
            <div className="flex lg:flex-row flex-col justify-center w-full align-middle items-center h-dvh min-h-[500px] bg-slate-0">
                <Card className="min-w-96 w-1/3">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="h-40 flex flex-col justify-between">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}
                        />                  
                        <Button className="w-full mt-1 mb-0 text-lg pt-5 pb-5" type="submit">Login</Button>
                        </form>
                    </Form>
                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
    }