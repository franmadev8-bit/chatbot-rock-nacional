import { http } from '../api/http';
import type { AskRequest, AskResponse, ChatMessage, ChatSummary } from '../models/chat';

export const chatService = {
    async list(): Promise<ChatSummary[]> {
        const { data } = await http.get<ChatSummary[]>('/chat');
        return data;
    },

    async messages(chatId: string): Promise<ChatMessage[]> {
        const { data } = await http.get<ChatMessage[]>(`/chat/${chatId}/messages`);
        return data;
    },

    async ask(body: AskRequest): Promise<AskResponse> {
        const { data } = await http.post<AskResponse>('/chat/ask', body);
        return data;
    },
};
