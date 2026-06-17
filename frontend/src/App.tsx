import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAppStore } from './store/appStore';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

// Lazy loading pages
const HomeFeed = lazy(() => import('./pages/HomeFeed'));
const Profile = lazy(() => import('./pages/Profile'));
const Buzz = lazy(() => import('./pages/Buzz'));
const News = lazy(() => import('./pages/News'));
const History = lazy(() => import('./pages/History'));
const Trending = lazy(() => import('./pages/Trending'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Chat = lazy(() => import('./pages/Chat'));
const Signup = lazy(() => import('./features/auth/components/Signup'));
const Login = lazy(() => import('./features/auth/components/Login'));
const ForgotPassword = lazy(() => import('./features/auth/components/ForgotPassword'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isAddingAccount = useAppStore((state) => state.isAddingAccount);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const theme = useAppStore((state) => state.theme);

  // Theme Management Logic
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Show nothing or a splash screen until the store has loaded from localStorage
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#08060d] flex flex-col items-center justify-center">
        <img src="/JanNetra.png" alt="Logo" className="w-24 h-24 mb-6 animate-pulse" />
        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-loading-bar"></div>
        </div>
      </div>
    );
  }

  console.log("App Auth State:", { isAuthenticated, isAddingAccount });

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <SocketProvider>
        <div className="min-h-screen bg-main-bg text-main-text transition-colors duration-300 font-sans">
          
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes - Only accessible if not authenticated OR if adding an account */}
              {(!isAuthenticated || isAddingAccount) && (
                <>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  {/* Redirect unauthenticated users trying to access root to login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              )}

              {/* Private Routes - Only accessible if authenticated AND not in adding account mode */}
              {isAuthenticated && !isAddingAccount && (
                <>
                  <Route path="/" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <HomeFeed />
                        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest pb-6">
                          © 2026 JanNetra • India's Administrative Network
                        </footer>
                      </main>
                    </div>
                  } />
                  <Route path="/profile" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Profile />
                      </main>
                    </div>
                  } />
                  <Route path="/profile/:username" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Profile />
                      </main>
                    </div>
                  } />
                  <Route path="/buzz" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Buzz />
                      </main>
                    </div>
                  } />
                  <Route path="/news" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <News />
                      </main>
                    </div>
                  } />
                  <Route path="/history" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <History />
                      </main>
                    </div>
                  } />
                  <Route path="/trending" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Trending />
                      </main>
                    </div>
                  } />
                  <Route path="/schemes" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Schemes />
                      </main>
                    </div>
                  } />
                  <Route path="/analytics" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Analytics />
                      </main>
                    </div>
                  } />
                  <Route path="/chats" element={
                    <div className="flex pt-12">
                      <Navbar />
                      <Sidebar />
                      <main className="ml-[64px] flex-1 p-3 lg:p-6 transition-all duration-300">
                        <Chat />
                      </main>
                    </div>
                  } />
                </>
              )}

              {/* Redirect to login if not authenticated */}
              {!isAuthenticated && (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}

              {/* Default catch-all when logged in */}
              {isAuthenticated && !isAddingAccount && (
                 <Route path="*" element={<Navigate to="/" replace />} />
              )}
            </Routes>
          </Suspense>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;
