import axios from 'axios'
import type { AiChatMessage, Scenario, ScenarioPrompt } from '../types'

const PROVIDERS = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'google/gemma-4-26b-a4b-it:free',
    apiKey:
      import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY,
  },
} as const

type ProviderName = keyof typeof PROVIDERS

type ScenarioGuidanceInput = {
  scenario: Scenario
  currentPrompt: ScenarioPrompt
  currentStep: number
  history: AiChatMessage[]
  userAnswer: string
}

const selectedProvider =
  (import.meta.env.VITE_AI_PROVIDER as ProviderName | undefined) ?? 'openrouter'

const provider = PROVIDERS[selectedProvider] ?? PROVIDERS.openrouter

export async function getScenarioGuidance({
  scenario,
  currentPrompt,
  currentStep,
  history,
  userAnswer,
}: ScenarioGuidanceInput) {
  if (!provider.apiKey) {
    throw new Error(
      `Не найден API ключ для провайдера "${selectedProvider}". Добавь переменную окружения для AI.`,
    )
  }

  const systemMessage = [
    scenario.systemPrompt,
    `Название сценария: ${scenario.title}.`,
    `Цель обучения: ${scenario.goal}.`,
    `Ситуация: ${scenario.situation}.`,
    `Текущий шаг: ${currentStep + 1} из ${scenario.prompts.length}.`,
    `Текущий вопрос: ${currentPrompt.question}.`,
    currentPrompt.helperText ? `Подсказка к вопросу: ${currentPrompt.helperText}.` : null,
    `Ответ пользователя: ${userAnswer}.`,
    'Ответь по-русски.',
    'Структура ответа обязательна:',
    '1. Короткий фидбек на ответ пользователя.',
    '2. Простое объяснение сути.',
    '3. Практический комментарий, что проверить в реальном полисе или процессе.',
    'Держи ответ в пределах 120-180 слов.',
  ]
    .filter(Boolean)
    .join('\n')

  const messages = [
    { role: 'system', content: systemMessage },
    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ]

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${provider.apiKey}`,
  }

  if (selectedProvider === 'openrouter') {
    headers['HTTP-Referer'] = 'http://localhost:5173'
    headers['X-Title'] = 'insurance.sol'
  }

  const response = await axios.post(
    `${provider.baseURL}/chat/completions`,
    {
      model: provider.model,
      messages,
      temperature: 0.45,
      max_tokens: 350,
    },
    {
      headers,
      timeout: 30_000,
    },
  )

  const content = response.data?.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('AI не вернул текстовый ответ для этого шага.')
  }

  return content.trim()
}

export function getAiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const providerMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message

    if (status === 404) {
      return 'AI endpoint не найден. Проверь адрес провайдера и конфигурацию API.'
    }

    if (status === 401 || status === 403) {
      return 'AI ключ недействителен или у него нет доступа к этой модели.'
    }

    if (status === 429) {
      return 'AI-модель временно перегружена или упёрлась в лимит. Попробуй ещё раз чуть позже.'
    }

    if (status && status >= 500) {
      return 'AI-провайдер сейчас недоступен. Попробуй повторить запрос позже.'
    }

    return providerMessage || 'Не удалось получить ответ от AI.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось получить ответ от AI.'
}
