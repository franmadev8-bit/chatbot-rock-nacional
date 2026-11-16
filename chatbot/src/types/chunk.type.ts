export type Chunk = {
  id: string;
  topic: string;
  section: string;
  text: string;
  source: string;
  order: number;
};

export type IndexedChunk = Chunk & { embedding: number[] };


export type IndexMetaData = {
  model: string;
  dimensions: number;
  totalChunks: number;
};

