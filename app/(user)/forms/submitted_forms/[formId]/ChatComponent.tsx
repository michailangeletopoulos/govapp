"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, X } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

type Message = {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  file_urls?: string[]; // Array of file URLs
};

export default function ChatComponent({ formId, userId }: { formId: number; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`form_${formId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `form_id=eq.${formId}` },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setUploadedFiles((current) => [...current, ...Array.from(selectedFiles)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;
  
    let fileUrls: string[] = [];
  
    // Upload files and generate signed URLs
    for (const file of uploadedFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `form_${formId}/${fileName}`;
  
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
  
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return; // Stop further execution if file upload fails
      } else {
        // Generate a signed URL
        const { data: signedData, error: signedUrlError } = await supabase
          .storage
          .from("avatars")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // Έγκυρο για 10 χρόνια
  
        if (signedUrlError) {
          console.error("Error generating signed URL:", signedUrlError);
          return;
        }
  
        fileUrls.push(signedData.signedUrl); // Save signed URL
      }
    }
  
    // Insert message into the database
    const { data, error } = await supabase
      .from("messages")
      .insert({
        form_id: formId,
        user_id: userId,
        content: newMessage,
        file_urls: fileUrls, // Make sure this matches your database column name
      })
      .select();
  
    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessages((current) => [...current, data[0]]);
      setNewMessage("");
      setUploadedFiles([]);
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Συνομιλία</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.user_id === userId ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-2 rounded-lg ${message.user_id === userId ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {message.content && <p className="mb-1">{message.content}</p>}
              {message.file_urls && <p className="mb-1">{message.file_urls}</p>}
              
              {message.file_urls?.map((url, index) => ( 
                <a href={url}>dsf</a>
              ))}

              {message.file_urls && message.file_urls.length > 0 && (
                <div className="mt-1">
                  {message.file_urls.map((url, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2 flex-shrink-0"></div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline truncate max-w-[200px]"
                        download
                      >
                        {decodeURIComponent(url.split("/").pop() || "")}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative p-2 bg-gray-100 rounded flex items-center">
              <p className="text-sm truncate flex-grow">{file.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Πληκτρολογήστε το μήνυμα σας..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Button variant="outline" size="icon" onClick={() => document.getElementById("file-upload")?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="mr-2 h-4 w-4" />
              <span >Αποστολή</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

