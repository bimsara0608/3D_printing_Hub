import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your 3D Printing Project?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Whether you have a design ready or need help bringing your idea to life,
              we're here to help. Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/custom-orders"
                className="inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="https://i.postimg.cc/x87qP6Tx/2.jpg"
                alt="3D Printing Process"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}