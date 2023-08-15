"use client";

import React, { useCallback, useEffect, useState } from "react";
import DevSelect from "@/components/DevSelect";
import { BsArrowLeftCircleFill as ArrowLeft } from "react-icons/bs";

import {
  Dev,
  DevQueryResult,
  GetDevQuery,
  GetUserDevsQuery,
  GetUserDevsQueryResult,
  UpdateUserDevsQuery,
} from "@/lib/services/devs";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import {
  ApolloQueryResult,
  OperationVariables,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";

import { useNotification } from "@/contexts/Notifications";
import { BsFillKeyboardFill as KeyboardIcon } from "react-icons/bs";
import { HiCommandLine as CommandLineIcon } from "react-icons/hi2";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import DevBattleCard from "./DevBattleCard";
import { calculateDamage } from "@/common/calculateDamage";
import {
  CreateUserMovesQuery,
  GetMovesQuery,
  GetMovesQueryResult,
  GetUserMovesQuery,
  GetUserMovesQueryResult,
} from "@/lib/services/moves";
import { generateUniqueRandomNumbers, rollChance, wait } from "@/common/utils";
import { calculateStatBoost } from "@/common/calculateStatBoost";
import { calculateStatDrain } from "@/common/calculateStatDrain";
import { useSession } from "next-auth/react";
import StarterDev from "./StarterDev";
import UserDevsSelection from "./UserDevsSelection";
import Link from "next/link";
import Unauthenticated from "./Unauthenticated";

export default function Arena() {
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();

  const [addNewUserMoves] = useMutation(CreateUserMovesQuery);
  const [updateUserDevs] = useMutation(UpdateUserDevsQuery);

  const handleAddUserMoves = useCallback(
    async (
      movesResult: GetMovesQueryResult,
      refetch: (
        variables?: Partial<OperationVariables> | undefined
      ) => Promise<ApolloQueryResult<GetUserMovesQueryResult>>,
      userId?: string
    ) => {
      try {
        const numbers = generateUniqueRandomNumbers(
          4,
          movesResult.moveCollection.edges.length
        );
        await addNewUserMoves({
          variables: {
            userId: userId,
            moveId1: movesResult.moveCollection.edges[numbers[0]].node.id,
            moveId2: movesResult.moveCollection.edges[numbers[1]].node.id,
            moveId3: movesResult.moveCollection.edges[numbers[2]].node.id,
            moveId4: movesResult.moveCollection.edges[numbers[3]].node.id,
          },
        });
        refetch({ userId: userId });
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [getMoves, { loading: movesLoading, error: movesError }] =
    useLazyQuery<GetMovesQueryResult>(GetMovesQuery);

  const [dev1, setDev1] = useState<Dev | null>(null);
  const [dev2, setDev2] = useState<Dev | null>(null);
  const [getDev1, { loading: dev1Loading, error: dev1Error, data: dev1Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });

  const { data: dev1Moves, refetch: refetchDev1Moves } =
    useQuery<GetUserMovesQueryResult>(GetUserMovesQuery, {
      variables: {
        userId: dev1?._id,
      },
      onCompleted: (data) => {
        if (data.userMoves === null) {
          getMoves({
            onCompleted: async (data) => {
              handleAddUserMoves(data, refetchDev1Moves, dev1?._id);
            },
          });
        } else {
        }
      },
      skip: !dev1,
    });
  const {
    data: dev1Devs,
    loading: dev1DevsLoading,
    refetch: refetchDev1Devs,
  } = useQuery<GetUserDevsQueryResult>(GetUserDevsQuery, {
    variables: {
      // @ts-ignore
      userId: session?.user?.id,
    },
    onCompleted: (data) => {
      if (data.userDevs === null) {
      } else {
      }
    },
    skip: !session?.user,
  });

  const [getDev2, { loading: dev2Loading, error: dev2Error, data: dev2Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });

  const { data: dev2Moves, refetch: refetchDev2Moves } =
    useQuery<GetUserMovesQueryResult>(GetUserMovesQuery, {
      variables: {
        userId: dev2?._id,
      },
      onCompleted: (data) => {
        if (data.userMoves === null) {
          getMoves({
            onCompleted: async (data) => {
              handleAddUserMoves(data, refetchDev2Moves, dev2?._id);
            },
          });
        } else {
        }
      },
      skip: !dev2,
    });

  useEffect(() => {
    if (dev1Error || dev2Error)
      showNotification("No Dev with that username.", "ERROR");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev1Error, dev2Error]);

  // GAME STATES
  const [gameOn, setGameOn] = useState(false);
  const [gameOver, setGameOver] = useState(true);
  const [dev1Health, setDev1Health] = useState(1000);
  const [dev2Health, setDev2Health] = useState(1000);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasAttemptedCapture, setHasAttemptedCapture] = useState(false);
  const [dev2FirstTurn, setDev2FirstTurn] = useState(false);

  const [turn, setTurn] = useState<1 | 2>(1);

  // Playing the game
  const doMove = async ({ moveId }: { moveId: string }) => {
    let continueNextTurn = true;
    if (dev1 && dev1Moves?.userMoves.moves.edges && gameOn && dev2) {
      const moveEdge = dev1Moves.userMoves.moves.edges.find(
        (edge) => edge.node.id === moveId
      );
      if (moveEdge) {
        const move = moveEdge.node;
        if (move.type === "ATTACK") {
          setDev2Health((prev) => {
            const damage = calculateDamage({
              move: moveEdge.node,
              attackerStrength: dev1.stats.strength,
              defenderDefense: dev2.stats.defense,
            });
            showNotification(`You attacked for ${damage} damage`);
            const remainingHealth = prev - damage;
            if (remainingHealth <= 0) continueNextTurn = false;
            return remainingHealth;
          });
        } else if (move.type === "POWER_UP") {
          setDev1((prev) => {
            if (prev) {
              const { newStats, newStatPoint } = calculateStatBoost({
                move: move,
                oldStats: prev.stats,
              });
              showNotification(
                `You raised your ${move.targetStat} by ${
                  move.power
                } to ${Math.round(newStatPoint)}`
              );
              return { ...prev, stats: newStats };
            }
            return prev;
          });
        } else if (move.type === "VIRUS") {
          setDev2((prev) => {
            if (prev) {
              const { newStats, newStatPoint } = calculateStatDrain({
                move: move,
                oldStats: prev.stats,
              });
              showNotification(
                `You drained ${dev2.username}'s ${move.targetStat} by ${
                  move.power
                } to ${Math.round(newStatPoint)}`
              );
              return { ...prev, stats: newStats };
            }
            return prev;
          });
        } else if (move.type === "HEAL") {
          setDev1Health((prev) => {
            const increased = prev + move.power;
            return increased > 1000 ? 1000 : increased;
          });
          showNotification(`You healed by  ${move.power} points`);
        }
      }
    }
    setTurn(2);
    await wait(5000);
    if (continueNextTurn) computerMove();
  };

  const computerMove = () => {
    if (dev1 && dev2Moves?.userMoves.moves.edges && dev2) {
      const moveEdge =
        dev2Moves.userMoves.moves.edges[
          Math.floor(Math.random() * dev2Moves.userMoves.moves.edges.length)
        ];
      if (moveEdge) {
        const move = moveEdge.node;
        if (move.type === "ATTACK") {
          setDev1Health((prev) => {
            const damage = calculateDamage({
              move: moveEdge.node,
              attackerStrength: dev2.stats.strength,
              defenderDefense: dev1.stats.defense,
            });
            showNotification(
              `${dev2.username} attacked you with ${move.name} for ${damage} damage`
            );

            return prev - damage;
          });
        } else if (move.type === "POWER_UP") {
          setDev2((prev) => {
            if (prev) {
              const { newStats, newStatPoint } = calculateStatBoost({
                move: move,
                oldStats: prev.stats,
              });
              showNotification(
                `${dev2.username} raised their ${move.targetStat} by ${
                  move.power
                } to ${Math.round(newStatPoint)}`
              );

              return { ...prev, stats: newStats };
            }
            return prev;
          });
        } else if (move.type === "VIRUS") {
          setDev1((prev) => {
            if (prev) {
              const { newStats, newStatPoint } = calculateStatDrain({
                move: move,
                oldStats: prev.stats,
              });
              showNotification(
                `${dev2.username} drained your ${move.targetStat} by ${
                  move.power
                } to ${Math.round(newStatPoint)}`
              );
              return { ...prev, stats: newStats };
            }
            return prev;
          });
        } else if (move.type === "HEAL") {
          setDev2Health((prev) => {
            const increased = prev + move.power;
            return increased > 1000 ? 1000 : increased;
          });
          showNotification(`@${dev2.username} healed by  ${move.power} points`);
        }
      }
    }
    setTurn(1);
  };

  const resetGame = () => {
    setGameOn(false);
    setDev1Health(1000);
    setDev2Health(1000);
    setTurn(1);
    setDev1(null);
    setDev2(null);
    setDev2FirstTurn(false);
  };

  useEffect(() => {
    (async () => {
      if (dev1Health < 0 || dev2Health < 0) {
        const playerWin = dev2Health < 0;
        setGameOver(true);
        if (!playerWin) await wait(4500);
        showNotification(
          playerWin
            ? `You won! You can try to "hire" @${dev2?.username}.`
            : "You lost!",
          playerWin ? "SUCCESS" : "ERROR"
        );
        if (!playerWin) resetGame();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev1Health, dev2Health]);

  useEffect(() => {
    if (dev2FirstTurn && !gameOver && gameOn) {
      computerMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev2FirstTurn, gameOver, gameOn]);

  if (status === "unauthenticated") return <Unauthenticated />;

  return (
    <main className="min-h-screen p-4 bg-gray-50 overflow-x-hidden">
      <AnimatePresence>
        {!gameOn && (
          <div>
            <header className="flex justify-center gap-4 items-center">
              <Link href="/" className="hover:opacity-90">
                <ArrowLeft className="text-3xl text-primary" />
              </Link>
              <h1 className="text-5xl font-bold text-center text-primary">
                Dev Arena
              </h1>
            </header>
            <div className="relative">
              <div className="flex flex-col lg:flex-row gap-4 justify-between mt-4 min-h-[500px] bg-secondary shadow-md rounded-md">
                {dev1Devs?.userDevs ? (
                  <UserDevsSelection
                    devUsernames={dev1Devs.userDevs.devs}
                    setUserDev={setDev1}
                    dev={dev1}
                  />
                ) : dev1DevsLoading ? (
                  <div className="flex-1 p-4 flex flex-col items-center justify-center">
                    <LoadIcon className="animate-spin text-5xl text-primary" />
                  </div>
                ) : (
                  <StarterDev refetchDevs={refetchDev1Devs} />
                )}
                <div className="flex items-center justify-center relative">
                  <div className="absolute bg-primary bg-gradient-to-b lg:bg-gradient-to-r from-primary via-blue-400 to-primary w-full h-4 lg:h-auto lg:w-4 lg:inset-y-0 left-1/2 -translate-x-1/2"></div>
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
                    onClick={async () => {
                      setGameOn(true);
                      setGameOver(false);
                      if (dev1.stats.speed >= dev2.stats.speed) {
                        setTurn(1);
                      } else {
                        setTurn(2);
                        await wait(5000);
                        setDev2FirstTurn(true);
                      }
                    }}
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
        {gameOn &&
          dev1Moves?.userMoves !== null &&
          dev2Moves?.userMoves !== null && (
            <div>
              <h1 className="text-5xl font-bold text-center text-primary">
                A Battle Commences!
              </h1>
              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-4 justify-between mt-4 min-h-[500px] bg-secondary shadow-md rounded-md">
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    {dev1 && (
                      <DevBattleCard
                        dev={dev1}
                        health={dev1Health}
                        moves={dev1Moves?.userMoves.moves.edges.map(
                          (edge) => edge.node
                        )}
                        doMove={doMove}
                        onTurn={turn === 1 && !gameOver}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center relative">
                    <div className="absolute bg-primary bg-gradient-to-b lg:bg-gradient-to-r from-primary via-blue-400 to-primary h-4 w-full lg:h-auto lg:w-4 lg:inset-y-0 left-1/2 -translate-x-1/2"></div>
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
                        isComputer
                        health={dev2Health}
                        side="RIGHT"
                        moves={dev2Moves?.userMoves.moves.edges.map(
                          (edge) => edge.node
                        )}
                        onTurn={turn === 2 && !gameOver}
                        isCapturing={isCapturing}
                      />
                    )}
                  </div>
                </div>
              </div>
              {gameOver &&
                dev2Health <= 0 &&
                !isCapturing &&
                !hasAttemptedCapture && (
                  <div className="mt-4 flex justify-center items-center gap-4">
                    <div className="text-primary font-bold">
                      You&apos;ve outsmarted @{dev2?.username}. Would you like
                      to &quot;negotiate a contract&quot; with them?
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={async () => {
                          if (dev1Devs && dev2) {
                            if (
                              dev1Devs.userDevs.devs.includes(dev2.username)
                            ) {
                              showNotification(
                                `@${dev2?.username} is already working in your team.`,
                                "ERROR"
                              );
                            } else {
                              showNotification(
                                `Negotiating a deal with @${dev2?.username}...`
                              );
                              setHasAttemptedCapture(true);
                              setIsCapturing(true);
                              await wait(6500);
                              const captured = rollChance(25);
                              if (captured) {
                                await updateUserDevs({
                                  variables: {
                                    // @ts-ignore
                                    userId: session?.user.id as string,
                                    devs: [
                                      ...dev1Devs.userDevs.devs,
                                      dev2.username,
                                    ],
                                  },
                                });
                                showNotification(
                                  `You've successfully hired @${dev2?.username} into your team!`,
                                  "SUCCESS"
                                );
                              } else {
                                showNotification(
                                  `@${dev2?.username} denied your request to join your team!`,
                                  "ERROR"
                                );
                              }
                              setIsCapturing(false);
                              await wait(3000);
                              setHasAttemptedCapture(false);
                              resetGame();
                            }
                          }
                        }}
                        className="px-6 py-3 text-xl rounded-md shadow-lg text-white bg-primary font-bold hover:opacity-90"
                      >
                        <span className="font-bold">Yes</span>
                      </button>
                      <button
                        onClick={() => resetGame()}
                        className="px-6 py-3 text-xl rounded-md shadow-lg text-primary border-2 border-primary font-bold hover:bg-dark"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
            </div>
          )}
      </AnimatePresence>
    </main>
  );
}
