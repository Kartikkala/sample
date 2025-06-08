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
      setIsLoadingResponse(true);

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

        askGeminiMutation.mutate({ prompt: input, modelId: selectedModel.id });
      } else {
        await dispatch(addMessage({
          chatId: currentChat.id,
          content: input,
          isUser: true
        }));

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
              className="form-control rounded-pill second-background-color first-text-color first-border-color"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              rows={1}
              disabled={isLoadingResponse}
              onFocus={(e) => {
                e.target.placeholder = '';
                e.target.style.caretColor = 'var(--text-primary)';
              }}
              onBlur={(e) => {
                if (!input) {
                  e.target.placeholder = 'Ask something...';
                }
              }}
              style={{
                resize: 'none',
                overflow: 'hidden',
                maxHeight: '160px',
                caretColor: 'transparent',
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn bg-dark rounded-circle flex-shrink-0 align-self-end border-white"
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
              <div className="spinner-border spinner-border-sm text-warning" role="status" style={{ width: '1rem', height: '1rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                className="bi bi-send"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.5.5 0 0 1-.916-.314l1.123-3.178a.5.5 0 0 0-.122-.51L6.833 9.14a.5.5 0 0 0-.51-.12l-3.178 1.123a.5.5 0 0 1-.314-.916L15.314.037a.5.5 0 0 1 .54.11ZM6.637 10.07l7.494-7.494-1.178 4.29-1.017 1.016-4.29 1.178Zm1.093 3.018L4.876 8.917l1.016-1.017 4.29-1.178 1.178 4.29Z"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
