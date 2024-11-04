"use client";

import { useAppKit } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAccount } from "wagmi";

function Navbar() {
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  return (
    <nav className="py-4 px-12 flex justify-between items-center">
      <a className="flex items-center" href="/">
        <img src="/assets/logo.png" className="h-8 w-8 rounded-sm mr-2" />
        <div className="text-white text-2xl font-bold">LaunchBox</div>
      </a>
      <button
        className="px-4 py-2 text-black rounded-xl flex items-center space-x-2 overflow-hidden bg-white font-extrabold"
        onClick={() => {
          router.push("/select");
        }}
      >
        <span className="relative z-10 text-sm font-medium font-inter">
          Launch It
        </span>
      </button>
    </nav>
  );
}

export default Navbar;
