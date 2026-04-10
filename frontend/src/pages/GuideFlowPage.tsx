import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, MessageSquareText } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getAiErrorMessage, getScenarioGuidance } from '../services/ai'
import { useGuideStore } from '../store/useGuideStore'
import type { GuideMessage } from '../types'

export default function GuideFlowPage() {
  const navigate = useNavigate()
  const scenario = useGuideStore((state) => state.scenario)
  const messages = useGuideStore((state) => state.messages)
  const currentStep = useGuideStore((state) => state.currentStep)
  const isLoading = useGuideStore((state) => state.isLoading)
  const error = useGuideStore((state) => state.error)
  const completed = useGuideStore((state) => state.completed)
  const addMessage = useGuideStore((state) => state.addMessage)
  const setLoading = useGuideStore((state) => state.setLoading)
  const setError = useGuideStore((state) => state.setError)
  const nextStep = useGuideStore((state) => state.nextStep)
  const markCompleted = useGuideStore((state) => state.markCompleted)
  const [draft, setDraft] = useState('')

  const totalSteps = scenario?.prompts.length ?? 0
  const currentPrompt = scenario?.prompts[currentStep]
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0
  const conversation = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages],
  )

  useEffect(() => {
    if (!scenario) {
      navigate('/scenarios', { replace: true })
    }
  }, [navigate, scenario])

  if (!scenario) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = draft.trim()
    if (!value || !currentPrompt || isLoading || completed) return

    const userMessage: GuideMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      kind: 'answer',
      content: value,
      stepIndex: currentStep,
    }

    addMessage(userMessage)
    setDraft('')
    setLoading(true)
    setError(null)

    try {
      const assistantReply = await getScenarioGuidance({
        scenario,
        currentPrompt,
        currentStep,
        history: [...messages, userMessage].map((message) => ({
          role: message.role,
          content: message.content,
        })),
        userAnswer: value,
      })

      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'feedback',
        content: assistantReply,
        stepIndex: currentStep,
      })

      if (currentStep + 1 >= totalSteps) {
        markCompleted(true)
      } else {
        nextStep()
      }
    } catch (requestError) {
      const message = getAiErrorMessage(requestError)

      setError(message)
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'error',
        content: `Ошибка AI: ${message}`,
        stepIndex: currentStep,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute right-[-7rem] top-12 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="absolute bottom-12 left-1/3 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate('/scenarios')}>
            <ArrowLeft className="size-4" />
            К сценариям
          </Button>
          <Badge variant="secondary" className="bg-white/75">
            {completed ? 'Сценарий завершён' : `Шаг ${currentStep + 1} из ${totalSteps}`}
          </Badge>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden border-slate-900/10 bg-slate-950 text-white">
              <CardHeader className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  <MessageSquareText className="size-3.5" />
                  Guided flow
                </Badge>
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{scenario.title}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {scenario.shortDescription}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Прогресс</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <motion.div
                      className="h-2 rounded-full bg-sky-300"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Ситуация
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{scenario.situation}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {scenario.terms.map((term) => (
                    <span
                      key={term}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {conversation.length > 0 ? (
              <Card className="bg-white/70">
                <CardHeader>
                  <CardTitle className="text-lg">Диалог с AI</CardTitle>
                  <CardDescription>
                    После каждого ответа модель даёт разбор именно под выбранный кейс.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {conversation.map((message, index) => (
                    <div
                      key={message.id ?? index}
                      className={`rounded-2xl p-4 ring-1 ring-inset ${
                        message.role === 'assistant'
                          ? 'bg-sky-50 ring-sky-100'
                          : 'bg-slate-50 ring-slate-100'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {message.role === 'assistant' ? 'AI-разбор' : `Твой ответ ${index + 1}`}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{message.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Card className="border-slate-200/80 bg-white/85">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Badge>{completed ? 'Финал' : `Вопрос ${currentStep + 1}`}</Badge>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="size-4" />
                    {completed ? 'Можно перейти к итогу' : `${totalSteps - currentStep} осталось`}
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {completed ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <CardTitle className="text-3xl leading-tight">
                        AI завершил разбор сценария. Можно перейти к итогам.
                      </CardTitle>
                      <CardDescription className="text-base leading-7">
                        Все ответы уже разобраны моделью. На следующем экране увидишь краткую
                        выжимку по сценарию и изученным терминам.
                      </CardDescription>
                    </motion.div>
                  ) : currentPrompt ? (
                    <motion.div
                      key={currentPrompt.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <CardTitle className="text-3xl leading-tight">
                        {currentPrompt.question}
                      </CardTitle>
                      {currentPrompt.helperText ? (
                        <CardDescription className="text-base leading-7">
                          {currentPrompt.helperText}
                        </CardDescription>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </CardHeader>

              <CardContent>
                {completed ? (
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
                      <p className="text-sm leading-7 text-emerald-900">
                        Сценарий завершён. AI уже дал обратную связь по каждому твоему ответу.
                      </p>
                    </div>
                    <Button size="lg" onClick={() => navigate('/result')}>
                      К результату
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                      <span className="mb-3 block text-sm font-medium text-slate-700">
                        Твой ответ
                      </span>
                      <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={7}
                        placeholder="Напиши, как ты понимаешь эту ситуацию. Можно простыми словами."
                        className="w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </label>

                    {error ? (
                      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {error}
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-6 text-slate-500">
                        Ответ отправится в AI-модель, заточенную под этот страховой кейс.
                      </p>
                      <Button type="submit" size="lg" disabled={!draft.trim() || isLoading}>
                        {isLoading ? 'AI думает...' : 'Отправить ответ'}
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
