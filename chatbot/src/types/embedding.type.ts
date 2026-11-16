export type JinaResponse = {
  usage: { total_tokens: number };
  data: { index: number; embedding: number[] }[];
};

export type EmbedResult = {
  vectors: number[][];
  tokens: number;
};


export type JinaTask = 'retrieval.passage' | 'retrieval.query';
