import React from "react";
import { Link } from "react-router-dom";

const Cards = ({countData, linkData, titleData, icon, bgImg}) => {
  return (
    <Link to={linkData}>
    <div
      className="bg-white px-6  text-black rounded-md border relative font-poppins border-[#E8E8E8] justify-start flex flex-col "
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <span className="pt-3 rounded-md w-12 mt-1">
        <img src={icon} alt="img" className="w-7 z-20" />
      </span>
      <p className="mt-3  text-[15px]">{titleData}</p>

      <p className=" text-[23px] mt-3  font-semibold">{countData}</p>
      <p className=" text-[23px] mt-3 py-[46px] font-semibold"></p>

    
    </div>
  </Link>
  );
};

export default Cards;
