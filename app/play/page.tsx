"use client";

import Arena from "@/components/Arena";
import { NotificationProvider } from "@/contexts/Notifications";
import { SessionProvider } from "next-auth/react";
import { ApolloProviderWrapper } from "@/components/ApolloProviderWrapper";

export default function Play() {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>
        <NotificationProvider>
          <Arena />
        </NotificationProvider>
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
