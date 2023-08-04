"use client";

import { getDev } from "@/lib/services/devs";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async () => {
      const dev = await getDev("ansellmax");
      console.log(dev);
    })();
  }, []);
  return (
    <main className="h-screen p-4 bg-gray-50">
      <h1 className="text-5xl font-bold italic text-center text-primary">
        Choose Your Dev!
      </h1>
      <div className="flex gap-4 justify-between mt-4">
        <div className="shadow-md rounded-md flex-1 p-4 bg-white min-h-[500px]">
          <h2 className="mb-2 text-2xl font-bold">Dev 1</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter a Hashnode username"
              className="px-2 py-1 rounded-full border border-gray-300 focus:border-primary outline-none w-[300px]"
            />
            <button className="bg-primary text-white px-3 py-1 rounded-full hover:opacity-90">
              Choose
            </button>
          </div>
        </div>
        <div className="shadow-md rounded-md flex-1">
          <h2>Player 2</h2>
          <div>
            <input
              type="text"
              placeholder="Type their Hashnode username"
              className="px-2 py-1 rounded-full border border-gray-300 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
