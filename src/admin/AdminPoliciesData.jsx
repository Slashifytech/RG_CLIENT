import React, { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { cancelPolicyData } from "../features/adminDashboardSlice";
import { formatDate } from "../helper/commonHelperFunc";
import { MdCancel, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PdfPage from "../Components/pdfPage";
import CancelPolicyPopUp from "../Components/cancelPolicyPopUp";
import { getFilteredPolicyById, getPolicyById } from "../../Util/UtilityFunction";
import Pagination from "../Components/Pagination";
import DataNotFound from "./DataNotFound";
import Loader from "../Components/Loader";
import ManufacturerTab from "../Components/ManufacturerTab";
import MgPdf from "../Components/Mgpdf";

const AdminPoliciesData = () => {
  const perPage = 10;
  const dispatch = useDispatch();
  const id = useSelector((state) => state.users?.users?._id);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState( localStorage.getItem("selectedManufacturer") || "Mercedes-Benz");
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [policies, setPolicies] = useState();
  const [totalPoliciesCount, setTotalPoliciesCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPolicies = async () => {
      setLoading(true);
      try {
        const res = await getFilteredPolicyById(id, currentPage, perPage);
        setPolicies(res.data); 
        setTotalPagesCount(res.totalPagesCount);
        setTotalPoliciesCount(res.totalPoliciesCount);
      } catch (error) {
        console.error('Error fetching policies:', error);
      } finally {
        setLoading(false); 
      }
    };
  
    getPolicies();
  }, [id, currentPage]);
  

  useEffect(() => {
    const filtered = policies?.filter(
      (item) =>
        item.vehicleManufacturer === selectedManufacturer && !item.isDisabled
    );
    setFilteredPolicies(filtered || []);
  }, [policies, selectedManufacturer]);

  const handleCancelPolicy = async (policyId) => {
    try {
      const response = await dispatch(cancelPolicyData(policyId)).unwrap();
      toast.success(response.data.message);

      setFilteredPolicies((prevPolicies) =>
        prevPolicies
          .map((policy) =>
            policy._id === policyId ? { ...policy, isDisabled: true } : policy
          )
          .filter((policy) => !policy.isDisabled)
      );
    } catch (error) {
      console.error("Error canceling policy:", error);
      toast.error("Something went wrong");
    }
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

    // Reset to the first page when switching manufacturers
    setCurrentPage(1);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <p className="md:pt-9 sm:pt-16 pt-28 text-[22px] font-semibold md:ml-[22%] sm:ml-[33%] ml-6">Policy Lists -</p>
        <ManufacturerTab
        selectedManufacturer={selectedManufacturer}
        handleTabClick={handleTabClick}
      />

      <div className="font-head">
        <div className="w-[100%] md:w-[110%] sm:w-[100%] overflow-x-scroll scrollbar-hide  pt-9">
          {/* Loading State */}
          {loading ? (
            <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
              {/* <Loading customText={"Loading"} /> */}
              <Loader/>
            </div>
          ) : filteredPolicies.length === 0 ? (
            <DataNotFound
              className="flex justify-center flex-col w-full items-center mt-20 ml-28"
              message="No policies found"
            />
          ) : (
            <>
              <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[18%] sm:ml-[33%] w-[240%]  bg-secondary  md:w-[75%] py-2 px-6 sm:w-[120%] font-semibold text-center text-[16px] items-center font-DMsans mb-6">
                <p className="md:w-1  ">S.No</p>
                <p className="md:w-32 w-[20%]">Name</p>
                <p className="text-center md:w-36 w-[16%]">Certificate No.</p>
                <p className="md:w-24 w-[15%]">Certificate Issue Date</p>
                <p className="md:w-32 w-[16%]">View / Download</p>
                <p className="md:w-40 md:text-start  w-[14%]">Actions</p>
              </div>
              {filteredPolicies?.map((item, index) => (
                <AgentTableData
                  key={item._id}
                  index={index}
                  item={item}
                  currentPage={currentPage}
                  perPage={perPage}
                  handleCancelPolicy={handleCancelPolicy}
                  selectedManufacturer={selectedManufacturer}
                />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPoliciesCount > 0 && (
          <div className="flex justify-center items-center mt-3 mb-5 ml-52">
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

const AgentTableData = ({
  item,
  handleCancelPolicy,
  perPage,
  currentPage,
  index,
  selectedManufacturer,
}) => {
  const pdfRef = useRef();
  const [isCancelled, setIsCancelled] = useState(item.isDisabled || false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const openPopUp = useCallback(() => setIsPopUpOpen(true));
  const closePopUp = useCallback(() => setIsPopUpOpen(false));
  useEffect(() => {
    setIsCancelled(item.isDisabled);
  }, [item.isDisabled]);

  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };
  const serialNumber =
    currentPage && perPage
      ? (currentPage - 1) * perPage + index + 1
      : index + 1;
  return (
    <>
      <div className="flex flex-col md:mx-40  md:ml-[20%] ml-[14%] sm:ml-[38%] mx-6  md:w-[70%] w-[205%] sm:w-[100%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
        <div className="flex text-[14px] flex-row justify-between items-start w-full my-1">
          <p className="md:w-1 w-8 ">{serialNumber}</p>
          <p className="md:w-40 w-[20%]">{item.customerName}</p>
          <p className="md:w-36 w-[20%]">{item.policyId}</p>
          <p className="">{formatDate(item.createdAt)}</p>
          <p className=" md:w-36 w-[20%] flex flex-row items-center gap-5 text-[14px]">
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
            {isCancelled ? (
              <span className=" bg-red-700 text-white rounded-md py-1 px-3">
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
                    update: "update"
                  }}
                  className="cursor-pointer rounded-md text-black flex flex-row gap-1"
                >
                  <MdOutlineEdit />
                  <span>Edit</span>
                </Link>
                <span
                  onClick={() => openPopUp()}
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

export default AdminPoliciesData;
