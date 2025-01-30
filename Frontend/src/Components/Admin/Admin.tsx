import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [messageInput, setMessageInput] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  interface Order {
    _id: string;
    id: string;
    userId: string;
    name: string;
    email: string;
    notes: string;
    format: string;
    projectType: string;
    quantity: number;
    material: string;
    price: number;
    status: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/design/view');
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:3000/design/update/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      toast.success(`Status updated to ${newStatus}`, {
        theme: 'colored',
        position: 'bottom-right',
      });
    } catch (error) {
      toast.error('Failed to update status', {
        theme: 'colored',
        position: 'bottom-right',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      alert('Please enter a message!');
      return;
    }
    const selectedOrder = orders.find(order => order._id === selectedOrderId);
    if (selectedOrder) {
      try {
        await axios.post('http://localhost:3000/message/create', {
          userID: selectedOrder.userId,
          message: messageInput,
        });
        toast.success("Message Sent Successfully", {
          theme: 'colored',
          position: 'bottom-right',
        });
        setShowMessageBox(false);
        setMessageInput('');
      } catch (error) {
        toast.error("Failed to send message", {
          theme: 'colored',
          position: 'bottom-right',
        });
      }
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/design/read/${id}`, {
        responseType: 'blob',
      });
      const fileBlob = new Blob([response.data], { type: response.data.type });
      const fileLink = document.createElement('a');
      const fileURL = URL.createObjectURL(fileBlob);
      fileLink.href = fileURL;
      fileLink.download = `${id}.${response.data.type.split('/')[1]}`;
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
      toast.success("Download Successful", {
        theme: 'colored',
        position: 'bottom-right',
      });
    } catch (error) {
      toast.error("Something went wrong", {
        theme: 'colored',
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-1 pt-6 w-[95%]">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 font-medium rounded-lg ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
              <table className="min-w-full bg-white rounded-lg">
                <thead>
                  <tr className="w-full border-b-2 border-gray-200">
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Order</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Customer</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Note</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Format</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Project Type</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Quantity</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Material</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Price</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Print</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDownload(order.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {order.id.slice(-4)}
                        </button>
                      </td>
                      <td className="px-4 py-2">{order.name}</td>
                      <td className="px-4 py-2">{order.email}</td>
                      <td className="px-4 py-2">{order.notes}</td>
                      <td className="px-4 py-2">{order.format}</td>
                      <td className="px-4 py-2">{order.projectType}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">{order.material}</td>
                      <td className="px-4 py-2">{order.price}</td>
                      <td className="px-4 py-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="finished">Finished</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded-lg mr-2">
                          Print
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setShowMessageBox(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Message Box Popup */}
              {showMessageBox && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-[400px]">
                    <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      rows={4}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Type your message here..."
                    />
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => setShowMessageBox(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
