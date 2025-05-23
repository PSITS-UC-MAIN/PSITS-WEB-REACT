import React, { useState, useEffect } from "react";
import { showToast } from "../../utils/alertHelper";
import { getInformationData } from "../../authentication/Authentication";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import FormButton from "../../components/forms/FormButton";
import FormTextArea from "../../components/forms/FormTextArea";
import ImageInput from "../../components/forms/ImageInput";
import backendConnection from "../../api/backendApi";
import axios from "axios";
const token = sessionStorage.getItem("Token");
import ToggleSwitch from "../../components/common/ToggleSwitch";

function EditProduct({ handleCloseEditProduct, merchData }) {
  const user = getInformationData();
  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isVariation, setVariation] = useState(false);
  const variation = [
    "White",
    "Purple",
    "Black",
    "Red",
    "Yellow",
    "Orange",
    "Blue",
    "Green",
    "Pink",
    "Gray",
    "Brown",
    "Cyan",
    "Magenta",
    "Teal",
    "Maroon",
    "Innovatio",
    "Paradox",
    "BSIT Wave",
  ];
  const size = [
    "18",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
  ];

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    stocks: "",
    start_date: "",
    end_date: "",
  });
  const [images, setImages] = useState([]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]); // AWS images
  const [newImages, setNewImages] = useState([]); // New local images
  const [removedImages, setRemovedImages] = useState([]); // AWS images to delete
  const [imagePreviews, setImagePreviews] = useState([]); // For UI
  const [isEventType, setIsEventType] = useState(false);

  const toggleIsEventType = () => {
    setIsEventType((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stocks: "",
    batch: "",
    description: "",
    start_date: "",
    end_date: "",
    category: "",
    type: "",
    created_by: user.name,
    control: "",
    selectedSizes: [],
    selectedVariations: [],
    selectedAudience: "",
    removeImage: [],
  });

  useEffect(() => {
    if (merchData) {
      setFormData({
        ...merchData,
        start_date: merchData.start_date.split("T")[0],
        end_date: merchData.end_date.split("T")[0],
        selectedSizes: merchData.selectedSizes ? merchData.selectedSizes : [],
        selectedVariations: Array.isArray(merchData.selectedVariations)
          ? merchData.selectedVariations
          : merchData.selectedVariations.split(","),
      });

      if (merchData.imageUrl && merchData.imageUrl.length > 0) {
        setImagePreviews(merchData.imageUrl);
      }
      setIsShown(true);
    }
  }, [merchData]);

  const handleRemoveImage = (image, index) => {
    setFormData((prev) => ({
      ...prev,
      removeImage: [
        ...(prev.removeImage && Array.isArray(prev.removeImage)
          ? prev.removeImage
          : []),
        ...(typeof image === "string" && image.startsWith("https://")
          ? [image]
          : []),
      ],
    }));

    if (typeof image === "string" && image.startsWith("https://")) {
      setRemovedImages((prev) => [...prev, image]);
      setUploadedImages((prev) => prev.filter((img) => img !== image));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {}, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      showToast("error", "You can only upload up to 3 images");
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  const validate = () => {
    let errors = {};

    // Validate Product Name
    if (!formData.name.trim()) {
      errors.name = "Product Name is required.";
    }

    // Validate Price
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      errors.price = "Price must be a positive number.";
    } else if (parseFloat(formData.price).toFixed(2) !== formData.price) {
      errors.price =
        "Price should be in a valid format with up to two decimal places.";
    }

    // Validate Stocks
    if (
      !formData.stocks ||
      isNaN(formData.stocks) ||
      parseInt(formData.stocks) < 0
    ) {
      errors.stocks = "Stocks must be a non-negative integer.";
    }

    // Validate Start Date
    if (!formData.start_date) {
      errors.start_date = "Start date is required.";
    }

    // Validate End Date
    if (!formData.end_date) {
      errors.end_date = "End date is required.";
    } else if (
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      errors.end_date = "End date must be after the start date.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreview = (e) => {
    e.preventDefault();

    setPreviewData(formData);
    setShowPreview(true);
  };
  // console.log(formData);

  const handleConfirm = async () => {
    setIsLoading(true);
    const data = new FormData();

    if (images) {
      images.forEach((image) => data.append("images", image));
    }

    for (const key in formData) {
      let value = formData[key];

      if (key === "selectedSizes") {
        try {
          value = JSON.stringify(value);
        } catch (error) {
          console.error("Error stringifying selectedSizes:", value);
          return;
        }
      } else if (Array.isArray(value)) {
        value = value.join(",");
      }

      data.append(key, value);
    }

    data.append("isEvent", isEventType);

    try {
      const response = await axios.put(
        `${backendConnection()}/api/merch/update/${merchData._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        handleCloseEditProduct(); // Close the modal after successful submission
        setShowPreview(false); // Hide preview modal after confirmation
        showToast("success", "Product updated successfully!");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Update error:", error.response?.data);
      showToast("error", error.response?.data || error.message);
      setIsLoading(false);
    }
  };

  const handleSizeClick = (size) => {
    setFormData((prevState) => {
      const selectedSizes = prevState.selectedSizes;

      // Toggle size selection
      if (selectedSizes.hasOwnProperty(size)) {
        const updatedSizes = { ...selectedSizes };
        delete updatedSizes[size];
        return { ...prevState, selectedSizes: updatedSizes };
      }

      return {
        ...prevState,
        selectedSizes: {
          ...selectedSizes,
          [size]: { custom: false, price: formData.price },
        },
      };
    });
  };

  const handleVariationClick = (variation) => {
    setFormData((prevState) => {
      const isSelected = prevState.selectedVariations.includes(variation);
      const newSelectedVariations = isSelected
        ? prevState.selectedVariations.filter((v) => v !== variation)
        : [...prevState.selectedVariations, variation];

      return {
        ...prevState,
        selectedVariations: newSelectedVariations,
      };
    });
  };

  const categoryOptions = [
    { value: "uniform", label: "Uniform" },
    { value: "intramurals", label: "Intramurals" },
    { value: "ict-congress", label: "ICT Congress" },
    { value: "merchandise", label: "Merchandise" },
  ];

  const typeOptions = {
    uniform: [
      { value: "CCS Uniform", label: "CCS Uniform" },
      { value: "Shorts", label: "Shorts" },
      { value: "Jacket", label: "Jacket" },
    ],
    intramurals: [
      { value: "Tshirt", label: "T-shirt" },
      { value: "Ticket", label: "Ticket" },
      { value: "Water Bottle", label: "Water Bottle" },
    ],
    "ict-congress": [{ value: "Ticket w/ Bundle", label: "Ticket w/ Bundle" }],
    merchandise: [
      { value: "Tshirt", label: "Tshirt" },
      { value: "Item", label: "Item" },
    ],
  };
  const audience = [
    { value: "all", label: "All" },
    { value: "officers", label: "Officers" },
    {
      value: "volunteer,media,developer",
      label: "Volunteers, Media and Developers",
    },
  ];

  const purchaseControlOptions = [
    { value: "limited-purchase", label: "Limited Purchase" },
    { value: "bulk-purchase", label: "Bulk Purchase" },
  ];

  const getTypeOptions = (category) => {
    return typeOptions[category] || [];
  };

  const handleCustomPriceToggle = (size) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedSizes: {
        ...prevState.selectedSizes,
        [size]: {
          ...prevState.selectedSizes[size],
          custom: !prevState.selectedSizes[size].custom,
          price: !prevState.selectedSizes[size].custom ? "" : formData.price, // Reset price if unchecked
        },
      },
    }));
  };

  const handlePriceChange = (size, value) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedSizes: {
        ...prevState.selectedSizes,
        [size]: { ...prevState.selectedSizes[size], price: value },
      },
    }));
  };

  const PreviewModal = ({ data, images, onClose, onConfirm }) => {
    // Show up to 3 images in the preview
    const imagesToShow = images.slice(0, 3);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="relative max-w-lg w-full mx-4 md:mx-auto p-6 bg-white rounded-2xl shadow-xl transition-transform transform scale-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h2>
          <div className="space-y-4">
            {imagesToShow.length > 0 && (
              <div className="flex gap-2">
                {imagesToShow.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Product Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                ))}
                {images.length > 3 && (
                  <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">
                      +{images.length - 3} more
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="text-gray-700 space-y-1">
              {Object.entries({
                "Product Name": data.name,
                Price: `₱${data.price}`,
                Stocks: data.stocks,
                Batch: data.batch,
                Category: data.category,
                Type: data.type,
                Description: data.description,
                "Purchase Control": data.control,
                "Start Date": data.start_date,
                "End Date": data.end_date,
                Sizes: Object.entries(data.selectedSizes),
                Variations: data.selectedVariations,
              }).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-10"
                >
                  <span className="font-medium text-md">{label}:</span>

                  {/* Handle array values separately */}
                  {Array.isArray(value) && value.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {value.map(([size, details]) => {
                        // Fallbacks to prevent errors
                        const isCustom = details?.custom;
                        const price = details?.price;

                        return (
                          <div
                            key={size}
                            className="flex items-center gap-1 border p-1 rounded"
                          >
                            <span>{size}</span>
                            {isCustom ? (
                              <span className="text-sm text-gray-500">
                                ₱{price}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-md">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-600 rounded-full text-sm transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className="px-5 py-2 bg-blue-500 text-white rounded-full text-sm transition-colors hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="loader"></div>
          <p className="ml-4 text-white">Updating product, please wait...</p>
        </div>
      ) : (
        <div className="relative h-[80%] max-w-4xl w-full mx-4 md:mx-auto p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
          <button
            onClick={handleCloseEditProduct}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
          <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
          <form onSubmit={handlePreview} className="space-y-6">
            <ImageInput
              label="Product Image"
              uploadedImages={uploadedImages}
              newImages={newImages}
              previews={imagePreviews}
              onAddImages={setNewImages}
              onRemoveImage={handleRemoveImage}
              multiple={true}
              handleImageChange={handleImageChange}
            />

            <FormInput
              label="Product Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              labelStyle="text-sm"
              inputStyle="text-sm"
            />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <FormInput
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                labelStyle="text-sm"
                inputStyle="text-sm"
              />
              <FormInput
                label="Stocks"
                name="stocks"
                type="number"
                value={formData.stocks}
                onChange={handleChange}
                labelStyle="text-sm"
                inputStyle="text-sm"
              />
              <FormInput
                label="Batch"
                name="batch"
                type="number"
                value={formData.batch}
                onChange={handleChange}
                labelStyle="text-sm"
                inputStyle="text-sm"
              />
            </div>
            <FormTextArea
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              labelStyle="text-sm"
              textareaStyle="text-sm"
            />
            <div className="flex flex-wrap space-x-0 md:space-x-4 gap-y-4">
              <FormSelect
                name="category"
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={handleChange}
                labelStyle="text-sm"
                optionStyle="text-sm"
                styles="flex-1"
              />
              <FormSelect
                name="type"
                label="Type"
                options={getTypeOptions(formData.category)}
                value={formData.type}
                onChange={handleChange}
                styles="flex-1"
                labelStyle="text-sm"
                optionStyle="text-sm"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-row relative gap-4">
                <label
                  htmlFor="start_date"
                  className="text-gray-500 mb-1 text-sm"
                >
                  Is Merch of Event type?
                </label>
                <ToggleSwitch
                  isToggled={isEventType}
                  onToggle={toggleIsEventType}
                />
              </div>
            </div>
            {isEventType && (
              <div className="flex flex-col relative">
                <label htmlFor="eventDate" className="text-gray-500 mb-1">
                  Event Date
                </label>
                <FormInput
                  label=""
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  labelStyle="text-sm"
                  inputStyle="text-sm"
                  error={errors.eventDate}
                  max={today}
                />
              </div>
            )}
            <FormSelect
              name="control"
              label="Purchase Control"
              options={purchaseControlOptions}
              value={formData.control}
              onChange={handleChange}
              labelStyle="text-sm"
              optionStyle="text-sm"
            />
            <FormSelect
              name="selectedAudience"
              label="Select Audience"
              options={audience}
              value={formData.selectedAudience}
              onChange={handleChange}
              labelStyle="text-sm"
              optionStyle="text-sm"
            />

            <div className="flex flex-col gap-4 text-sm">
              {(isShown && (formData.type === "Tshirt") ||
                formData.category === "uniform") && (
                <div>
                  <p className="font-semibold">Sizes:</p>
                  <div className="flex flex-col gap-2">
                    {size.map((s) => (
                      <div
                        key={s}
                        className="grid grid-cols-[auto_auto_1fr] items-center gap-4"
                      >
                        {/* Button for Size Selection */}
                        <button
                          type="button"
                          onClick={() => handleSizeClick(s)}
                          className={`p-2 w-14 text-center border rounded ${
                            formData.selectedSizes[s]
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800"
                          }`}
                        >
                          {s}
                        </button>

                        {/* Checkbox for Custom Price */}
                        {formData.selectedSizes[s] !== undefined && (
                          <label className="flex items-center gap-2 text-sm">
                            <FormInput
                              type="checkbox"
                              checked={formData.selectedSizes[s]?.custom}
                              onChange={() => handleCustomPriceToggle(s)}
                            />
                            Custom Price
                          </label>
                        )}

                        {/* Input for Custom Price */}
                        {formData.selectedSizes[s]?.custom && (
                          <FormInput
                            type="number"
                            placeholder="Enter price"
                            value={
                              formData.selectedSizes[s]?.price
                                ? formData.selectedSizes[s]?.price
                                : formData.price
                            }
                            onChange={(e) =>
                              handlePriceChange(s, e.target.value)
                            }
                            className="border p-1 rounded w-full max-w-32"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(isShown || isVariation) && (
                <div>
                  <p className="font-semibold">Variations:</p>
                  <div className="flex gap-2 flex-wrap text-sm">
                    {variation.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleVariationClick(v)}
                        className={`p-2 border rounded ${
                          formData.selectedVariations.includes(v)
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <FormInput
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                labelStyle="text-sm"
                inputStyle="text-sm"
                error={errors.start_date} // Pass the error message for start_date
                max={today}
              />
              <FormInput
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                labelStyle="text-sm"
                inputStyle="text-sm"
                error={errors.end_date} // Pass the error message for end_date
                max={today}
              />
            </div>
            <FormButton
              type="button"
              text="Preview"
              onClick={handlePreview}
              styles="w-full bg-blue-500 text-white py-2 rounded"
              disabled={isLoading}
            />
          </form>
          {showPreview && !isLoading && (
            <PreviewModal
              data={previewData}
              images={images}
              onClose={() => setShowPreview(false)}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default EditProduct;
