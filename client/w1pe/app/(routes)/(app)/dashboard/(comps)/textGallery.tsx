'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TextGallery(props) {
    const texts = props.texts;
    const setDefaultTextValues = props.setDefaultTextValues;
    const setPosts = props.setPosts;

    function setDefaultValues(values) {
        console.log(values);
        fetch(`http://127.0.0.1:8000/posts?text_id=${values.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setPosts(data);
        })
        .catch(error => console.log(error));
    
        setDefaultTextValues({
          title: values.title,
          content: values.content,
        });
    
      }


    return (
        <ScrollArea className="w-full h-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {texts.length > 0 ? texts.map((text) => (
              <Card key={text.id} className="w-[20rem] h-[15rem] flex flex-col justify-around">
                <div onClick={() => setDefaultValues(text)}>
                <CardHeader>
                  <CardTitle className='w-full whitespace-pre-wrap flex flex-row justify-between'>
                    {text.title.slice(0, 20)} {text.title.length > 20 ? "..." : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className='h-full whitespace-pre-wrap'>
                  <p className='w-full'>{`${text.content.slice(0, 150)} ${text.content.length > 240 ? "..." : ""}`}</p>
                  <p>{text.user_id}</p>
                </CardContent>
                <CardFooter>
                </CardFooter>
                </div>
              </Card>
            ))
          : null}
            <ScrollBar orientation='horizontal' />
          </div>
        </ScrollArea>
    );
    }