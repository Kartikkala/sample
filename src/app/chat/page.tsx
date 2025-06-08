'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createNewChat, addMessage, setCurrentChat } from '@/store/features/chatSlice';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { trpc } from '../_trpc/client';

export default function ChatPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) =>
    state.chat.chats.find(chat => chat.id === state.chat.currentChatId)
  );
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const [input, setInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const askGeminiMutation = trpc.askGemini.useMutation({
    onSuccess: (data) => {
      if (currentChat) {
        const response = data.response;
        if (response.type === 'multimodal') {
          // Add text message
          dispatch(addMessage({
            chatId: currentChat.id,
            content: response.text,
            isUser: false
          }));
          // Add image message
          dispatch(addMessage({
            chatId: currentChat.id,
            imageData: `data:${response.mimeType};base64,${response.base64Data}`,
            isUser: false
          }));
        } else if (response.type === 'text') {
          dispatch(addMessage({
            chatId: currentChat.id,
            content: response.text,
            isUser: false
          }));
        } else if (response.type === 'image') {
          dispatch(addMessage({
            chatId: currentChat.id,
            imageData: `data:${response.mimeType};base64,${response.base64Data}`,
            isUser: false
          }));
        }
      }
      setIsLoadingResponse(false);
    },
    onError: (error) => {
      console.error('Error:', error);
      setIsLoadingResponse(false);
    }
  });

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Not logged in</div>;

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    try {
      if (!currentChat) {
        const result = await dispatch(createNewChat({ 
          userId: user.sub!
        })).unwrap();
        await dispatch(setCurrentChat(result.id));
        await dispatch(addMessage({
          chatId: result.id,
          content: input,
          isUser: true
        }));

        setIsLoadingResponse(true);
        askGeminiMutation.mutate({ prompt: input, modelId: selectedModel.id });
      } else {
        await dispatch(addMessage({
          chatId: currentChat.id,
          content: input,
          isUser: true
        }));

        setIsLoadingResponse(true);
        askGeminiMutation.mutate({ prompt: input, modelId: selectedModel.id });
      }

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoadingResponse(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-2">
          <div className="flex-grow-1 position-relative">
            <textarea
              ref={textareaRef}
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              rows={1}
              disabled={isLoadingResponse}
              style={{
                resize: 'none',
                overflow: 'hidden',
                maxHeight: '160px',
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary rounded-circle flex-shrink-0 align-self-end mb-2"
            disabled={isLoadingResponse}
            style={{
              width: '40px',
              height: '40px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoadingResponse ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                fill="currentColor" 
                className="bi bi-send" 
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.5.5 0 0 1-.916-.314l-.598-1.955-5.454 5.454a.5.5 0 0 1-.707-.707l5.454-5.454-1.955-.598a.5.5 0 0 1 .314-.916L15.314.036a.5.5 0 0 1 .54.11z"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
