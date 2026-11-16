import { createContext } from 'react';
import type { ChatMessage, ChatSummary } from '../../models/chat';

export interface ChatContextValue {
    chats: ChatSummary[];
    activeChatId: string | null;
    messages: ChatMessage[];
    loadingChats: boolean;
    loadingMessages: boolean;
    sending: boolean;
    loadChats: () => Promise<void>;
    openChat: (chatId: string) => Promise<void>;
    startNewChat: () => void;
    ask: (question: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextValue | null>(null);
