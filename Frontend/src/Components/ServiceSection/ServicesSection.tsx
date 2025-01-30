
import { motion } from 'framer-motion';
import { Printer, Package, Clock, Shield, Palette, Wrench, Users, Zap } from 'lucide-react';

const services = [
  {
    icon: Printer,
    title: 'Professional 3D Printing',
    description: 'High-resolution prints with precise details using industrial-grade printers.'
  },
  {
    icon: Package,
    title: 'Custom Solutions',
    description: 'Tailored 3D printing solutions for your specific requirements.'
  },
  {
    icon: Clock,
    title: 'Rapid Turnaround',
    description: '24-48 hour processing for standard orders with express options available.'
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: '100% satisfaction guarantee with our quality assurance process.'
  },
  {
    icon: Palette,
    title: 'Multiple Materials',
    description: 'Wide selection of materials including PLA, ABS, PETG, and Resin.'
  },
  {
    icon: Wrench,
    title: 'Post-Processing',
    description: 'Professional finishing services for the perfect final product.'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Dedicated team of 3D printing experts to assist you.'
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description: 'Quick iteration cycles for product development and testing.'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Comprehensive 3D Printing Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We offer a complete range of 3D printing services to bring your ideas to life
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}