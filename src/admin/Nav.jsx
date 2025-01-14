import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { close, logo, menu } from "../assets";
import LogoutPop from "../Components/LogoutPop";

const Nav = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [toggle, SetToggle] = useState(false);
  const role = localStorage.getItem('roleType');
  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };

  return (
    <>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />
      <div className="bg-navcolor px-9 py-9 text-start w-60 h-screen rounded-r-3xl hidden md:block sm:block overflow-x-auto whitespace-nowrap scrollbar-hide">
        <img src={logo} alt="" loading="lazy" className="w-40 h-28" />

      
        <span>
        {
          role === "0" && <>
          <Link to="/admin/dashboard">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3   rounded-xl text-[17px] "  ${
                (path === "/admin/dashboard" ||
                  path === "/admin/cancelled-policy" ||
                  path === "/admin/add-policies") &&
                "adminnav"
              }`}
            >
              Dashboard
            </p>
          </Link>

          {/* <Link to="/admin/team-lists">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                (path === "/admin/new-team" ||
                  path === "/admin/team-lists" ||
                  path === "/admin/team-invoices") &&
                "adminnav"
              }`}
            >
              Team Lists
            </p>
          </Link> */}
          <Link to="/admin/agent-lists">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                (path === "/admin/agent-lists" ||
                  path === "/admin/update-agent" ||
                  path === "/admin/add-agent" ||
                  path === "/admin/agent-policies") &&
                "adminnav"
              }`}
            >
              Agent Lists
            </p>
          </Link></>}
          <Link to="/admin/active-policy">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                path === "/admin/active-policy" && "adminnav"
              }`}
            >
              Active Policies
            </p>
          </Link>
          {
            role === "0" && <>
          <Link to="/admin/policies">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                (path === "/admin/update-policies" ||
                  path === "/admin/policies") &&
                "adminnav"
              }`}
            >
              Admin Policies List
            </p>
          </Link>
          <Link to="/admin/documents">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                path === "/admin/documents" && "adminnav"
              }`}
            >
              Document Lists
            </p>
          </Link></>}
          <Link to="/admin/invoice-lists">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                (path === "/admin/invoice-lists" || path === "/invoice-form") &&
                "adminnav"
              }`}
            >
              Invoice Lists
            </p>
          </Link>
          <Link to="/mb-invoice">
            {" "}
            <p
              className={`cursor-pointer text-white hover:bg-white hover:text-primary py-2 px-3 mt-5 rounded-xl text-[17px] ${
                path === "/mb-invoice" ? "adminnav" : ""
              }`}
            >
              Invoice Approval
            </p>
          </Link>
          <Link to="/admin/approval-lists">
            {" "}
            <p
              className={`cursor-pointer text-white hover:bg-white hover:text-primary py-2 px-3 mt-5 rounded-xl text-[17px] ${
                path === "/admin/approval-lists" ? "adminnav" : ""
              }`}
            >
              Policy Approval
            </p>
          </Link>

          <Link to="">
            {" "}
            <p
              onClick={openLogoutPopup}
              className=" cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-5 rounded-xl text-[17px]"
            >
              Logout
            </p>
          </Link>
        </span>
      </div>
      {/* // responsive nav */}
      {/* <div className=" flex flex-row items-center justify-between w-[43vh]  fixed">
        <span>
          <img src={logo} alt="logo" className="w-24 h-20" />
        </span>
        <div className="md:hidden sm:hidden ">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[25px] h-[25px]  object-contain "
            onClick={() => SetToggle(!toggle)}
          />

          <div
            className={`${!toggle ? "hidden" : "flex"}
   mt-5 absolute top-20 right-0  min-w-[200px] rounded-xl  admin_sidebar z-50 bg-[#0A1629] text-black`}
          > */}
            {/* <ul className="list-none flex justify-end items-start font-DMsans flex-1 flex-col z-50">
              <span>
                <div className="flex  items-center relative gap-3"></div>
                <Link to="/admin/dashboard">
                  {" "}
                  <p
                    className={` cursor-pointer text-white hover:bg-primary hover:text-white  py-2 px-3  mt-5 rounded-xl text-[17px] "  ${
                      (path === "/admin/dashboard" ||
                        path === "/admin/add-policies" ||
                        path === "/admin/cancelled-policy" ||
                        path === "/admin/add-agent" ||
                        path === "/admin/update-policies" ||
                        path === "/admin/active-policy" ||
                        path === "/admin/update-agent" ||
                        path === "/admin/agent-policies") &&
                      "adminresnav"
                    }`}
                  >
                    Dashboard
                  </p>
                </Link>
                <Link to="/admin/policies">
                  {" "}
                  <p
                    className={` cursor-pointer text-white hover:bg-primary hover:text-white  py-2 px-3  mt-5 rounded-xl text-[17px] "  ${
                      path === "/admin/policies" && "adminresnav"
                    }`}
                  >
                    Admin Policies
                  </p>
                </Link>
                <Link to="/admin/approval-lists">
                  {" "}
                  <p
                    className={` cursor-pointer text-white hover:bg-primary hover:text-white  py-2 px-3 mt-5 rounded-xl text-[17px]  ${
                      path === "/admin/approval-lists" && "adminresnav"
                    }`}
                  >
                    Approval Page
                  </p>
                </Link>

                <span>
                  {" "}
                  <p
                    onClick={openLogoutPopup}
                    className=" cursor-pointer  hover:bg-primary hover:text-white text-white  py-2 px-3  mt-5 rounded-xl text-[17px]"
                  >
                    Logout
                  </p>
                </span>
              </span>
            </ul> */}
          {/* </div>
        </div>
      </div> */}
    </>
  );
};

export default Nav;
