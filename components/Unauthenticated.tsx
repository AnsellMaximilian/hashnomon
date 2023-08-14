import React from "react";
import Link from "next/link";
import Image from "next/image";
import fullLogo from "@/assets/images/logo-full.svg";

export default function Unauthenticated() {
  return (
    <main className="h-screen p-4 flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <Image src={fullLogo} alt="Game Logo" className="h-10" />
        <div className="text-center">
          <h1 className="text-2xl text-primary font-bold">
            You are not logged in.
          </h1>
          <p>Log in to access Dev Battles and your Hashnodex</p>
        </div>
        <Link
          href="/"
          className="px-4 py-3 bg-primary text-white font-bold rounded-md block mt-4"
        >
          Go to main page
        </Link>
      </div>
    </main>
  );
}
