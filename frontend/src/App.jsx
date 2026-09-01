import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';
import { ExamDiscoveryPage } from './pages/ExamDiscoveryPage';
import { ExamSubjectDetailPage } from './pages/ExamSubjectDetailPage';
import { PracticeHubPage } from './pages/PracticeHubPage';
import { PracticeSessionPage } from './pages/PracticeSessionPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { MockTestSimulatorPage } from './pages/MockTestSimulatorPage';
import { TestResultPage } from './pages/TestResultPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MistakeNotebookPage } from './pages/MistakeNotebookPage';
import { SpeedDuelPage } from './pages/SpeedDuelPage';
import { CutoffPredictorPage } from './pages/CutoffPredictorPage';
import { FormulaDeckPage } from './pages/FormulaDeckPage';
import { PyqTrendAnalyzerPage } from './pages/PyqTrendAnalyzerPage';
import { UniversityPrepPage } from './pages/UniversityPrepPage';
import { VideoGeneratorPage } from './pages/VideoGeneratorPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAppStore } from './store/useAppStore';

export function App() {
    const { token, fetchCurrentUser } = useAppStore();

    // Fetch user profile on initial mount if token exists
    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token, fetchCurrentUser]);

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#080c14] text-white flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Protected Routes */}
                    <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/exams" element={<ProtectedRoute><ExamDiscoveryPage /></ProtectedRoute>} />
                    <Route path="/exam/:slug" element={<ProtectedRoute><ExamSubjectDetailPage /></ProtectedRoute>} />
                    <Route path="/practice" element={<ProtectedRoute><PracticeHubPage /></ProtectedRoute>} />
                    <Route path="/practice/session" element={<ProtectedRoute><PracticeSessionPage /></ProtectedRoute>} />
                    <Route path="/mock-tests" element={<ProtectedRoute><MockTestsPage /></ProtectedRoute>} />
                    <Route path="/mock-tests/simulator/:id" element={<ProtectedRoute><MockTestSimulatorPage /></ProtectedRoute>} />
                    <Route path="/mock-tests/result/:attemptId" element={<ProtectedRoute><TestResultPage /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                    <Route path="/study-plan" element={<ProtectedRoute><StudyPlanPage /></ProtectedRoute>} />
                    <Route path="/university-prep" element={<ProtectedRoute><UniversityPrepPage /></ProtectedRoute>} />
                    <Route path="/ai-tutor" element={<ProtectedRoute><AiTutorPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/video-generator" element={<ProtectedRoute><VideoGeneratorPage /></ProtectedRoute>} />
                    <Route path="/mistakes" element={<ProtectedRoute><MistakeNotebookPage /></ProtectedRoute>} />
                    <Route path="/speed-duel" element={<ProtectedRoute><SpeedDuelPage /></ProtectedRoute>} />
                    <Route path="/cutoff-predictor" element={<ProtectedRoute><CutoffPredictorPage /></ProtectedRoute>} />
                    <Route path="/formula-deck" element={<ProtectedRoute><FormulaDeckPage /></ProtectedRoute>} />
                    <Route path="/pyq-trends" element={<ProtectedRoute><PyqTrendAnalyzerPage /></ProtectedRoute>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
