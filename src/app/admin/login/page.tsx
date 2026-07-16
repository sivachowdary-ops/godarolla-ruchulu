'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdmin();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(password);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-md w-full space-y-8 bg-white border border-border-warm rounded-2xl shadow-xl p-8">
        
        {/* Brand logo & Header */}
        <div className="text-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-accent-gold mx-auto mb-4 bg-bg-cream-dark">
            <Image
              src="/images/logo.jpeg"
              alt="Godarolla Ruchulu"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-text-charcoal">
            Admin Portal Access
          </h2>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-semibold">
            Godarolla Ruchulu — VSM 1969
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password-input" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex justify-between">
                <span>Enter Password</span>
                <span className="text-[10px] text-text-muted font-normal lowercase">(default: vsm-change-me)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10 pr-3 py-3 w-full rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold bg-bg-cream/10"
                />
              </div>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex gap-2 p-3 bg-primary-red/5 border border-primary-red/10 rounded-lg text-xs text-primary-red">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-red hover:bg-primary-red-dark focus:outline-none shadow transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-text-muted hover:text-primary-red transition-colors font-semibold"
          >
            ← Back to Storefront
          </button>
        </div>

      </div>
    </div>
  );
}
