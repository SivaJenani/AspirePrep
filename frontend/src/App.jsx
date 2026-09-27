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
import { SyllabusDatabasePage } from './pages/SyllabusDatabasePage';
import { UniversityPrepPage } from './pages/UniversityPrepPage';
import { VideoGeneratorPage } from './pages/VideoGeneratorPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfilePage } from './pages/ProfilePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAppStore } from './store/useAppStore';
import { Crosshair, EyeOff } from 'lucide-react';

export function App() {
    const { token, fetchCurrentUser, isDarkMode, setDarkMode, isFocusMode, toggleFocusMode } = useAppStore();


    // Fetch user profile on initial mount if token exists
    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token, fetchCurrentUser]);

    // Keep document HTML classes and colorScheme in sync with theme state
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, [isDarkMode]);

    // Respond to system preference changes if user hasn't explicitly set a preference
    useEffect(() => {
        try {
            const saved = localStorage.getItem('aptitudemax_theme');
            if (!saved && window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const listener = (e) => {
                    if (!localStorage.getItem('aptitudemax_theme')) {
                        setDarkMode(e.matches);
                    }
                };
                mediaQuery.addEventListener('change', listener);
                return () => mediaQuery.removeEventListener('change', listener);
            }
        } catch (e) {
            // ignore
        }
    }, [setDarkMode]);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#080c14] dark:text-white flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
            <Navbar />
            <main className="relative z-10 flex-1 w-full max-w-full overflow-x-hidden">
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
                    <Route path="/learning-progress" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                    <Route path="/study-plan" element={<ProtectedRoute><StudyPlanPage /></ProtectedRoute>} />
                    <Route path="/syllabus" element={<ProtectedRoute><SyllabusDatabasePage /></ProtectedRoute>} />
                    <Route path="/university-prep" element={<ProtectedRoute><UniversityPrepPage /></ProtectedRoute>} />
                    <Route path="/ai-tutor" element={<ProtectedRoute><AiTutorPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/video-generator" element={<ProtectedRoute><VideoGeneratorPage /></ProtectedRoute>} />
                    <Route path="/mistakes" element={<ProtectedRoute><MistakeNotebookPage /></ProtectedRoute>} />
                    <Route path="/speed-duel" element={<ProtectedRoute><SpeedDuelPage /></ProtectedRoute>} />
                    <Route path="/cutoff-predictor" element={<ProtectedRoute><CutoffPredictorPage /></ProtectedRoute>} />
                    <Route path="/formula-deck" element={<ProtectedRoute><FormulaDeckPage /></ProtectedRoute>} />
                    <Route path="/pyq-trends" element={<ProtectedRoute><PyqTrendAnalyzerPage /></ProtectedRoute>} />
                    <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                </Routes>
            </main>

            {/* Floating Zen Focus Mode Quick Widget */}
            {isFocusMode && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/90 text-white p-2 pr-3.5 border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-bounce-subtle">
                    <div className="h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Crosshair className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-black tracking-wider uppercase text-emerald-400">
                            Focus Mode Active
                        </div>
                        <div className="text-[11px] font-bold text-slate-300">
                            Distractions Hidden
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={toggleFocusMode}
                        className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Exit Focus Mode"
                    >
                        <EyeOff className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <Footer />

        </div>
    );
}

export default App;
