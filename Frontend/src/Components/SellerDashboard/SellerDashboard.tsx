import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthContext";
import axios from "axios";

function SellerDashboard() {
  const [products, setProducts] = useState([
    {
      id: "",
      name: "",
      description: "",
      image: "",
      price: "",
      format: "",
    },
  ]);
  const [inquiries, setInquiries] = useState<
    {
      _id: string;
      customerEmail: string;
      productId: string;
      productName: string;
    }[]
  >([]);

  const { authState } = useAuth();
  const { userId, email } = authState;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/product/view/${userId}`,
          {
            params: { email: email },
          }
        );
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/inquiry/view", {
          headers,
        });
        const data = response.data;
        setInquiries(data);
        console.log("Fetched inquiries:", data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <Link to={`/seller/addproduct/${userId}`}>
          <button className="px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Product
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-lg p-4">
            <img
              src={
                "http://localhost:3000/product/image/" +
                product.id +
                "." +
                product.format
              }
              alt={product.name}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-2 text-indigo-600 font-bold">{product.price}</p>
          </div>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg border-separate border-spacing-0">
          <thead>
            <tr className="bg-indigo-600 text-white text-left rounded-lg">
              <th className="px-6 py-4 text-sm font-semibold">Product</th>
              <th className="px-6 py-4 text-sm font-semibold">
                Customer Email
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr
                key={inquiry._id}
                className="border-b hover:bg-indigo-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  {inquiry.productName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {inquiry.customerEmail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerDashboard;
