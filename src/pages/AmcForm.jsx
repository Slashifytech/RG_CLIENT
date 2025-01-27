import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GroupedInput } from "../Components/Input";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../admin/Nav";
import SideNav from "../agent/SideNav";
import { addNewAMC, updateAMC } from "../features/AMCapi";
import { useDispatch, useSelector } from "react-redux";
import { fetchamcDataById } from "../features/amcSlice";
import { createdDate, formatDate } from "../helper/commonHelperFunc";
import { fuelType, modelOption } from "../data";
import Header from "../Components/Header";
const AMCForm = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formattedDate = createdDate();
  const { amcByIdorStatus } = useSelector((state) => state.amc);
  const { _id, roleType } = useSelector((state) => state.users.users);
  const [AMCData, setAMCData] = useState({
    customerDetails: {
      customerName: "",
      address: "",
      customerGst: "",
      contact: "",
      stateCode: "",
      email: "",
      pan: "",
      zipCode: "",
    },
    vehicleDetails: {
      model: "",
      fuelType: "",
      vinNumber: "",
      agreementPeriod: "",
      agreementStartDate: "",
      agreementValidDate: "",
      agreementStartMilage: "",
      agreementValidMilage: "",
      MaximumValidPMS: "",
      dealerLocation: "",
      total: "",
      rmEmail: "",
      gmEmail: "",
    },
    createdBy: _id,
  });

  const rightFields = [
    {
      name: "customerName",
      type: "text",
      placeholder: "Customer Name",
      label: "Customer Name",
    },
    {
      name: "contact",
      type: "number",
      placeholder: "Contact",
      label: "Contact",
    },
    {
      name: "pan",
      type: "text",
      placeholder: "Pan Number",
      label: "Pan Number",
    },
    {
      name: "zipCode",
      type: "number",
      placeholder: "Zip Code",
      label: "Zip Code",
    },
  ];
  const leftFields = [
    { name: "address", type: "text", placeholder: "Address", label: "Address" },
    { name: "email", type: "email", placeholder: "Email", label: "Email" },
    {
      name: "customerGst",
      type: "text",
      placeholder: "Customer Gst",
      label: "Customer Gst",
    },
    {
      name: "stateCode",
      type: "text",
      placeholder: "State Code",
      label: "State Code",
    },
  ];
  const rightVehicleFields = [
    {
      name: "vinNumber",
      type: "number",
      placeholder: "Vin Number",
      label: "Vin Number",
    },
    {
      name: "agreementStartDate",
      type: "date",
      placeholder: "Agreement Start Date",
      label: "Agreement Start Date",
    },
    {
      name: "agreementStartMilage",
      type: "text",
      placeholder: "Agreement Start Milage",
      label: "Agreement Start Milage",
    },
    {
      name: "MaximumValidPMS",
      type: "text",
      placeholder: "Maximum Valid Number of PMS",
      label: "Maximum Valid Number of PMS",
    },
    {
      name: "total",
      type: "number",
      placeholder: "Total Amount",
      label: "Total Amount",
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
      name: "model",
      type: "select",
      placeholder: "Model",
      label: "Model",
      options: modelOption,
    },
    {
      name: "fuelType",
      type: "select",
      placeholder: "Fuel Type",
      label: "Fuel Type",
      options: fuelType,
    },
    {
      name: "agreementPeriod",
      type: "number",
      placeholder: "Agreement Period",
      label: "Agreement Period",
    },
    {
      name: "agreementValidDate",
      type: "date",
      placeholder: "Agreement Valid Date",
      label: "Agreement Valid Date",
    },
    {
      name: "agreementValidMilage",
      type: "number",
      placeholder: "Agreement Valid Milage",
      label: "Agreement Valid Milage",
    },
    {
      name: "dealerLocation",
      type: "text",
      placeholder: "Location of the Dealer",
      label: "Location of the Dealer",
    },
    {
      name: "rmEmail",
      type: "email",
      placeholder: "Regional Manager Email",
      label: "Regional Manager Email",
    },
  ];
  const [errors, setErrors] = useState({});
  const id = location?.state?.docId;

  const handleInput = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset?.section;

    setAMCData((prev) => {
      const updatedSection = {
        ...prev[section],
        [name]: value,
      };

      if (name === "agreementPeriod" || name === "agreementStartDate") {
        const agreementPeriod = parseFloat(
          name === "agreementPeriod" ? value : updatedSection.agreementPeriod
        );
        const agreementStartDate =
          name === "agreementStartDate"
            ? value
            : updatedSection.agreementStartDate;

        if (agreementPeriod && agreementStartDate) {
          const validDate = new Date(agreementStartDate);

          const years = Math.floor(agreementPeriod);
          const months = Math.round((agreementPeriod - years) * 12);

          validDate.setFullYear(validDate.getFullYear() + years);
          validDate.setMonth(validDate.getMonth() + months);

          updatedSection.agreementValidDate = validDate
            .toISOString()
            .split("T")[0];
        }
      }

      // Calculate `agreementValidMilage` if necessary fields are available
      if (
        name === "agreementPeriod" ||
        name === "agreementStartMilage" ||
        name === "fuelType" ||
        name === "model"
      ) {
        const agreementPeriod = parseFloat(
          name === "agreementPeriod" ? value : updatedSection.agreementPeriod
        );
        const agreementStartMilage = parseInt(
          name === "agreementStartMilage"
            ? value
            : updatedSection.agreementStartMilage,
          10
        );
        const fuelType = name === "fuelType" ? value : updatedSection.fuelType;
        const model = name === "model" ? value : updatedSection.model;

        if (agreementPeriod && agreementStartMilage && fuelType) {
          const mileageMultiplier =
            fuelType === "petrol"
              ? 10000
              : fuelType === "Electric Vehicle" && (model === "Comet" ||
                model === "ZS EV")
              ? 10000
              : fuelType === "Electric Vehicle" && model === "Windsor"
              ? 15000
              : 15000;

          updatedSection.agreementValidMilage =
            agreementStartMilage + agreementPeriod * mileageMultiplier;
        }
      }

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  const validateFields = () => {
    const newErrors = {};

    // Customer Details Validation
    const {
      customerName,
      address,
      customerGst,
      contact,
      stateCode,
      email,
      pan,
      zipCode,
    } = AMCData.customerDetails;

    if (!customerName) newErrors.customerName = "Customer name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!customerGst) newErrors.customerGst = "Customer GST is required.";
    if (!/^\d{10}$/.test(contact))
      newErrors.contact = "Contact must be a valid 10-digit number.";
    if (!stateCode) newErrors.stateCode = "State code is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email must be valid.";
    // if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) newErrors.pan = "PAN must be valid.";
    if (!/^\d{6}$/.test(zipCode))
      newErrors.zipCode = "Zip Code must be a 6-digit number.";

    // Vehicle Details Validation
    const {
      model,
      vinNumber,
      agreementPeriod,
      agreementStartDate,
      agreementValidDate,
      agreementStartMilage,
      agreementValidMilage,
      MaximumValidPMS,
      dealerLocation,
      total,
    } = AMCData.vehicleDetails;

    if (!model) newErrors.model = "Model is required.";
    if (!vinNumber) newErrors.vinNumber = "VIN number is required.";
    if (!agreementPeriod)
      newErrors.agreementPeriod = "Agreement period is required.";
    if (!agreementStartDate)
      newErrors.agreementStartDate = "Agreement start date is required.";
    if (!agreementValidDate)
      newErrors.agreementValidDate = "Agreement valid date is required.";
    if (!/^\d+$/.test(agreementStartMilage))
      newErrors.agreementStartMilage = "Start mileage must be a number.";
    if (!/^\d+$/.test(agreementValidMilage))
      newErrors.agreementValidMilage = "Valid mileage must be a number.";
    if (!/^\d+$/.test(MaximumValidPMS))
      newErrors.MaximumValidPMS = "PMS must be a number.";
    if (!dealerLocation)
      newErrors.dealerLocation = "Dealer location is required.";
    if (!/^\d+(\.\d{1,2})?$/.test(total))
      newErrors.total = "Total must be a valid number.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchamcDataById({ id, option: null }));
    }
  }, [id]);
  useEffect(() => {
    setAMCData((prev) => ({
      ...prev,
      ...amcByIdorStatus?.data,
    }));
  }, [amcByIdorStatus?.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      console.log("Form data is valid:", AMCData);
    } else {
      console.log("Validation errors:", errors);
      toast.error("Form data is invalid");
      return;
    }
    try {
      let res;
      res = id ? await updateAMC(AMCData, id) : await addNewAMC(AMCData);
      toast.success(res?.message || "Buyback Added successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="fixed">
        <div className="absolute">
          {roleType === "0" ? <Nav /> : roleType === "2" ? <SideNav /> : null}
        </div>
      </div>
      <div>
        <Header />
      </div>
      <span className="flex md:flex-row flex-col md:items-center justify-between md:mx-36 mx-6 font-head pt-10 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[14%] sm:ml-[25%]">
          {id ? "Update AMC" : "Add New AMC"}
        </p>
        <p className="md:text-[18px] text-[16px] font-medium md:pt-12 pt-4 sm:ml-[25%]">
          AMC Issue Date -{" "}
          {id ? formatDate(amcByIdorStatus?.data?.createdAt) : formattedDate}
        </p>
      </span>

      <div className="sm:ml-[26.5%] md:ml-[21%]  w-full">
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Personal Details
        </p>
        <GroupedInput
          leftFields={leftFields}
          rightFields={rightFields}
          stateName={AMCData.customerDetails}
          errors={errors || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "customerDetails" } },
            });
          }}
        />
        <p className="text-[20px] font-head font-semibold mt-5">
          Vehicle Details
        </p>

        <GroupedInput
          leftFields={leftVehicleFields}
          rightFields={rightVehicleFields}
          stateName={AMCData.vehicleDetails}
          errors={errors || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "vehicleDetails" } },
            });
          }}
        />
        <div
          onClick={handleSubmit}
          className="bg-primary text-white mt-16 rounded-md px-6 py-2 cursor-pointer w-28 text-center mb-20"
        >
          Submit
        </div>
      </div>
    </>
  );
};

export default AMCForm;
