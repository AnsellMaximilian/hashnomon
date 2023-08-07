"use client";

import Selection from "@/components/Selection";
import { NotificationProvider } from "@/contexts/Notifications";

export default function Play() {
  return (
    <NotificationProvider>
      <Selection />
    </NotificationProvider>
  );
}
