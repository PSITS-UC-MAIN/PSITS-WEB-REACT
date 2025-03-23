import backendConnection from "../api/backendApi";
import { setInformationData } from "./Authentication";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";

const PrivateRouteStudent = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("Token");
  const checkAuthentication = async () => {
    try {
      const response = await axios.get(
        `${backendConnection()}/api/protected-route-student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInformationData(response.data.user, response.data.user.role);
      if (response.data.user.role === "Student") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Not authorized:");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="flex justify-center items-center h-60vh">
          <InfinitySpin
            visible={true}
            width={200}
            color="#0d6efd"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
};

export default PrivateRouteStudent;
