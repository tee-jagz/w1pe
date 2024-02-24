"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HeadNav from "../headNav";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { json } from "stream/consumers";
import { Phone } from "lucide-react";


const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
});


export default function SignUp() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        },
    });
    const router = useRouter();

    
    function onSubmit(values) {
        const data = {
            first_name: values.firstname,
            last_name: values.lastname,
            username: values.username,
            email: values.email,
            password: values.password,
            phone: "1234567890",
            role_id: 1,
        }
        fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            response.status == 201 ? router.push('/login') : response.status == 400 ? console.log(response.json()) : response.json()
        })
        .then(data => {
            // form.reset();
            console.log(data);
        })
        .catch(error => console.log(error));
    }
    
    return (
        <>
        <HeadNav />
        <div className="flex lg:flex-row flex-col justify-center w-full align-middle items-center h-dvh min-h-[500px] bg-slate-0">
            <Card className="min-w-96 w-1/3">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-96 flex flex-col justify-between">
                    <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                    />
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
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Sign Up</Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        </div>
        </>
    );
    }
