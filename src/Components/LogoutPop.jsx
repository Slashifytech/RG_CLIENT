import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";


const LogoutPop = ({ isLogoutOpen, closeLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/360policy/login");
    closeLogout();
  };

  useEffect(() => {
    if (isLogoutOpen) {
      Swal.fire({
        title: "Do you want to logout?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#6149CD",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        backdrop: true,
        customClass: {
          popup: "font-poppins text-sm",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
          actions: "swal-actions", 
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout();
        } else {
          closeLogout();
        }
      });
    }
  }, [isLogoutOpen]);

  return null;
};

export default LogoutPop;
