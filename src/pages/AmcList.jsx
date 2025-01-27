import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import DataNotFound from "../admin/DataNotFound";
import { CustomTableFour } from "../Components/Table";
import { FaPencil } from "react-icons/fa6";
import Nav from "../admin/Nav";
import { fetchamcLists, setEmptyAMC } from "../features/amcSlice";
import Loader from "../Components/Loader";
import SideNav from "../agent/SideNav";
import Header from "../Components/Header";
import {
  amcCancelByAdmin,
  amcResubmit,
  updateAMCStatus,
} from "../features/AMCapi";
import { toast } from "react-toastify";

const AdminAmcList = () => {
  const { _id, roleType } = useSelector((state) => state.users?.users);
  const userId = roleType === "2" ? _id : null;
  const { amcLists } = useSelector((state) => state.amc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const currentPage = amcLists?.pagination?.currentPage;
  const totalPagesCount = amcLists?.pagination?.totalPages;
  const totalCount = amcLists?.pagination?.totalItems;
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    setLoading(true);
    if (roleType === "2" && userId) {
      dispatch(
        fetchamcLists({ page, perPage, searchTerm, userId, option: null })
      );
    } else if (roleType === "0" || roleType === "1") {
      dispatch(
        fetchamcLists({
          page,
          perPage,
          searchTerm,
          userId: null,
          status: false,
        })
      );
    }

    setLoading(false);
  }, [page, perPage, searchTerm, userId]);

  const TABLE_HEAD = [
    "S.No.",
    "Name",
    "Email",
    "VIN No.",
    "AMC Issue date",
    "View/Download",
    "Status",
    "Action",
  ];

  const TABLE_ROWS = amcLists?.data?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    data: data || "NA",
    status: data?.amcStatus || "NA",
    type: "amc",
  }));

  const handleDispatch = () => {
    dispatch(setEmptyAMC());
  };

  const handleResubmit = async (id) => {
    try {
      const res = await amcResubmit(id);
      if (roleType === "2" && userId) {
        dispatch(
          fetchamcLists({ page, perPage, option: null, userId, option: null })
        );
      } else if (roleType === "0" || roleType === "1") {
        dispatch(
          fetchamcLists({
            page,
            perPage,
            option: null,
            userId: null,
            status: false,
          })
        );
      }
      toast.success(res?.message || "Amc resubmitted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something Went Wrong");
    }
  };
  const handleCancel = async (id) => {
    try {
      const res = await amcCancelByAdmin(id);
      dispatch(
        fetchamcLists({
          page,
          perPage,
          searchTerm,
          userId: null,
          status: false,
        })
      );
      toast.success(res?.message || "Amc cancelled successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something Went Wrong");
    }
  };
  const handleStatus = async (userId, type, reason) => {
    try {
      const response = await updateAMCStatus(userId, type, reason);

      toast.success(response?.message || "AMC Updated Successfully");
      dispatch(
        fetchamcLists({
          option: null,
          option: null,
          option: null,
          option: null,
          status: "reqCancel",
        })
      );
    } catch (error) {
      console.error(error, "Something went wrong");
      toast.error(error?.message || "Something Went Wrong");
    }
  };

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          {roleType === "2" ? <SideNav /> : <Nav />}
        </span>
      </div>
      <div>
        <Header />
      </div>
      <div className="md:pt-20 sm:pt-20 pt-6 flex md:flex-row sm:flex-row flex-col-reverse justify-between md:items-center sm:items-center md:px-20 mx-6">
        <Link
          onClick={handleDispatch}
          to={roleType === "2" ? "/agent/amc-form" : "/admin/add-amc"}
          className="px-6 bg-primary text-white rounded-md py-2 text-[16px] md:ml-[15.5%] sm:ml-[26%] mt-4 sm:mt-4 md:mt-4"
        >
          + Add New Amc
        </Link>
      </div>

      <div className="px-6 flex justify-start md:ml-64 sm:ml-48 mt-6">
        <input
          type="text"
          placeholder="Search by VIN number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[20rem] py-2 border border-gray-300 bg-white px-3 rounded-2xl outline-none"
        />
      </div>

      <p className="pt-5 text-[20px] font-semibold md:ml-[21%] sm:ml-[28%] ml-6">
        AMC Lists-
      </p>

      <div className="font-head pt-4">
        {loading ? (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
            {/* <Loading customText={"Loading"} /> */}
            <Loader />
          </div>
        ) : !totalCount ? (
          <div className="flex justify-center items-center h-[300px]">
            <DataNotFound
              className="flex justify-center flex-col w-full items-center md:mt-20 mt-12 md:ml-28 sm:ml-28"
              message="No AMC found"
            />
          </div>
        ) : (
          <>
            <div className="md:ml-[20.5%] sm:ml-[28%] mt-6 mr-6  ">
              <CustomTableFour
                tableHead={TABLE_HEAD}
                tableRows={TABLE_ROWS}
                link={
                  roleType === "2" ? "/agent/edit-AMC" : "/admin/update-AMC"
                }
                redirectLink={"/amc-view"}
                action="Edit"
                icon={<FaPencil />}
                handleResubmit={handleResubmit}
                handleStatus={handleStatus}
                handleCancel={handleCancel}
              />
            </div>
            {totalPagesCount > 1 && (
              <div className="flex justify-center items-center mt-3 mb-5 ml-52">
                <Pagination
                  currentPage={currentPage}
                  hasNextPage={currentPage * perPage < totalCount}
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

export default AdminAmcList;
