'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ShieldCheck, Lock, Eye, FileText, Bell, UserCheck, ChevronRight } from 'lucide-react';
import { RootState } from '@/redux/store';
import Link from 'next/link';

const PrivacyPolicy = () => {
  const { data: settings } = useSelector((state: RootState) => state.settings);
  const siteName = settings.websiteName || 'SnapGrocery';

  const sections = [
    {
      id: 'collection',
      icon: <Eye className="text-blue-500" size={20} />,
      title: 'Information We Collect',
      content: `We collect information to provide better services to all our users. This includes:
        - Personal details: Name, email address, phone number, and delivery address.
        - Payment information: Processed securely through our payment partners (we do not store your full card details).
        - Technical data: IP address, browser type, and device information used to access our storefront.`
    },
    {
      id: 'usage',
      icon: <FileText className="text-green-500" size={20} />,
      title: 'How We Use Information',
      content: `Your data helps us make ${siteName} work for you:
        - To process and deliver your grocery orders.
        - To send order updates via SMS or Email.
        - To improve our website experience and product range.
        - To prevent fraud and ensure the security of our customers.`
    },
    {
      id: 'sharing',
      icon: <UserCheck className="text-purple-500" size={20} />,
      title: 'Information Sharing',
      content: `We do not sell your personal data. We only share information with:
        - Delivery Partners: So our delivery personnel can find your address.
        - Service Providers: Payment processors and analytical tools that help us operate.
        - Legal Requirements: If required by law to protect our rights or comply with judicial proceedings.`
    },
    {
      id: 'security',
      icon: <Lock className="text-red-500" size={20} />,
      title: 'Data Security',
      content: `We use industry-standard encryption and security protocols (SSL) to protect your data. While no method of transmission over the internet is 100% secure, we strive to use commercially acceptable means to protect your personal information.`
    },
    {
      id: 'updates',
      icon: <Bell className="text-amber-500" size={20} />,
      title: 'Changes to This Policy',
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 py-16">
{/* ✅ Back to Home button */}
        <div className="max-w-6xl mx-auto">
          <button>
            <Link href="/" className="flex items-center gap-1 px-4 py-2 rounded-xl  hover:text-gray-700 text-gray-500 text-xs font-medium transition-all">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />Back to Home
            </Link>
          </button>
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-green-100 p-3 rounded-2xl">
              <ShieldCheck className="text-green-600" size={32} />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Table of Contents (Desktop Only) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Contents</h3>
              <nav className="flex flex-col gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Text */}
          <div className="flex-1 space-y-12">
            <section className="prose prose-green max-w-none">
              <p className="text-lg text-gray-600 leading-relaxed italic">
                At {siteName}, we take your privacy seriously. This policy describes how your personal 
                information is collected, used, and shared when you visit or make a purchase from our platform.
              </p>
            </section>

            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line ml-11">
                  {section.content}
                </div>
              </motion.section>
            ))}

            {/* ── Contact Section ── */}
            <section className="bg-green-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-4">Questions about your data?</h2>
                <p className="text-green-100 mb-6 max-w-xl">
                  If you would like to access, correct, or delete any personal information we have about you, 
                  please contact our Privacy Compliance Officer.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-green-700 px-6 py-3 rounded-xl text-sm font-bold">
                    Email: {settings.contactInfo?.email || 'privacy@snapgrocery.com'}
                  </div>
                  <div className="bg-green-700 px-6 py-3 rounded-xl text-sm font-bold">
                    Phone: {settings.contactInfo?.phone}
                  </div>
                </div>
              </div>
              <ShieldCheck size={180} className="absolute -right-10 -bottom-10 text-green-500 opacity-20" />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;