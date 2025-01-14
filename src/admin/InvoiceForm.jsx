import { useEffect, useState } from "react";
import { CustomInput, FileUpload, GroupedInput, SelectInput } from "../Components/Input";
import { createdDate, roundToTwoDecimalPlaces } from "../helper/commonHelperFunc";
import Nav from "./Nav";
import { invoiceOption } from "../data";
import { toast } from "react-toastify";
import { addNewInovoice, editInovoice } from "../features/adminApi";
import { v4 as uuidv4 } from 'uuid';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import { storage } from "../../Util/fireBase";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchInvoiceById } from "../features/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
const InvoiceForm = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate  = useNavigate()
  const {invoiceById} = useSelector((state)=>state.invoice)
  const {users} = useSelector((state)=>state.users)

  const createdBy = users?._id
  const invoiceId = location?.state
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: "",
    email: "",
    billingDetail: {
      address: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
      stateCode: "",
      pan: "",
      contact: "",
      gstRegType:"",
      gstInNumber:"",
    },
    deliveryDetails: {
      address: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
      stateCode: "",
      pan: "",
      contact: "",
      gstRegType:"",
      gstInNumber:"",
    },
    supplyDetails: {
      address: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
      stateCode: "",
      pan: "",
      contact: "",
      gstRegType:"",
      gstInNumber:"",
    },
    vehicleDetails: {
      vehnumber: "",
      vinnumber: "",
      enginenumber: "",
      vehiclemodel: "",
      totalpriceinfigure: "",
      totalpriceinvalue: "",
      reversechargeapplication: "",
      warrantystartdate: "",
      warrantyenddate: "",
    },
    customerBillingDetails: {
      description: "",
      hsnCode: "",
      quantity: "",
      rate: "",
      total: "",
      discount: "",
      taxValue: "",
      igstpercentage: "",
      sgstpercentage: "",
      cgstpercentage: "",
      cesspercentage: "",
      ugstpercentage: "",
      cgst: "",
      sgst: "",
      cess: "",
      igst: "",
      ugst: "",
      totalinvoiceamount: "",
      totalpriceinvalue:""
    },
    invoicecopydocument: "",
    pancard: "",
    gstcertificate: "",
    paymentproof: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [sameAsSupply, setSameAsSupply] = useState(false);

  const [errors, setErrors] = useState({});
  const formattedDate = createdDate();
  const rightFields = [
    { name: "city", type: "text", placeholder: "City", label: "City" },
    { name: "country", type: "text", placeholder: "Country", label: "Country" },
    { name: "stateCode", type: "text", placeholder: "State Code", label: "State Code" },
    { name: "contact", type: "text", placeholder: "Contact", label: "Contact" },
    { name: "gstInNumber", type: "text", placeholder: "GSTIN", label: "GSTIN" },

  ];
  const leftFields = [
    { name: "address", type: "text", placeholder: "Address", label: "Address" },
    { name: "state", type: "text", placeholder: "State", label: "State" },
    { name: "zipCode", type: "text", placeholder: "Zip Code", label: "Zip Code" },
    { name: "pan", type: "text", placeholder: "PAN", label: "PAN" },
    { name: "gstRegType", type: "text", placeholder: "GST Registration Type", label: "GST Reg. Type" },

  ];
  const rightCustomerBillingFields = [
    { name: "hsnCode", type: "text", placeholder: "HSN/SAC Code", label: "HSN/SAC Code" },
    { name: "rate", type: "number", placeholder: "Rate", label: "Rate" },
    { name: "discount", type: "number", placeholder: "Discount %", label: "Discount %" },
    { name: "cgstpercentage", type: "number", placeholder: "CGST %", label: "CGST %" },
    { name: "sgstpercentage", type: "number", placeholder: "SGST %", label: "SGST %" },
    { name: "igstpercentage", type: "number", placeholder: "IGST %", label: "IGST %" },
    { name: "ugstpercentage", type: "number", placeholder: "UGST %", label: "UGST %" },
    { name: "cesspercentage", type: "number", placeholder: "CESS %", label: "CESS %" },
    { name: "totalinvoiceamount", type: "number", placeholder: "Total Invoice Amount", label: "Total Invoice Amount" },
  ];
  const leftCustomerBillingFields = [
    { name: "description", type: "text", placeholder: "Description", label: "Description of goods and Services" },
    { name: "quantity", type: "text", placeholder: "Quantity", label: "Quantity" },
    { name: "total", type: "number", placeholder: "Total", label: "Total" },
    { name: "taxValue", type: "text", placeholder: "Taxable Value", label: "Taxable Value" },
    { name: "cgst", type: "number", placeholder: "CGST Amount", label: "CGST Amount" },
    { name: "sgst", type: "number", placeholder: "SGST Amount", label: "SGST Amount" },
    { name: "igst", type: "number", placeholder: "IGST Amount", label: "IGST Amount" },
    { name: "ugst", type: "number", placeholder: "UGST Amount", label: "UGST Amount" },
    { name: "cess", type: "number", placeholder: "CESS Amount", label: "CESS Amount" },
  ];
  const rightVehicleFields = [
    { name: "vinnumber", type: "text", placeholder: "Vin Number", label: "Vin Number" },
    { name: "vehiclemodel", type: "text", placeholder: "Model", label: "Model" },
    { name: "totalpriceinvalue", type: "text", placeholder: "Total Price in Words", label: "Total Price in Value (in words) " },
    { name: "warrantystartdate", type: "date", placeholder: "Start Date", label: "Warranty Start Date" },
  ];
  const leftVehicleFields = [
    { name: "vehnumber", type: "text", placeholder: "Veh Number", label: "Veh Number" },
    { name: "enginenumber", type: "text", placeholder: "Engine Number", label: "Engine Number" },
    { name: "totalpriceinfigure", type: "number", placeholder: "Total Price in Figure", label: "Total Price in Value (in figure) " },
    { name: "reversechargeapplication", type: "text", placeholder: "Yes/No", label: "Whether Reverse charge applicable (Y/N)" },
    { name: "warrantyenddate", type: "date", placeholder: "End Date", label: "Warranty End Date" },


  ];
  const validateInput = (name, value) => {
    let error = "";

    // Required fields except billingDetail
    const requiredFields = [
      "invoiceType",
      "email",
      "deliveryDetails.address",
      "deliveryDetails.city",
      "deliveryDetails.country",
      "deliveryDetails.state",
      "deliveryDetails.zipCode",
      "deliveryDetails.contact",
      "vehicleDetails.vehnumber",
      "vehicleDetails.vinnumber",
      "vehicleDetails.enginenumber",
      "vehicleDetails.vehiclemodel",
      "vehicleDetails.totalpriceinfigure",
      "vehicleDetails.totalpriceinvalue",
      "customerBillingDetails.description",
      "customerBillingDetails.hsnCode",
      "customerBillingDetails.quantity",
      "customerBillingDetails.rate",
      "customerBillingDetails.total",
      "invoicecopydocument",
      "pancard",
      "gstcertificate",
      "paymentproof",
      "invoiceId",
    ];

    if (requiredFields.includes(name) && !value) {
      error = "This field is required";
      return error;
    }

    // Additional validation for specific fields
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    if (
      (name === "customerBillingDetails.quantity" ||
        name === "customerBillingDetails.rate" ||
        name === "vehicleDetails.totalpriceinfigure") &&
      isNaN(value)
    ) {
      error = "Must be a number";
    }

    return error;
  };
  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      "invoiceType",
      "email",
      "deliveryDetails.address",
      "deliveryDetails.city",
      "deliveryDetails.country",
      "deliveryDetails.state",
      "deliveryDetails.zipCode",
      "deliveryDetails.contact",
      "vehicleDetails.vehnumber",
      "vehicleDetails.vinnumber",
      "vehicleDetails.enginenumber",
      "vehicleDetails.vehiclemodel",
      "vehicleDetails.totalpriceinfigure",
      "vehicleDetails.totalpriceinvalue",
      "customerBillingDetails.description",
      "customerBillingDetails.hsnCode",
      "customerBillingDetails.quantity",
      "customerBillingDetails.rate",
      "customerBillingDetails.total",
      "invoicecopydocument",
      "pancard",
      "gstcertificate",
      "paymentproof",
      "invoiceId",
    ];
  
    requiredFields.forEach((field) => {
      const keys = field.split(".");
      const value = keys.reduce((obj, key) => obj[key], invoiceData); // Traverse nested object
      const error = validateInput(field, value);
      if (error) newErrors[field] = error;
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  
  
  const handleInput = (e) => {
    const { name, value, dataset } = e.target;
  
    const section = dataset?.section;
  
    // Validate the input
    const error = validateInput(name, value);
  
    setInvoiceData((prevState) => {
      let updatedCustomerBillingDetails = { ...prevState.customerBillingDetails };
      let updatedBillingDetail = { ...prevState.billingDetail };
      let updatedDeliveryDetails = { ...prevState.deliveryDetails };
      let updatedSupplyDetails = { ...prevState.supplyDetails };
      let updatedVehicleDetails = { ...prevState.vehicleDetails };
  
      // Check for updates in customerBillingDetails
      if (section === "customerBillingDetails") {
        // Update quantity and rate and calculate total
        if (name === "quantity" || name === "rate") {
          updatedCustomerBillingDetails[name] = value;
          updatedCustomerBillingDetails.total =
            (name === "quantity" ? value : updatedCustomerBillingDetails.quantity) *
            (name === "rate" ? value : updatedCustomerBillingDetails.rate);
        } else {
          updatedCustomerBillingDetails[name] = value;
        }
      }
  
  
      // Check which section to update based on dataset
      if (section) {
        switch (section) {
          case "billingDetail":
            updatedBillingDetail[name] = value;
            break;
          case "deliveryDetails":
            updatedDeliveryDetails[name] = value;
            break;
          case "supplyDetails":
            updatedSupplyDetails[name] = value;
            break;
          case "vehicleDetails":
            updatedVehicleDetails[name] = value;
            break;
          default:
            break;
        }
      } else {
        // Handle non-nested state updates directly
        if (!['quantity', 'rate'].includes(name)) {
          // If name is not related to nested state, update directly
          return {
            ...prevState,
            [name]: value, // For non-nested fields
            billingDetail: updatedBillingDetail,
            deliveryDetails: updatedDeliveryDetails,
            supplyDetails: updatedSupplyDetails,
            vehicleDetails: updatedVehicleDetails,
            customerBillingDetails: updatedCustomerBillingDetails,
          };
        }
      }
  
      return {
        ...prevState,
        billingDetail: updatedBillingDetail,
        deliveryDetails: updatedDeliveryDetails,
        supplyDetails: updatedSupplyDetails,
        vehicleDetails: updatedVehicleDetails,
        customerBillingDetails: updatedCustomerBillingDetails,
      };
    });
  
    // Update errors
    setErrors((prevErrors) => {
      if (section) {
        return {
          ...prevErrors,
          [section]: {
            ...(prevErrors[section] || {}),
            [name]: error,
          },
        };
      }
      return {
        ...prevErrors,
        [name]: error,
      };
    });
  };
  
  
  const handleCheckboxChange = (type) => {
    if (type === "billing") {
      setSameAsBilling((prev) => {
        if (!prev) {
          setInvoiceData((currentData) => ({
            ...currentData,
            deliveryDetails: { ...currentData.billingDetail },
          }));
        } else {
          // Clear delivery details when unchecked
          setInvoiceData((currentData) => ({
            ...currentData,
            deliveryDetails: {
              address: "",
              city: "",
              country: "",
              state: "",
              zipCode: "",
              pan: "",
              contact: "",
              stateCode: "",
              gstRegType:"",
              gstInNumber:"",
            },
          }));
        }
        return !prev;
      });
    }

    if (type === "supply") {
      setSameAsSupply((prev) => {
        if (!prev) {
          setInvoiceData((currentData) => ({
            ...currentData,
            supplyDetails: { ...currentData.billingDetail },
          }));
        } else {
          // Clear supply details when unchecked
          setInvoiceData((currentData) => ({
            ...currentData,
            supplyDetails: {
              address: "",
              city: "",
              country: "",
              state: "",
              zipCode: "",
              pan: "",
              contact: "",
              stateCode: "",
              gstRegType:"",
              gstInNumber:"",
            },
          }));
        }
        return !prev;
      });
    }
  };

  const handlePercentageInput = (name, value) => {
    setInvoiceData((prev) => {
      const formattedValue = roundToTwoDecimalPlaces(value);
      // Deep copy the state
      const updatedCustomerBillingDetails = { ...prev.customerBillingDetails };
      const updatedVehicleDetails = { ...prev.vehicleDetails };

  
      // Update the entered percentage value
      updatedCustomerBillingDetails[name] = formattedValue;
  
      // Calculate discount
      if (name === "discount") {
        const discountAmount =roundToTwoDecimalPlaces(
          (value / 100) * updatedCustomerBillingDetails.total);
        updatedCustomerBillingDetails.taxValue =roundToTwoDecimalPlaces(
          updatedCustomerBillingDetails.total - discountAmount);
      } else {
        // Calculate taxes based on percentages
        const taxFields = {
          igstpercentage: "igst",
          sgstpercentage: "sgst",
          cgstpercentage: "cgst",
          cesspercentage: "cess",
          ugstpercentage: "ugst",
        };
  
        if (taxFields[name]) {
          updatedCustomerBillingDetails[taxFields[name]] = roundToTwoDecimalPlaces(
            (value / 100) * updatedCustomerBillingDetails.taxValue);
        }
      }
  
      // Recalculate the total invoice amount
      updatedCustomerBillingDetails.totalinvoiceamount = roundToTwoDecimalPlaces(
        parseFloat(updatedCustomerBillingDetails.taxValue || 0) +
        parseFloat(updatedCustomerBillingDetails.cgst || 0) +
        parseFloat(updatedCustomerBillingDetails.sgst || 0) +
        parseFloat(updatedCustomerBillingDetails.igst || 0) +
        parseFloat(updatedCustomerBillingDetails.ugst || 0) +
        parseFloat(updatedCustomerBillingDetails.cess || 0)
      );

     updatedVehicleDetails.totalpriceinfigure =  updatedCustomerBillingDetails.totalinvoiceamount
      
      // Return updated state
      return {
        ...prev,
        customerBillingDetails: updatedCustomerBillingDetails,
        vehicleDetails: updatedVehicleDetails
      };
    });
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (["discount", "cgstpercentage", "sgstpercentage", "igstpercentage", "cesspercentage", "ugstpercentage"].includes(name)) {
      // Ensure percentage input is handled

      handlePercentageInput(name, parseFloat(value) || 0); 
    } else {
      handleInput(e); // For other fields
    }
  };
  
  

  const handleFileSelect = async (name, file) => {
    // console.log("Selected file:", file);
    if (!file) return;

    // const storageRef = ref(storage, `files/${file?.name}`);
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `files/invoice/${uniqueFileName}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded file:", snapshot);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File available at:", downloadURL);

      setInvoiceData((prevData) => ({
        ...prevData,
        [name]: downloadURL,
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    }
  };

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;

    const storageRef = ref(storage, fileUrl);

    try {
      // toast.success("File deleted successfully!");

      if (uploadType === "invoicecopydocument") {
        setInvoiceData((prevData) => ({
          ...prevData,
          invoicecopydocument: "",
        }));
      } else if (uploadType === "paymentproof") {
        setInvoiceData((prevData) => ({
          ...prevData,
          paymentproof: "",
        }));
      } else if (uploadType === "gstcertificate") {
        setInvoiceData((prevData) => ({
          ...prevData,
          gstcertificate: "",
        }));
      } else if (uploadType === "pancard") {
        setInvoiceData((prevData) => ({
          ...prevData,
          pancard: "",
        }));
      }
      await deleteObject(storageRef);

    } catch (error) {
      console.error("Error deleting file:", error);
      // toast.error("Error deleting file. Please try again.");
    }
  };

  useEffect(()=>{
      dispatch(fetchInvoiceById({invoiceId}))
  }, [])
  useEffect(()=>{
    setInvoiceData((prev)=>({
      ...prev,
      ...invoiceById?.invoice 
    }))
  }, [invoiceById?.invoice])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const isValid = validateAllFields();
  
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
    const role = localStorage.getItem("roleType")
    try {
      let res;
    
      if (invoiceId) {
        res = await editInovoice(payload, invoiceId);
        toast.success(res?.message || "Invoice updated successfully");
      } else {
        res = await addNewInovoice(payload, role);
        toast.success(res?.message || "Invoice added successfully");
      }
   
    
  navigate('/admin/invoice-lists')
    
    }catch(error){
      console.log(error)
      toast.error(error.response.data.message || "Something went wrong")
    }
  }
  return (
    <>
      <div className="fixed">
        <span className="absolute">{<Nav />}</span>
      </div>
      <span className="flex md:flex-row flex-col md:items-center justify-between md:mx-36 mx-6 font-head md:pt-0 pt-12 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[13%] sm:ml-[34%]">
          Add New Inovaice
        </p>
        <p className="md:text-[18px] text-[16px] font-medium md:pt-12 pt-4 sm:ml-[34%]">
          Invoice Issue Date - {formattedDate}
          {/* id ? formatDate(isCreatedDate) :  */}
        </p>
      </span>
      <div className="ml-[21%]  w-full">
        <span className="flex items-center w-full gap-20">
          <span className=" w-[30%]">
            <SelectInput
              label="Invoice Type"
              title="Invoice Type"
              customClass=" w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
              options={invoiceOption}
              name="invoiceType"
              value={invoiceData.invoiceType}
              onChange={handleInput}
              placeholder="Select Invoice Type"
            />
          </span>
          <span className=" w-[30%]">
            <CustomInput
              imp={true}
              title="Email"
              className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
              type="email"
              name="email"
              placeHolder="Email"
              value={invoiceData.email}
              onChange={handleInput}
              errorMessage={errors.email}
            />
          </span>
        </span>
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Bill to Details
        </p>

        <GroupedInput
           leftFields={leftFields}
           rightFields={rightFields}
          stateName={invoiceData.billingDetail}
          errors={errors.billingDetail || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "billingDetail" } },
            });
          }}
        />
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Place of Supply Details
        </p>
        <div className="mt-5 flex items-center gap-2 ">
          <input
          
            type="checkbox"
            id="sameAsSupply"
            checked={sameAsSupply}
            onChange={() => handleCheckboxChange("supply")}
          />
          <label htmlFor="sameAsSupply">Same as above</label>
          </div>
        <GroupedInput
        leftFields={leftFields}
        rightFields={rightFields}
          stateName={invoiceData.supplyDetails}
          errors={errors.supplyDetails || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "supplyDetails" } },
            });
          }}
        />
        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Place of Delivery Details
        </p>
       
          <div className="mt-5 flex items-center gap-2 ">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={() => handleCheckboxChange("billing")}
          />
          <label htmlFor="sameAsBilling">Same as above</label>
        </div>
        
        <GroupedInput
        leftFields={leftFields}
        rightFields={rightFields}
          stateName={invoiceData.deliveryDetails}
          errors={errors.deliveryDetails || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "deliveryDetails" } },
            });
          }}
        />

        <p className="text-[20px] font-head font-semibold mt-5">
          Customer Billing Details
        </p>

        <GroupedInput
        leftFields={leftCustomerBillingFields}
        rightFields={rightCustomerBillingFields}
          stateName={invoiceData.customerBillingDetails}
          errors={errors.customerBillingDetails || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleChange({
              target: { name, value, dataset: { section: "customerBillingDetails" } },
            });
          }}
        />
                <p className="text-[20px] font-head font-semibold mt-5">
        Vehicle Details
        </p>
{console.log(errors)}
        <GroupedInput
        leftFields={leftVehicleFields}
        rightFields={rightVehicleFields}
          stateName={invoiceData.vehicleDetails}
          errors={errors?.vehicleDetails || {}}
          onChange={(e) => {
            const { name, value } = e.target;
            handleInput({
              target: { name, value, dataset: { section: "vehicleDetails" } },
            });
          }}
        />
        <p className="text-[15px] font-head font-medium mt-5">
        Declaration/ Terms and Conditions:-
        </p>
        <p className="text-[13px] font-head font-medium mt-2">
        Above package can be availed only at all branches of Silver Star <br />
        (Hyderabad,Vizag,Pune,Kolhapur,Nashik,Aurangabad)
        </p>


        <div className="flex   items-baseline gap-20 w-full">
            <span className="w-[30%] ">
              <FileUpload
              imp={true}
                label="Upload Inovoice Copy"
                onFileSelect={(file) =>
                  handleFileSelect("invoicecopydocument", file)
                }
                deleteFile={() =>
                  deleteFile(
                    invoiceData.invoicecopydocument,
                    "invoicecopydocument"
                  )
                }
                name="invoicecopydocument"
                fileUrl={invoiceData.invoicecopydocument}
              />
              {errors.invoicecopydocument && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.invoicecopydocument}
                </p>
              )}
              <div className="mt-4">
                <FileUpload
                imp={true}
                  label="Upload Pan Card Copy"
                  onFileSelect={(file) =>
                    handleFileSelect("pancard", file)
                  }
                  deleteFile={() =>
                    deleteFile(
                      invoiceData.pancard,
                      "pancard"
                    )
                  }
                  name="pancard"
                  fileUrl={invoiceData.pancard}
                />
                {errors.pancard && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.pancard}
                  </p>
                )}
              </div>
            </span>
            <span className="w-[30%] ">
              <FileUpload
              imp={true}
                label="Upload GST Certificate Soft Copy"
                onFileSelect={(file) =>
                  handleFileSelect("gstcertificate", file)
                }
                deleteFile={() =>
                  deleteFile(
                    invoiceData.gstcertificate,
                    "gstcertificate"
                  )
                }
                name="gstcertificate"
                fileUrl={invoiceData.gstcertificate}
              />
              {errors.gstcertificate && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.gstcertificate}
                </p>
              )}
              <div className="mt-4">
                <FileUpload
                imp={true}
                  label="Upload Payment Proof*"
                  onFileSelect={(file) =>
                    handleFileSelect("paymentproof", file)
                  }
                  deleteFile={() =>
                    deleteFile(
                      invoiceData.paymentproof,
                      "paymentproof"
                    )
                  }
                  name="paymentproof"
                  fileUrl={invoiceData.paymentproof}
                />
                {errors.paymentproof && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.paymentproof}
                  </p>
                )}
              </div>
            </span>
          </div>
<div className="mt-9 mb-20">
          <span onClick={handleSubmit} className="bg-primary text-white px-6 rounded-md py-2 cursor-pointer"> 
            Submit
          </span></div>
      </div>
    </>
  );
};

export default InvoiceForm;
