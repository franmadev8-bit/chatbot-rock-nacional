export type RagSource = {
    id: string;
    topic: string;
    section: string;
    score: number;
};

export type RagAnswer = {
    answer: string;
    sources: RagSource[];
};


export type HistoryMessage = { role: 'user' | 'assistant'; content: string };
