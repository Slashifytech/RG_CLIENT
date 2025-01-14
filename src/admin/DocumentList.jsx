import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import DataNotFound from "./DataNotFound";
import Pagination from "../Components/Pagination";
import { CustomTableTwo } from "../Components/Table";
import { FaPencil } from "react-icons/fa6";

import { fetchDocumentData } from "../features/DocumentSlice";
import { toast } from "react-toastify";
import { updateStatus } from "../features/DocumentApi";
import {  customerApprovalSend } from "../features/adminApi";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { documentData } = useSelector((state) => state.documents);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setIsLoading] = useState(false);
  const perPage = 10;
  const role = localStorage.getItem("roleType");
  const currentPage = documentData?.pagination?.currentPage;
  const totalPagesCount = documentData?.pagination?.totalPages;
  const totalCount = documentData?.pagination?.totalItems;
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchDocumentData({ page, perPage, search }));
  }, [dispatch, page, perPage, search]);

  
  const documentStatus = async (
    invoiceId,
    policyId,
    customerName,
    agentId,
    agentApproval,
    clientApproval,
    email
  ) => {
    try {
      const res = await updateStatus(
        invoiceId,
        policyId,
        customerName,
        agentId,
        agentApproval,
        clientApproval,
        null,
        email,
        role
      );
      toast.success(res?.message || "Status Updated Successfully");
      dispatch(fetchDocumentData({}));
    } catch (error) {
      console.error("Error in documentStatus:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  const sendCustomerDoc = async (
    invoiceId,
    policyId,
    customerName,
    clientApproval,
    email
  ) => {
    try {
      setIsLoading(true)
      const res = await customerApprovalSend(
        invoiceId,
        policyId,
        customerName,
        clientApproval,
        email
      );
      setIsLoading(false)

      toast.success(res?.message || "Status Updated Successfully");
      dispatch(fetchDocumentData({}));

    } catch (error) {
      console.error("Error in documentStatus:", error);
      toast.error(error?.message || "Something went wrong");
    }finally{
      setIsLoading(false)

    }
  };

  const TABLE_HEAD = [
    "S.No.",
    "Customer Name",
    "Email",
    "Certificate Id",
    "Invoice Id",
    "View Policy",
    "View Invoice",
    "Agent Approval",
    "Client Approval",
    "Auto Approval",
  ];

  const TABLE_ROWS = documentData?.commonData?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    policyId: data?.policyId || "NA",
    invoiceId: data?.invoiceId || "NA",
    data: data || "NA",
    agentApprovalStatus: data?.documentStatus?.agentApproval?.status || "NA",
    clientApprovalStatus: data?.documentStatus?.clientApproval?.status || "NA",

    appId: data?._id,
  }));

  return (
    <>
      <div className="fixed">
        <span className="absolute">{<Nav />}</span>
      </div>
      <span className="flex md:flex-row flex-col md:items-end justify-between md:mx-36 mx-6 font-head md:pt-0 pt-12 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[12%] sm:ml-[36%]">
          Document Lists
        </p>
        <input
          type="text"
          placeholder="Search by Policy ID / Invoice Id / Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[27rem] py-2 border border-gray-300 bg-secondary px-3 rounded-2xl outline-none md:ml-[12%] sm:ml-[36%] sm:mt-6"
        />
      </span>

      {totalCount > 0 ? (
        <>
          <div className="md:ml-[19.5%] sm:ml-[36%] mt-6 mr-6  ">
            <CustomTableTwo
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              link="/invoice-form"
              action={"Edit"}
              icon={<FaPencil />}
              documentStatus={documentStatus}
              sendCustomerDoc={sendCustomerDoc}
              loading={loading}
            />
          </div>
          <div className="mt-16 mb-10 ml-20">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage * perPage < totalCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        </>
      ) : (
        <div className="mt-36 font-medium text-body ml-[12%] mr-[15%] mb-20">
          <DataNotFound
            className="flex justify-center flex-col w-full items-center mt-20 ml-28"
            message="No documents found"
          />
        </div>
      )}
    </>
  );
};

export default InvoiceList;
