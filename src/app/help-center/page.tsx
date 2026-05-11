// src/app/help-center/page.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, MessageCircle, HelpCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Dynamic FAQ Data Structure
const faqData = [
  {
    category: "Orders & Delivery",
    icon: <BookOpen className="w-5 h-5" />,
    questions: [
      { q: "How fast is the delivery?", a: "We offer the fastest delivery in town, typically within 30-60 minutes depending on your location." },
      { q: "What are the delivery charges?", a: "Delivery charges are flat, but we offer free delivery on orders above a certain threshold." }
    ]
  },
  {
    category: "Payments & Refunds",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      { q: "Which payment methods do you accept?", a: "We accept all major credit cards, debit cards, and popular mobile wallets." },
      { q: "How long do refunds take?", a: "Refunds are usually processed within 5-7 business days to your original payment method." }
    ]
  }
];

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {faqData.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <div className="flex items-center gap-2 px-2 text-green-600 font-semibold uppercase tracking-wider text-sm">
                {section.icon}
                <span>{section.category}</span>
              </div>

              <div className="space-y-3">
                {section.questions.filter(item => item.q.toLowerCase().includes(searchTerm)).map((item, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === id;

                  return (
                    <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help? */}
        <div className="mt-16 bg-green-600 rounded-3xl p-8 text-center text-white shadow-lg shadow-green-100">
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-green-50 mb-6 text-sm">Our support team is available 24/7 to assist you.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HelpCenterPage;