import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import SideNav from "./SideNav";
import DataNotFound from "../admin/DataNotFound";
import { fetchPendingReq } from "../features/agentSlice";
import { updateStatus } from "../features/DocumentApi";
import RejectDocPop from "../Components/RejectDocPop";

const ApprovalPage = () => {
  const dispatch = useDispatch();
  const { approvals } = useSelector((state) => state.agent);
  const { users } = useSelector((state) => state.users);

  const userId = users?._id
  const [page, setPage] = useState(1);
  const perPage = 10;
  const currentPage = approvals?.pagination?.currentPage;
  const totalPagesCount = approvals?.pagination?.totalPages;
  const totalCount = approvals?.pagination?.totalRecords;
  const [loading, setLoading] = useState(false);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(
      fetchPendingReq({
        page,
        perPage,
        userId
      })
    );
    setLoading(false);
  }, [dispatch, page, perPage]);

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <SideNav />
        </span>
      </div>

      <p className="font-semibold text-[28px] md:ml-72 sm:ml-72 ml-6 pt-12">
        Pending Request List
      </p>
      <div className="overflow-x-scroll w-full md:w-full md:overflow-hidden ">
        <ul className="bg-secondary text-[15px] py-7 flex flex-row justify-around items-center sm:w-[93%] w-[180%]  mr-10 md:ml-72 sm:ml-72 md:w-[75%]  gap-2 rounded-lg mt-8 h-[6vh]  text-black font-medium">
          <li className="md:w-[2%]">S.No</li>
          <li className="w-[32%] md:w-[36%] text-center">Description</li>
          <li className="w-[1%] text-center">Action</li>
        </ul>

        <div>
          {loading ? (
            <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
              {/* <Loading customText={"Loading"} /> */}
              <Loader />
            </div>
          ) : !approvals?.data || approvals.data.length === 0 ? (
            <DataNotFound
              className="flex justify-center flex-col w-full items-center mt-20 ml-28"
              message="No pending request found"
            />
          ) : (
            approvals?.data?.map((item, index) => (
              <ApprovalCard
                key={item._id}
                item={item}
                index={(currentPage - 1) * perPage + index + 1}
              />
            ))
          )}
        </div>

        {totalCount > 0 && (
          <div className="flex justify-center items-center  mt-9 mb-5 ml-28 ">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage * perPage < totalCount}
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
  const [isReasonPopUp, setIsReasonPopUp] = useState(false);
  const openReasonPopUp = useCallback(() => setIsReasonPopUp(true));
  const closeReasonPopUp = useCallback(() => setIsReasonPopUp(false));

  const documentStatus = async (
    invoiceId,
    policyId,
    customerName,
    agentId,
    agentApproval,
    clientApproval,
    autoApproval,
    message
  ) => {
    console.log(message, "check");

    try {
      const res = await updateStatus(
        invoiceId,
        policyId,
        customerName,
        agentId,
        agentApproval,
        clientApproval,
        message
      );
      toast.success(res?.message || "Status Updated Successfully");
      dispatch(fetchPendingReq({}));
    } catch (error) {
      console.error("Error in documentStatus:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <ul className="text-[15px] flex flex-row justify-around items-start mx-6 sm:mx-6 md:mx-10 md:ml-72 sm:ml-72 gap-2 rounded-lg mt-8 text-black font-normal w-[180%] md:w-[80%] sm:w-[100%]">
        <li className="w-[2%]">{index}</li>
        <li className="w-[36%] px-3 text-start mb-3 py-3 rounded-lg bg-secondary  shadow">
          Admin sent you a request to approve the policies and invoice of{" "}
          {item?.customerName}
          <span className="flex flex-row items-center gap-6">
            <Link
              to="/policy"
              state={{ id: item?.policyId }}
              className="mx-1 text-primary cursor-pointer underline"
            >
              {" "}
              View Policy{" "}
            </Link>
            <Link
              to="/invoice"
              state={{ id: item?.invoiceId }}
              className="mx-1 text-primary cursor-pointer underline"
            >
              {" "}
              View Invoice{" "}
            </Link>
          </span>
        </li>

        <li className="md:w-[9%] w-[13%] text-center flex flex-col gap-2">
          <>
            <span
              onClick={() =>
                documentStatus(
                  item?.invoiceId,
                  item?.policyId,
                  null,
                  null,
                  "approved",
                  null,
                  null,
                  null
                )
              }
              className="py-1 px-5 bg-primary text-white rounded-lg cursor-pointer"
            >
              Accept
            </span>
            <span
              onClick={openReasonPopUp}
              className="py-1 px-5 text-primary border border-primary rounded-md font-medium cursor-pointer"
            >
              Reject
            </span>
          </>
        </li>
      </ul>
      <RejectDocPop
        isReasonPopUp={isReasonPopUp}
        closeReasonPopUp={closeReasonPopUp}
        handleStatus={documentStatus}
        item={item}
        subTitle={"  Please provide reason to reject the Policy !"}
      />
    </>
  );
};

export default ApprovalPage;
