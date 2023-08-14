import { Dev, DevQueryResult, GetDevQuery } from "@/lib/services/devs";
import { useQuery } from "@apollo/client";
import React from "react";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";
import logo from "@/assets/images/logo.svg";
import Image from "next/image";

export default function HashnodexEntry({
  username,
  setSelectedDev,
}: {
  username: string;
  setSelectedDev: React.Dispatch<React.SetStateAction<Dev | null>>;
}) {
  const { loading, error, data } = useQuery<DevQueryResult>(GetDevQuery, {
    variables: {
      username: username,
    },
  });
  const setDev = () => {
    if (data) {
      setSelectedDev(data.hashnode.user);
    }
  };
  return (
    <button
      className="p-4 bg-white shadow-md rounded-md hover:bg-light block col-span-6"
      onMouseOver={setDev}
      onClick={setDev}
    >
      {loading && <LoadIcon className="animate-spin" />}
      {data && (
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" className="w-8 aspect-square" />
          <div>{data.hashnode.user.username}</div>
        </div>
      )}
    </button>
  );
}
