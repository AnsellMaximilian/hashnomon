import React, { Dispatch, SetStateAction } from "react";
import DevCard from "./DevCard";
import { DevData } from "@/app/page";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";

export default function DevSelect({
  setDevData,
  resetDevData,
  devData,
  setDev,
  number,
  side = "LEFT",
}: {
  setDevData: Dispatch<SetStateAction<DevData>>;
  setDev: (number: number, username: string) => Promise<void>;
  devData: DevData;
  resetDevData: (number: number) => Promise<void>;
  number: 1 | 2;
  side?: "RIGHT" | "LEFT";
}) {
  return (
    <div className="shadow-md rounded-md flex-1 p-4 bg-secondary min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="mb-2 text-2xl font-bold">Dev {number}</div>
        {devData.dev && (
          <button
            className="px-2 py-1 bg-white border-2 border-primary rounded-md text-primary font-bold hover:bg-dark"
            onClick={() => resetDevData(number)}
          >
            Change
          </button>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        {devData?.dev ? (
          <DevCard dev={devData.dev} side={side} />
        ) : (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={devData.searchValue}
              onChange={(e) =>
                setDevData((prev) => ({
                  ...prev,
                  searchValue: e.target.value,
                }))
              }
              placeholder="Enter a Hashnode username"
              className="px-4 py-2 text-xl flex-grow rounded-full border border-gray-300 focus:border-primary outline-none"
            />
            <button
              className="bg-primary text-white px-4 py-2 text-xl rounded-full hover:opacity-90 flex items-center gap-2"
              onClick={() => {
                setDevData((prev) => ({ ...prev, status: "LOADING" }));
                setDev(number, devData.searchValue);
              }}
            >
              <span>Choose</span>
              {devData.status === "LOADING" && (
                <LoadIcon className="animate-spin" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
