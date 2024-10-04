import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="py-4 px-12 flex justify-between items-center">
      <a className="flex items-center" href="/">
        <img src="/assets/Logo.png" className="h-8 w-8 rounded-sm mr-2" />
        <div className="text-white text-2xl font-bold">LaunchBox</div>
      </a>

      <Link href={"/select"}>
        <button className="px-4 py-3 text-gray-300 rounded-xl flex items-center space-x-2 overflow-hidden bg-[#222320] border-white border-[0.1px] border-opacity-20 bg-opacity-95">
          <span className="relative z-10 text-sm font-medium font-inter">
            Launch It
          </span>
        </button>
      </Link>
      {/* <w3m-button /> */}
    </nav>
  );
}

export default Navbar;
