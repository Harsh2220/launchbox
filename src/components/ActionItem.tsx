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
        <span className={`bg-${iconBgColor}-300 p-4 rounded-xl`}>{icon}</span>
        <div className="flex flex-col text-left justify-center">
          <h1 className="text-white text-lg font-semibold">{title}</h1>
          <h1 className="text-white text-sm font-medium opacity-70">{subtitle}</h1>
        </div>
      </div>
      <button className="bg-blue-400 py-[0.4rem] px-4 rounded-full">
        <MoveRight />
      </button>
    </div>
  );
}

export default ActionItem;
