import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import { formatDate } from "../helper/commonHelperFunc";
import { ToggleButton } from "./Input";
import CancelReqPopUp from "./CancelReqPopUp";
import PdfPage from "./pdfPage";
import MgPdf from "./Mgpdf";
import { TbPencilCancel } from "react-icons/tb";
import InvoiceView from "../pages/InvoiceView";
import ViewAmc from "../pages/ViewAmc";
import ViewBuyBack from "../pages/viewBuyBack";
import { useSelector } from "react-redux";

export function CustomTableOne({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
}) {
  const pdfRefs = useRef({});
  const getPdfRef = (id) => {
    if (!pdfRefs.current[id]) {
      pdfRefs.current[id] = React.createRef();
    }
    return pdfRefs.current[id];
  };

  const handleDownloadClick = (id) => {
    const ref = pdfRefs.current[id];
    if (ref && ref.current) {
      ref.current.handleDownloadPDF();
    }
  };
  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4"
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.sno || "NA"}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.data.billingDetail?.customerName}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.data.billingDetail?.email}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.data?.vehicleDetails?.vinNumber}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {formatDate(row.data.createdAt)}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <Link
                    to="/invoice"
                    state={{ id: row?.data?._id }}
                    className="bg-primary text-white px-6 py-1 rounded-md cursor-pointer"
                  >
                    View
                  </Link>
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <span
                    onClick={() => handleDownloadClick(row?.data?._id)}
                    className="bg-primary text-white px-6 py-1 rounded-md cursor-pointer"
                  >
                    Download
                  </span>
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={link}
                    state={{ invoiceId: row?.data?._id }}
                    className="flex flex-row items-center gap-2"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="font-body">{action}</span>
                  </Link>
                </Typography>
              </td>

              <span className="hidden">
                <InvoiceView
                  ref={getPdfRef(row?.data?._id)}
                  id={row?.data?._id}
                />
              </span>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function CustomTableTwo({
  tableHead = [],
  tableRows = [],
  documentStatus,
  sendCustomerDoc,
  loading,
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
}) {
  const role = localStorage.getItem("roleType");
  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4"
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.sno || "NA"}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.data?.customerName}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.data?.commonEmail}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.policyId}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.invoiceId}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <Link
                    to="/policy"
                    state={{ id: row?.data?.policyDbId }}
                    className="bg-primary text-white px-6 py-1 rounded-md cursor-pointer"
                  >
                    View
                  </Link>
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <Link
                    to="/invoice"
                    state={{ id: row?.data?.invoiceDbId }}
                    className="bg-primary text-white px-6 py-1 rounded-md cursor-pointer"
                  >
                    View
                  </Link>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  onClick={() => {
                    if (row?.agentApprovalStatus !== "approved") {
                      documentStatus(
                        row.data?.invoiceDbId,
                        row.data?.policyDbId,
                        row?.data?.customerName,
                        row.data?.agentId,
                        role === "0" ? "approved" : "pending",
                        null,
                        row?.data?.commonEmail
                      );
                    }
                  }}
                  variant="small"
                  color="blue-gray"
                  className={` text-white rounded-md w-28 px-2 py-[3px] text-center font-normal cursor-pointer ${
                    row.agentApprovalStatus === "pending"
                      ? "bg-[#fa9c30] "
                      : row.agentApprovalStatus === "approved"
                      ? "bg-[#09985C]"
                      : row.agentApprovalStatus === "rejected"
                      ? "bg-[#D33131]"
                      : "bg-primary"
                  }`}
                >
                  {row.agentApprovalStatus === "pending"
                    ? "Pending"
                    : row.agentApprovalStatus === "rejected"
                    ? "Rejected"
                    : row.agentApprovalStatus === "approved"
                    ? "Approved"
                    : "Send"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  onClick={() => {
                    if (!loading && row?.clientApprovalStatus !== "approved") {
                      sendCustomerDoc(
                        row?.data?.invoiceDbId,
                        row?.data?.policyDbId,
                        row?.data?.customerName,
                        "pending",
                        row?.data?.commonEmail
                      );
                    }
                  }}
                  variant="small"
                  color="blue-gray"
                  className={`text-white rounded-md w-28 px-2 py-[3px] text-center font-normal cursor-pointer ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : row?.clientApprovalStatus === "pending"
                      ? "bg-[#fa9c30]"
                      : row?.clientApprovalStatus === "approved"
                      ? "bg-[#09985C]"
                      : "bg-primary"
                  }`}
                >
                  {loading
                    ? "Sending ..."
                    : row?.clientApprovalStatus === "pending"
                    ? "Pending"
                    : row?.clientApprovalStatus === "approved"
                    ? "Approved"
                    : "Send"}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <ToggleButton
                    value={row?.clientApprovalStatus}
                    checkedToggle={row?.clientApprovalStatus === "approved"}
                    onChange={(newStatus) =>
                      sendCustomerDoc(
                        row.data?.invoiceDbId,
                        row.data?.policyDbId,
                        row?.data?.customerName,
                        newStatus,
                        row?.data?.commonEmail
                      )
                    }
                  />
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function CustomTableThree({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  handleResubmit,
  cancelPolicyRequest,
  brandName,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
}) {
  const pdfRef = useRef();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isId, setIsId] = useState();

  const openPopUp = useCallback((id) => {
    setIsId(id);
    setIsPopUpOpen(true);
  }, []);

  const closePopUp = useCallback(() => setIsPopUpOpen(false), []);

  const handleDownloadClick = (id) => {
    if (pdfRef.current[id]) {
      // Check if ref for this ID exists
      pdfRef.current[id].handleDownloadPDF();
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.sno || "NA"}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.customerName}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data.email || "Waiting"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data.policyId || "Waiting"}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(row.data.createdAt)}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    <span className="flex flex-row items-center gap-3">
                      <Link
                        to="/policy"
                        state={{ id: row?.data?._id }}
                        className="border border-primary text-primary px-6 py-1 rounded-md cursor-pointer"
                      >
                        View
                      </Link>
                      <span
                        onClick={() => handleDownloadClick(row?.data?._id)}
                        className="bg-primary text-white px-6 py-1.5 rounded-md cursor-pointer"
                      >
                        Download
                      </span>
                    </span>
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-[13px]   px-2 py-[3px] text-center `}
                  >
                    {row?.data?.isCancelReq === "reqCancel" ? (
                      <span className="">Pending</span>
                    ) : row?.data?.isCancelReq === "approvedReq" ? (
                      <span className="">Approved</span>
                    ) : row?.data?.isDisabled === true ? (
                      <span className="">Approved</span>
                    ) : row?.data?.policyStatus === "rejected" ? (
                      <span className="">Rejected</span>
                    ) : row?.data?.policyStatus === "approved" ? (
                      <>
                        <span className="flex items-center gap-3">
                          <span className="text-[20px]  text-red-500">
                            <TbPencilCancel />
                          </span>
                          <span
                            className="cursor-pointer text-[15px]"
                            onClick={() => openPopUp(row?.data?._id)}
                          >
                            Request
                          </span>
                        </span>
                      </>
                    ) : null}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-[13px]   px-2 py-[3px] text-center `}
                  >
                    {row?.data?.isDisabled === true &&
                    row?.data?.policyStatus === "approved" ? (
                      <span className="bg-red-500 text-white rounded-md py-2 px-2">
                        Cancelled
                      </span>
                    ) : row?.data?.policyStatus === "approved" ? (
                      <span className="bg-green-500 text-white rounded-md py-2 px-3">
                        Approved
                      </span>
                    ) : row?.data?.policyStatus === "rejected" ? (
                      <span className="flex items-center gap-3">
                        <Link
                          to="/update-policies"
                          state={{
                            id: row?.data?._id,
                            update: "update",
                          }}
                          className="text-primary text-[15px]"
                        >
                          Edit
                        </Link>
                        <span className="bg-red-500 text-white rounded-md py-2 px-3">
                          Rejected
                        </span>
                      </span>
                    ) : (
                      <span className="bg-yellow-500  text-white rounded-md py-2 px-3">
                        Pending
                      </span>
                    )}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.data?.policyStatus === "rejected" ? (
                      <span
                        onClick={() => handleResubmit(row?.data?._id)}
                        className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
                      >
                        Resubmit
                      </span>
                    ) : (
                      "_"
                    )}
                  </Typography>
                </td>
                {brandName === "MB" ? (
                  <span className="hidden">
                    <PdfPage
                      ref={(el) => {
                        // Initialize pdfRefs.current if it's undefined
                        if (!pdfRef.current) {
                          pdfRef.current = {};
                        }
                        pdfRef.current[row?.data?._id] = el; // Store the reference
                      }}
                      id={row?.data?._id}
                    />
                  </span>
                ) : brandName === "MG" ? (
                  <span className="hidden">
                    <MgPdf
                      ref={(el) => {
                        // Initialize pdfRefs.current if it's undefined
                        if (!pdfRef.current) {
                          pdfRef.current = {};
                        }
                        pdfRef.current[row?.data?._id] = el; // Store the reference
                      }}
                      id={row?.data?._id}
                    />
                  </span>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <CancelReqPopUp
        closePopUp={closePopUp}
        isPopUpOpen={isPopUpOpen}
        item={isId}
        cancelPolicyRequest={cancelPolicyRequest}
      />
    </>
  );
}

