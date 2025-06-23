export interface ModelOption {
  value: string;
  label: string;
}

export interface ChatResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
  model: string;
}

export interface FormData {
  name: string;
  apiKey: string;
  prompt: string;
  selectedModel: ModelOption | null;
} 