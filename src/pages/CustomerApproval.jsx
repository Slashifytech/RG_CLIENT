import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { colorLogo, greenCheck } from "../assets";
import { approvalByCustomer } from "../features/DocumentApi";

const CustomerApproval = () => {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isdecodedEmail, setIsDecodedEmail] = useState(false);

  const [searchParams] = useSearchParams();
  const [submissionComplete, setSubmissionComplete] = useState(false);

  useEffect(() => {
    // Retrieve the expiration time and encoded email from query parameters
    const expires = searchParams.get("noav");
    const encodedEmail = searchParams.get("efall");
    const currentTime = Math.floor(Date.now() / 1000);
  
    // Check if the link is expired
    if (expires && currentTime > parseInt(expires)) {
      setIsExpired(true);
    }
  
    // Decode the email if available
    if (encodedEmail) {
      try {
        const decodedEmail = atob(decodeURIComponent(encodedEmail)); 
        setIsDecodedEmail(decodedEmail)
      } catch (error) {
        console.error("Error decoding email:", error);
        toast.error("Failed to decode email. Please check the link.");
      }
    }
  }, [searchParams]);
  
 

  const handleSubmit = async () => {
    if (!isChecked) {
      toast.info("You must agree to the terms before submitting.");
      return;
    }

    if (!email) {
      toast.info("Please enter your email.");
      return;
    }
    if (email !== isdecodedEmail) {
        toast.error("You are not authorized for this link.");
        return;
      }
    

    try {
      const res = await approvalByCustomer("approved", email);
      toast.success(res?.message || "Status Updated Successfully");
      setSubmissionComplete(true); 
    } catch (error) {
      console.error("Error in documentStatus:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold">This link has expired.</p>
        <p className="text-sm mt-2">Please request a new link to access this page.</p>
      </div>
    );
  }

  if (submissionComplete) {
    return (
        <>
        <img
        src={colorLogo}
        alt="logo"
        loading="lazy"
        className="w-36 h-28 mb-4 ml-6 mt-6"
      />
      <div className="flex flex-col items-center justify-center mt-20">
        <img
          src={greenCheck}
          alt="logo"
          loading="lazy"
          className=" mb-4"
        />
        <p className="text-lg font-semibold mt-6">Thank you for your approval!</p>
        <p className="text-sm mt-2">
          Your response has been recorded successfully.
        </p>
      </div>
      </>
    );
  }

  return (
    <>
      <img src={colorLogo} alt="logo" loading="lazy" className="w-36 h-28 ml-6 mt-6" />
      <div className="bg-[#F8F8FF] md:px-16 px-9 py-14 rounded-lg mt-20 md:mx-96 mx-6 sm:mx-36">
        <p>Enter policy and invoice generated email id</p>
        <input
          type="text"
          placeholder="Email"
          className="px-3 py-2 rounded-md bg-[#d6d6d6] w-full mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="termsCheckbox" className="text-sm">
            I agree to the 360 policy terms and conditions that mentioned in the document.
          </label>
        </div>
        <div
          className="text-center mt-6 rounded-md px-6 py-2 bg-primary text-white cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </div>
      </div>
    </>
  );
};

export default CustomerApproval;
