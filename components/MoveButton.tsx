import { Move } from "@/lib/services/moves";
import React from "react";

const statColorMap = {
  STRENGTH: "bg-red-500",
  DEFENSE: "bg-green-500",
  SPEED: "bg-blue-500",
};

export default function MoveButton({
  move,
  doMove,
  disabled,
}: {
  move: Move;
  doMove?: ({ moveId }: { moveId: string }) => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={() => {
        if (doMove) doMove({ moveId: move.id });
      }}
      disabled={disabled}
      className="disabled:opacity-70 col-span-6 bg-white shadow-md p-4 hover:from-dark hover:to-dark hover:via-white rounded-md bg-gradient-to-b from-gray-100 via-white to-gray-100"
    >
      <div className="flex justify-end mb-2 gap-2">
        <div className="p-1 bg-gray-600 text-white text-xs rounded-md">
          {move.type.replace("_", " ")}
        </div>
        {(move.type === "POWER_UP" || move.type === "VIRUS") && (
          <div
            className={`p-1 ${
              statColorMap[move.targetStat]
            } text-white text-xs rounded-md`}
          >
            {move.targetStat.replace("_", " ")}
          </div>
        )}
      </div>
      <div className="text-left">
        <div className="font-semibold text-md">{move.name}</div>
        <div>POWER: {move.power}</div>
      </div>
    </button>
  );
}
