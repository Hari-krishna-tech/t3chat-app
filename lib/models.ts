export type ModelType =
  | 'qwen/qwen3-8b'
  | 'qwen/qwen-2.5-72b-instruct'
  | 'google/gemini-2.5-flash'
  | 'google/gemini-2.5-pro'
  | 'google/gemini-3.5-flash'
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'anthropic/claude-sonnet-4.6'
  | 'anthropic/claude-opus-4.8';

export interface ModelConfig {
  id: ModelType;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'qwen';
  description: string;
  maxTokens: number;
  requiresKey: boolean;
}

export const MODELS: ModelConfig[] = [
  {
    id: 'qwen/qwen3-8b',
    name: 'Qwen 3 8B',
    provider: 'qwen',
    description: 'Qwen 3 8B model - extremely fast and capable lightweight model.',
    maxTokens: 32768,
    requiresKey: true,
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct',
    provider: 'qwen',
    description: 'Qwen 2.5 flagship model - powerful reasoning and coding.',
    maxTokens: 32768,
    requiresKey: true,
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    description: 'Google\'s fast, efficient model optimized for speed and quality.',
    maxTokens: 1048576,
    requiresKey: true,
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    description: 'Google\'s high-intelligence model for complex reasoning and tasks.',
    maxTokens: 2097152,
    requiresKey: true,
  },
  {
    id: 'google/gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'google',
    description: 'Google\'s latest lightweight and highly capable next-generation model.',
    maxTokens: 1048576,
    requiresKey: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'OpenAI\'s flagship multimodal model, highly versatile.',
    maxTokens: 128000,
    requiresKey: true,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'OpenAI\'s fast, lightweight model for everyday tasks.',
    maxTokens: 128000,
    requiresKey: true,
  },
  {
    id: 'anthropic/claude-sonnet-4.6',
    name: 'Claude 3.5 Sonnet (v4.6)',
    provider: 'anthropic',
    description: 'Anthropic\'s state-of-the-art model for coding and reasoning.',
    maxTokens: 200000,
    requiresKey: true,
  },
  {
    id: 'anthropic/claude-opus-4.8',
    name: 'Claude 3 Opus (v4.8)',
    provider: 'anthropic',
    description: 'Anthropic\'s most powerful model for deep analysis and reasoning.',
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