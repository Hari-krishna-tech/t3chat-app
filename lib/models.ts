export type ModelType = 'gemini-pro' | 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus';

export interface ModelConfig {
  id: ModelType;
  name: string;
  provider: 'google' | 'openai' | 'anthropic';
  description: string;
  maxTokens: number;
  requiresKey: boolean;
}

export const MODELS: ModelConfig[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google\'s most capable model for text generation',
    maxTokens: 32768,
    requiresKey: true,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'OpenAI\'s most advanced model',
    maxTokens: 8192,
    requiresKey: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient model for most tasks',
    maxTokens: 4096,
    requiresKey: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Anthropic\'s most capable model',
    maxTokens: 200000,
    requiresKey: true,
  },
];

export const getModelConfig = (modelId: ModelType): ModelConfig => {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }
  return model;
}; 