import { Routes, Route, Navigate } from 'react-router-dom'
import ScenarioPickerPage from './pages/ScenarioPickerPage'
import GuideFlowPage from './pages/GuideFlowPage'
import ResultPage from './pages/ResultPage'
import WelcomePage from './pages/WelcomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/scenarios" element={<ScenarioPickerPage />} />
      <Route path="/guide" element={<GuideFlowPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
