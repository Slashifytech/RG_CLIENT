import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelPolicyData,
  fetchAllPolicy,
} from "../features/adminDashboardSlice";
import { MdCancel, MdOutlineEdit } from "react-icons/md";
import Pagination from "../Components/Pagination";
import Nav from "./Nav";
import { formatDate } from "../helper/commonHelperFunc";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PdfPage from "../Components/pdfPage";
import CancelPolicyPopUp from "../Components/cancelPolicyPopUp";
import { downloadCsvData } from "../../Util/UtilityFunction";
import Loader from "../Components/Loader";
import DataNotFound from "./DataNotFound";
import ManufacturerTab from "../Components/ManufacturerTab";
import MgPdf from "../Components/Mgpdf";

const ActivePolicyData = () => {
  const dispatch = useDispatch();
  const { data, totalPagesCount, totalPoliciesCount } = useSelector(
    (state) => state.admin.allPolicy
  );
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    localStorage.getItem("selectedManufacturer") || "Mercedes-Benz"
  );
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchAllPolicy({
        page: currentPage,
        limit: perPage,
        manufacturer: selectedManufacturer,
        searchTerm
      })
    ).finally(() => {
      setLoading(false);
    });
  }, [selectedManufacturer, currentPage, searchTerm]);
 

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabClick = (manufacturer) => {
    if (manufacturer === "MG") {
      setSelectedManufacturer("Morris Garage");
      localStorage.setItem("selectedManufacturer", "Morris Garage");
    }
    if (manufacturer === "MB") {
      setSelectedManufacturer("Mercedes-Benz");
      localStorage.setItem("selectedManufacturer", "Mercedes-Benz");
    }
    setSearchTerm("");

    setCurrentPage(1);
  };

  const handleCancelPolicy = async (policyId) => {
    try {
      const response = await dispatch(cancelPolicyData(policyId)).unwrap();
      toast.success(response?.message || "Cancelled Successfully");
      dispatch(
        fetchAllPolicy({
       
        }))
    } catch (error) {
      console.error("Error canceling policy:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDownload = async (manufacturer) => {
    await downloadCsvData(manufacturer);
  };

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <p className="pt-9 text-[20px] font-semibold md:ml-[22%] sm:ml-[34%] ml-6 md:mt-0 mt-16 sm:mt-16">
        Active Policies List -
      </p>
      <ManufacturerTab
        selectedManufacturer={selectedManufacturer}
        handleTabClick={handleTabClick}
      />

      <div className="flex md:flex-row sm:flex-col flex-col items-center w-full justify-end md:pr-16  sm:px-8 pt-9 ">
        <div className="px-6">
          <input
            type="text"
            placeholder="Search by Policy ID /Engine Number /Vehicle Registartion Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-[30rem] w-72 sm:w-[30rem] sm:ml-60 py-2 border border-gray-300 bg-secondary  px-3 rounded-2xl outline-none"
          />
        </div>
        <span className="flex flex-row gap-6 mt-10 sm:mt-10 md:mt-0 sm:ml-10">
          <span
            onClick={() => handleDownload("Morris Garage")}
            className="bg-primary text-white cursor-pointer rounded-md  px-3 py-2 "
          >
            <span>Download MG</span>
          </span>
          <span
            onClick={() => handleDownload("Mercedes-Benz")}
            className="bg-primary text-white cursor-pointer rounded-md  px-3 py-2"
          >
            Download MB
          </span>
        </span>
      </div>
      <div className="font-head pt-9">
        {loading ? (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
              {/* <Loading customText={"Loading"} /> */}
              <Loader/>
            </div>
        ) : data?.data?.length === 0 ? (
          <DataNotFound
            className="flex justify-center flex-col w-full items-center mt-20 ml-28"
            message="No active policy found"
          />
        ) : (
          <div className="w-[100%] md:w-[110%] sm:w-[100%] overflow-x-scroll scrollbar-hide  ">
            <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[18%] sm:ml-[33%] w-[235%]  bg-secondary  md:w-[75%] py-2 px-6 sm:w-[160%] font-semibold text-center text-[16px] items-center font-DMsans mb-6">
              <p className="md:w-1  ">S.No</p>
              <p className="md:w-32 w-[20%]">Name</p>
              <p className="md:w-48 w-[20%]">Email</p>

              <p className="text-center md:w-36 w-[16%]">Certificate No.</p>
              <p className="md:w-24 w-[15%]">Certificate Issue Date</p>
              <p className="md:w-32 w-[16%]">View / Download</p>
              <p className="md:w-40 md:text-start  w-[14%]">Actions</p>
            </div>
            {data?.data?.map((item, index) => (
              <PolicyDataTable
                key={item._id}
                item={item}
                index={index + 1 + (currentPage - 1) * perPage}
                handleCancelPolicy={handleCancelPolicy}
                selectedManufacturer={selectedManufacturer}

              />
            ))}
          </div>
        )}
        {totalPoliciesCount > 1 && (
          <div className="flex justify-center items-center mt-9 mb-5 ml-28 ">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage < totalPagesCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        )}
      </div>
    </>
  );
};

