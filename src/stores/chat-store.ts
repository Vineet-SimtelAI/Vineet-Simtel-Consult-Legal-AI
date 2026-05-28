import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    legalReferences?: Array<{ act: string; section: string }>;
  };
}

export interface Conversation {
  _id: string;
  title: string;
  tags: string[];
  creditsUsed: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string, metadata?: any) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isConnected: false,
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversation: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content, metadata) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content, isStreaming: false, metadata: metadata || m.metadata } : m
      ),
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearChat: () => set({ messages: [], activeConversation: null }),
}));
