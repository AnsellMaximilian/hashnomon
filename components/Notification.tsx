import React, { useContext } from "react";
import { useNotification } from "@/contexts/Notifications";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross2 as Cross } from "react-icons/rx";
import logo from "@/assets/images/logo.svg";
import Image from "next/image";

const Notification = ({
  message,
  status,
}: {
  message: string | null;
  status?: "ERROR" | "SUCCESS" | null;
}) => {
  const { hideNotification } = useNotification();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          exit={{ x: "150%" }}
          className="fixed top-8 right-8 bg-white shadow-lg"
        >
          <div className="flex">
            <div className="py-2 px-4 bg-secondary flex items-center justify-center">
              <Image src={logo} alt="logo" className="w-8" />
            </div>
            <div>
              <div className="p-4 flex items-center justify-between gap-4">
                <div>{message}</div>
                <button
                  className="hover:opacity-50"
                  onClick={() => hideNotification()}
                >
                  <Cross />
                </button>
              </div>
              <div
                className={`h-2 ${
                  status
                    ? status === "ERROR"
                      ? "bg-red-500"
                      : "bg-green-500"
                    : "bg-primary"
                }`}
              ></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
