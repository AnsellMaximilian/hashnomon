"use client";

import Navigation from "@/components/Navigation";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/contexts/Notifications";
import fullLogo from "@/assets/images/logo-full.svg";
import Image from "next/image";
import { ApolloProviderWrapper } from "@/components/ApolloProviderWrapper";

export default function Home() {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>
        <NotificationProvider>
          <main className="min-h-screen p-4 bg-gray-50 overflow-x-hidden flex items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              <Image src={fullLogo} alt="Game Logo" className="w-64 sm:w-96" />

              <Navigation />
            </div>
          </main>
        </NotificationProvider>
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
