'use client';
import React, { useEffect } from "react";
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
import { get } from "http";
import { toast } from "sonner";


const formSchema = z.object({
    title: z.string().nonempty(),
    content: z.string().nonempty(),
  });

export default function TextForm(props) {
    const setTextId = props.setTextId;
    const createPosts = props.createPosts;
    const setGenerating = props.setGenerating;
    const generating = props.generating;
    const defaultValues = props.defaultValues;
    const savedText = props.savedText;
    const setSavedText = props.setSavedText;
    const text_id = props.text_id;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
      });

      const { setValue } = form;


      useEffect(() => {
        if (defaultValues) {
            for (const key in defaultValues) {
                setValue(key, defaultValues[key]);
            }
        }
    }, [defaultValues, setValue]);

      function postText(values) {
        savedText 
        ? 
        createPosts(text_id)
        :
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
          setTextId(data.id);
          setSavedText(true);
          return data.id;
          
        }).then(id => {
          createPosts(id);
        })
        .catch(error => {
          toast.error('Error generating posts');
          console.log(error);
        });
    
      };

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
                  <Input  placeholder="Title" variant="title" {...field} className="border-t-0 border-r-0 border-l-0 outline-none outline-gray-0"  />
                  </FormControl>
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
              <FormItem className="h-5/6">
                  <FormControl>
                  <Textarea className='h-full' variant='plain' placeholder="Enter text here..." {...field} className="border-0 outline-none outline-gray-0 resize-none h-full"  />
                  </FormControl>
              </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`text-lg ${generating ? 'cursor-not-allowed' : 'cursor-pointer'}` }
              disabled={generating}
            >
              Generate {generating ? <SyncOutlined className='pl-2 pr-2' spin /> : null}
            </Button>
          </form>
        </Form>
    );
    }