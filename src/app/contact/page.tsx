'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { data: settings } = useSelector((state: RootState) => state.settings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent! We'll get back to you shortly.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactDetails = [
    {
      icon: <Phone className="text-green-600" size={20} />,
      title: "Call Us",
      value: settings.contactInfo?.phone || "+1 (234) 567-890",
      sub: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: <Mail className="text-green-600" size={20} />,
      title: "Email Us",
      value: settings.contactInfo?.email || "support@snapgrocery.com",
      sub: "We usually respond within 24hrs"
    },
    {
      icon: <MapPin className="text-green-600" size={20} />,
      title: "Visit Us",
      value: settings.contactInfo?.address || "123 Grocery Lane, Tech City",
      sub: "Stop by our warehouse"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header Section ── */}
      <section className="bg-linear-to-b from-green-50 to-white pt-20 pb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              We're Here to <span className="text-green-600">Help You</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Have a question about an order or our delivery service? 
              Drop us a message and our team will jump right on it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* ── Contact Info Sidebar ── */}
            <div className="lg:col-span-1 space-y-8">
              {contactDetails.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 transition-hover hover:border-green-200"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-800 font-medium text-sm mb-1">{item.value}</p>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* Working Hours Card */}
              <div className="p-8 rounded-3xl bg-green-600 text-white relative overflow-hidden shadow-xl shadow-green-100">
                <Clock className="absolute -right-4 -bottom-4 text-green-500 opacity-30" size={120} />
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold">Store Hours</h3>
                  <div className="space-y-2 text-sm text-green-50/80">
                    <div className="flex justify-between border-b border-green-500 pb-2">
                      <span>Mon - Sat</span>
                      <span className="font-bold text-white">08:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Sunday</span>
                      <span className="font-bold text-white">09:00 - 18:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Contact Form ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100 p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageSquare size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-gray-800 appearance-none">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Delivery Feedback</option>
                    <option>Account Issues</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all text-gray-800 resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full md:w-auto px-10 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FAQ Quick Link ── */}
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6">
            <CheckCircle2 size={40} className="text-green-400 mx-auto" />
            <h2 className="text-2xl md:text-3xl font-black text-white">Looking for instant answers?</h2>
            <p className="text-gray-400">
              Check out our Help Center for frequently asked questions about delivery fees, 
              returns, and payment methods.
            </p>
            <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all">
              Visit FAQ Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;