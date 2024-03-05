'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";


import TextForm from './(comps)/textForm';
import PostGallery from './(comps)/postGallery';
import TextGallery from './(comps)/textGallery';




export default function Dashboard() {
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [texts, setTexts] = useState([]);
  const [text_id, setTextId] = useState(null);
  const [defaultValues, setDefaultTextValues] = useState({
    title: "",
    content: "",
  });  

  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const decoded = jwtDecode(token);
    console.log(decoded);
    console.log(`http://127.0.0.1:8000/texts?user_id=${decoded.id}`);

    fetch(`http://127.0.0.1:8000/texts?user_id=${decoded.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => setTexts(data))
    .catch(error => console.log(error));
  }
  , []);
  

  function getPosts(textid) {
    fetch(`http://127.0.0.1:8000/posts?text_id=${textid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
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
      <div className={`w-full  h-1/${posts.length > 0 ? "4": "2"}`}>
        <TextForm 
        setPosts = {setPosts}
        getPosts = {getPosts}
        setTextId = {setTextId}
        setGenerating = {setGenerating}
        generating = {generating}
        />
      </div>
      <div className={`w-full h-1/${posts.length > 0 ? "2": "4"} bg-slate-200 flex flex-col justify-around`}>
        <PostGallery
        posts = {posts}
        />
      </div>
    </main>
  );
}