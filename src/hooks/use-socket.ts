'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';
import { useChatStore } from '@/stores/chat-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000';

export function useSocket() {
  const { token } = useAuthStore();
  const { setConnected, addMessage, updateMessage } = useChatStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for incoming messages
    socketInstance.on('chat:message', (data) => {
      addMessage({
        id: data.id,
        role: data.role,
        content: data.content,
        createdAt: new Date(data.createdAt),
      });
    });

    // Listen for stream chunks
    socketInstance.on('chat:stream:chunk', (data) => {
      // For streaming, we'll handle this in the chat component
    });

    socketInstance.on('chat:stream:end', (data) => {
      updateMessage(data.messageId, data.fullContent, data.metadata);
    });

    socketInstance.on('chat:error', (data) => {
      console.error('Chat error:', data.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      socket?.emit('chat:join', { conversationId });
    },
    [socket]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      socket?.emit('chat:message', { conversationId, content });
    },
    [socket]
  );

  const sendTyping = useCallback(
    (conversationId: string) => {
      socket?.emit('chat:typing', { conversationId });
    },
    [socket]
  );

  return { socket, joinConversation, sendMessage, sendTyping };
}
