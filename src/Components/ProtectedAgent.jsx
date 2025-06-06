import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedAgent = ({ children }) => {
  const roleType = localStorage.getItem("roleType");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center md:ml-32 sm:ml-20 md:mt-48 mt-60 sm:mt-80">
        <Loader />
      </div>
    );
  }

  if (roleType !== "2") {
    return <Navigate to="/360policy/login" replace={true} />;
  }

  return children;
};

export default ProtectedAgent;
