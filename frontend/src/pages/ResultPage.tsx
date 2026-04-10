import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuideStore } from '../store/useGuideStore'

export default function ResultPage() {
    const navigate = useNavigate()
    const { scenario, messages, reset } = useGuideStore()

    // Защита: если нет сценария — на главную
    useEffect(() => {
        if (!scenario) navigate('/', { replace: true })
    }, [scenario, navigate])

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
        <div className="min-h-screen bg-white flex flex-col">

            {/* Header */}
            <div className="px-6 pt-12 pb-8 text-center">
                {/* Иконка успеха */}
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Отлично, ты разобрался!
                </h1>
                <p className="text-sm text-gray-400">
                    Сценарий: <span className="text-gray-600 font-medium">{scenario.title}</span>
                </p>
            </div>

            {/* Контент */}
            <div className="flex-1 px-6 max-w-lg mx-auto w-full flex flex-col gap-4">

                {/* Что узнал */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                        Что ты узнал
                    </p>
                    <ul className="flex flex-col gap-2">
                        {scenario.learnings.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-blue-900 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Термины */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Термины
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {scenario.terms.map((term) => (
                            <span
                                key={term}
                                className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border border-gray-200 font-medium"
                            >
                                {term}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Статистика диалога */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {messages.filter((m) => m.role === 'user').length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">ответов дано</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {scenario.terms.length}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">терминов изучено</p>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-8 max-w-lg mx-auto w-full flex flex-col gap-3">
                <button
                    onClick={handleNewScenario}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base py-3.5 rounded-2xl transition-all duration-150"
                >
                    Попробовать другой сценарий
                </button>
                <button
                    onClick={handleRestart}
                    className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
                >
                    Начать сначала
                </button>
            </div>

        </div>
    )
}
