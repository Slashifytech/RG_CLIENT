import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "../helper/commonHelperFunc";
import Loader from "../Components/Loader";
import html2pdf from "html2pdf.js";
import { getInvoiceById } from "../features/InvoiceApi";
import { invoicelogo } from "../assets";

const InvoiceView = forwardRef(({ id }, ref) => {
  const [data, setData] = useState();
  const location = useLocation();
  const invoiceId = id ? id : location?.state?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInvoiceById(invoiceId);
        setData(res?.invoice);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [invoiceId]);

  const pdfRef = useRef();
  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${data?.invoiceId}_Invoice` || "360_Invoice",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a3", orientation: "landscape" },
      pagebreak: { mode: "avoid-all" },
    };
    html2pdf().from(input).set(opt).save();
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF,
  }));
  if (!data) {
    return (
      <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
        {/* <Loading customText={"Loading"} /> */}
        <Loader />
      </div>
    );
  }
  return (
    <div
      ref={pdfRef}
      className="border border-black p-6 font-body m-3 text-[13px]"
    >
       <div className="flex flex-row items-start gap-[20%] text-[14px] font-bold">
        <img src={invoicelogo} alt="logo" style={{ width: "11%" }} />
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>360 Car Protect India LLP</h2>
          <h3 style={{ margin: 0 }}>
            3-4-138, A/Flat No. 501, Royal Elegance, Barkatpura, Hyderabad,
            Telangana
          </h3>
          <h3 style={{ margin: 0 }}>TS-500027</h3>
          <h3 style={{ margin: 0 }}>State Code: 36, GSTIN: 36AADFZ5034G1Z5</h3>
          <h3 style={{ margin: 0 }}>PAN: AADFZ5034G</h3>
        </div>
      </div>
      {/* Invoice Header */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "60%",
                border: "1px solid black",
                padding: "8px",
              }}
            >
              <h2 className="font-bold text-[20px] ">Tax Invoice</h2>
            </td>
            <td style={{ width: "40%", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <th
                      className="fornt-semibold"
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      Invoice Type:
                    </th>
                    <td style={{ border: "1px solid black", padding: "5px" }}>
                      360 Car Protect
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="fornt-semibold"
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      Invoice Number:
                    </th>
                    <td style={{ border: "1px solid black", padding: "5px" }}>
                      {data?.invoiceId}
                    </td>
                  </tr>
                  <tr>
                    <th
                      className="fornt-semibold"
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      Invoice Date:
                    </th>
                    <td style={{ border: "1px solid black", padding: "5px" }}>
                      {formatDate(data?.createdAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Billing Details */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "33%",
                border: "1px solid black",
                padding: "8px",
              }}
            >
              <b>Bill To:</b>
              <br />
              {data?.billingDetail?.address}
              <br />
              {data?.billingDetail?.city}, {data.billingDetail?.state}
              <br />
              State Code: {data.billingDetail?.stateCode}
              <br />
              GST Registration Type: {data?.billingDetail?.gstRegType}
              <br />
              GSTIN: {data?.billingDetail?.gstInNumber}
              <br />
              PAN: {data?.billingDetail?.pan}
              <br />
              Contact No: {data?.billingDetail?.contact}
            </td>
            <td
              style={{
                width: "33%",
                border: "1px solid black",
                padding: "8px",
              }}
            >
              <b>Place of Supply:</b>
              <br />
              {data.supplyDetails.address}
              <br />
              {data.supplyDetails.city}, {data.supplyDetails.state}
              <br />
              State Code: {data.supplyDetails.stateCode}
              <br />
              GST Registration Type: {data?.supplyDetails?.gstRegType}
              <br />
              GSTIN: {data.supplyDetails.gstInNumber}
              <br />
              PAN: {data.supplyDetails.pan}
              <br />
              Contact No: {data.supplyDetails.contact}
            </td>
            <td
              style={{
                width: "33%",
                border: "1px solid black",
                padding: "8px",
              }}
            >
              <b>Place of Delivery:</b>
              <br />
              {data.deliveryDetails.address}
              <br />
              {data.deliveryDetails.city}, {data.deliveryDetails.state}
              <br />
              State Code: {data.deliveryDetails.stateCode}
              <br />
              GST Registration Type: {data?.deliveryDetails?.gstRegType}
              <br />
              GSTIN: {data.deliveryDetails.gstInNumber}
              <br />
              PAN: {data.deliveryDetails.pan}
              <br />
              Contact No: {data.deliveryDetails.contact}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Invoice Items */}
      <div className={`overflow-x-auto ${id ? "mt-12" : "mt-0"}`}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid black",
            marginBottom: "20px",
          }}
        >
          <thead>
            {/* Main Header Row */}
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                S.No
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Description
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                HSN/SAC Code
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Qty
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Total
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Discount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Taxable Value
              </th>
              <th
                className="fornt-semibold text-[13px]"
                colSpan="2"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                CGST
              </th>
              <th
                className="fornt-semibold text-[13px]"
                colSpan="2"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                SGST
              </th>
              <th
                className="fornt-semibold text-[13px]"
                colSpan="2"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                IGST
              </th>
              <th
                className="fornt-semibold text-[13px]"
                colSpan="2"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                CESS
              </th>
              <th
                className="fornt-semibold text-[13px]"
                colSpan="2"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                UGST
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Total Amount (INR)
              </th>
            </tr>
            {/* Sub-header Row */}
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              {/* Empty cells for alignment */}
              <th
                className="fornt-semibold text-[13px]"
                colSpan="8"
                style={{ border: "none" }}
              ></th>
              {/* Sub-columns for CGST, SGST, IGST, CESS, UGST */}
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Amount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Amount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Amount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Amount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Rate
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                Amount
              </th>
              <th
                className="fornt-semibold text-[13px]"
                style={{ border: "none" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                1
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.description}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.hsnCode}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.quantity}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.rate}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.total}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.discount}
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.taxValue}
              </td>
              {/* Values for CGST */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.cgstpercentage}%
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.cgst}
              </td>
              {/* Values for SGST */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.sgstpercentage}%
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.sgst}
              </td>
              {/* Values for IGST */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.igstpercentage}%
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.igst}
              </td>
              {/* Values for CESS */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.cesspercentage}%
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.cess}
              </td>
              {/* Values for UGST */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.ugstpercentage}%
              </td>
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.ugst}
              </td>
              {/* Total Amount */}
              <td
                className="text-[13px]"
                style={{ border: "1px solid black", padding: "6px" }}
              >
                {data.customerBillingDetails.totalinvoiceamount}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  Veh No:
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.vehnumber}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  VIN NO:
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.vinnumber}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  Engine No:
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.enginenumber}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  Model:
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.vehiclemodel}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  Total Invoice Price Value (in figure):
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.totalpriceinfigure}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  Whether Reverse Charge Applicable (Y/N):
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {data.vehicleDetails.reversechargeapplication}
                </td>
                <td style={{ border: "none", padding: "6px" }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: "20px" }}>Declaration/Terms and Conditions:</p>
        <p>
          Above package can be availed only at all branches of Silver Star
          (Hyderabad, Vizag, Pune, Kolhapur, Nashik, Aurangabad)
        </p>

        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Warranty Validity:
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Start Date
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid black", padding: "8px" }}></td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {data.vehicleDetails.warrantystartdate}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {data.vehicleDetails.warrantyenddate}
              </td>
            </tr>
          </tbody>
        </table>
        <p>Certified that the particulars given above are true and correct</p>
        <p>All Disputes Subject to Jurisdiction of Hyderabad</p>

        <p style={{ textAlign: "right" }}>For 360 Car Protect India LLP</p>
        <p className="mb-3" style={{ textAlign: "right" }}>
          Authorized Signatory
        </p>
      </div>
    </div>
  );
});

export default InvoiceView;
