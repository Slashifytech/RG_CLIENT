import React, { useCallback, useEffect, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPendingPolicy, updatePolicy } from "../features/policySlice";
import { toast } from "react-toastify";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import DataNotFound from "./DataNotFound";
import { fetchUserById } from "../../Util/UtilityFunction";
import Loader from "../Components/Loader";
import RejectPopUp from "../Components/RejectPopUp";

const PolicyApproval = () => {
  const dispatch = useDispatch();
  const { pendingPolicy, status, totalPagesCount, totalPoliciesCount } =
    useSelector((state) => state.policy);

  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    dispatch(
      fetchAllPendingPolicy({
        page: currentPage,
        limit: perPage,
      })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "succeeded" || status === "failed") {
      setLoading(false);
    }
  }, [status]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <>
   
      <div>
      
      </div>

      <p className="font-semibold text-[24px] md:ml-72 sm:ml-72 ml-6 ">
        Pending Approval List
      </p>
      <div className="overflow-x-scroll w-full md:w-full md:overflow-hidden ">
        <ul className="bg-secondary text-[15px] py-7 flex flex-row justify-around items-center sm:w-[93%] w-[180%]  mr-10 md:ml-72 sm:ml-72 md:w-[75%]  gap-2 rounded-lg mt-8 h-[6vh]  text-black font-medium">
          <li className="md:w-[2%]">S.No</li>
          <li className="w-[32%] md:w-[36%] text-center">Description</li>
          <li className="w-[1%] text-center">Action</li>
        </ul>

        <div>
          {loading ? (
            <div className="mt-16 flex justify-center md:ml-32 sm:ml-52">
              {/* <Loading customText={"Loading"} /> */}
              <Loader />
            </div>
          ) : pendingPolicy?.data?.length === 0 ? (
            <DataNotFound
              className="flex justify-center flex-col w-full items-center mt-20 ml-28"
              message="No pending policy found"
            />
          ) : (
            pendingPolicy?.data
              ?.filter(
                (policy) =>
                  policy.policyStatus === "yetToApproved" ||
                  policy?.isCancelReq === "reqCancel"
              )
              .map((item, index) => (
                <ApprovalCard
                  key={item._id}
                  item={item}
                  index={index + 1 + (currentPage - 1) * perPage}
                />
              ))
          )}
        </div>

        {totalPoliciesCount > 0 && (
          <div className="flex justify-center items-center  mt-9 mb-5 ml-28 ">
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

const ApprovalCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const [agentData, setAgentData] = useState();
  const [isReasonPopUp, setIsReasonPopUp] = useState(false);
  const openReasonPopUp = useCallback(() => setIsReasonPopUp(true));
  const closeReasonPopUp = useCallback(() => setIsReasonPopUp(false));
  const getAgentData = async () => {
    const data = await fetchUserById(item.userId);
    setAgentData(data);
  };

  useEffect(() => {
    getAgentData();
  }, []);

  const handlePolicyStatus = async (userId, type, policyData, reason) => {
    try {
      const response = await dispatch(
        updatePolicy({ userId, type, policyData, reason })
      );

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Policy Updated Successfully");
        dispatch(fetchAllPendingPolicy({ page: 1, limit: 10 }));
      } else {
        toast.error("Failed to update the policy status");
      }
    } catch (error) {
      console.error(error, "Something went wrong");
    }
  };

  return (
    <>
      <ul className="text-[15px] flex flex-row justify-around items-start mx-6 sm:mx-6 md:mx-10 md:ml-72 sm:ml-72 gap-2 rounded-lg mt-8 text-black font-normal w-[180%] md:w-[80%] sm:w-[100%]">
        <li className="w-[2%]">{index}</li>
        <li className="w-[36%] px-3 text-start mb-3 py-3 rounded-lg bg-secondary  shadow">
          {agentData?.roleType === "0" ? "Admin" : "Agent"}:{" "}
          {agentData?.agentName}{" "}
          {item?.isCancelReq === "reqCancel"
            ? "Sent a request to cancel the Policy of"
            : " Sent a request to approve the policy of"}{" "}
          {item?.customerName} 
          {item?.isCancelReq === "reqCancel" ? item?.policyId : ""}
          <Link
            to="/policy"
            state={{ id: item?._id }}
            className="mx-1 text-primary cursor-pointer underline"
          >
            {" "}
            View Policy{" "}
          </Link>
        </li>

        <li className="md:w-[9%] w-[13%] text-center flex flex-col gap-2">
          {item?.isCancelReq === "reqCancel" ? (
            <Link
              to="/admin/active-policy"
              onClick={() => handlePolicyStatus(item._id, "approvedReq", item)}
              className="py-1 px-5 bg-primary text-white rounded-lg cursor-pointer "
            >
              Approve
            </Link>
          ) : (
            <>
              <span
                onClick={() => handlePolicyStatus(item._id, "approved", item)}
                className="py-1 px-5 bg-primary text-white rounded-lg cursor-pointer"
              >
                Accept
              </span>
              <span
                onClick={openReasonPopUp}
                className="py-1 px-5 text-primary border border-primary rounded-md font-medium cursor-pointer"
              >
                Decline
              </span>
            </>
          )}
        </li>
      </ul>
      <RejectPopUp
        isReasonPopUp={isReasonPopUp}
        closeReasonPopUp={closeReasonPopUp}
        handlePolicyStatus={handlePolicyStatus}
        item={item}
        subTitle={"  Please provide reason to reject the Policy !"}
      />
    </>
  );
};

export default PolicyApproval;
