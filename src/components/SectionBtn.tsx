import React from "react";

function SectionBtn({ content }: { content: string }) {
  return (
    <button className="px-4 py-2 text-gray-300 rounded-full flex items-center space-x-2 overflow-hidden bg-[#222320] border-white border-[0.1px] border-opacity-20 bg-opacity-95 mx-auto">
      <span className="relative z-10 text-sm font-medium font-inter bg-gradient-to-r via-white from-gray-300 to-gray-300  bg-clip-text text-transparent">
        {content}
      </span>
    </button>
  );
}

export default SectionBtn;
