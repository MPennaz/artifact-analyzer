// src/app/login/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = React.useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState<{ kind: 'error' | 'success'; text: string } | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage({ kind: 'error', text: error.message });
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage({ kind: 'error', text: error.message });
      return;
    }

    setMessage({ kind: 'success', text: 'Account created. You can now sign in.' });
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.08]" />
        {/* glow blobs */}
        <div className="absolute -top-24 left-[-120px] h-[340px] w-[340px] rounded-full bg-fuchsia-600/20 blur-[80px]" />
        <div className="absolute -bottom-24 right-[-120px] h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-[90px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.9)_100%)]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* top badge */}
          <div className="mb-4 flex items-center justify-center">
            
          </div>

          <Card className="border-neutral-800 bg-neutral-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.6)]">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-white">
                    Artifact Analyzer
                  </h1>
                  <p className="text-sm text-neutral-400">
                    Sign in to explore sites, artifacts, and AI insights.
                  </p>
                </div>

                <div className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-800 bg-neutral-950">
                  <ShieldCheck className="h-5 w-5 text-fuchsia-200" />
                </div>
              </div>

              {/* separator */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-black border-neutral-800 focus-visible:ring-fuchsia-500/40"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 bg-black border-neutral-800 focus-visible:ring-fuchsia-500/40"
                      placeholder=""
                    />
                  </div>
                </div>

                {message ? (
                  <div
                    className={[
                      'rounded-md border p-3 text-sm',
                      message.kind === 'error'
                        ? 'border-red-500/30 bg-red-500/10 text-red-200'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    ].join(' ')}
                  >
                    {message.text}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={[
                      'w-full cursor-pointer justify-between',
                      'bg-fuchsia-600 text-white hover:bg-fuchsia-500',
                      'shadow-[0_10px_30px_rgba(217,70,239,0.18)]',
                      'active:scale-[0.99] transition'
                    ].join(' ')}
                  >
                    <span className="font-semibold">
                      {loading ? 'Signing in…' : 'Sign In'}
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-90" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-full cursor-pointer border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
                  >
                    Create account
                  </Button>
                </div>
                
              </form>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  );
}
