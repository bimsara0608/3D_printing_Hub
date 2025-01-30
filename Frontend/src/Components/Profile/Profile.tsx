import { useAuth } from '../../Hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { User, MapPin } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { status, userId, name, email } = authState;

  const [sellerData, setSellerData] = useState({
    name: '',
    email: '',
    education: '',
    description: '',
    experience: '',
    professionalExperience: '',
    skills: [],
    location: '',
  });
  interface Order {
    _id: string;
    quantity: number;
    price: number;
    status: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "seller") {
        try {
          const response = await axios.get(`http://localhost:3000/seller/getSeller/${userId}`);
          setSellerData(response.data);
        } catch (error) {
          console.error('Error fetching seller:', error);
        }
      }
    };

    fetchUserData();
  }, [status, userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/design/getOrders/${userId}`);
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <div className="relative h-24 w-24 rounded-full border-4 border-indigo-600 flex items-center justify-center bg-gray-100 shadow-lg">
            <User className="h-16 w-16 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              <p>Hello, {status}</p>{name}
            </h1>
            <p className="text-sm text-gray-500">{email}</p>
            {status === "seller" && (
              <>
                <p className="text-sm text-gray-500">{sellerData.experience}</p>
                <div className="mt-2 flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-1 text-indigo-600" />
                  <span>{sellerData.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
        {status === "seller" ? (
          <>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">About Me</h2>
              <p className="mt-2 text-gray-600">{sellerData.description}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              <p className="mt-2 text-gray-600">{sellerData.education}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {sellerData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">About Me</h2>
              <p className="mt-2 text-gray-600">This is your personal profile.</p>
            </div>
          </>
        )}
        <div className="mt-8 text-center">
          {status === "customer" ? (
            <button
              onClick={() => navigate('/seller/register')}
              className="px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Switch to Selling
            </button>
          ) : (
            <button
              onClick={() => navigate('/user/register')}
              className="px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Switch as Customer
            </button>
          )}
          {status === "customer" && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Orders</h2>
              <table className="min-w-full mt-4 table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">Rs.{order.price.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
