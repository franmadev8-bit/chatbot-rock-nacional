import { useContext } from 'react';
import { ChatContext } from './ChatContext';

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat tiene que usarse dentro de <ChatProvider>.');
    return context;
}
