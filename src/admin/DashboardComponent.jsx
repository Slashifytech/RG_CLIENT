import React, { useEffect, useState } from "react";
import HeaderTab from "./HeaderTabs";
import Nav from "./Nav";
import { Link } from "react-router-dom";

import {
  getCancelledCountPolicy,
  getCountPolicy,
} from "../../Util/UtilityFunction";

const DashboardComponent = () => {
  const [cancelPolicyCount, setCancelPolicyCount] = useState();
  const [policyCount, setPolicyCount] = useState();

  useEffect(() => {
    const getCancelledPolicy = async () => {
      const response = await getCancelledCountPolicy();
      setCancelPolicyCount(response);
    };
    getCancelledPolicy();
  }, []);
  useEffect(() => {
    const getAllPolicy = async () => {
      const response = await getCountPolicy();
      setPolicyCount(response);
    };
    getAllPolicy();
  }, []);
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="ml-0 sm:ml-[28%] md:ml-[23%]">
        <HeaderTab />
      </div>

      <div className="flex md:flex-row sm:flex-row flex-col  ml-8 sm:ml-[33%] md:ml-[25%]  w-full gap-9 pt-3 pb-20">
        <Link
          to="/admin/active-policy"
          className="bg-secondary shadow font-semibold font md:w-[16%]  sm:w-[28%] w-[72%] md:mx-0 sm:mx-0 mx-6 rounded-md h-[10rem] text-center pt-6 font-head text-[20px]"
        >
          <p className="text-[40px]">{policyCount || 0}</p>
          Active Polices
        </Link>

        <Link
          to="/admin/cancelled-policy"
          className="bg-secondary shadow font-semibold font md:w-[16%]  sm:w-[28%] w-[72%] md:mx-0 sm:mx-0 mx-6 rounded-md h-[10rem] text-center pt-6 font-head text-[20px]"
        >
          <p className="text-[40px]">{cancelPolicyCount || 0}</p>
          Cancelled Polices
        </Link>
      </div>
    </>
  );
};

export default DashboardComponent;
