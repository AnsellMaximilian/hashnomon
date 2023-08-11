"use client";

import React, { useEffect, useState } from "react";
import DevCard from "@/components/DevCard";
import DevSelect from "@/components/DevSelect";
import { Dev, DevQueryResult, GetDevQuery } from "@/lib/services/devs";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useNotification } from "@/contexts/Notifications";
import { BsFillKeyboardFill as KeyboardIcon } from "react-icons/bs";
import { HiCommandLine as CommandLineIcon } from "react-icons/hi2";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import DevBattleCard from "./DevBattleCard";
import { calculateDamage } from "@/common/calculateDamage";
import {
  GetUserMovesQuery,
  GetUserMovesQueryResult,
} from "@/lib/services/moves";

export default function Arena() {
  const { showNotification } = useNotification();
  const [dev1, setDev1] = useState<Dev | null>(null);
  const [dev2, setDev2] = useState<Dev | null>(null);
  const [getDev1, { loading: dev1Loading, error: dev1Error, data: dev1Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });

  const {
    data: dev1Moves,
    error: dev1MovesError,
    loading: dev1MovesLoading,
  } = useQuery<GetUserMovesQueryResult>(GetUserMovesQuery, {
    variables: {
      userId: dev1?._id,
    },
    onCompleted: (data) => {
      if (data.userMoves === null) {
      } else {
      }
    },
    skip: !dev1,
  });

  const [getDev2, { loading: dev2Loading, error: dev2Error, data: dev2Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });

  useEffect(() => {
    if (dev1Error || dev2Error)
      showNotification("No Dev with that username.", "ERROR");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev1Error, dev2Error]);

  // GAME STATES
  const [gameOn, setGameOn] = useState(false);
  const [dev1Health, setDev1Health] = useState(1000);
  const [dev2Health, setDev2Health] = useState(1000);

  const [turn, setTurn] = useState<1 | 2>(1);

  // Playing the game
  useEffect(() => {
    let timer: NodeJS.Timer;
    if (gameOn && dev1 && dev2) {
      const firstTurn = dev1.stats.speed >= dev2.stats.speed ? 1 : 2;
      const secondTurn = firstTurn === 1 ? 2 : 1;

      timer = setInterval(() => {
        if (turn === firstTurn) {
          const damage = calculateDamage({
            attackerStrength: dev1.stats.strength,
            defenderDefense: dev2.stats.defense,
          });
          setDev2Health((prev) => prev - damage);
          showNotification(
            `${dev1.username} attacked ${dev2.username} for ${damage} damage`
          );

          setTurn(secondTurn);
        } else {
          const damage = calculateDamage({
            attackerStrength: dev2.stats.strength,
            defenderDefense: dev1.stats.defense,
          });
          setDev1Health((prev) => prev - damage);
          showNotification(
            `${dev2.username} attacked ${dev1.username} for ${damage} damage`
          );
          setTurn(firstTurn);
        }
      }, 5000);
    }

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOn, turn, dev1, dev2]);

  useEffect(() => {
    if (dev1Health < 0 || dev2Health < 0) {
      showNotification("Someone won!", "SUCCESS");
      // setGameOn(false);
      setDev1Health(1000);
      setDev2Health(1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev1Health, dev2Health]);

  return (
    <main className="h-screen p-4 bg-gray-50 overflow-x-hidden">
      <AnimatePresence>
        {!gameOn && (
          <div>
            <h1 className="text-5xl font-bold italic text-center text-primary">
              Choose Your Dev!
            </h1>
            <div className="relative">
              <div className="flex gap-4 justify-between mt-4 min-h-[500px] bg-secondary shadow-md rounded-md">
                <DevSelect
                  number={1}
                  getDev={getDev1}
                  dev={dev1}
                  loading={dev1Loading}
                  setDev={setDev1}
                />
                <div className="flex items-center justify-center relative">
                  <div className="absolute bg-primary bg-gradient-to-r from-primary via-blue-400 to-primary w-4 inset-y-0 left-1/2 -translate-x-1/2"></div>
                  <motion.div
                    className="w-32 h-32 relative z-50"
                    exit={{ scale: 10, rotate: 90 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={logo}
                      alt="logo"
                      className="w-full h-full relative"
                    />
                  </motion.div>
                </div>
                <DevSelect
                  number={2}
                  side="RIGHT"
                  getDev={getDev2}
                  dev={dev2}
                  loading={dev2Loading}
                  setDev={setDev2}
                />
              </div>
              {dev1 && dev2 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setGameOn(true)}
                    className="px-8 py-6 text-3xl rounded-full shadow-lg text-white bg-primary font-bold hover:opacity-90 flex gap-6 justify-between items-center"
                  >
                    <KeyboardIcon /> <span>FIGHT</span> <CommandLineIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {gameOn && (
          <div>
            <h1 className="text-5xl font-bold italic text-center text-primary">
              A Battle Commences!
            </h1>
            <div className="relative">
              <div className="flex gap-4 justify-between mt-4 min-h-[500px] bg-secondary shadow-md rounded-md">
                <div className="flex-1 p-4 flex flex-col justify-center">
                  {dev1 && (
                    <DevBattleCard
                      dev={dev1}
                      health={dev1Health}
                      moves={dev1Moves?.userMoves.moves.edges.map(
                        (edge) => edge.node
                      )}
                    />
                  )}
                </div>
                <div className="flex items-center justify-center relative">
                  <div className="absolute bg-primary bg-gradient-to-r from-primary via-blue-400 to-primary w-4 inset-y-0 left-1/2 -translate-x-1/2"></div>
                  <motion.div className="w-32 h-32 relative z-50">
                    <Image
                      src={logo}
                      alt="logo"
                      className="w-full h-full relative"
                    />
                  </motion.div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  {dev2 && (
                    <DevBattleCard
                      dev={dev2}
                      health={dev2Health}
                      side="RIGHT"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
