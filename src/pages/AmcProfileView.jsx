import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader";
import { useLocation } from "react-router-dom";
import { BiSolidCar } from "react-icons/bi";
import Nav from "./../admin/Nav";
import Header from "./../Components/Header";
import { FaRegAddressCard, FaRegIdCard } from "react-icons/fa6";
import { fetchamcDataById } from "./../features/amcSlice";
import { CustomTableFive } from "../Components/Table";
import DataNotFound from "../admin/DataNotFound";

const AmcProfileView = () => {
  const { amcByIdorStatus } = useSelector((state) => state.amc);
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState();
  const id = location?.state?.id;

  useEffect(() => {
    if (id) {
      dispatch(fetchamcDataById({ id }));
    }
  }, [id]);

  const TABLE_HEAD = [
    "S.No.",
    "Vin Number",
    "Service Date",
    "Parts Price",
    "Labour Price",
    "Vas Price",
    "Total Amount",
  ];
  const TABLE_ROWS = amcByIdorStatus?.data?.amcExpense?.map((data, index) => ({
    sno:  index + 1,
    data: data || "NA",
  }));
  const totalExpense = amcByIdorStatus?.data?.amcExpense?.reduce(
    (sum, data) => sum + Number(data?.serviceTotalAmount || 0),
    0
  );
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <Nav />
        </span>
      </div>

      <div className="md:ml-[19%] sm:ml-[26.5%] mt-20">
        {loading && (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
            <Loader />
          </div>
        )}

        {!loading && !amcByIdorStatus && (
          <div className="flex justify-center items-center h-[300px]">
            <DataNotFound
              className="flex justify-center flex-col w-full items-center md:mt-20 mt-12 md:ml-28 sm:ml-28"
              message="No AMC Profile found"
            />
          </div>
        )}

        {!loading && amcByIdorStatus && (
          <div className="mr-6">
            <div className="bg-white rounded-md px-6 py-4 font-poppins mt-28 ">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <FaRegIdCard />
                  </span>
                  <span className="font-semibold text-[22px]">
                    Customer Personal Information
                  </span>
                </span>
              </div>
              <div className="flex flex-row w-full justify-between mt-6">
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Customer Name </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.customerName ||
                      "NA"}
                  </span>
                  <span className="font-light mt-4">Email</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.email || "NA"}
                  </span>
                  <span className="font-light mt-4">Pan Number</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.pan || "NA"}
                  </span>
                  <span className="font-light mt-4">Zip Code</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.zipCode || "NA"}
                  </span>
                </span>
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Address </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.address || "NA"}
                  </span>
                  <span className="font-light mt-4">Phone Number</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.contact || "NA"}
                  </span>

                  <span className="font-light mt-4">Gst Number</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.customerGst ||
                      "NA"}
                  </span>
                  <span className="font-light mt-4">State Code</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.customerDetails?.stateCode || "NA"}
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6 mb-6">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <BiSolidCar />
                  </span>
                  <span className="font-semibold text-[22px]">
                    Vehicle Details
                  </span>
                </span>
              </div>
              <div className="flex flex-row w-full justify-between mt-6">
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light mt-4">Model</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.model || "NA"}
                  </span>
                  <span className="font-light mt-4">Agreement Period</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails
                      ?.agreementStartDate || "NA"}
                  </span>
                  <span className="font-light mt-4">Agreement Valid Date</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails
                      ?.agreementValidDate || "NA"}
                  </span>
                  <span className="font-light mt-4">
                    Agreement Valid Milage
                  </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails
                      ?.agreementValidMilage || "NA"}
                  </span>
                  <span className="font-light mt-4">
                    Location of the Dealer
                  </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.dealerLocation ||
                      "NA"}
                  </span>
                </span>
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Vin Number </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.vinNumber || "NA"}
                  </span>
                  <span className="font-light mt-4">Agreement Start Date</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails
                      ?.agreementStartDate || "NA"}
                  </span>{" "}
                  <span className="font-light mt-4">
                    Agreement Start Milage
                  </span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails
                      ?.agreementStartMilage || "NA"}
                  </span>
                  <span className="font-light mt-4">Total Amount</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.total || "NA"}
                  </span>
                </span>
              </div>
            </div>
            <div className="bg-white rounded-md px-6 py-4 font-poppins  mb-6">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <FaRegAddressCard />
                  </span>
                  <span className="font-semibold text-[22px]">AMC Details</span>
                </span>
              </div>
              <div className="flex flex-row w-full justify-between mt-6">
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light mt-4">Issue Type</span>
                  <span className="font-medium">INT</span>
                  <span className="font-light mt-4">Revenue</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.total || "NA"}
                  </span>
                </span>
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light mt-4">Available Credit</span>
                  <span className="font-medium">
                    {amcByIdorStatus?.data?.vehicleDetails?.agreementPeriod ||
                      "NA"}
                  </span>
                  <span className="font-light mt-4">Expenses</span>
                  <span className="font-medium">
                    {totalExpense || "NA"}
                  </span>{" "}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-md px-6 py-4 font-poppins  mb-20">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <FaRegAddressCard />
                  </span>
                  <span className="font-semibold text-[22px]">
                    AMC Expense Details
                  </span>
                </span>
              </div>
              <div className=" mt-6 mr-6  ">
                <CustomTableFive
                  tableHead={TABLE_HEAD}
                  tableRows={TABLE_ROWS}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AmcProfileView;
