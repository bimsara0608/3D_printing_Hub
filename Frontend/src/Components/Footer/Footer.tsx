import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 p-8 px-[10rem]" id='footer'>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <Link to="/" className="flex items-center mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500">
              <Printer className="h-8 w-8 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">3D Print Hub</span>
          </Link>
          <p className="leading-relaxed">
            Creating custom 3D printed solutions for your unique needs. Quality prints, fast delivery, and exceptional service.
          </p>
          <div className="flex space-x-4 mt-4">
            {['Twitter', 'Facebook', 'Instagram'].map((platform) => (
              <a
                key={platform}
                href={`https://${platform.toLowerCase()}.com/3dprinthub`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { name: 'About Us', href: '/about' },
              { name: 'Services', href: '/services' },
              { name: 'Contact', href: '/contact' },
              { name: 'FAQ', href: '/faq' },
            ].map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Our Services</h3>
          <ul className="space-y-2">
            {[
              { name: '3D Printing', href: '/services/3d-printing' },
              { name: 'Prototyping', href: '/services/prototyping' },
              { name: 'Design Consultation', href: '/services/design-consultation' },
              { name: 'Custom Orders', href: '/services/custom-orders' },
            ].map((service) => (
              <li key={service.name}>
                <Link to={service.href} className="hover:text-white">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <a href="mailto:support@3dprinthub.com" className="hover:text-white">
                support@3dprinthub.com
              </a>
            </li>
            <li className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <a href="tel:+15551234567" className="hover:text-white">
                (+94)70 320 3368
              </a>
            </li>
            <li className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <a
                href="https://wa.me/+94703203368"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Live Chat on WhatsApp
              </a>
            </li>
            <li className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Gampaha, Kirindiwela.</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
          <p className="mb-4 leading-relaxed">
            Subscribe to our newsletter for the latest 3D printing news and exclusive offers.
          </p>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Horizontal Line and Footer Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 3D Print Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
