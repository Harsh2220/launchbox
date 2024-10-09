import Image from "next/image";
import React from "react";

function ToolTip() {
  return (
    <div className="flex px-4 py-2 text-gray-300 rounded-full items-center space-x-2 overflow-hidden bg-[#222320] border-white border-[0.1px] border-opacity-20 bg-opacity-95 mt-24 align-middle justify-between w-fit mx-auto">
      <Image src={"/assets/star.svg"} height={14} width={14} alt="star-asset" />
      <span className="relative z-10 text-xs font-medium font-inter">
        Your Token Toolkit
      </span>
    </div>
  );
}

export default ToolTip;
