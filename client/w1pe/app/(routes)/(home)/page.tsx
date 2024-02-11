"use client";
import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/").then((response) => response.json()).then((data) => {
      setData(data);
    });
    fetch("http://127.0.0.1:8000/posts").then((response) => response.json()).then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{data.Message}</h1>
      <div>
      <ol  className="flex flex-col items-center justify-center">
        {posts.map((post) => (
          
            <li key={post.id} className="m-5">{post.content}</li>
          
        ))}
        </ol>
      </div>
    </main>
  );
}
