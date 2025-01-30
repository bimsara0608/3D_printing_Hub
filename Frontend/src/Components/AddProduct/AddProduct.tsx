import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, UploadIcon } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthContext";

function AddProduct() {
  const [product, setProduct] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    materials: string[];
    printTime: string;
    customizable: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    materials: [],
    printTime: "",
    customizable: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const { authState } = useAuth();
  const { userId } = authState;
  const navigate = useNavigate();

  const categories = [
    "3D Printing Services",
    "3D Modeling",
    "3D Scanning",
    "Prototyping",
    "Custom 3D Designs",
    "3D Printed Gifts",
    "Industrial Prototypes",
    "Architectural Models",
    "Medical Models",
  ];

  const materials = [
    { value: "PLA", label: "PLA" },
    { value: "ABS", label: "ABS" },
    { value: "TPU", label: "TPU" },
    { value: "PETG", label: "PETG" },
    { value: "NYLON", label: "NYLON" },
    { value: "RESIN", label: "RESIN" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "customizable"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleMaterialsChange = (selectedOptions: any) => {
    setProduct((prev) => ({
      ...prev,
      materials: selectedOptions.map(
        (option: { value: string }) => option.value
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setUploadCompleted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("category", product.category);
    formData.append("materials", JSON.stringify(product.materials));
    formData.append("printTime", product.printTime);
    formData.append("customizable", product.customizable.toString());
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        "http://localhost:3000/product/upload",
        formData,
        { headers }
      );
      toast.success("Product added successfully");
      //console.log(response.data);
      navigate(`/seller/dashboard/${userId}`);
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("Error uploading product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 space-y-6"
      >
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Materials Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Materials
          </label>
          <Select
            isMulti
            name="materials"
            options={materials}
            className="mt-1 block w-full rounded-md shadow-lg"
            classNamePrefix="select"
            onChange={handleMaterialsChange}
            value={materials.filter((material) =>
              product.materials.includes(material.value)
            )}
          />
        </div>

        {/* Print Time Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Print Time
          </label>
          <input
            type="text"
            name="printTime"
            value={product.printTime}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Customizable Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="customizable"
            checked={product.customizable}
            onChange={handleChange}
            className="h-4 w-4 p-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Customizable
          </label>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          {uploadCompleted ? (
            <div className="mt-4 border-2 border-green-500 rounded-md p-6 flex flex-col items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
              <p className="mt-2 text-green-600 text-sm">
                Successfully submitted!
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-gray-600 text-sm">
                  Drag & drop or click to upload
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
