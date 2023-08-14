"use client";

import { NotificationProvider } from "@/contexts/Notifications";
import { SessionProvider } from "next-auth/react";
import { ApolloProviderWrapper } from "@/components/ApolloProviderWrapper";
import Hashnodex from "@/components/Hashnodex";

export default function HashnodexPage() {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>
        <NotificationProvider>
          <Hashnodex />
        </NotificationProvider>
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
