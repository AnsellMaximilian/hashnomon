"use client";

import DevCard from "@/components/DevCard";
import DevSelect from "@/components/DevSelect";
import { Dev, getDev } from "@/lib/services/devs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsFillKeyboardFill as KeyboardIcon } from "react-icons/bs";
import { HiCommandLine as CommandLineIcon } from "react-icons/hi2";

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

export default function Home() {
  const [dev1Data, setDev1Data] = useState<DevData>(defaultDevData);
  const [dev2Data, setDev2Data] = useState<DevData>(defaultDevData);

  const setDev = async (number: number, username: string) => {
    try {
      const dev = await getDev(username);
      if (number === 1) {
        setDev1Data((prev) => ({ ...prev, dev: dev, status: "SUCCESS" }));
      } else {
        setDev2Data((prev) => ({ ...prev, dev: dev, status: "SUCCESS" }));
      }
    } catch (error) {
      if (number === 1) {
        setDev1Data((prev) => ({ ...prev, dev: null, status: "ERROR" }));
      } else {
        setDev2Data((prev) => ({ ...prev, dev: null, status: "ERROR" }));
      }
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
    <main className="h-screen p-4 bg-gray-50">
      <h1 className="text-5xl font-bold italic text-center text-primary">
        Choose Your Dev!
      </h1>
      <div className="relative">
        <div className="flex gap-4 justify-between mt-4">
          <DevSelect
            devData={dev1Data}
            setDev={setDev}
            setDevData={setDev1Data}
            resetDevData={resetDevData}
            number={1}
          />
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
