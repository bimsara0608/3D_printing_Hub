import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import NotFound from "./Components/NotFound/NotFound";
import Layout from "./Components/Layout/Layout";
import Products from "./Components/Products/Products";
import CustomOrders from "./Components/CustomOrders/CustomOrders";
import SellerRegistration from "./Components/SellerRegister/SellerRegistration";
import UserRegistration from "./Components/UserRegistration/UserRegistration";
import Profile from "./Components/Profile/Profile";
import SellerDashboard from "./Components/SellerDashboard/SellerDashboard";
import Admin from "./Components/Admin/Admin";
import AddProduct from "./Components/AddProduct/AddProduct";
import { useAuth } from "./Hooks/AuthContext";

function App() {
  const { authState } = useAuth();
  const { status } = authState;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<Products />} />
          <Route path="custom-orders" element={
            status === "seller" ? (
              <Navigate to="/user/register" replace />
            ) : (
              <CustomOrders />
            )
          } />
          <Route path="seller/register" element={<SellerRegistration />} />
          <Route path="user/register" element={<UserRegistration />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="/seller/dashboard/:id" element={status === "seller" && <SellerDashboard />} />
          <Route path="/seller/addproduct/:id" element={status === "seller" && <AddProduct />} />
          <Route path="/admin/dashboard" element={status === "admin" && <Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
