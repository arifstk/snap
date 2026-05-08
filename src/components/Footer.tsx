// Footer.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  ShoppingBasket,
  ArrowRight
} from 'lucide-react';
import { FaSquareFacebook } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSettings } from '@/redux/settingsSlice';

const Footer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: settings, isLoading } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    // Fetch settings on mount if not already loaded
    dispatch(fetchSettings());
  }, [dispatch]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 border-t border-gray-100 pt-5 sm:pt-16 md:pt-16 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-3">

          {/* Brand Section */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <ShoppingBasket className="text-white" size={24} />
              </div>
              <span className="text-xl font-black text-gray-800 tracking-tight">
                {settings?.websiteName || 'Snap'}
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm">
              Fresh groceries delivered to your doorstep. Quality products,
              unbeatable prices, and the fastest delivery in town.
            </p>
            <div className="flex gap-4">
              {settings?.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                  <FaSquareFacebook size={18} />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks?.instagram} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">
                  <FaInstagramSquare size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links/ Shopping */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Shopping</h4>
            <ul className="space-y-2 text-sm">
              {/* <li><Link href="/products" className="text-gray-500 hover:text-green-600 transition-colors">All Products</Link></li> */}
              <li><Link href="/offers" className="text-gray-500 hover:text-green-600 transition-colors">Special Offers</Link></li>
              <li><Link href="/categories" className="text-gray-500 hover:text-green-600 transition-colors">Categories</Link></li>
              <li><Link href="/user/my-orders" className="text-gray-500 hover:text-green-600 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-green-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</Link></li>
              {settings?.maintenanceMode && (
                <li>
                  <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    System Maintenance Active
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin size={20} className="text-green-600 shrink-0" />
                <span>{settings?.contactInfo?.address || 'Your Store Address Here'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={20} className="text-green-600 shrink-0" />
                <span>{settings?.contactInfo?.phone || '+1 000 000 000'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={20} className="text-green-600 shrink-0" />
                <span>{settings?.contactInfo?.email || 'hello@store.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-gray-100 flex md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs -tracking-tighter">
            © {currentYear} {settings?.websiteName || 'Snap'}. All rights reserved.
          </p>
          <div className="group text-xs text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors -tracking-tighter">
            Developed by: Arif
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

