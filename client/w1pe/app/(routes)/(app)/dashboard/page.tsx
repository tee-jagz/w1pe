'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { SyncOutlined } from '@ant-design/icons';

import { useEffect, useState } from 'react';


export default function Dashboard() {
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }
  , []);


  return (
    <main className="flex min-h-screen flex-col h-full pt-6 pr-4 pl-4 items-center justify-between">
      <div className='w-full h-1/4 flex flex-col justify-around'>
      </div>
      <div className='w-full h-1/2 flex flex-col justify-around'>
        <Form>
          <Input placeholder='Title'></Input>
          <Textarea placeholder='Write your text/article here...' className='h-5/6'></Textarea>
          <Button>Generate Posts {generating ? <SyncOutlined className='ml-2' spin/> : null}</Button>
        </Form>
      </div>
      <div className='w-full h-1/4 flex flex-col justify-around'>
        
      </div>
    </main>
  );
}