import React, { Dispatch, SetStateAction, useState } from "react";
import DevCard from "./DevCard";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";
import { motion } from "framer-motion";
import { LazyQueryExecFunction, OperationVariables } from "@apollo/client";
import { Dev, DevQueryResult } from "@/lib/services/devs";
import { useNotification } from "@/contexts/Notifications";

export default function DevSelect({
  number,
  dev,
  side = "LEFT",
  getDev,
  loading,
  setDev,
}: {
  number: 1 | 2;
  dev: Dev | null;
  side?: "RIGHT" | "LEFT";
  loading: boolean;
  getDev: LazyQueryExecFunction<any, OperationVariables>;
  setDev: React.Dispatch<React.SetStateAction<Dev | null>>;
}) {
  const { showNotification } = useNotification();
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className={`flex-1 p-4 flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <div className="mb-2 text-2xl font-bold">Rival Dev</div>
        {dev && (
          <button
            className="px-2 py-1 bg-white border-2 border-primary rounded-md text-primary font-bold hover:bg-dark"
            onClick={() => setDev(null)}
          >
            Change
          </button>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        {dev ? (
          <DevCard dev={dev} side={side} />
        ) : (
          <motion.div
            className="flex gap-2 w-full"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Enter a Hashnode username"
              className="px-4 py-2 text-xl flex-grow rounded-full border border-gray-300 focus:border-primary outline-none"
            />
            <button
              className="bg-primary text-white px-4 py-2 text-xl rounded-full hover:opacity-90 flex items-center gap-2"
              disabled={loading}
              onClick={() => {
                if (!searchValue) {
                  showNotification("Please enter a username", "ERROR");
                } else {
                  setSearchValue("");

                  getDev({
                    variables: { username: searchValue },
                    onCompleted: (data: DevQueryResult) => {
                      setDev(data.hashnode.user);
                    },
                  });
                }
              }}
            >
              <span>Choose</span>
              {loading && <LoadIcon className="animate-spin" />}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
