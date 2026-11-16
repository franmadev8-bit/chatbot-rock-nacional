import { RagSource } from "./rag.types.js";

export type SendMessageResponse = {
    chatId: string;
    title: string;
    answer: string;
    sources: RagSource[];
};