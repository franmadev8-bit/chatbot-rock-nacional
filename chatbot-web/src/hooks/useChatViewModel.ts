import { App } from 'antd';
import { useState, type KeyboardEvent } from 'react';
import { useChat } from '../contexts/chat/useChat';
import { getErrorMessage } from '../utils/errors';

export const MAX_QUESTION_LENGTH = 1000;

export const SUGGESTIONS = [
    '¿Qué discos sacó Sumo?',
    '¿Quiénes formaron Hermética?',
    '¿Cómo se separaron Viejas Locas?',
    '¿Cuál es el primer disco de Los Redondos?',
];

export function useChatViewModel() {
    const { messages, sending, loadingMessages, activeChatId, ask } = useChat();
    const { message } = App.useApp();
    const [draft, setDraft] = useState('');

    const canSend = draft.trim().length > 0 && !sending;

    const send = async (text = draft) => {
        const question = text.trim();
        if (!question || sending) return;

        setDraft('');
        try {
            await ask(question);
        } catch (err) {
            setDraft(question);
            message.error(getErrorMessage(err, 'No pudimos enviar tu pregunta.'));
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            void send();
        }
    };

    return {
        messages,
        sending,
        loadingMessages,
        isEmpty: !activeChatId && messages.length === 0,
        draft,
        setDraft,
        canSend,
        send,
        handleKeyDown,
        suggestions: SUGGESTIONS,
    };
}
