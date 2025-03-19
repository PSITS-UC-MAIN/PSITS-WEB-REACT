import { useState, useEffect } from "react";
import { membership, merchandiseAdmin } from "../../api/admin";
import Modal from "../../components/common/modal/Modal";
import SearchDropdown from "../search/SearchDropdown";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import Button from "../../components/common/Button";
import { getInformationData } from "../../authentication/Authentication";

// Add Order Modal jud
const AddOrderModal = ({ handleClose = () => {}, onCreateOrder }) => {
  // options
  const [studentOptions, setStudentOptions] = useState([]);
  const [merchOptions, setMerchOptions] = useState([]);
  // formData
  const [student, setStudent] = useState();
  const [item, setItem] = useState();
  const [size, setSize] = useState("");
  const [variation, setVariation] = useState("");
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const user = getInformationData();

  useEffect(() => {
    /* Merchandise Options */
    const fetchMerchOptions = async () => {
      const temp = await merchandiseAdmin();
      setMerchOptions(
        temp
          .filter((opt) => opt.is_active === true)
          .map((opt) => ({
            label: `${opt.name}`,
            value: opt,
          }))
      );
    };

    const fetchStudentOptions = async () => {
      try {
        const result = await membership();
        const options = result.map((student) => ({
          label: `${student.id_number} - ${student.first_name} ${student.last_name}`,
          value: student,
        }));
        setStudentOptions(options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMerchOptions();
    fetchStudentOptions();
  }, []);

  const handleSizeClick = (size) => setSize(size);
  const handleVariationClick = (variation) => setVariation(variation);

  const calculateTotal = (qty, price) => {
    return (price * qty).toFixed(2);
  };

  const createOrderHandler = () => {
    setIsLoading(true);
    const items = {
      product_id: item._id,
      imageUrl1: item.imageUrl[0],
      product_name: item.name,
      limited: item.control === "limited-purchase" ? true : false,
      price: item.price,
      quantity: quantity,
      sub_total: amount,
      variation: item.category === "uniform" ? variation : "",
      sizes: size,
      batch: item.batch,
    };

    const formData = {
      id_number: student.id_number,
      rfid: student.rfid,
      imageUrl1: item.imageUrl[0],
      membership_discount: false,
      course: student.course,
      year: student.year,
      student_name:
        student.first_name +
        " " +
        student.middle_name +
        " " +
        student.last_name,
      items: items,
      total: calculateTotal(quantity, amount),
      admin: user.id_number,
      order_date: new Date(),
      order_status: "Pending",
    };

    onCreateOrder(formData);
  };
  useEffect(() => {
    if (item?.price) {
      setAmount(calculateTotal(quantity, item.price));
    }
  }, [item, quantity]);

  return (
    <Modal onClose={handleClose}>
      <div className="flex flex-col gap-2 p-4 h-full">
        <h1 className="text-2xl font-semibold"> Add Order </h1>
        <SearchDropdown
          label="Student"
          placeholder="Search ID Number..."
          options={studentOptions}
          onOptionSelect={(opt) => setStudent(opt ? opt.value : null)}
        />
        <SearchDropdown
          label="Item"
          placeholder="Search Item Name..."
          options={merchOptions}
          onOptionSelect={(opt) => setItem(opt ? opt.value : null)}
        />
        <TextInput
          label="Quantity"
          type="number"
          value={quantity}
          placeholder="Qty"
          onChange={(e) => {
            const qty = parseInt(e.target.value) || 1;
            setQuantity(qty);
          }}
        />
        <TextInput
          label="Amount"
          type="number"
          value={amount} // Use state value
          placeholder="Price"
          disabled
        />

        {/* Order specific functions should be here */}
        {/* If item is t-shirt */}
        {item &&
        /* If type is Uniform, Tshirt, or Tshirt w/ Bundle */
        (item.type === "Uniform" ||
          item.type === "Tshirt" ||
          item.type === "Tshirt w/ Bundle") ? (
          <div>
            <p className="font-semibold">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {item.selectedSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSizeClick(s)}
                  className={`p-2 border rounded ${
                    size === s
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="font-semibold">Variations:</p>
            <div className="flex gap-2 flex-wrap text-sm">
              {item.selectedVariations.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleVariationClick(v)}
                  className={`p-2 border rounded ${
                    variation === v
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        <Button size="full" onClick={createOrderHandler} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3m-3 3l-3-3m3 3V4a8 8 0 018 8h-4l3 3m-3-3l3 3"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            "Create Order"
          )}
        </Button>
      </div>
    </Modal>
  );
};

AddOrderModal.propTypes = {
  handleClose: PropTypes.func,
  studentOptions: PropTypes.array,
  merchOptions: PropTypes.array,
  setSelectedStudent: PropTypes.func,
  setSelectedItem: PropTypes.func,
  selectedItem: PropTypes.object,
  onCreateOrder: PropTypes.func.isRequired,
};

export default AddOrderModal;
