import { Link } from 'react-router-dom'
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl hero-gradient flex items-center justify-center text-white text-sm font-bold">S</div>
              <span className="font-display font-bold text-white text-lg">Shoppers Point</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for quality products at the best prices. Shop with confidence.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['Home', '/'], ['About Us', '/about'], ['Contact', '/contact'], ['Login', '/login'], ['Register', '/register/customer']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell on Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4">Sell With Us</h4>
            <ul className="space-y-2 text-sm">
              {[['Become a Seller', '/register/seller'], ['Seller Dashboard', '/seller/dashboard'], ['Seller Guidelines', '/about']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary-400" /> support@shoppers-point.in</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary-400" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="text-primary-400 mt-0.5" /> 123 Commerce Street, Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Shoppers Point. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
