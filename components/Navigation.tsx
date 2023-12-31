import React, { useEffect } from "react";
import github from "@/assets/images/github-mark.svg";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import hashnodex from "@/assets/images/hashnodex.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import { useNotification } from "@/contexts/Notifications";
import Link from "next/link";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";

const NavListItem = ({
  label,
  icon,
  description,
  onclick,
  roundImage = false,
  href,
  authLoading = false,
}: {
  label: string;
  icon: string;
  description: string;
  onclick?: () => void;
  roundImage?: boolean;
  href?: string;
  authLoading?: boolean;
}) => {
  return (
    <li>
      <div className="w-64 h-48 shadow-md bg-white  md:-skew-x-12 relative border-gray-100 border-4 hover:bg-light hover:text-primary">
        <button
          className="absolute inset-0 p-4 flex flex-col items-center justify-center md:skew-x-12"
          onClick={onclick}
        >
          {href && <Link href={href} className="absolute inset-0"></Link>}
          <div className="flex flex-col gap-4 justify-between items-center mt-auto">
            <Image
              src={icon}
              alt="Github Logo"
              className={`w-20 ${roundImage ? "rounded-full" : ""}`}
              width={80}
              height={80}
            />
            <div className="">
              <div className="text-xl font-bold flex gap-2 justify-center items-center">
                <span>{label}</span>
                {authLoading && <LoadIcon className="animate-spin text-sm" />}
              </div>
              <div className="text-xs">{description}</div>
            </div>
          </div>
        </button>
      </div>
    </li>
  );
};

export default function Navigation() {
  const { data: session, status } = useSession();
  const authenticated = status === "authenticated";
  const { showNotification } = useNotification();

  useEffect(() => {
    if (authenticated) {
      showNotification("Successfully logged in.", "SUCCESS");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  return (
    <nav>
      <ul className="flex gap-2 flex-col md:flex-row">
        <NavListItem
          roundImage={authenticated}
          label={authenticated ? session?.user?.name || "User" : "Login"}
          icon={authenticated ? session?.user?.image || github : github}
          description={
            status === "loading"
              ? "Loading..."
              : authenticated
              ? "Sign out of your account"
              : "Log in using your Github account"
          }
          onclick={authenticated ? () => signOut() : () => signIn("github")}
          authLoading={status === "loading"}
        />
        <NavListItem
          label="Battle"
          icon={logo}
          description="Battle and employ other devs"
          href="/play"
        />
        <NavListItem
          label="Hashnodex"
          icon={hashnodex}
          description="Info on devs in your team"
          href="/hashnodex"
        />
      </ul>
    </nav>
  );
}
