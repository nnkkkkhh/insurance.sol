export type GuideMessageRole = 'system' | 'assistant' | 'user'

export type GuideMessage = {
  id: string
  role: GuideMessageRole
  content: string
  kind?: 'intro' | 'answer' | 'feedback' | 'error'
  stepIndex?: number
}

export type ScenarioPrompt = {
  id: string
  question: string
  helperText?: string
}

export type Scenario = {
  id: string
  title: string
  shortDescription: string
  situation: string
  difficulty: 'easy' | 'medium' | 'hard'
  goal: string
  assistantIntro: string
  systemPrompt: string
  prompts: ScenarioPrompt[]
  learnings: string[]
  terms: string[]
}

export type GuideState = {
  scenario: Scenario | null
  messages: GuideMessage[]
  currentStep: number
  isLoading: boolean
  error: string | null
  completed: boolean
  finalSummary: string | null
  summaryLoading: boolean
  summaryError: string | null
}

export type AiChatMessage = {
  role: GuideMessageRole
  content: string
}
