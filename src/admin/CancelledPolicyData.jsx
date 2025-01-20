import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancelledPolicy } from "../features/adminDashboardSlice";
import { formatDate } from "../helper/commonHelperFunc";
import { Link } from "react-router-dom";
import PdfPage from "../Components/pdfPage";
import Pagination from "../Components/Pagination";
import DataNotFound from "./DataNotFound";
import Loader from "../Components/Loader";
import MgPdf from "../Components/Mgpdf";

const CancelledPolicyData = () => {
  const perPage = 10;
  const dispatch = useDispatch();
  const { data, totalPoliciesCount, totalPagesCount } = useSelector(
    (state) => state.admin.fetchCancelledData
  );
  const policies = data.data || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    localStorage.getItem("selectedManufacturer") || "Mercedes-Benz"
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchCancelledPolicy({
        page: currentPage,
        limit: perPage,
      })
    ).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <p className="pt-6 text-[20px] font-semibold md:ml-[22%] mt-16 ml-6 md:mt-6 sm:mt-9 sm:ml-[35%]">
        Cancelled Policy Lists -
      </p>
  

      <div className="font-head pt-9">
        {/* Show loading state */}
        {loading ? (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
            {/* <Loading customText={"Loading"} /> */}
            <Loader />
          </div>
        ) : policies.length === 0 ? (
          // Show "No Data" message if no policies are found
          <DataNotFound
            className="flex justify-center flex-col w-full items-center mt-20 ml-28"
            message="No Cancelled policy found"
          />
        ) : (
          <div className="w-[100%] md:w-[110%] sm:w-[100%] overflow-x-scroll scrollbar-hide ">
            <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[18%] sm:ml-[33%] w-[240%]  bg-secondary  md:w-[75%] py-2 px-6 sm:w-[120%] font-semibold text-center text-[16px] items-center font-DMsans mb-6">
              <p className="md:w-1  ">S.No</p>
              <p className="md:w-32 w-[20%]">Name</p>
              <p className="text-center md:w-36 w-[16%]">Certificate No.</p>
              <p className="md:w-24 w-[15%]">Certificate Issue Date</p>
              <p className="md:w-32 w-[16%]">View / Download</p>
              <p className="md:w-40 md:text-start  w-[18%]">Status</p>
            </div>
            {policies.map((item, index) => (
              <AgentTableData
                key={index}
                item={item}
                selectedManufacturer={selectedManufacturer}
                index={index}
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

const AgentTableData = ({ item, index, selectedManufacturer }) => {
  const pdfRef = useRef();

  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };

  return (
    <>
      <div className="flex flex-col md:mx-40  md:ml-[20%] ml-[14%] sm:ml-[38%] mx-6  md:w-[70%] w-[205%] sm:w-[100%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
        <div className="flex text-[14px] flex-row justify-between items-start w-full my-1">
          <p className="md:w-1 w-8">{index + 1}</p>
          <p className="md:w-40 w-[20%]">{item?.customerName}</p>
          <p className="md:w-36 w-[20%]">{item?.policyId}</p>
          <p className="">{formatDate(item?.createdAt)}</p>
          <p className="md:w-36 w-[20%] flex flex-row items-center gap-5 text-[14px]">
            <Link
              to="/policy"
              state={{ id: item?._id }}
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
            <span className=" bg-red-700 text-white rounded-md py-1 px-3">
              Cancelled
            </span>
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
    </>
  );
};

export default CancelledPolicyData;
