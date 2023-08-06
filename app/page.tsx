"use client";

import Selection from "@/components/Selection";
import { NotificationProvider } from "@/contexts/Notifications";

export default function Home() {
  return (
    <NotificationProvider>
      <Selection />
    </NotificationProvider>
  );
}
