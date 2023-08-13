import React, { Dispatch, SetStateAction, useState } from "react";
import DevCard from "./DevCard";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";
import { motion } from "framer-motion";
import {
  ApolloQueryResult,
  LazyQueryExecFunction,
  OperationVariables,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  CreateUserDevsQuery,
  Dev,
  DevQueryResult,
  GetDevQuery,
  GetUserDevsQueryResult,
} from "@/lib/services/devs";
import { useSession } from "next-auth/react";

import { useNotification } from "@/contexts/Notifications";

export default function StarterDev({
  refetchDevs,
}: {
  refetchDevs: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<GetUserDevsQueryResult>>;
}) {
  const { showNotification } = useNotification();
  const [searchValue, setSearchValue] = useState("");
  const [dev, setDev] = useState<Dev | null>(null);
  const [getDev, { loading, error, data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery);
  const [addNewUserDevs, { loading: createLoading }] =
    useMutation(CreateUserDevsQuery);
  const { data: session, status } = useSession();

  return (
    <div
      className={`flex-1 p-4 flex flex-col items-center justify-center gap-8`}
    >
      <div className="text-center">
        <div className="mb-2 text-2xl font-bold">Choose your starter Dev</div>
        <div className="text-lg">
          You don&apos;t employ any devs at the moment. Choose your starter dev.
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        {dev ? (
          <div className="w-full">
            <DevCard dev={dev} />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDev(null)}
                className="text-primary font-bold border border-primary rounded-md hover:bg-dark bg-white px-3 py-2"
              >
                Change
              </button>
              <button
                disabled={createLoading}
                className="bg-primary text-white font-bold rounded-md hover:opacity-90 px-3 py-2 flex items-center gap-2"
                onClick={() => {
                  addNewUserDevs({
                    variables: {
                      firstDevId: dev.username,
                      // @ts-ignore
                      userId: session?.user.id as string,
                    },
                    onCompleted: (data) => {
                      refetchDevs({
                        variables: {
                          // @ts-ignore
                          userId: session?.user?.id,
                        },
                      });
                    },
                  });
                }}
              >
                <span>Choose Dev</span>
                {createLoading && <LoadIcon className="animate-spin" />}
              </button>
            </div>
          </div>
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
                    onError: () =>
                      showNotification("No Dev with that username", "ERROR"),
                  });
                }
              }}
            >
              <span>Check</span>
              {loading && <LoadIcon className="animate-spin" />}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
