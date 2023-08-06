import React, { useContext } from "react";
import { useNotification } from "@/contexts/Notifications";
import { motion } from "framer-motion";

const Notification = ({
  message,
  status,
}: {
  message: string;
  status?: "ERROR" | "SUCCESS" | null;
}) => {
  const { hideNotification } = useNotification();

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      className="fixed top-8 right-8 bg-white shadow-md"
    >
      <div className="p-4">{message}</div>
      <div
        className={`h-2 ${
          status
            ? status === "ERROR"
              ? "bg-red-500"
              : "bg-green-500"
            : "bg-primary"
        }`}
      ></div>
    </motion.div>
  );
};

export default Notification;
