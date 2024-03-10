'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import TextForm from '../(comps)/textForm';
import PostGallery from '../(comps)/postGallery';
import PlatformConfig from '../(comps)/platformConfig';
import TextGallery from '../(comps)/textGallery';
import { toast } from 'sonner';
import PostCard from '../(comps)/postCard';




export default function Write() {
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedText, setSavedText] = useState(false);
  const [texts, setTexts] = useState([]);
  const [text_id, setTextId] = useState(0);
  const [platformConfigs, setPlatformConfigs] = useState([]);
  const [usePlatformConfigs, setUsePlatformConfigs] = useState([]);
  const searchParams = useSearchParams();
  const textid = searchParams.get('text_id');
  const [defaultValues, setDefaultTextValues] = useState({
    title: "",
    content: "",
  });
  const url = 'http://127.0.0.1:8000/';

 
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    console.log(textid);

    if (textid) {
      setTextId(parseInt(textid));
      setSavedText(true);
      fetch(`${url}texts/${textid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setDefaultTextValues(data);
      })
      .catch(error => console.log(error));
    }

    fetch(`${url}texts?user_id=${decoded.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {setTexts(data)
    return data;
    }
    )
    .then(data => {
      console.log(data);
      getPlatformConfigs();
      }
    )
    .catch(error => console.log(error));
    
  }
  , []);

  useEffect(() => {
    console.log('usePlatformConfigs', usePlatformConfigs);
    console.log(JSON.stringify(usePlatformConfigs));
  }
  , [usePlatformConfigs]);


  function getPlatformConfigs() {
    fetch(`${url}users/platformconfigs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setPlatformConfigs(data)
      setUsePlatformConfigs(data)    
    })
    .catch(error => console.log(error));
  }
  

  function createPosts(textid) {
    fetch(`http://127.0.0.1:8000/posts?text_id=${textid}`, {
        method: 'POST',
        headers: {
          'Application-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },

        body: JSON.stringify(usePlatformConfigs)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPosts(data);
        setGenerating(false);
        toast.success('Posts generated');
      })
      .catch(error => {
        console.log(error);
        setGenerating(false);
      });
  }


  function getPosts(textid = text_id) {
    fetch(`http://127.0.0.1:8000/posts?text_id=${textid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setPosts(data);
    })
    .catch(error => console.log(error));
  }
  

  
  

  return (
    <main className="flex min-h-dvh max-w-[900px] min-w-[750px] bg-black-0 w-full flex-col p-10 items-center justify-between">
      <div className={`w-full h-1/${posts.length > 0 ? "2": "4"}  flex flex-col justify-around space-y-6 pb-5`}>
        {
          posts.length > 0 ? 
          posts.map(
            (post) => (
              post ? 
              <PostCard
              post={post}
              getPosts={getPosts}
              large={true}
              />
              : null
            )
          )
          : null
        }
      </div>
      <div className={`w-full h-2/3 sticky bottom-0`}>
        <Card className='h-full w-full pb-6 border-0 shadow-none'>
          <CardHeader>
          </CardHeader>
          <CardContent className='h-[90%] p-0'>
            <TextForm
            defaultValues = {defaultValues}
            createPosts = {createPosts}
            setTextId = {setTextId}
            setGenerating = {setGenerating}
            generating = {generating}
            savedText = {savedText}
            setSavedText = {setSavedText}
            text_id = {text_id}
            />
          </CardContent>

          <CardFooter className='w-full p-0'>
            <h1 className='pr-3 text-lg font-semibold'>Platform Configs: </h1>
            {platformConfigs.map(
              (config) => (
                config ?
                <PlatformConfig 
                config={config}
                usePlatformConfigs={usePlatformConfigs}
                setUsePlatformConfigs={setUsePlatformConfigs}
                />
                : null
              )
            )}

          </CardFooter>
        </Card>   
      </div>
      
    </main>
  );
}