import { useEffect, useState } from "react";
import { GroupedInput } from "../Components/Input";
import { createdDate } from "../helper/commonHelperFunc";
import Nav from "./Nav";
import { toast } from "react-toastify";
import { addNewInovoice, editInovoice } from "../features/adminApi";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchInvoiceById } from "../features/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchamcDataById } from "../features/amcSLice";
import { fetchbuyBackDataById } from "../features/BuyBackSlice";
import { updateAMCStatus } from "../features/AMCapi";
import { updatBuyBackStatus, updateBuyBack } from "../features/BuybackApi";
const InvoiceForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoiceById } = useSelector((state) => state.invoice);
  const { buyBackByIdorStatus } = useSelector((state) => state.buyBack);
  const { amcByIdorStatus } = useSelector((state) => state.amc);
  const { users } = useSelector((state) => state.users);

  const createdBy = users?._id;
  const invoiceId = location?.state?.invoiceId;
  const id = location?.state?.id;
  const typeData = location?.state?.type;
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: typeData,
    serviceId: id,
    billingDetail: {
      customerName: "",
      address: "",
      contact: "",
      email: "",
      pan: "",
      customerGst: "",
      zipCode: "",
      stateCode: "",
    },
    shippingDetails: {
      customerName: "",
      address: "",
      contact: "",
      email: "",
      pan: "",
      customerGst: "",
      zipCode: "",
      stateCode: "",
    },

    vehicleDetails: {
      hypothecated: "",
      vinNumber: "",
      branchName: "",
      vehiclemodel: "",
      model: "",
      gstAmount: "",
      cgst: "",
      sgst: "",
      totalAmount: "",
      rmEmail: "",
      gmEmail: "",
    },
  });
  console.log(typeData);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const [errors, setErrors] = useState({});
  const formattedDate = createdDate();
  const rightFields = [
    { name: "customerName", type: "text", placeholder: "Name", label: "Name" },
    {
      name: "zipCode",
      type: "text",
      placeholder: "Zip Code",
      label: "Zip Code",
    },
    {
      name: "contact",
      type: "number",
      placeholder: "Contact Number",
      label: "Conatct Number",
    },
    {
      name: "customerGst",
      type: "text",
      placeholder: "GSTIN",
      label: "GSTIN Number",
    },
  ];
  const leftFields = [
    { name: "address", type: "text", placeholder: "Address", label: "Address" },
    {
      name: "stateCode",
      type: "text",
      placeholder: "State Code",
      label: "State Code",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email Id",
      label: "Email Id",
    },
    {
      name: "pan",
      type: "text",
      placeholder: "PAN Number",
      label: "PAN Number",
    },
  ];

  const rightVehicleFields = [
    {
      name: "branchName",
      type: "text",
      placeholder: "Branch Name",
      label: "Branch Name",
    },
    {
      name: "model",
      type: "text",
      placeholder: "Model",
      label: "Model",
    },
    {
      name: "cgst",
      type: "number",
      placeholder: "CGST 9%",
      label: "CGST 9%",
    },
    {
      name: "sgst",
      type: "number",
      placeholder: "SGST 9%",
      label: "SGST 9%",
    },
    {
      name: "gmEmail",
      type: "email",
      placeholder: "General Manager Email",
      label: "General Manager Email",
    },
  ];
  const leftVehicleFields = [
    {
      name: "hypothecated",
      type: "text",
      placeholder: "Hypothecated To",
      label: "Hypothecated To",
    },
    {
      name: "vinNumber",
      type: "number",
      placeholder: "Vin Number",
      label: "Vin Number",
    },
    {
      name: "gstAmount",
      type: "number",
      placeholder: "Pre Gst Amount",
      label: "Pre Gst Amount",
    },

    {
      name: "totalAmount",
      type: "number",
      placeholder: "Total Amount",
      label: "Total Amount",
    },
    {
      name: "rmEmail",
      type: "email",
      placeholder: "Regional Manager Email",
      label: "Regional Manager Email",
    },
  ];

  const handleInput = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset?.section;
    setInvoiceData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    if (invoiceData.vehicleDetails.gstAmount !== undefined) {
      calculateVehicleDetails();
    }
  }, [invoiceData.vehicleDetails.gstAmount]);

  const calculateVehicleDetails = () => {
    setInvoiceData((prevState) => {
      const gstAmount = parseFloat(prevState.vehicleDetails.gstAmount || 0);
      console.log("GST Amount:", gstAmount);

      const cgst = gstAmount * 0.09; // 9% of GST
      const sgst = gstAmount * 0.09; // 9% of GST
      const totalAmount = gstAmount + cgst + sgst;

      // console.log("CGST:", cgst, "SGST:", sgst, "Total Amount:", totalAmount);

      return {
        ...prevState,
        vehicleDetails: {
          ...prevState.vehicleDetails,
          cgst,
          sgst,
          totalAmount,
        },
      };
    });
  };

  const handleCheckboxChange = (e) => {
    setSameAsBilling(e.target.checked);
    if (e.target.checked) {
      setInvoiceData((prevState) => ({
        ...prevState,
        shippingDetails: { ...prevState.billingDetail },
      }));
    }
  };

  const validateFields = () => {
    const requiredFields = {
      invoiceType: "Invoice Type is required",
      email: "Email is required",
      ...Object.keys(invoiceData.billingDetail).reduce(
        (acc, key) => ({
          ...acc,
          [`billingDetail.${key}`]: `${key} in Billing Detail is required`,
        }),
        {}
      ),
      ...Object.keys(invoiceData.shippingDetails).reduce(
        (acc, key) => ({
          ...acc,
          [`shippingDetails.${key}`]: `${key} in Shipping Detail is required`,
        }),
        {}
      ),
      ...Object.keys(invoiceData.vehicleDetails).reduce(
        (acc, key) => ({
          ...acc,
          [`vehicleDetails.${key}`]: `${key} in Vehicle Details is required`,
        }),
        {}
      ),
    };

    const errors = {};

    Object.keys(requiredFields).forEach((fieldPath) => {
      const value = fieldPath
        .split(".")
        .reduce((o, key) => o?.[key], invoiceData);
      if (!value) {
        errors[fieldPath] = requiredFields[fieldPath];
      }
    });

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById({ invoiceId }));
    }
    if (id) {
      if (typeData === "AMC") {
        dispatch(fetchamcDataById({ id, option: null }));
      } else if (typeData === "Buyback") {
        dispatch(fetchbuyBackDataById({ id, option: null }));
      }
    }
  }, []);

  useEffect(() => {
    if (invoiceById?.invoice) {
      setInvoiceData((prev) => ({
        ...prev,
        ...invoiceById?.invoice,
      }));
    }
  }, [invoiceById?.invoice]);

  useEffect(() => {
    if (amcByIdorStatus?.data || buyBackByIdorStatus?.data) {
      const incomingData = amcByIdorStatus?.data || buyBackByIdorStatus?.data;

      setInvoiceData((prevState) => ({
        ...prevState,
        invoiceType: incomingData.invoiceType || prevState.invoiceType,
        email: incomingData.email || prevState.email,
        billingDetail: {
          ...prevState.billingDetail,
          customerName: incomingData?.customerDetails?.customerName || "",
          address:
            incomingData?.customerDetails?.address ||
            prevState.billingDetail.address,
          contact:
            incomingData?.customerDetails?.contact ||
            prevState.billingDetail.contact,
          email:
            incomingData?.customerDetails?.email ||
            prevState.billingDetail.email,
          pan:
            incomingData?.customerDetails?.pan || prevState.billingDetail.pan,
          customerGst:
            incomingData?.customerDetails?.customerGst ||
            prevState.billingDetail.customerGst,
          zipCode:
            incomingData?.customerDetails?.zipCode ||
            prevState.billingDetail.zipCode,
          stateCode:
            incomingData?.customerDetails?.stateCode ||
            prevState.billingDetail.stateCode,
        },

        vehicleDetails: {
          ...prevState.vehicleDetails,
          vinNumber:
            incomingData.vehicleDetails?.vinNumber ||
            prevState.vehicleDetails.vinNumber,
          model:
            incomingData.vehicleDetails?.model ||
            incomingData.vehicleDetails?.vehicleModel ||
            prevState.vehicleDetails.model,
          gstAmount:
            incomingData.vehicleDetails?.total ||
            incomingData.vehicleDetails?.totalPayment ||
            prevState.vehicleDetails.gstAmount,
          rmEmail:
            incomingData.vehicleDetails?.rmEmail ||
            prevState.vehicleDetails.rmEmail,
          gmEmail:
            incomingData.vehicleDetails?.gmEmail ||
            prevState.vehicleDetails.gmEmail,
        },
      }));
    }
  }, [amcByIdorStatus]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateFields();

    if (isValid) {
    } else {
      console.log("Validation errors:", errors);
      toast.error(errors || "Please fill all required fields");
    }

    const getChangedFields = (current, original) => {
      return Object.keys(current).reduce((changes, key) => {
        if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
          changes[key] = current[key];
        }
        return changes;
      }, {});
    };

    const payload = invoiceId
      ? getChangedFields(invoiceData, invoiceById?.invoice || {})
      : { ...invoiceData, createdBy: createdBy };
    const role = localStorage.getItem("roleType");
    try {
      let res;

      if (invoiceId) {
        res = await editInovoice(payload, invoiceId);
        toast.success(res?.message || "Invoice updated successfully");
      } else {
        const updateResponse =
          typeData === "Buyback"
            ? await updatBuyBackStatus(id, "approved", null)
            : await updateAMCStatus(id, "approved", null);

        if (updateResponse.status === 200) {
          res = await addNewInovoice(payload, role);
          toast.success(res?.message || "Invoice added successfully");
        }
      }

      // navigate("/admin/invoice-lists");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="fixed">
        <span className="absolute">{<Nav />}</span>
      </div>
      <span className="flex md:flex-row flex-col md:items-center justify-between md:mx-36 mx-6 font-head md:pt-0 pt-12 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[14%] sm:ml-[34%]">
          Add New Invoice
        </p>
        <p className="md:text-[18px] text-[16px] font-medium md:pt-12 pt-4 sm:ml-[34%]">
          Invoice Issue Date - {formattedDate}
          {/* id ? formatDate(isCreatedDate) :  */}
        </p>
      </span>
      <div className="ml-[21%]  w-full">
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Bill to Details
        </p>

        <GroupedInput
          leftFields={leftFields}
          rightFields={rightFields}
          stateName={invoiceData.billingDetail}
          errors={errors || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "billingDetail" } },
            });
          }}
        />
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Shipped to
        </p>
        <div className="mt-5 flex items-center gap-2 ">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => handleCheckboxChange(e)}
          />
          <label htmlFor="sameAsBilling">Same as above</label>
        </div>
        <GroupedInput
          leftFields={leftFields}
          rightFields={rightFields}
          stateName={invoiceData.shippingDetails}
          errors={errors || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "shippingDetails" } },
            });
          }}
        />

        <p className="text-[20px] font-head font-semibold mt-5">
          Vehicle Details
        </p>
        <GroupedInput
          leftFields={leftVehicleFields}
          rightFields={rightVehicleFields}
          stateName={invoiceData.vehicleDetails}
          errors={errors || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "vehicleDetails" } },
            });
          }}
        />
        <div className="mt-9 mb-20">
          <span
            onClick={handleSubmit}
            className="bg-primary text-white px-6 rounded-md py-2 cursor-pointer"
          >
            Submit
          </span>
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;
