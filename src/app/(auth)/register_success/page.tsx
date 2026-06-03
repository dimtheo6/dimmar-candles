import Link from "next/link";
import { courgette } from "@/lib/fonts";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-100 flex">
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md text-center space-y-6">
          <h1 className={`${courgette.className} text-4xl text-stone-800`}>
            Dimmar
          </h1>

          <CheckCircleIcon className="mx-auto h-16 w-16 text-amber-500" />

          <div className="space-y-2">
            <h2 className={`${courgette.className} text-3xl text-stone-800`}>
              Account Created!
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Welcome to Dimmar. Your account has been successfully created.
              You&apos;re all set to start shopping.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block w-full bg-stone-900 text-white text-sm font-medium py-3 px-6 rounded-lg hover:bg-stone-700 transition-colors"
          >
            Go back to shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
