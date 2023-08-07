import React from "react";
import github from "@/assets/images/github-mark.svg";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import hashnodex from "@/assets/images/hashnodex.svg";

const NavListItem = ({
  label,
  icon,
  description,
}: {
  label: string;
  icon: string;
  description: string;
}) => {
  return (
    <li>
      <div className="w-64 h-48 shadow-md bg-white -skew-x-12 relative border-gray-100 border-4 hover:bg-light hover:text-primary">
        <button className="absolute inset-0 p-4 flex flex-col items-center justify-center skew-x-12">
          <div className="flex flex-col gap-4 justify-between items-center mt-auto">
            <Image src={icon} alt="Github Logo" className="w-20" />
            <div className="">
              <div className="text-xl font-bold">{label}</div>
              <div>{description}</div>
            </div>
          </div>
        </button>
      </div>
    </li>
  );
};

export default function Navigation() {
  return (
    <nav>
      <ul className="flex gap-2">
        <NavListItem label="Login" icon={github} description="Just login" />
        <NavListItem label="Battle" icon={logo} description="Just battle" />
        <NavListItem
          label="Hashnodex"
          icon={hashnodex}
          description="Just dex"
        />
      </ul>
    </nav>
  );
}
