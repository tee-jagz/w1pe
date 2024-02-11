"use client";
import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/").then((response) => response.json()).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{data.message}</h1>
    </main>
  );
}
