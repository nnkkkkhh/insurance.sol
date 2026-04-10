import { useNavigate } from 'react-router-dom'

const features = [
    {
        icon: '🎯',
        title: 'Реальные сценарии',
        desc: 'Разбитый телефон, поездка за границу, травма на тренировке',
    },
    {
        icon: '🤖',
        title: 'ИИ-помощник',
        desc: 'Объясняет сложные вещи простым языком, отвечает на вопросы',
    },
    {
        icon: '📚',
        title: 'Без скуки',
        desc: 'Никаких учебников — только живой диалог и практика',
    },
]

export default function WelcomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Интерактивный гайд
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                    Страхование —{' '}
                    <span className="text-blue-600">это просто</span>
                </h1>

                <p className="text-lg text-gray-500 max-w-sm mb-10 leading-relaxed">
                    Разберись как работает страхование через реальные истории и диалог с ИИ
                </p>

                {/* CTA */}
                <button
                    onClick={() => navigate('/scenarios')}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-base font-semibold px-8 py-3.5 rounded-2xl transition-all duration-150 shadow-sm shadow-blue-200"
                >
                    Начать →
                </button>

                <p className="text-sm text-gray-400 mt-3">Займёт около 5 минут</p>
            </div>

            {/* Features */}
            <div className="px-6 pb-12 max-w-lg mx-auto w-full">
                <div className="flex flex-col gap-3">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="flex items-start gap-4 bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                        >
                            <span className="text-2xl mt-0.5 select-none">{f.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
