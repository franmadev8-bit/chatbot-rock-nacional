import { App } from 'antd';
import { useEffect } from 'react';
import { useChat } from '../contexts/chat/useChat';
import { getErrorMessage } from '../utils/errors';

export function useSidebarViewModel(onNavigate?: () => void) {
    const { chats, activeChatId, loadingChats, sending, loadChats, openChat, startNewChat } = useChat();
    const { message } = App.useApp();

    useEffect(() => {
        loadChats().catch((err: unknown) => message.error(getErrorMessage(err, 'No pudimos cargar tus chats.')));
    }, [loadChats, message]);

    const selectChat = (chatId: string) => {
        if (chatId === activeChatId) return;
        onNavigate?.();
        openChat(chatId).catch((err: unknown) => message.error(getErrorMessage(err, 'No pudimos abrir el chat.')));
    };

    const newChat = () => {
        onNavigate?.();
        startNewChat();
    };

    return {
        chats,
        activeChatId,
        loading: loadingChats && chats.length === 0,
        disabled: sending,
        selectChat,
        newChat,
    };
}
