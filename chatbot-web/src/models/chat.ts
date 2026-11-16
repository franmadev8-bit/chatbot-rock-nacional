export type MessageRole = 'user' | 'assistant';

export interface RagSource {
    id: string;
    topic: string;
    section: string;
    score: number;
}

export interface ChatSummary {
    id: string;
    title: string;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: string;
    sources?: RagSource[];
}

export interface AskRequest {
    question: string;
    chatId?: string;
}

export interface AskResponse {
    chatId: string;
    title: string;
    answer: string;
    sources: RagSource[];
}
