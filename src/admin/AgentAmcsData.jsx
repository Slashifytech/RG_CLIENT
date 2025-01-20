import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Pagination from "../Components/Pagination";
import DataNotFound from "./DataNotFound";
import { CustomTableFour } from "../Components/Table";
import { FaPencil } from "react-icons/fa6";
import { fetchamcLists, setEmptyAMC } from "../features/amcSLice";
import Loader from "../Components/Loader";

const AgentAmcsData = () => {
  const location = useLocation();
  const userId = location?.state?.agentId;

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
    if (userId) {
      dispatch(
        fetchamcLists({ page, perPage, searchTerm, userId, option: null })
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

  return (
    <>
    

      <div className="flex items-center gap-3 justify-center md:ml-28 text-[18px] md:mt-10 sm:mt-10 mt-20">
      </div>

      <div className="md:pt-6 sm:pt-14 pt-6 flex md:flex-row sm:flex-row flex-col-reverse justify-between md:items-center sm:items-center md:px-20 mx-6">
        <Link
          onClick={handleDispatch}
          to="/admin/add-amc"
          className="px-6 bg-primary text-white rounded-md py-2 text-[16px] md:ml-[16%] sm:ml-[33%] mt-4 sm:mt-4 md:mt-4"
        >
          + Add New Amc
        </Link>
      
      </div>

      <div className="px-6 flex justify-center md:ml-28 sm:ml-60 mt-6">
        <input
          type="text"
          placeholder="Search by VIN number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[30rem] py-2 border border-gray-300 bg-secondary px-3 rounded-2xl outline-none"
        />
      </div>

      <p className="pt-5 text-[20px] font-semibold md:ml-[20%] sm:ml-[33%] ml-6">
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
            <div className="md:ml-[19.5%] sm:ml-[36%] mt-6 mr-6  ">
              <CustomTableFour
                tableHead={TABLE_HEAD}
                tableRows={TABLE_ROWS}
                link="/admin/update-AMC"
                redirectLink={"/amc-view"}
                action="Edit"
                icon={<FaPencil />}
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

export default AgentAmcsData;
