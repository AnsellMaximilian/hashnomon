"use client";

import React, { useEffect, useState } from "react";
import DevCard from "@/components/DevCard";
import DevSelect from "@/components/DevSelect";
import { Dev, DevQueryResult, GetDevQuery } from "@/lib/services/devs";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { useLazyQuery } from "@apollo/client";
import { useNotification } from "@/contexts/Notifications";
import { BsFillKeyboardFill as KeyboardIcon } from "react-icons/bs";
import { HiCommandLine as CommandLineIcon } from "react-icons/hi2";

export default function Arena() {
  const { showNotification } = useNotification();
  const [getDev1, { loading: dev1Loading, error: dev1Error, data: dev1Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });

  const [getDev2, { loading: dev2Loading, error: dev2Error, data: dev2Data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery, {
      variables: {
        username: "",
      },
    });
  const [dev1, setDev1] = useState<Dev | null>(null);
  const [dev2, setDev2] = useState<Dev | null>(null);

  useEffect(() => {
    if (dev1Error || dev2Error)
      showNotification("No Dev with that username.", "ERROR");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dev1Error, dev2Error]);

  return (
    <main className="h-screen p-4 bg-gray-50 overflow-x-hidden">
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
            <Image src={logo} alt="logo" className="w-32 h-32 relative" />
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
            <button className="px-8 py-6 text-3xl rounded-full shadow-lg text-white bg-primary font-bold hover:opacity-90 flex gap-6 justify-between items-center">
              <KeyboardIcon /> <span>FIGHT</span> <CommandLineIcon />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
