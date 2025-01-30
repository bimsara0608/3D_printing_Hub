import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Printer, Menu, X, MessageSquare, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Hooks/AuthContext";
import { useStore } from "../../Hooks/StoreContext";

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { authState, logout } = useAuth();
  const { userId, name, status } = authState;

  const { messages, fetchMessages, markAsRead } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId, fetchMessages]);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Hire Frelancers", href: "/products" },
  { name: "Custom Orders", href: "/custom-orders" },
  { name: "Contact", href: "#footer" },
  ...(status === "admin" ? [{ name: "Admin", href: "/admin/dashboard" }] : []),
];


  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    } else {
      navigate(href);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const unreadMessagesCount = messages.filter((msg) => !msg.isRead).length;

  const handleMarkAsRead = (id: string, userId: string) => {
    markAsRead(id);
    fetchMessages(userId);
    setIsMessageBoxOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-600 p-2 rounded-lg"
              >
                <Printer className="h-8 w-8 text-white" />
              </motion.div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                3D Print Hub
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                      isActive(link.href)
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    {link.name}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {userId ? (
              <>
                {status === "customer" ? (
                  <Link
                    to="/seller/register"
                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Become a Seller
                  </Link>
                ) : (
                  <Link
                    to="/user/register"
                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Become a Customer
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <User className="h-6 w-6" />
                    <span>Hi, {name} <br /> You are our {status}</span>
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 p-4"
                      >
                        <Link
                          to={`/profile/${userId}`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() =>setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {status === "seller" && (
                          <Link
                            to={`/seller/dashboard/${userId}`}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() =>setIsUserMenuOpen(false)}
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/user/register"
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => setIsMessageBoxOpen(!isMessageBoxOpen)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <MessageSquare className="h-6 w-6" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                {userId && (
                  <button
                    onClick={() =>
                      handleLinkClick(
                        status === "customer" ? "/seller/register" : "/customer/register"
                      )
                    }
                    className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    {status === "customer" ? "Become a Seller" : "Become a Customer"}
                  </button>
                )}
                <button
                  onClick={() => handleLinkClick("/user/register")}
                  className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isMessageBoxOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-100 p-4"
            >
              <div className="text-gray-800 text-sm">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message._id} className="flex justify-between items-center p-2">
                      <span>{message.message}</span>
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message._id, message.userId)}
                          className="text-indigo-600 text-xs"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No messages.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default NavBar;
