import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import DataNotFound from "./DataNotFound";
import Pagination from "../Components/Pagination";
import { CustomTableOne } from "../Components/Table";
import { FaPencil, FaRegEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { setEmptyInvoiceData } from "../features/InvoiceSlice";
import { toast } from "react-toastify";
import { reSubmitInvoice } from "../features/InvoiceApi";
import { fetchInvoiceByStatus } from "./../features/adminDashboardSlice";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { invoicesByStatus } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const perPage = 10;
  const currentPage = invoicesByStatus?.data?.currentPage;
  const totalPagesCount = invoicesByStatus?.data?.totalPagesCount;
  const totalCount = invoicesByStatus?.data?.totalInvoicesCount;
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchInvoiceByStatus({ page, perPage, optional:null, search }));
  }, [dispatch, page, perPage, search]);

  const handleResubmit = async (invoiceId) => {
    try {
      const res = await reSubmitInvoice(invoiceId);
      toast.success(res?.message || "Invoice resubmitted successfully");
      dispatch(fetchInvoiceByStatus({}));
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Sommething went wrong");
    }
  };

  const TABLE_HEAD = [
    "S.No.",
    "Invoice Id",
    "Email",
    "Invoice Issue Date",
    "View Invoice",
    "Downlaod Invoice",

    "Approvals",
    "Action",
    "Resubmit",
  ];

  const TABLE_ROWS = invoicesByStatus?.data?.invoiceData?.map(
    (data, index) => ({
      sno: (currentPage - 1) * perPage + index + 1,
      id: data?.invoiceId || "NA",
      data: data || "NA",
      status: data?.invoicestatus || "NA",
      appId: data?._id,
    })
  );
  return (
    // <div>InvoiceList</div>

    <>
      <div className="fixed">
        <span className="absolute">{<Nav />}</span>
      </div>
      <span className="flex md:flex-row flex-col md:items-center justify-between  mx-6 font-head md:pt-0 pt-12 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[20%] sm:ml-[34%]">
          Invoice Lists
        </p>
        <Link
          onClick={() => dispatch(setEmptyInvoiceData())}
          to="/invoice-form"
          className="bg-primary px-3 py-2 md:text-[15px] text-[16px] font-medium md:mt-12  sm:ml-[34%] text-white rounded-md cursor-pointer sm:w-36 sm:mt-6"
        >
          + Add Invoice
          {/* id ? formatDate(isCreatedDate) :  */}
        </Link>
      </span>
      <input
          type="text"
          placeholder="Search by Invoice Id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[27rem] py-2 border border-gray-300 bg-secondary px-3 rounded-2xl outline-none md:ml-[39%] sm:ml-[36%] sm:mt-6"
        />

      {totalCount > 0 ? (
        <>
          <div className="md:ml-[19.5%] sm:ml-[36%] mt-6 mr-6  ">
            <CustomTableOne
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              link="/invoice-form"
              action={"Edit"}
              icon={<FaPencil />}
              handleResubmit={handleResubmit}
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
            message="No pending Invoices found"
          />
        </div>
      )}
    </>
  );
};

export default InvoiceList;