const PolicyDataTable = ({ item, index, handleCancelPolicy, selectedManufacturer}) => {
  const pdfRef = useRef();
  const [isCancelled, setIsCancelled] = useState(item.isDisabled || false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const openPopUp = useCallback(() => setIsPopUpOpen(true));
  const closePopUp = useCallback(() => setIsPopUpOpen(false));

  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };

  useEffect(() => {
    setIsCancelled(item.isDisabled);
  }, [item.isDisabled]);

  return (
    <>
    <div className="flex flex-col md:mx-40  md:ml-[20%] ml-[14%] sm:ml-[38%] mx-6  md:w-[70%] w-[205%] sm:w-[139%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
    <div className="flex text-[14px] flex-row justify-between items-start w-full my-1">
          <p className="w-6">{index}</p> {/* S.No */}
          <p className="md:w-40 md:text-center   w-[20%]">{item.customerName}</p>
          <p className="md:w-52 md:text-center   w-[20%]">{item.email}</p>

          <p className="md:w-36 w-[20%]">{item.policyId}</p>
          <p className="">{formatDate(item.createdAt)}</p>
          <p className="md:w-36 w-[20%] flex flex-row items-center gap-5 text-[14px]">
            <Link
              to="/policy"
              state={{ id: item._id }}
              className="bg-primary text-white py-1 px-3 cursor-pointer rounded-md"
            >
              View
            </Link>
            <span
              onClick={handleDownloadClick}
              className="bg-primary text-white py-1 px-3 cursor-pointer rounded-md"
            >
              Download
            </span>
          </p>
          <p className="md:w-40 w-[5%] flex flex-row items-center gap-3 text-[14px]">
            {isCancelled ? (
              <span className="bg-red-700 text-white rounded-md py-1 px-3">
                Cancelled
              </span>
            ) : (
              <>
                <Link
                  to="/admin/update-policies"
                  state={{
                    policyType:
                      item?.vehicleManufacturer === "Morris Garage"
                        ? "MG"
                        : "MB",
                    id: item?._id,
                    update: "update",
                  }}
                  className="cursor-pointer rounded-md text-black flex flex-row gap-1"
                >
                  <MdOutlineEdit />
                  <span>Edit</span>
                </Link>
                <span
                  onClick={openPopUp}
                  className="cursor-pointer rounded-md text-black flex items-center gap-1"
                >
                  <MdCancel size={20} /> <span>Cancel</span>
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      {selectedManufacturer === "Mercedes-Benz" ? (
        <span className="hidden">
          <PdfPage ref={pdfRef} id={item?._id} />
        </span>
      ) : selectedManufacturer === "Morris Garage" ? (
        <span className="hidden">
          <MgPdf ref={pdfRef} id={item?._id} />
        </span>
      ) : null}
      <CancelPolicyPopUp
        handleCancelPolicy={handleCancelPolicy}
        item={item}
        isPopUpOpen={isPopUpOpen}
        closePopUp={closePopUp}
      />
    </>
  );
};

export default ActivePolicyData;
