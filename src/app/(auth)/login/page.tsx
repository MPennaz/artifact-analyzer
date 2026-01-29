// src/app/login/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = React.useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setError('Account created. You can now sign in.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">
            artifact-analyzer
          </h1>
          <p className="text-sm text-neutral-400">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neutral-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neutral-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full rounded-md border border-neutral-800 py-2 text-sm text-neutral-300 hover:bg-neutral-900 disabled:opacity-50"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
