'use client';
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";

import { SyncOutlined } from '@ant-design/icons';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
   } from '@/components/ui/form';


const formSchema = z.object({
    title: z.string(),
    content: z.string(),
  });

export default function TextForm(props) {
    const getPosts = props.getPosts;
    const setTextId = props.setTextId;
    const setPosts = props.setPosts;
    const setGenerating = props.setGenerating;
    const generating = props.generating;
    const defaultValues = props.defaultValues;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
      });

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

      function onSubmit(values) {
        setGenerating(true);
        const token = localStorage.getItem('access_token');
        const decoded = jwtDecode(token);
    
        values['user_id'] = decoded.id;
        values['posted'] = false;
    
        postText(values);
            
      }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='h-full flex flex-col justify-around'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
              <FormItem >
                  <FormControl>
                  <Input  placeholder="Title"  {...field}   />
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
                  <Textarea className='h-full' placeholder="Text" {...field}  />
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
    );
    }