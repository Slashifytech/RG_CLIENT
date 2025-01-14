import React, { useState } from "react";
import { logo } from "../assets";
import { signin, useAuth } from "../features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../features/getUserSlice";
import { FaRegEyeSlash, FaRegEye  } from "react-icons/fa6";
import Mobile from "../Components/MobileUI";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginCred, setLoginCred] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { value, name, type } = e.target;
    setLoginCred((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await dispatch(
          signin({ email: loginCred?.email, password: loginCred?.password })
        );
        if (res?.payload?.token) {
          toast.success("Login Successful");

          dispatch(fetchUsers());

          if (res?.payload?.user?.roleType === "0") {
            navigate("/admin/dashboard");
          } else if (
            res?.payload?.user?.roleType === "2" 
          ) {
            navigate("/agent-dashboard");
          }
           else if (
            res?.payload?.user?.roleType === "1" 
          ) {
            navigate("/admin/active-policy");
          }
        } else {
          toast.error("Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
    <Mobile/>
      <div className="bg-Image h-screen hidden sm:block md:block">
        <div>
          <img src={logo} alt="" loading="lazy" className="w-44 h-32" />
        </div>

        <div className="bg-secondary md:mt-6 sm:mt-28 mt-20  flex flex-col justify-center md:mx-[30%] mx-6 sm:mx-36  p-14  rounded-md">
          <span className="font-semibold">
            Email <span className="text-red-500">*</span>
          </span>
          <input
            type="email"
            name="email"
            className="bg-input w-full px-3 py-3 mt-2 rounded-md outline-none"
            placeholder="Email"
            onChange={handleInput}
          />
          <span className="font-semibold mt-6">
            Password <span className="text-red-500">*</span>
          </span>
          <div className="pt-3 pb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="bg-input w-full px-3 py-3  rounded-md outline-none"
              placeholder="Password"
              onChange={handleInput}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 top-0 text-[20px] flex items-center"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="bg-primary text-white rounded-md py-3 mt-9"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
