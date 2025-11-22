
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { ScrollToTop } from './components/logic/ScrollToTop';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChapterHub = lazy(() => import('./pages/ChapterHub'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Exercises = lazy(() => import('./pages/Exercises'));

// Configure TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      // Smart Retry Strategy: Don't retry if it's a 404 (Not Found)
      retry: (failureCount, error) => {
        if (error.message.includes('404') || error.message.includes('introuvable')) return false;
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
    <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen relative text-slate-800 font-body selection:bg-blue-900/10 selection:text-blue-900">
                <main className="w-full animate-fadeIn">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      <Route path="/chapter/:chapterId" element={<ChapterHub />} />
                      <Route path="/chapter/:chapterId/lesson" element={<Lesson />} />
                      <Route path="/chapter/:chapterId/quiz" element={<Quiz />} />
                      <Route path="/chapter/:chapterId/exercises" element={<Exercises />} />
                      
                      <Route path="/" element={<Navigate to="/login" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </main>
            </div>
          </Router>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
