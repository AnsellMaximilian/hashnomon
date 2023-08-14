import {
  Dev,
  GetUserDevsQuery,
  GetUserDevsQueryResult,
} from "@/lib/services/devs";
import { useQuery } from "@apollo/client";
import React from "react";
import { useSession } from "next-auth/react";
import HashnodexEntry from "./HashnodexEntry";
import { Inter, Montserrat, Orbitron } from "next/font/google";
import DevCard from "./DevCard";
import logo from "@/assets/images/logo.svg";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BsArrowLeftCircleFill as ArrowLeft } from "react-icons/bs";
import Unauthenticated from "./Unauthenticated";

const orbFont = Orbitron({ subsets: ["latin"] });

const DevInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <li className="flex items-center gap-2">
    <span>{label}</span>
    <span className="flex-1 border-b border-white border-dotted h-[100%]"></span>
    <span>{value === null ? 0 : value}</span>
  </li>
);

export default function Hashnodex() {
  const { data: session, status } = useSession();
  const [selectedDev, setSelectedDev] = useState<Dev | null>(null);

  const {
    data: devs,
    loading: devsLoading,
    error: devsError,
  } = useQuery<GetUserDevsQueryResult>(GetUserDevsQuery, {
    variables: {
      // @ts-ignore
      userId: session?.user?.id,
    },
    skip: !session?.user,
  });

  if (status === "unauthenticated") return <Unauthenticated />;
  return (
    <main
      className={`p-4 bg-gray-50 overflow-x-hidden min-h-screen flex flex-col ${orbFont.className}`}
    >
      <header className="mb-4 flex items-center gap-4">
        <Link href="/" className="hover:opacity-90">
          <ArrowLeft className="text-3xl text-primary" />
        </Link>
        <h1 className="text-2xl text-primary font-bold">Your Hashnodex</h1>
      </header>
      <div className="grid grid-cols-12 gap-4 bg-primary p-4 rounded-md flex-1 shadow-lg">
        <div className="col-span-6 bg-dark">
          {devs && devs.userDevs !== null && (
            <div className="grid grid-cols-12 gap-2 p-2">
              {devs.userDevs.devs.map((username) => (
                <HashnodexEntry
                  key={username}
                  username={username}
                  setSelectedDev={setSelectedDev}
                />
              ))}
            </div>
          )}
          {devsLoading && (
            <div className="h-full flex items-center justify-center w-full p-4">
              <div className="text-primary flex flex-col w-full gap-2">
                <div className="font-bold text-xl">Loading Your Devs</div>
                <div className="bg-gray-400 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 h-8 relative">
                  <motion.div
                    className="bg-gradient-to-b from-primary via-[#5280ff] to-primary inset-y-0 absolute"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                  ></motion.div>
                </div>
              </div>
            </div>
          )}

          {devs?.userDevs === null && (
            <div className="h-full flex items-center justify-center w-full p-4 flex-col gap-4">
              <div className="text-xl text-center">
                Your team is empty. Go to the battle menu and get your starter
                Dev
              </div>
              <Link
                href="/play"
                className="bg-primary text-white px-4 py-3 hover:opacity-90"
              >
                Battle Menu
              </Link>
            </div>
          )}
        </div>
        <div className="col-span-6 bg-dark">
          <AnimatePresence>
            {selectedDev && (
              <div>
                <div className="p-4">
                  <DevCard dev={selectedDev} />
                </div>
                <div className="p-2 mt-4">
                  <div className="px-2 py-8 bg-black text-white rounded-md">
                    <div className="text-lg mb-2">Hashnode Info</div>
                    <ul>
                      <DevInfo
                        label="Followers"
                        value={selectedDev.numFollowers}
                      />
                      <DevInfo
                        label="Following"
                        value={selectedDev.numFollowing}
                      />
                      <DevInfo
                        label="Reactions"
                        value={selectedDev.numReactions}
                      />
                      <DevInfo label="Posts" value={selectedDev.numPosts} />
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {!selectedDev && (
              <motion.div className="p-4 h-full flex items-center justify-center bg-black">
                <Image src={logo} alt="Logo" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
