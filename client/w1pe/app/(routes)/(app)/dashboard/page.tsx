'use client';
import { use, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import TextForm from './(comps)/textForm';
import PostGallery from './(comps)/postGallery';
import PlatformConfig from './(comps)/platformConfig';
import { set } from 'zod';




export default function Dashboard() {
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [texts, setTexts] = useState([]);
  const [text_id, setTextId] = useState(0);
  const [platformConfigs, setPlatformConfigs] = useState([]);
  const [usePlatformConfigs, setUsePlatformConfigs] = useState([]);
  const [defaultValues, setDefaultTextValues] = useState({
    title: "",
    content: "",
  });
  const url = 'http://127.0.0.1:8000/';

  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    console.log(decoded);

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
  

  function getPosts(textid) {
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
      })
      .catch(error => {
        console.log(error);
        setGenerating(false);
      });
  }

  
  

  return (
    <main className="flex min-h-screen max-w-[900px] w-full flex-col h-full pt-6 pr-4 pl-4 pb-5 items-center justify-between">
      <div className='w-full h-1/8 bg-black flex flex-col justify-around'>
        
      </div>
      <div className={`w-full  h-2/3 `}>
        <Card className='h-full w-full pb-6'>
          <CardHeader>
          </CardHeader>
          <CardContent className='h-[90%]'>
            <TextForm 
            setPosts = {setPosts}
            getPosts = {getPosts}
            setTextId = {setTextId}
            setGenerating = {setGenerating}
            generating = {generating}
            />
          </CardContent>

          <CardFooter>
            <h1 className='pr-2 font-bold'>Platform Configs: </h1>
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
      <div className={`w-full h-1/${posts.length > 0 ? "2": "4"}  flex flex-col justify-around`}>
        <PostGallery
        posts = {posts}
        />
      </div>
    </main>
  );
}