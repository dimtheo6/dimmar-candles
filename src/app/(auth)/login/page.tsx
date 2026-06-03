"use client";

import { useState } from "react";
import Link from "next/link";
import { courgette } from "@/lib/fonts";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/lib/firebase";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit= async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      console.log("Logged in user:", user);
      // Redirect or show success message
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false);
    }
  }
    

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col items-center justify-center gap-6 p-16 text-center">
        <h1 className={`${courgette.className} text-white text-5xl`}>Dimmar</h1>
        <p className="text-stone-400 text-base leading-relaxed max-w-xs">
          Handcrafted candles &amp; homewares, made with care. Bringing warmth
          to every home.
        </p>
        <div className="mt-4 w-12 h-px bg-stone-600" />
        <p className="text-stone-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center">
            <h1 className={`${courgette.className} text-stone-900 text-4xl`}>
              Dimmar
            </h1>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-600 hover:text-amber-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-11 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 active:bg-amber-700 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>

          {/* Mobile sign up link */}
          <p className="lg:hidden text-center text-sm text-stone-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-amber-600 hover:text-amber-500 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
