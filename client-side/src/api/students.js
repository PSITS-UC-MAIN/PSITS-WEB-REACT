import "../App.css";
import { showToast } from "../utils/alertHelper";
import backendConnection from "./backendApi";
import axios from "axios";

const token = sessionStorage.getItem("Token");

export const requestMembership = async (id_number) => {
  try {
    // console.log("Sending request for ID:", id_number);
    const response = await axios.put(
      `${backendConnection()}/api/students/request`,
      { id_number },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      showToast("success", response.data.message);
      //window.location.reload();
    } else {
      showToast("error", response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      showToast("error", error.response.data.message || "An error occurred");
    } else {
      showToast("error", "An error occurred");
    }
    console.error("Error:", error);
  }
};

export const getMembershipStatusStudents = async (id_number) => {
  try {
    const response = await axios.get(
      `${backendConnection()}/api/students/get-membership-status/${id_number}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      // console.log(response.data.message);
      // window.location.reload();
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response.data.message);

      // window.location.reload();
    } else {
      console.log(error.response.data.message);
      //window.location.reload();
    }
    console.error("Error:", error);
    //window.location.reload();
  }
};

export const addToCartApi = async (formData) => {
  try {
    const response = await axios.post(
      `${backendConnection()}/api/cart/add-cart`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      showToast("error", error.response.data.message || "An error occurred");
    } else {
      showToast("error", "An error occurred");
    }
    console.error("Error:", error);
  }
};

export const viewCart = async (id_number) => {
  try {
    const response = await axios.get(
      `${backendConnection()}/api/cart/view-cart`,
      {
        params: { id_number },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteItem = async (data) => {
  try {
    const response = await axios.put(
      `${backendConnection()}/api/cart/delete-item-cart`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      showToast("success", response.data.message);
      window.location.reload();
    } else {
      showToast("error", response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error:", error);
    } else {
      console.error("Error:", error);
    }
    console.error("Error:", error);
  }
};

///fetch-specific-student/:id_number

export const fetchSpecificStudent = async (id_number) => {
  try {
    const response = await axios.get(
      `${backendConnection()}/api/fetch-specific-student/${id_number}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error:", error);
    } else {
      console.error("Error:", error);
    }
    console.error("Error:", error);
  }
};
