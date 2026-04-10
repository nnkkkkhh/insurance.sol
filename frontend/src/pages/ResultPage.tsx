import { CheckCircle2, MessageSquareText, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getAiErrorMessage, getScenarioSummary } from '../services/ai'
import { useGuideStore } from '../store/useGuideStore'

export default function ResultPage() {
  const navigate = useNavigate()
  const {
    scenario,
    messages,
    reset,
    finalSummary,
    summaryLoading,
    summaryError,
    setFinalSummary,
    setSummaryLoading,
    setSummaryError,
  } = useGuideStore()

  const userAnswersCount = useMemo(
    () => messages.filter((message) => message.role === 'user').length,
    [messages],
  )

  const aiFeedback = useMemo(
    () =>
      messages.filter(
        (message) => message.role === 'assistant' && message.kind === 'feedback',
      ),
    [messages],
  )

  useEffect(() => {
    if (!scenario) navigate('/', { replace: true })
  }, [scenario, navigate])

  useEffect(() => {
    if (!scenario || !messages.length || finalSummary || summaryLoading) return
    const activeScenario = scenario

    const feedbackHistory = messages
      .filter((message) => message.role === 'assistant' || message.role === 'user')
      .map((message) => ({
        role: message.role,
        content: message.content,
      }))

    if (!feedbackHistory.length) return

    let cancelled = false

    async function loadSummary() {
      setSummaryLoading(true)
      setSummaryError(null)

      try {
        const summary = await getScenarioSummary({
          scenario: activeScenario,
          history: feedbackHistory,
        })

        if (!cancelled) {
          setFinalSummary(summary)
        }
      } catch (error) {
        if (!cancelled) {
          setSummaryError(getAiErrorMessage(error))
        }
      } finally {
        if (!cancelled) {
          setSummaryLoading(false)
        }
      }
    }

    void loadSummary()

    return () => {
      cancelled = true
    }
  }, [
    finalSummary,
    messages,
    scenario,
    setFinalSummary,
    setSummaryError,
    setSummaryLoading,
    summaryLoading,
  ])

  if (!scenario) return null

  const handleNewScenario = () => {
    reset()
    navigate('/scenarios')
  }

  const handleRestart = () => {
    reset()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-7rem] top-12 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden border-emerald-200/60 bg-white/85">
            <CardHeader className="space-y-4">
              <Badge className="w-fit gap-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="size-3.5" />
                Сценарий завершён
              </Badge>
              <div className="space-y-3">
                <CardTitle className="text-4xl leading-tight">
                  Отлично, ты разобрался в кейсе "{scenario.title}".
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7">
                  Ты прошёл AI-guided сценарий, получил обратную связь по каждому ответу и
                  собрал ключевую базу по теме страхования.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ответов</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{userAnswersCount}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Терминов</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{scenario.terms.length}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI-разборов</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{aiFeedback.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-slate-950 text-white">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <Sparkles className="size-3.5" />
                AI takeaway
              </Badge>
              <CardTitle className="text-2xl">Последние выводы от модели</CardTitle>
              <CardDescription className="text-slate-300">
                Здесь остаются последние AI-комментарии, чтобы быстро вспомнить логику
                разбора сценария.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summaryLoading ? (
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  AI собирает итоговую выжимку по сценарию...
                </div>
              ) : finalSummary ? (
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-7 text-slate-200">{finalSummary}</p>
                </div>
              ) : summaryError ? (
                <div className="space-y-3">
                  <div className="rounded-[24px] border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                    {summaryError}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFinalSummary(null)
                      setSummaryError(null)
                    }}
                  >
                    Повторить summary
                  </Button>
                </div>
              ) : (
                aiFeedback.slice(-2).map((message) => (
                  <div
                    key={message.id}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm leading-7 text-slate-200">{message.content}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-2xl">Что ты узнал</CardTitle>
              <CardDescription>
                Базовая выжимка сценария, которую пользователь должен унести с собой.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenario.learnings.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[24px] bg-sky-50 p-4 ring-1 ring-inset ring-sky-100"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-bold text-sky-800">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-2xl">Термины</CardTitle>
              <CardDescription>
                Набор понятий, который стоит закрепить после прохождения кейса.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {scenario.terms.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {term}
                </span>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={handleNewScenario}>
            <MessageSquareText className="size-4" />
            Попробовать другой сценарий
          </Button>
          <Button size="lg" variant="secondary" onClick={handleRestart}>
            <RotateCcw className="size-4" />
            Начать сначала
          </Button>
        </div>
      </div>
    </div>
  )
}
