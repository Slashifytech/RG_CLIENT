import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateEmail } from "../features/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomInput, PasswordField } from "../Components/Input";
import { greenCheck } from "../assets";
import { fetchUsers } from "../features/getUserSlice";
import Header from "../Components/Header";
import Nav from "./Nav";

const ChangeEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    newEmail: "",
    confirmEmail: "",
    password: "",
  });

  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const { newEmail, confirmEmail, password } = formData;
  const { _id, email } = useSelector((state) => state.users.users);

  const { getAdminProfile } = useSelector((state) => state.admin);
  const userId = _id;
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const toggleConPasswordVisibility = () => setShowConPassword((prev) => !prev);

  const handleSubmit = async () => {
    if (!newEmail || !confirmEmail || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.error("Invalid email format");
      return;
    }

    if (newEmail !== confirmEmail) {
      toast.error("Email addresses do not match");
      return;
    }

    const payload = {
      email: newEmail,
      password,
      id: userId,
    };

    try {
      const res = await updateEmail(payload);
      toast.success(
        res.message ||
          " Your registered email has been successfully updated. Please log in using your new email to regain access to your account"
      );
      dispatch(fetchUsers());
      if (res.statusCode === 200) {
        setIsEmailChanged(true);
        setTimeout(() => {
          navigate("/raam-group/login");
          localStorage.removeItem("userAuthToken");
          localStorage.removeItem("role");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <Nav />
        </span>
      </div>
      <div className="bg-white ">
        <span className="flex items-center pt-16 md:ml-[16.5%] sm:ml-[22%]">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9 pb-3">
              Change Email Address
            </p>
          </span>
        </span>
      </div>

      {!isEmailChanged ? (
        <div className="bg-white font-poppins rounded-md md:mx-72 mt-12 md:ml-[32%] sm:ml-[32%] sm:mx-20 py-6 px-12 mb-16">
          {/* New Email Input */}
          <div className="mt-5">
            <CustomInput
              type="email"
              title={"New Email"}
              name="newEmail"
              className="h-11 md:w-full sm:w-full rounded-md text-body bg-input pl-3 border border-[#E8E8E8] outline-none"
              placeHodler="Enter new Email Address"
              value={newEmail}
              onChange={handleInput}
            />
          </div>

          {/* Confirm Email Input */}
          <div className="mt-5">
            <CustomInput
              type="email"
              title={"Confirm New Email"}
              name="confirmEmail"
              className="h-11 md:w-full sm:w-full rounded-md text-body bg-input pl-3 border border-[#E8E8E8] outline-none"
              placeHodler="Confirm new Email Address"
              value={confirmEmail}
              onChange={handleInput}
            />
          </div>
          <p className="text-body font-normal text-[13px] mt-2">
            {" "}
            Current Email: <span className="font-medium"> {email}</span> <br />
            Enter a new email address for your SOV account
          </p>
          {/* Password Input */}
          <div className="mt-5">
            <PasswordField
              name="password"
              value={password}
              handleInput={handleInput}
              label="Enter Your Password"
              showPassword={showConPassword}
              toggleVisibility={toggleConPasswordVisibility}
            />
          </div>

          {/* Submit Button */}
          <div
            onClick={handleSubmit}
            className="bg-primary text-white cursor-pointer px-6 py-2 text-center rounded-md mt-5"
          >
            Submit
          </div>
        </div>
      ) : (
        <div className="bg-white py-6 mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[30%] mt-12 text-[20px] sm:mx-[22%] text-secondary">
          <div className="flex flex-col justify-center w-full items-center">
            <img
              src={greenCheck}
              alt="Success"
              loading="lazy"
              className="w-24 h-24"
            />
            <p className="text-black font-poppins text-[22px] mt-6">
              Email changed successfully!
            </p>
            <p className="text-green-500 font-poppins text-[16px]">
              We’re redirecting you to the login page...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeEmail;
