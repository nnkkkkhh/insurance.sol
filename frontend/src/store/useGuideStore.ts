import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { scenarios } from '../data/scenarios'
import type { GuideMessage, Scenario } from '../types'

type GuideStore = {
  scenario: Scenario | null
  messages: GuideMessage[]
  currentStep: number
  isLoading: boolean
  error: string | null
  completed: boolean
  finalSummary: string | null
  summaryLoading: boolean
  summaryError: string | null
  scenarios: Scenario[]
  setScenario: (scenario: Scenario | null) => void
  addMessage: (message: GuideMessage) => void
  setMessages: (messages: GuideMessage[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setFinalSummary: (summary: string | null) => void
  setSummaryLoading: (loading: boolean) => void
  setSummaryError: (error: string | null) => void
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
  finalSummary: null,
  summaryLoading: false,
  summaryError: null,
}

export const useGuideStore = create<GuideStore>()(
  persist(
    (set) => ({
      ...initialState,
      scenarios,
      setScenario: (scenario) =>
        set({
          scenario,
          currentStep: 0,
          isLoading: false,
          error: null,
          completed: false,
          finalSummary: null,
          summaryLoading: false,
          summaryError: null,
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
      setFinalSummary: (finalSummary) => set({ finalSummary }),
      setSummaryLoading: (summaryLoading) => set({ summaryLoading }),
      setSummaryError: (summaryError) => set({ summaryError }),
      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),
      markCompleted: (completed) => set({ completed }),
      reset: () => set({ ...initialState, scenarios }),
    }),
    {
      name: 'insurance-guide-store',
      partialize: (state) => ({
        scenario: state.scenario,
        messages: state.messages,
        currentStep: state.currentStep,
        completed: state.completed,
        finalSummary: state.finalSummary,
      }),
    },
  ),
)
