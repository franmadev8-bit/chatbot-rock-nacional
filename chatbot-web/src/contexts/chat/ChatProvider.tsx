import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ChatMessage, ChatSummary } from '../../models/chat';
import { chatService } from '../../services/chatService';
import { ChatContext, type ChatContextValue } from './ChatContext';

const TITLE_REFRESH_DELAY_MS = 4000;

function createMessage(role: ChatMessage['role'], content: string, sources?: ChatMessage['sources']): ChatMessage {
    return { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString(), sources };
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const titleTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(titleTimer.current), []);

    const loadChats = useCallback(async () => {
        setLoadingChats(true);
        try {
            setChats(await chatService.list());
        } finally {
            setLoadingChats(false);
        }
    }, []);

    const openChat = useCallback(async (chatId: string) => {
        setActiveChatId(chatId);
        setMessages([]);
        setLoadingMessages(true);
        try {
            setMessages(await chatService.messages(chatId));
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    const startNewChat = useCallback(() => {
        setActiveChatId(null);
        setMessages([]);
    }, []);

    const ask = useCallback(async (question: string) => {
        const userMessage = createMessage('user', question);
        setMessages((prev) => [...prev, userMessage]);
        setSending(true);

        try {
            const response = await chatService.ask({ question, chatId: activeChatId ?? undefined });
            setMessages((prev) => [...prev, createMessage('assistant', response.answer, response.sources)]);

            if (!activeChatId) {
                setActiveChatId(response.chatId);
                setChats((prev) => [
                    { id: response.chatId, title: response.title, createdAt: new Date().toISOString() },
                    ...prev,
                ]);
                window.clearTimeout(titleTimer.current);
                titleTimer.current = window.setTimeout(() => void loadChats(), TITLE_REFRESH_DELAY_MS);
            }
        } catch (error) {
            setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
            throw error;
        } finally {
            setSending(false);
        }
    }, [activeChatId, loadChats]);

    const value = useMemo<ChatContextValue>(
        () => ({
            chats, activeChatId, messages, loadingChats, loadingMessages, sending,
            loadChats, openChat, startNewChat, ask,
        }),
        [chats, activeChatId, messages, loadingChats, loadingMessages, sending, loadChats, openChat, startNewChat, ask],
    );

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
