import React, { useState } from "react";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import "./DropDownMenu.css";

interface DropDownMenuProps {
  isDropdownVisible: boolean;
  hideDropdown: () => void;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  isDropdownVisible,
  hideDropdown,
}) => {
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setClickedItem(item);
    hideDropdown();
  };

  return (
    <div
      className={`absolute top-full left-0 w-full z-10 transition-transform transform ${
        isDropdownVisible
          ? "opacity-100 h-auto translate-y-0"
          : "opacity-100 h-0 translate-y-4 overflow-hidden"
      } duration-300 ease-in`}
    >
      <div className="w-full h-2"></div>
      <div className="bg-slate-500 shadow-lg opacity-95 text-slate-300 text-sm font-medium rounded-2xl">
        <div
          className={`relative group flex items-center justify-between py-3 rounded-md px-3 overflow-hidden ${
            clickedItem === "editProfile" ? "animate-clicked" : ""
          }`}
          onClick={() => handleItemClick("editProfile")}
        >
          <label className="text-sm ml-2 tracking-wide z-20 group-hover:text-slate-100">
            EDIT PROFILE
          </label>
          <PersonOutlineRoundedIcon
            fontSize="small"
            className="mr-2 group-hover:text-slate-100 z-20"
          />
          <div className="absolute shadow-2xl inset-0 m-1 bg-slate-400 opacity-15 transition-transform transform scale-x-0 group-hover:scale-x-100 duration-75 origin-left rounded-xl z-10"></div>
        </div>
        <div
          className={`relative group flex items-center justify-between py-3 rounded-md px-3 overflow-hidden ${
            clickedItem === "patientList" ? "animate-clicked" : ""
          }`}
          onClick={() => handleItemClick("patientList")}
        >
          <label className="text-sm ml-2 tracking-wide z-20 group-hover:text-slate-100">
            PATIENT LIST
          </label>
          <ListAltIcon
            fontSize="small"
            className="mr-2 group-hover:text-slate-100 z-20"
          />
          <div className="absolute inset-0 m-1 bg-slate-400 opacity-15 transition-transform transform scale-x-0 group-hover:scale-x-100 duration-75 origin-left rounded-xl z-10"></div>
        </div>
        <div
          className={`relative group flex items-center justify-between py-3 rounded-md px-3 overflow-hidden ${
            clickedItem === "logout" ? "animate-clicked" : ""
          }`}
          onClick={() => handleItemClick("logout")}
        >
          <label className="text-sm ml-2 tracking-wide z-20 group-hover:text-slate-100">
            LOGOUT
          </label>
          <ExitToAppIcon
            fontSize="small"
            className="mr-2 group-hover:text-slate-100 z-20"
          />
          <div className="absolute inset-0 m-1 bg-slate-400 opacity-15 transition-transform transform scale-x-0 group-hover:scale-x-100 duration-75 origin-left rounded-xl z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
