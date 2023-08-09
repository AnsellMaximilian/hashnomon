import { Dev } from "@/lib/services/devs";
import React, { useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Image from "next/image";
import fallbackPicture from "@/assets/images/404.svg";

interface DevBattleCardProps {
  dev: Dev;
  health: number;
  side?: "RIGHT" | "LEFT";
}

export default function DevBattleCard({
  health,
  dev,
  side = "LEFT",
}: DevBattleCardProps) {
  const [devPhoto, setDevPhoto] = useState(fallbackPicture);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    try {
      const photoURL = new URL(dev.photo);
      setDevPhoto(dev.photo);
    } catch (error) {
      setDevPhoto(fallbackPicture);
    }
  }, [dev.photo]);

  const displayedHealth = health < 0 ? 0 : health;

  useEffect(() => {
    if (displayedHealth < 1000) {
      animate(scope.current, { x: [25, 0, 25, 0, 25, 0] }, { duration: 0.5 });
    }
  }, [displayedHealth, scope, animate]);

  return (
    <motion.div
      ref={scope}
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
          <div className="relative p-2 bg-gray-400 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(displayedHealth / 1000) * 100}%` }}
              transition={{ delay: 0.5 }}
              className={`bg-red-600 h-full absolute inset-y-0 bg-gradient-to-b from-pink-600 via-pink-500 to-pink-600 ${
                side === "RIGHT" ? "right-0" : "left-0"
              }`}
            ></motion.div>
            <div
              className={`relative font-bold text-white flex gap-2 justify-between`}
            >
              <div className={side === "LEFT" ? "order-1" : "order-2"}>
                HEALTH
              </div>
              <div className="order-1 font-normal">{displayedHealth}/1000</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <h2
          className={`bg-primary text-white font-bold p-3 mt-4 text-2xl shadow-md max-w-fit rounded-md ${
            side === "RIGHT" ? "ml-auto" : ""
          }`}
        >
          @{dev.username}
        </h2>
      </div>
    </motion.div>
  );
}
