import React, { useState } from "react";
import QuickreplyRoundedIcon from "@mui/icons-material/QuickreplyRounded";
import ViewComfyRoundedIcon from "@mui/icons-material/ViewComfyRounded";

import "./DropDownMenu.css";

interface DropDownMenuProps {
  isDropdownVisible: boolean;
  hideDropdown: () => void;
}

const SettingDropDown: React.FC<DropDownMenuProps> = ({
  isDropdownVisible,
  hideDropdown,
}) => {
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setClickedItem(item);
    alert(item);
    hideDropdown();
  };

  return (
    <div
      className={`absolute top-full -right-2 w-36 z-10 transition-transform transform ${
        isDropdownVisible
          ? "opacity-100 h-auto translate-y-0"
          : "opacity-100 h-0 translate-y-4 overflow-hidden"
      } duration-300 ease-in`}
    >
      <div className="w-full h-2"></div>
      <div className="absolute top-0 right-5 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-slate-500 opacity-95"></div>
      <div className="bg-slate-500 shadow-lg opacity-95 text-slate-300 text-sm font-medium rounded-2xl">
        <div
          className={`relative group flex items-center justify-between py-3 rounded-md px-3 overflow-hidden ${
            clickedItem === "shortcuts" ? "animate-clicked" : ""
          }`}
          onClick={() => handleItemClick("shortcuts")}
        >
          <label className="text-sm ml-2 tracking-wide z-20 group-hover:text-slate-100">
            Shortcuts
          </label>
          <QuickreplyRoundedIcon
            fontSize="small"
            className="mr-2 group-hover:text-slate-100 z-20"
          />
          <div className="absolute shadow-2xl inset-0 m-1 bg-slate-400 opacity-15 transition-transform transform scale-x-0 group-hover:scale-x-100 duration-75 origin-left rounded-xl z-10"></div>
        </div>
        <div
          className={`relative group flex items-center justify-between py-3 rounded-md px-3 overflow-hidden ${
            clickedItem === "layouts" ? "animate-clicked" : ""
          }`}
          onClick={() => handleItemClick("layouts")}
        >
          <label className="text-sm ml-2 tracking-wide z-20 group-hover:text-slate-100">
            Layouts
          </label>
          <ViewComfyRoundedIcon
            fontSize="small"
            className="mr-2 group-hover:text-slate-100 z-20"
          />
          <div className="absolute inset-0 m-1 bg-slate-400 opacity-15 transition-transform transform scale-x-0 group-hover:scale-x-100 duration-75 origin-left rounded-xl z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingDropDown;
