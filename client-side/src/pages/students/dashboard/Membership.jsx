import {
  requestMembership,
  getMembershipStatusStudents,
} from "../../../api/students";
import { getInformationData } from "../../../authentication/Authentication";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Membership({ styles }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState({
    membership: "",
    renew: "",
  });
  const token = sessionStorage.getItem("Token");

  const user = getInformationData();
  const fetchStatus = async () => {
    try {
      const status = await getMembershipStatusStudents(user.id_number);
      if (status) {
        setMembershipStatus({
          membership: status?.membership || "",
          renew: status?.renew || "",
        });
      }
    } catch (error) {
      console.error("Error fetching membership status:", error);
      setMembershipStatus({ membership: "", renew: "" });
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchStatus();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const request = async () => {
    try {
      await requestMembership(user.id_number);
    } catch (error) {
      console.error("Error requesting membership:", error);
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className={`${styles} bg-[#074873] p-3 sm:p-4 rounded-lg shadow-md text-center text-neutral-light`}
    >
      <h1 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
        {membershipStatus.renew === "Accepted" ||
        (membershipStatus.membership === "Accepted" &&
          membershipStatus.renew !== "None" &&
          membershipStatus.renew !== "Pending")
          ? "Membership Activated"
          : membershipStatus.renew === "None" &&
            membershipStatus.membership === "Accepted"
          ? "Renew your Membership"
          : "Join Our Membership Program"}
      </h1>
      <p className="text-xs sm:text-sm mb-3 sm:mb-4">
        {membershipStatus.renew === "Accepted" ||
        (membershipStatus.membership === "Accepted" &&
          membershipStatus.renew !== "None" &&
          membershipStatus.renew !== "Pending")
          ? "Thank you for becoming a member of PSITS!"
          : membershipStatus.membership === "Pending" ||
            membershipStatus.renew === "Pending"
          ? "Your membership request has been successfully submitted. If needed, you can cancel this transaction at the PSITS Office."
          : "Get exclusive benefits and stay updated with our latest offers."}
      </p>

      {membershipStatus.membership === "Pending" ||
      membershipStatus.renew === "Pending" ? (
        <>
          <motion.button
            className="bg-neutral-light text-dark font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded transition"
            //onClick={toggleModal}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled="true"
          >
            Pending Request
          </motion.button>
        </>
      ) : membershipStatus.renew === "Accepted" ||
        (membershipStatus.membership === "Accepted" &&
          membershipStatus.renew !== "None" &&
          membershipStatus.renew !== "Pending") ? (
        <></>
      ) : (
        <>
          <motion.button
            className="bg-neutral-light text-dark font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded transition"
            onClick={toggleModal}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Membership
          </motion.button>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-center w-full max-w-xs sm:max-w-sm mx-auto">
            <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
              Request Membership
            </h2>
            <p className="text-xs sm:text-sm mb-2 sm:mb-3 text-gray-600">
              Are you sure you want to request membership? Please note that you
              need to pay PHP 50 in the PSITS Office to activate your membership
              until the end of the semester.
            </p>
            <div className="bg-gray-100 p-2 rounded-lg mb-3 sm:mb-4 border border-gray-300">
              <h3 className="text-sm sm:text-md font-semibold mb-1 sm:mb-2 text-gray-700">
                Membership Benefits:
              </h3>
              <ul className="list-disc list-inside text-left text-gray-600 text-xs sm:text-sm">
                <li className="mb-1">5% discount on all merchandise</li>
                <li>Clearance offers at the end of the semester</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <motion.button
                className="bg-blue-600 text-white font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow transition ease-in-out"
                onClick={request}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Yes
              </motion.button>
              <motion.button
                className="bg-gray-600 text-white font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow transition ease-in-out"
                onClick={toggleModal}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                No
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Membership;
