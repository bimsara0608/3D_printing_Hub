import { motion } from "framer-motion";
import { Upload, Settings, FileText, Send } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your 3D Model",
    description: "Submit your design in STL, OBJ, or 3MF format.",
  },
  {
    icon: Settings,
    title: "Customize Settings",
    description: "Choose material, color, and printing preferences.",
  },
  {
    icon: FileText,
    title: "Get Instant Quote",
    description: "Instantly view the price and printing details.",
  },
  {
    icon: Send,
    title: "Submit for Printing",
    description: "Approve and send your design to our team.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Simple steps to bring your ideas to life
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                  <div className="absolute right-0 -top-1 h-2 w-2 rounded-full bg-indigo-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
