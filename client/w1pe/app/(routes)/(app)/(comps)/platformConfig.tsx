'use client';
import React, { use } from "react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

import { ActivitySquare, Facebook } from 'lucide-react';
import { XOutlined } from '@ant-design/icons';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
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
    CardTitle
} from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { platform } from "os";
import { parse } from "path";



const formSchema = z.object({
    character_limit: z.string().transform(parseInt),
    no_of_posts: z.string().transform(parseInt),
    hashtag_usage: z.boolean().default(false).optional(),
    mention_usage: z.boolean().default(false).optional(),
    emoji_usage: z.boolean().default(false).optional(),
    active: z.boolean().default(false).optional(),
});



export default function PlatformConfig(props) {
    const config = props.config;
    const usePlatformConfigs = props.usePlatformConfigs;
    const setUsePlatformConfigs = props.setUsePlatformConfigs;
    config.platform_id == 1 ? config.name = 'X' : config.name = 'Facebook'
    config.active = true
    const [useActive, setUseActive] = useState(config.active);
    const name = config.name;
    let ind = null;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            character_limit: config.character_limit.toString(),
            no_of_posts: config.no_of_posts.toString(),
            hashtag_usage: config.hashtag_usage,
            mention_usage: config.mention_usage,
            emoji_usage: config.emoji_usage,
            active: config.active,
        },
    });


    useEffect(() => {
        if (useActive) {
            usePlatformConfigs.push(config);
        } else {
        setUsePlatformConfigs(usePlatformConfigs.filter(item => item.platform_id != config.platform_id));
        }
        
    }
    , [useActive]);



    

    function onSubmit(values) {
        setUseActive(values.active);
        values.platform_id = config.platform_id;
        values.name = name;
        setUsePlatformConfigs(usePlatformConfigs.map(item => item.platform_id == config.platform_id ? values : item));
        
    }

    return (
        <div className='hover:text-red-400 mr-5'>
            <Popover>
                <PopoverTrigger asChild>
                    {
                        name == 'X' ? <XOutlined className='text-lg'/> : <Facebook className=' size-6'/>
                    
                    }
                </PopoverTrigger>
                <PopoverContent className="w-96">
                    <h1 className="text-xl font-medium mb-4">{name + " config"}</h1>
                    <Form {...form}>
                        <form onChange={form.handleSubmit(onSubmit)} className='h-full flex flex-col justify-around'>
                            <FormField
                            control={form.control}
                            name="character_limit"
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-row justify-between items-center'>
                                <FormLabel className="w-1/2">Character Limit</FormLabel>
                                <FormControl className="w-1/2">
                                    <Input {...field} type="number"
                                        disabled={!useActive}
                                        />
                                </FormControl>
                                <FormMessage>
                                </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="no_of_posts"
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-row justify-between items-center'>
                                <FormLabel className="w-1/2">No of Posts</FormLabel>
                                <FormControl className="w-1/2">
                                    <Input {...field} type="number"
                                        disabled={!useActive}
                                        />
                                </FormControl>
                                <FormMessage>
                                </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="hashtag_usage"
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-row justify-between items-center'>
                                <FormLabel className="w-1/2">Hashtag Usage</FormLabel>
                                <FormControl className="w-1/2">
                                    <div className="w-1/2 flex flex-row justify-start items-start">
                                        <Switch 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        {...field}
                                        disabled={!useActive}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage>
                                </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="mention_usage"
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-row justify-between items-center'>
                                <FormLabel className="w-1/2">Mention Usage</FormLabel>
                                <FormControl className="w-1/2">
                                    <div className="w-1/2 flex flex-row justify-start items-start">
                                        <Switch 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        {...field}
                                        disabled={!useActive}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage>
                                </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="emoji_usage"
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-row justify-between items-center'>
                                    <FormLabel className="w-1/2">Emoji Usage</FormLabel>
                                    <FormControl className="w-1/2">
                                    <div className="w-1/2 flex flex-row justify-start items-start">
                                        <Switch 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        {...field}
                                        disabled={!useActive}
                                        />
                                    </div>
                                    </FormControl>
                                    <FormMessage>
                                    </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className='w-full pt-4 flex flex-row justify-between items-center'>
                                <FormLabel className="w-1/2 text-md font-semibold">Active</FormLabel>
                                <FormControl className="w-1/2">
                                    <div className="w-1/2 flex flex-row justify-start items-start">
                                        <Switch 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage>
                                </FormMessage>
                                </FormItem>
                            )}
                            />
                            {/* <Button type="submit">Save</Button> */}
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </div>
    );
}