export function CustomTableFour({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  redirectLink,
  handleResubmit,
  handleStatus,
  handleCancel,
}) {
  const pdfRef = useRef();
  const { _id, roleType } = useSelector((state) => state.users?.users);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isId, setIsId] = useState();

  const openPopUp = useCallback((id) => {
    setIsId(id);
    setIsPopUpOpen(true);
  }, []);

  const closePopUp = useCallback(() => setIsPopUpOpen(false), []);
  const handleDownloadClick = (id) => {
    if (pdfRef.current[id]) {
      pdfRef.current[id].handleDownloadPDF();
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.sno || "NA"}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.customerDetails?.customerName}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data.customerDetails?.email || "Waiting"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.vehicleDetails?.vinNumber || "Waiting"}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(row.data.createdAt)}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    <span className="flex flex-row items-center gap-3">
                      <Link
                        to={redirectLink}
                        state={{ id: row?.data?._id }}
                        className="border border-primary text-primary px-6 py-1 rounded-md cursor-pointer"
                      >
                        View
                      </Link>
                      <span
                        onClick={() => handleDownloadClick(row?.data?._id)}
                        className="bg-primary text-white px-6 py-1.5 rounded-md cursor-pointer"
                      >
                        Download
                      </span>
                    </span>
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light text-[13px] text-white rounded-xl w-28 px-2 py-[3px] text-center ${
                      row?.status === "pending"
                        ? "bg-[#096D98] "
                        : row?.status === "approved"
                        ? "bg-[#09985C]"
                        : row?.status === "rejected"
                        ? "bg-[#D33131]"
                        : "bg-primary"
                    }`}
                  >
                    {row?.status === "pending"
                      ? "Pending"
                      : row?.status === "rejected"
                      ? "Rejected"
                      : row?.status === "approved"
                      ? "Approved"
                      : "NA"}
                  </Typography>
                </td>
                {row?.status === "rejected" ? (
                  <td className="p-4">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <div className="flex flex-ro items-center gap-4">
                        <Link
                          to={link}
                          state={{ docId: row?.data?._id }}
                          className="flex flex-row items-center gap-2"
                        >
                          <span className="text-primary">{icon}</span>
                          <span className="font-body">{action}</span>
                        </Link>

                        <span
                          onClick={() => handleResubmit(row?.data?._id)}
                          className="bg-primary text-white rounded-md px-6 py-1 cusror-pointer"
                        >
                          Resubmit
                        </span>
                      </div>
                    </Typography>
                  </td>
                ) : row?.status === "approved" && roleType === "2" ? (
                  <td className="p-4">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <span
                        onClick={() =>
                          handleStatus(row?.data?._id, "reqCancel", null)
                        }
                        className="bg-primary text-white rounded-md px-6 py-1 cusror-pointer"
                      >
                        Request Cancel
                      </span>
                    </Typography>
                  </td>
                ) : row?.status === "approved" ? (
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <span
                        onClick={() => openPopUp(row?.data?._id)}
                        className="bg-primary text-white rounded-md px-6 py-1 cursor-pointer"
                      >
                        Cancel
                      </span>
                    </Typography>
                  </td>
                ) : (
                  <span>__</span>
                )}
                {row.type === "amc" ? (
                  <span className="hidden">
                    <ViewAmc
                      ref={(el) => {
                        // Initialize pdfRefs.current if it's undefined
                        if (!pdfRef.current) {
                          pdfRef.current = {};
                        }
                        pdfRef.current[row?.data?._id] = el; // Store the reference
                      }}
                      id={row?.data?._id}
                    />
                  </span>
                ) : row.type === "buyBack" ? (
                  <span className="hidden">
                    <ViewBuyBack
                      ref={(el) => {
                        // Initialize pdfRefs.current if it's undefined
                        if (!pdfRef.current) {
                          pdfRef.current = {};
                        }
                        pdfRef.current[row?.data?._id] = el; // Store the reference
                      }}
                      id={row?.data?._id}
                    />
                  </span>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <CancelReqPopUp
        closePopUp={closePopUp}
        isPopUpOpen={isPopUpOpen}
        item={isId}
        text="Are you sure to request the cancellation for this policy ?"
        cancelPolicyRequest={handleStatus}
      />
      <CancelReqPopUp
        closePopUp={closePopUp}
        isPopUpOpen={isPopUpOpen}
        item={isId}
        text="Are you sure to cancel the policy ?"
        cancelPolicyRequest={handleCancel}
      />
    </>
  );
}
