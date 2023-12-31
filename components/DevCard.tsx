import { Dev } from "@/lib/services/devs";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import fallbackPicture from "@/assets/images/404.svg";
import { useState, useEffect } from "react";

const Bar = ({
  width,
  label,
  colorClasses,
  side,
}: {
  width: number;
  label: string;
  colorClasses: string;
  side: "RIGHT" | "LEFT";
}) => {
  return (
    <div className="relative p-2 bg-gray-400 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ delay: 0.35 }}
        className={`bg-red-600 h-full absolute inset-y-0 bg-gradient-to-b ${colorClasses} ${
          side === "RIGHT" ? "right-0" : "left-0"
        }`}
      ></motion.div>
      <div
        className={`relative font-bold text-white ${
          side === "RIGHT" ? "text-right" : "text-left"
        }`}
      >
        {label}
      </div>
    </div>
  );
};

export default function DevCard({
  side = "LEFT",
  dev: {
    username,
    photo,
    stats: { strength, defense, speed },
  },
}: {
  dev: Dev;
  side?: "RIGHT" | "LEFT";
}) {
  const [devPhoto, setDevPhoto] = useState(fallbackPicture);
  useEffect(() => {
    try {
      const photoURL = new URL(photo);
      setDevPhoto(photo);
    } catch (error) {
      setDevPhoto(fallbackPicture);
    }
  }, [photo]);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: side === "RIGHT" ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`rounded-full border-4 border-primary overflow-hidden shadow-lg ${
            side === "RIGHT" ? "order-2" : ""
          }`}
        >
          <Image
            src={devPhoto}
            width={125}
            height={125}
            alt="Dev Photo"
            placeholder={fallbackPicture}
            onError={() => setDevPhoto(fallbackPicture)}
          />
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          <Bar
            side={side}
            label="STRENGTH"
            colorClasses="from-red-700 via-red-400 to-red-700"
            width={strength}
          />
          <Bar
            side={side}
            label="DEFENSE"
            colorClasses="from-green-700 via-green-400 to-green-700"
            width={defense}
          />
          <Bar
            side={side}
            label="SPEED"
            colorClasses="from-blue-700 via-blue-400 to-blue-700"
            width={speed}
          />
        </div>
      </div>
      <div className="flex">
        <h2
          className={`bg-primary text-white font-bold p-3 mt-4 text-2xl shadow-md max-w-fit rounded-md ${
            side === "RIGHT" ? "ml-auto" : ""
          }`}
        >
          @{username}
        </h2>
      </div>
    </motion.div>
  );
}
