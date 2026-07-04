"use client";

import { useState } from "react";
import Link from "next/link";
import { courgette } from "@/lib/fonts";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const user = userCredential.user;

      // verify email
      // await sendEmailVerification(user);

      // Save extra user info in Firesstore

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: serverTimestamp(),
        role: "user",
      });

      console.log("Account created!");
      router.push("/register_success");
    } catch (err: any) {
      console.log(err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already exists");
          break;

        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;

        case "auth/invalid-email":
          setError("Invalid email");
          break;

        default:
          setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col items-center justify-center gap-6 p-16 text-center">
        <Link
          href={"/"}
          className={`${courgette.className} text-white text-5xl`}
        >
          Dimmar
        </Link>
        <p className="text-stone-400 text-base leading-relaxed max-w-xs">
          Handcrafted candles &amp; homewares, made with care. Bringing warmth
          to every home.
        </p>
        <div className="mt-4 w-12 h-px bg-stone-600" />
        <p className="text-stone-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center">
            <Link
              href={"/"}
              className={`${courgette.className} text-stone-900 text-4xl`}
            >
              Dimmar
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Sign up to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-5">
              {/* First Name */}
              <div className="space-y-1.5 flex-1">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-stone-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  autoComplete="given-name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  required
                />
              </div>
              {/* Last Name */}
              <div className="space-y-1.5 flex-1">
                <div className="space-y-1.5">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    autoComplete="family-name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                    required
                  />
                </div>
              </div>
            </div>
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
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                required
              />
              <p className="text-sm text-red-500">{error}</p>
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
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-11 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  required
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
              {/* Confirm Password */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 pr-11 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  required
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
              {formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              id="submit"
              className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 active:bg-amber-700 transition-colors cursor-pointer"
            >
              Create account
            </button>
          </form>

          {/* Mobile sign up link */}
          <p className="lg:hidden text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-600 hover:text-amber-500 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
