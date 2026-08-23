import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/** Shared split layout for auth screens: brand image left on desktop, form right; form-only on mobile. */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <div className="relative hidden shrink-0 lg:block lg:h-dvh lg:w-1/2">
        <Image src="/images/slide-3.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-12 pt-24">
          <h2 className="text-2xl font-extrabold text-white">Quickfiss</h2>
          <p className="mt-2 max-w-sm text-sm text-white/85">
            Find trusted, verified artisans for every home repair and maintenance job.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-10 lg:w-1/2 lg:justify-center lg:px-20 lg:py-0">
        <div className="lg:mx-auto lg:w-full lg:max-w-md">{children}</div>
      </div>
    </div>
  );
};
