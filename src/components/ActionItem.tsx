import { MoveRight } from "lucide-react";
import React from "react";

interface ActionItemProps {
  icon: React.JSX.Element;
  title: string;
  subtitle: string;
  iconBgColor: string;
}

function ActionItem({ icon, subtitle, title, iconBgColor }: ActionItemProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row justify-center gap-4">
        <span
          className={`bg-[#222320] border-white border-[0.1px] border-opacity-20 bg-opacity-95 p-4 rounded-xl`}
        >
          {icon}
        </span>
        <div className="flex flex-col text-left justify-center">
          <h1 className="text-white text-lg font-semibold">{title}</h1>
          <h1 className="text-white text-sm font-medium opacity-70">
            {subtitle}
          </h1>
        </div>
      </div>
      <button
        className="bg-white border-white border-[0.1px] border-opacity-20 bg-opacity-95 py-[0.4rem] px-4 rounded-full
                   shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_-2px_4px_rgba(0,0,0,0.05),0_0_10px_rgba(255,255,255,0.2)]
                   hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05),inset_0_-4px_6px_rgba(0,0,0,0.05),0_0_15px_rgba(255,255,255,0.3)]
                   transition-all duration-300 ease-in-out
                   hover:translate-y-[-2px] hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      >
        <MoveRight className="text-black font-bold" />
      </button>
    </div>
  );
}

export default ActionItem;