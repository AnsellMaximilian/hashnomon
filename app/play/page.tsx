"use client";

import Selection from "@/components/Selection";
import { NotificationProvider } from "@/contexts/Notifications";
import { SessionProvider } from "next-auth/react";
import { ApolloProviderWrapper } from "@/components/ApolloProviderWrapper";

export default function Play() {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>
        <NotificationProvider>
          <Selection />
        </NotificationProvider>
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
