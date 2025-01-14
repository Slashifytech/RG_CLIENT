import React, { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cancelPolicyData } from "../features/adminDashboardSlice";
import { formatDate } from "../helper/commonHelperFunc";
import { MdCancel, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import PdfPage from "../Components/pdfPage";
import CancelPolicyPopUp from "../Components/cancelPolicyPopUp";
import { fetchUserById, getFilteredPolicyById } from "../../Util/UtilityFunction";
import Pagination from "../Components/Pagination";
import DataNotFound from "./DataNotFound";
import Loader from "../Components/Loader";


const AgentPoliciesData = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.state?.agentId; // Optional chaining in case agentId is not available
  const [agentData, setAgentData] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(1); 

  const perPage = 10;

  useEffect(() => {
    const getPolicies = async () => {
      setLoading(true);
      try {
        const res = await getFilteredPolicyById(id, currentPage, perPage);
        setPolicies(res.data || []); 
        setTotalPagesCount(res.totalPages || 1);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    getPolicies();
  }, [id, currentPage]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserById(id);
        setAgentData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const activePolicies = policies.filter((item) => !item.isDisabled);
    setFilteredPolicies(activePolicies);
  }, [policies]);


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

      <div className="font-head pt-9">
      <p className="pt-14 text-[20px] font-semibold md:ml-[22%] ml-6 sm:ml-[33%]">
              {agentData?.agentName || "NA"} {agentData?.agentId || "NA"}
            </p>
            <p className="text-[20px] font-semibold md:ml-[22%] sm:ml-[33%] ml-6 pt-3">
              Policy Lists -
            </p>
        {loading ? (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
              {/* <Loading customText={"Loading"} /> */}
              <Loader/>
            </div>
        ) : filteredPolicies.length === 0 ? (
          <DataNotFound
              className="flex justify-center flex-col w-full items-center mt-20 ml-28"
              message="No agent policy found"
            />
        ) : (
          <>
       

          <div className="w-[100%] md:w-[110%] sm:w-[100%] overflow-x-scroll scrollbar-hide  mt-3">
            <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[18%] sm:ml-[33%] w-[235%]  bg-secondary  md:w-[75%] py-2 px-6 sm:w-[120%] font-semibold text-center text-[16px] items-center font-DMsans mb-6">
              <p className="md:w-1  ">S.No</p>
              <p className="md:w-32 w-[20%]">Name</p>
              <p className="text-center md:w-36 w-[16%]">Certificate No.</p>
              <p className="md:w-24 w-[15%]">Certificate Issue Date</p>
              <p className="md:w-32 w-[16%]">View / Download</p>
              <p className="md:w-40 md:text-start  w-[14%]">Actions</p>
            </div>
              {filteredPolicies.map((item, index) => (
                <AgentTableData
                  key={item._id}
                  item={item}
                  index={index + 1 + (currentPage - 1) * perPage}
                  handleCancelPolicy={handleCancelPolicy}
                />
              ))}
            </div>

            {totalPagesCount > 1 && (
              <div className="flex justify-center items-center mt-9 mb-5 ml-28">
                <Pagination
                  currentPage={currentPage}
                  hasNextPage={currentPage < totalPagesCount}
                  hasPreviousPage={currentPage > 1}
                  onPageChange={handlePageChange}
                  totalPagesCount={totalPagesCount}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const AgentTableData = ({ item, handleCancelPolicy, index }) => {
  const pdfRef = useRef();
  const [isCancelled, setIsCancelled] = useState(item.isDisabled || false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const openPopUp = useCallback(() => setIsPopUpOpen(true), []);
  const closePopUp = useCallback(() => setIsPopUpOpen(false), []);

  useEffect(() => {
    setIsCancelled(item.isDisabled);
  }, [item.isDisabled]);

  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };

  return (
    <>
         <div className="flex flex-col md:mx-40  md:ml-[20%] ml-[14%] sm:ml-[38%] mx-6  md:w-[70%] w-[205%] sm:w-[100%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
        <div className="flex text-[14px] flex-row justify-between items-start w-full my-1">
        <p className="w-1">{index}</p> {/* S.No */}
          <p className="md:w-40 mdtext-center   w-[20%]">{item.customerName}</p>
          <p className="md:w-36 w-[20%]">{item.policyId}</p>
          <p className="">{formatDate(item.createdAt)}</p>
          <p className= "md:w-36 w-[20%] flex flex-row items-center gap-5 text-[14px]">
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
                    policyType: item.vehicleManufacturer === "Morris Garage" ? "MG" : "MB",
                    id: item._id,
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
      <span className="hidden">
        <PdfPage ref={pdfRef} id={item._id} />
      </span>
      <CancelPolicyPopUp
        handleCancelPolicy={handleCancelPolicy}
        item={item}
        isPopUpOpen={isPopUpOpen}
        closePopUp={closePopUp}
      />
    </>
  );
};

export default AgentPoliciesData;
