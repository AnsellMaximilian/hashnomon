"use client";

import React from "react";
import DevCard from "@/components/DevCard";
import DevSelect from "@/components/DevSelect";
import { Dev, GetDevQuery, getDev } from "@/lib/services/devs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsFillKeyboardFill as KeyboardIcon } from "react-icons/bs";
import { HiCommandLine as CommandLineIcon } from "react-icons/hi2";
import logo from "@/assets/images/logo.svg";
import {
  NotificationProvider,
  useNotification,
} from "@/contexts/Notifications";
import { gql, useQuery } from "@apollo/client";

export interface DevData {
  dev: Dev | null;
  searchValue: string;
  status: "LOADING" | "SUCCESS" | "ERROR" | "IDLE";
}

const defaultDevData: DevData = {
  dev: null,
  searchValue: "",
  status: "IDLE",
};

export default function Selection() {
  const [dev1Data, setDev1Data] = useState<DevData>(defaultDevData);
  const [dev2Data, setDev2Data] = useState<DevData>(defaultDevData);

  // const { loading, error, data } = useQuery<{
  //   data: { user: Dev };
  // }>(GetDevQuery, {
  //   variables: {
  //     username: dev1Data.searchValue,
  //   },
  // });

  const { loading, error, data } = useQuery(gql`
    query GetDev {
      hashnode {
        user(username: "ansellmax") {
          _id
          username
          name
          numFollowers
          numReactions
          numPosts
          numFollowing
          photo
          stats
        }
      }
    }
  `);

  console.log({ loading, error, data });
  console.log(error?.stack);

  const { showNotification } = useNotification();

  const setDev = async (number: number, username: string) => {
    try {
      const dev = await getDev(username);
      if (number === 1) {
        setDev1Data((prev) => ({ ...prev, dev: dev, status: "SUCCESS" }));
      } else {
        setDev2Data((prev) => ({ ...prev, dev: dev, status: "SUCCESS" }));
      }
    } catch (error) {
      const errorValue: DevData = {
        dev: null,
        searchValue: "",
        status: "ERROR",
      };
      if (number === 1) {
        setDev1Data(errorValue);
      } else {
        setDev2Data(errorValue);
      }
      showNotification("Username not found.", "ERROR");
    }
  };

  const resetDevData = async (number: number) => {
    if (number === 1) {
      setDev1Data(defaultDevData);
    } else {
      setDev2Data(defaultDevData);
    }
  };
  return (
    <main className="h-screen p-4 bg-gray-50 overflow-x-hidden">
      <h1 className="text-5xl font-bold italic text-center text-primary">
        Choose Your Dev!
      </h1>
      <div className="relative">
        <div className="flex gap-4 justify-between mt-4 min-h-[500px] bg-secondary shadow-md rounded-md">
          <DevSelect
            devData={dev1Data}
            setDev={setDev}
            setDevData={setDev1Data}
            resetDevData={resetDevData}
            number={1}
          />
          <div className="flex items-center justify-center relative">
            <div className="absolute bg-primary bg-gradient-to-r from-primary via-blue-400 to-primary w-4 inset-y-0 left-1/2 -translate-x-1/2"></div>
            <Image src={logo} alt="logo" className="w-32 h-32 relative" />
          </div>
          <DevSelect
            devData={dev2Data}
            setDev={setDev}
            setDevData={setDev2Data}
            resetDevData={resetDevData}
            number={2}
            side="RIGHT"
          />
        </div>
        {dev1Data?.dev && dev2Data?.dev && (
          <div className="mt-4 flex justify-center">
            <button className="px-8 py-6 text-3xl rounded-full shadow-lg text-white bg-primary font-bold hover:opacity-90 flex gap-6 justify-between items-center">
              <KeyboardIcon /> <span>FIGHT</span> <CommandLineIcon />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
