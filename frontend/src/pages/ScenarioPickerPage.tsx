import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { useGuideStore } from '../store/useGuideStore'
import type { Scenario } from '../types'

const difficultyStyles: Record<Scenario['difficulty'], string> = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-rose-50 text-rose-700 border-rose-200',
}

const difficultyLabels: Record<Scenario['difficulty'], string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

export default function ScenarioPickerPage() {
  const navigate = useNavigate()
  const scenarios = useGuideStore((state) => state.scenarios)
  const setScenario = useGuideStore((state) => state.setScenario)

  function handleSelectScenario(scenario: Scenario) {
    setScenario(scenario)
    navigate('/guide')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="size-4" />
            Назад
          </Button>
          <Badge variant="secondary" className="bg-white/70">
            3 сценария для старта
          </Badge>
        </motion.div>

        <section className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-6"
          >
            <Badge className="gap-2">
              <Sparkles className="size-3.5" />
              Выбор сценария
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Выбери страховую ситуацию, через которую мы проведём тебя шаг за шагом.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Каждый сценарий построен как короткий интерактивный разбор: что произошло,
                какие вопросы задаёт страховщик и какие термины действительно важно понять.
              </p>
            </div>

            <Card className="overflow-hidden border-slate-900/10 bg-slate-950 text-white">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  <ShieldCheck className="size-3.5" />
                  Как это работает
                </Badge>
                <CardTitle className="text-2xl">Никакой сухой теории</CardTitle>
                <CardDescription className="text-slate-300">
                  Сначала выбираешь кейс, потом проходишь guided-flow, а в конце получаешь
                  короткую выжимку с ключевыми терминами и выводами.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Шаг 1</p>
                  <p className="mt-2 text-sm font-medium text-white">Выбор жизненного кейса</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Шаг 2</p>
                  <p className="mt-2 text-sm font-medium text-white">Диалог и ответы</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Шаг 3</p>
                  <p className="mt-2 text-sm font-medium text-white">Итог и термины</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-4">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
              >
                <Card className="group h-full overflow-hidden border-slate-200/80 bg-white/85 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={difficultyStyles[scenario.difficulty]}>
                        {difficultyLabels[scenario.difficulty]}
                      </Badge>
                      <Badge variant="secondary">{scenario.prompts.length} вопроса</Badge>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{scenario.title}</CardTitle>
                      <CardDescription>{scenario.shortDescription}</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Ситуация
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {scenario.situation}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {scenario.terms.slice(0, 3).map((term) => (
                        <span
                          key={term}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="justify-between gap-4">
                    <p className="text-sm text-slate-500">
                      {scenario.learnings.length} ключевых вывода в финале
                    </p>
                    <Button
                      onClick={() => handleSelectScenario(scenario)}
                      className="group/button"
                    >
                      Выбрать
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
