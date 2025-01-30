import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import MaterialPreview from "./../MaterialReview/MaterialReview";
import { useAuth } from "../../Hooks/AuthContext";
import axios from "axios";
import "./ProductDetails.css";

interface ProductDetailsProps {
  product: any;
  onClose: () => void;
}

export default function ProductDetails({
  product,
  onClose,
}: ProductDetailsProps) {
  const { authState } = useAuth();
  const { name, email } = authState;

  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    material: "PLA",
    color: "White",
    quantity: 1,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      productId: product.id,
      productName: product.name,
      email: email,
      colour: formData.color.toLowerCase(),
      quantity: formData.quantity,
      material: formData.material,
    };
    console.log(payload.productId);
    console.log(payload.email);
    console.log(payload.colour);
    console.log(payload.productName);
    console.log(payload.material);
    const token = localStorage.getItem("authToken");
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.post(
        "http://localhost:3000/inquiry/create",
        payload,
        { headers }
      );
      //console.log("Inquiry created successfully:", response.data);
      if (response.status == 200) {
        toast.success("Your inquiry has been sent! We will contact you soon.", {
          position: "bottom-right",
          theme: "colored",
        });
        onClose();
      } else {
        toast.error("Some Error", {
          position: "bottom-right",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred. Please try again.", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 pb-8 overflow-y-auto max-h-[85vh] scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={
                  "http://localhost:3000/product/image/" +
                  product.id +
                  "." +
                  product.format
                }
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Request Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4 pb-[5rem]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border-gray-800 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Type
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="PLA">PLA</option>
                    <option value="ABS">ABS</option>
                    <option value="PETG">PETG</option>
                    <option value="TPU">TPU</option>
                    <option value="Resin">Resin</option>
                  </select>
                </div> */}

                {/* {formData.material && (
                  <MaterialPreview material={formData.material} />
                )} */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Gray">Gray</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Custom">Custom (Specify in notes)</option>
                  </select>
                </div> */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border-gray-300 shadow-lg focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div> */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
