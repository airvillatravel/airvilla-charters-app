import { LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SignupStep3({ email }: { email: string }) {
  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <svg
            className="inline-flex w-16 h-16 fill-current mb-6"
            viewBox="0 0 64 64"
          >
            <circle className="text-emerald-400/30" cx="32" cy="32" r="32" />
            <path
              className="text-emerald-400"
              d="m28.5 41-8-8 3-3 5 5 12-12 3 3z"
            />
          </svg>
          <h1 className="text-lg text-slate-100  mb-8">
            Please check your email{" "}
            <span className="text-red-500 font-bold">{email}</span> to verify
            you account!!
          </h1>
          <Link
            href="/signin"
            className="my-3 text-base bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span className="text-sm">Login</span>
            <LogIn className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
