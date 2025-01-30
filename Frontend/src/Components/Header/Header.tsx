import { Link } from "react-router-dom";
import { ChevronRight, Printer } from "lucide-react";
import Button from "../Button/Button";
import { motion } from "framer-motion";

function Header() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px]" />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:px-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your Ideas Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Reality with 3D Printing
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                From concept to creation, we deliver high-quality 3D printed
                solutions with premium materials and expert craftsmanship.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Explore Frelancers
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/custom-orders">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group w-full sm:w-auto"
                  >
                    Custom Orders
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                {[
                  { label: "Satisfied Clients", value: "500+" },
                  { label: "Projects Completed", value: "1000+" },
                  { label: "Print Success Rate", value: "99.9%" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                <div className="absolute inset-0 bg-white rounded-2xl m-0.5" />
                <img
                  src="https://i.postimg.cc/sDH56R2X/new.jpg"
                  alt="3D Printing Process"
                  className="relative rounded-xl w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Printer className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Creative Freedom
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      Bring Any Idea to Life
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-200/30 to-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

export default Header;
