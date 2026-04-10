import { create } from 'zustand'
import { scenarios } from '../data/scenarios'
import type { GuideMessage, Scenario } from '../types'

type GuideStore = {
  scenario: Scenario | null
  messages: GuideMessage[]
  currentStep: number
  isLoading: boolean
  error: string | null
  completed: boolean
  scenarios: Scenario[]
  setScenario: (scenario: Scenario | null) => void
  addMessage: (message: GuideMessage) => void
  setMessages: (messages: GuideMessage[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  nextStep: () => void
  markCompleted: (completed: boolean) => void
  reset: () => void
}

const initialState = {
  scenario: null,
  messages: [],
  currentStep: 0,
  isLoading: false,
  error: null,
  completed: false,
}

export const useGuideStore = create<GuideStore>((set) => ({
  ...initialState,
  scenarios,
  setScenario: (scenario) =>
    set({
      scenario,
      currentStep: 0,
      isLoading: false,
      error: null,
      completed: false,
      messages: scenario
        ? [
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              kind: 'intro',
              content: scenario.assistantIntro,
              stepIndex: -1,
            },
          ]
        : [],
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),
  markCompleted: (completed) => set({ completed }),
  reset: () => set(initialState),
}))
