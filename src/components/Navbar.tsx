import React from "react";

function Navbar() {
  return (
    <nav className="py-4 px-12 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-white text-2xl font-bold mr-2">LaunchBox</div>
      </div>
      <div className="hidden md:flex space-x-6 font-inter font-medium">
        <a href="#" className="text-white hover:text-gray-300">
          Home
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          Technology
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          Features
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          Pricing
        </a>
        <a href="#" className="text-gray-400 hover:text-gray-300">
          FAQ
        </a>
      </div>
      <button className="px-4 py-3 text-gray-300 rounded-xl flex items-center space-x-2 overflow-hidden bg-[#222320] border-white border-[0.1px] border-opacity-20 bg-opacity-95">
        <span className="relative z-10 text-sm font-medium font-inter">
          Get Started
        </span>
      </button>
    </nav>
  );
}

export default Navbar;
