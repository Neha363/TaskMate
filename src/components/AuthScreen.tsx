import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface AuthScreenProps {
  isSupabaseConfigured: boolean;
  authActionLoading: boolean;
  error: string | null;
  notice: string | null;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (fullName: string, email: string, password: string) => Promise<boolean>;
  onClearMessages: () => void;
}

export function AuthScreen({
  isSupabaseConfigured,
  authActionLoading,
  error,
  notice,
  onSignIn,
  onSignUp,
  onClearMessages,
}: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setValidationError(null);
    onClearMessages();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    onClearMessages();

    if (mode === 'register' && fullName.trim().length < 2) {
      setValidationError('Please enter your name (at least 2 characters).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'login') {
      await onSignIn(email, password);
    } else {
      await onSignUp(fullName, email, password);
    }
  };

  const activeError = validationError || error;

  return (
    <div className="min-h-screen bg-[#FAF9FE] flex flex-col lg:flex-row">
      {/* Left Brand & Value Column */}
      <div className="lg:w-[46%] bg-[#F4F1FC] border-b lg:border-b-0 lg:border-r border-[#E6E0F4] px-6 py-10 sm:px-12 lg:px-16 lg:py-14 flex flex-col justify-between">
        <div>
          <BrandLogo />
          <div className="mt-10 lg:mt-16 max-w-md">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B2E] leading-tight text-balance">
              Organize every day with quiet clarity.
            </h1>
            <p className="mt-4 text-base text-[#524B69] leading-relaxed">
              Keep personal errands, college coursework, and work deliverables structured in one
              calm workspace—privately synced to your account.
            </p>
          </div>
        </div>

        {/* Clean structured feature preview */}
        <div className="hidden lg:block mt-12 max-w-md bg-white border border-[#E6E0F4] rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9F7]">
            <span className="font-display text-sm font-semibold text-[#1E1B2E]">
              Today&apos;s Focus
            </span>
            <span className="text-xs text-[#6B6385] tabular-nums">3 tasks</span>
          </div>
          <ul className="divide-y divide-[#EDE9F7] mt-1">
            <li className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#1E1B2E]">
                  Submit CS302 research proposal
                </p>
                <p className="text-xs text-[#6B6385] mt-0.5">
                  <span className="text-[#DC2626] font-medium">High priority</span>
                  <span aria-hidden="true"> · </span>
                  <span>College</span>
                  <span aria-hidden="true"> · </span>
                  <span>Today</span>
                </p>
              </div>
            </li>
            <li className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#1E1B2E]">
                  Review Q4 sprint deliverables
                </p>
                <p className="text-xs text-[#6B6385] mt-0.5">
                  <span className="text-[#D97706] font-medium">Medium priority</span>
                  <span aria-hidden="true"> · </span>
                  <span>Work</span>
                  <span aria-hidden="true"> · </span>
                  <span>Tomorrow</span>
                </p>
              </div>
            </li>
            <li className="pt-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium line-through text-[#8D85A5]">
                  Evening grocery run
                </p>
                <p className="text-xs text-[#8D85A5] mt-0.5">
                  <span>Low priority</span>
                  <span aria-hidden="true"> · </span>
                  <span>Personal</span>
                  <span aria-hidden="true"> · </span>
                  <span>Completed</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-[#E6E0F4] rounded-2xl p-6 sm:p-8">
            {/* Mode Switcher */}
            <div
              className="grid grid-cols-2 gap-1 p-1 bg-[#F4F1FC] rounded-lg"
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => switchMode('login')}
                className={`py-2 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === 'login'
                    ? 'bg-white text-[#1E1B2E] shadow-xs'
                    : 'text-[#524B69] hover:text-[#1E1B2E]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => switchMode('register')}
                className={`py-2 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  mode === 'register'
                    ? 'bg-white text-[#1E1B2E] shadow-xs'
                    : 'text-[#524B69] hover:text-[#1E1B2E]'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mt-6">
              <h2 className="font-display text-2xl font-bold text-[#1E1B2E]">
                {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
              </h2>
              <p className="mt-1 text-sm text-[#524B69]">
                {mode === 'login'
                  ? 'Sign in with your email and password to access your tasks.'
                  : 'Register with Supabase Authentication to store your personal tasks securely.'}
              </p>
            </div>

            {!isSupabaseConfigured && (
              <div
                className="mt-5 rounded-xl border border-[#DDD6FE] bg-[#F7F5FF] p-4 text-sm text-[#4C1D95]"
                role="status"
              >
                <div className="flex items-start gap-2.5">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#6D28D9]" />
                  <div>
                    <p className="font-medium text-[#1E1B2E]">Supabase connection required</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#524B69]">
                      Add <code className="font-mono text-[#5B21B6]">SUPABASE_URL</code> and{' '}
                      <code className="font-mono text-[#5B21B6]">SUPABASE_PUBLISHABLE_KEY</code>{' '}
                      (or <code className="font-mono text-[#5B21B6]">VITE_SUPABASE_*</code>) to your
                      Secrets / environment variables and run{' '}
                      <code className="font-mono text-[#5B21B6]">supabase/schema.sql</code> to
                      enable login and task persistence.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeError && (
              <div
                className="mt-5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-800 flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
                <span>{activeError}</span>
              </div>
            )}

            {notice && (
              <div
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm text-emerald-900 flex items-start gap-2.5"
                role="status"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                <span>{notice}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="auth-fullname"
                    className="block text-sm font-medium text-[#1E1B2E] mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="h-4 w-4 text-[#8D85A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="auth-fullname"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Neha Metre"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#9F97B5] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-sm font-medium text-[#1E1B2E] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#8D85A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-10 pr-3.5 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#9F97B5] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-sm font-medium text-[#1E1B2E] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#8D85A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full h-11 pl-10 pr-11 text-sm bg-white border border-[#E6E0F4] rounded-xl text-[#1E1B2E] placeholder:text-[#9F97B5] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/25 focus:border-[#6D28D9] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-[#6B6385] hover:text-[#1E1B2E] hover:bg-[#F4F1FC] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authActionLoading}
                className="w-full h-11 mt-2 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {authActionLoading && (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>
                  {mode === 'login'
                    ? authActionLoading
                      ? 'Signing In...'
                      : 'Sign In'
                    : authActionLoading
                      ? 'Creating Account...'
                      : 'Create Account'}
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
