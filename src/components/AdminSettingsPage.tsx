// 'use client';
// // AdminSettingsPage.tsx
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'motion/react';
// import {
//   Settings, Globe, Image, Truck, Phone, Share2,
//   ShieldAlert, ShoppingCart, DollarSign, Save,
//   RotateCcw, ChevronRight, Plus, Trash2, Edit3,
//   Check, X, ToggleLeft, ToggleRight, AlertTriangle
// } from 'lucide-react';
// // import {
// //   updateWebsiteName,
// //   updateDeliveryFee,
// //   updateFreeDeliveryThreshold,
// //   updateSupportPhone,
// //   updateSupportEmail,
// //   updateContactInfo,
// //   updateSocialLinks,
// //   toggleMaintenanceMode,
// //   toggleGuestCheckout,
// //   updateMaxCartItems,
// //   updateCurrencySymbol,
// //   updateTaxRate,
// //   updateBannerSlide,
// //   addBannerSlide,
// //   removeBannerSlide,
// //   resetSettings,
// // } from '@/redux/settingsSlice';
// import { RootState } from '@/redux/store';

// // ─── Types ────────────────────────────────────────────────────────────────────
// type SectionKey =
//   | 'general'
//   | 'banner'
//   | 'delivery'
//   | 'contact'
//   | 'social'
//   | 'store'
//   | 'danger';

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const SectionCard = ({
//   children,
//   title,
//   icon,
// }: {
//   children: React.ReactNode;
//   title: string;
//   icon: React.ReactNode;
// }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 16 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -8 }}
//     transition={{ duration: 0.35 }}
//     className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
//   >
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-linear-to-r from-green-50 to-white">
//       <span className="text-green-600">{icon}</span>
//       <h2 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h2>
//     </div>
//     <div className="px-6 py-5 space-y-5">{children}</div>
//   </motion.div>
// );

// const Field = ({
//   label,
//   hint,
//   children,
// }: {
//   label: string;
//   hint?: string;
//   children: React.ReactNode;
// }) => (
//   <div className="space-y-1.5">
//     <label className="block text-sm font-medium text-gray-700">{label}</label>
//     {children}
//     {hint && <p className="text-xs text-gray-400">{hint}</p>}
//   </div>
// );

// const Input = ({
//   value,
//   onChange,
//   placeholder,
//   type = 'text',
//   prefix,
// }: {
//   value: string | number;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   type?: string;
//   prefix?: string;
// }) => (
//   <div className="flex items-center gap-0 rounded-xl border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all overflow-hidden bg-gray-50">
//     {prefix && (
//       <span className="px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 self-stretch flex items-center">
//         {prefix}
//       </span>
//     )}
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
//     />
//   </div>
// );

// const Toggle = ({
//   enabled,
//   onToggle,
//   label,
//   description,
// }: {
//   enabled: boolean;
//   onToggle: () => void;
//   label: string;
//   description?: string;
// }) => (
//   <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
//     <div>
//       <p className="text-sm font-medium text-gray-700">{label}</p>
//       {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
//     </div>
//     <button
//       onClick={onToggle}
//       className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${enabled
//           ? 'bg-green-100 text-green-700'
//           : 'bg-gray-100 text-gray-500'
//         }`}
//     >
//       {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
//       {enabled ? 'On' : 'Off'}
//     </button>
//   </div>
// );

// // ─── Nav Sidebar ──────────────────────────────────────────────────────────────
// const navItems: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
//   { key: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
//   { key: 'banner', label: 'Banner Slides', icon: <Image className="w-4 h-4" /> },
//   { key: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
//   { key: 'contact', label: 'Contact & Social', icon: <Phone className="w-4 h-4" /> },
//   { key: 'store', label: 'Store Rules', icon: <ShoppingCart className="w-4 h-4" /> },
//   { key: 'danger', label: 'Danger Zone', icon: <ShieldAlert className="w-4 h-4" /> },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────────
// const AdminSettingsPage = () => {
//   const dispatch = useDispatch();
//   const settings = useSelector((s: RootState) => s.settings);

//   const [activeSection, setActiveSection] = useState<SectionKey>('general');
//   const [saved, setSaved] = useState(false);
//   const [resetConfirm, setResetConfirm] = useState(false);

//   // local editable copies for banner
//   const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
//   const [bannerDraft, setBannerDraft] = useState({ id: 0, title: '', subtitle: '', btnText: '', bg: '' });

//   // local copies for contact & social (to allow batch save)
//   const [contactDraft, setContactDraft] = useState(settings.contactInfo);
//   const [socialDraft, setSocialDraft] = useState(settings.socialLinks);

//   const handleSave = () => {
//     dispatch(updateContactInfo(contactDraft));
//     dispatch(updateSocialLinks(socialDraft));
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handleReset = () => {
//     if (resetConfirm) {
//       dispatch(resetSettings());
//       setContactDraft(settings.contactInfo);
//       setSocialDraft(settings.socialLinks);
//       setResetConfirm(false);
//     } else {
//       setResetConfirm(true);
//       setTimeout(() => setResetConfirm(false), 4000);
//     }
//   };

//   const startEditBanner = (slide: typeof bannerDraft) => {
//     setBannerDraft(slide);
//     setEditingBannerId(slide.id);
//   };

//   const saveBanner = () => {
//     dispatch(updateBannerSlide(bannerDraft));
//     setEditingBannerId(null);
//   };

//   const addNewBanner = () => {
//     const newId = Date.now();
//     const newSlide = { id: newId, title: 'New Slide', subtitle: 'Subtitle here', btnText: 'Shop Now', bg: '' };
//     dispatch(addBannerSlide(newSlide));
//     startEditBanner(newSlide);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* Header */}
//       <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
//           <div className="flex items-center gap-3">
//             <div className="bg-green-100 p-2 rounded-xl">
//               <Settings className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <h1 className="text-base font-bold text-gray-900 leading-tight">Admin Settings</h1>
//               <p className="text-xs text-gray-400">{settings.websiteName}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleReset}
//               className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${resetConfirm
//                   ? 'bg-red-100 text-red-600 border border-red-200'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//             >
//               {resetConfirm ? (
//                 <><AlertTriangle className="w-3.5 h-3.5" /> Confirm Reset?</>
//               ) : (
//                 <><RotateCcw className="w-3.5 h-3.5" /> Reset</>
//               )}
//             </button>
//             <motion.button
//               whileTap={{ scale: 0.96 }}
//               onClick={handleSave}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${saved
//                   ? 'bg-green-500 text-white'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//                 }`}
//             >
//               {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
//               {saved ? 'Saved!' : 'Save Changes'}
//             </motion.button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
//         {/* Sidebar Nav */}
//         <aside className="w-48 shrink-0 hidden md:block">
//           <nav className="space-y-1 sticky top-24">
//             {navItems.map((item) => (
//               <button
//                 key={item.key}
//                 onClick={() => setActiveSection(item.key)}
//                 className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeSection === item.key
//                     ? 'bg-green-600 text-white shadow-sm shadow-green-200'
//                     : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//               >
//                 {item.icon}
//                 {item.label}
//                 {activeSection === item.key && (
//                   <ChevronRight className="w-3.5 h-3.5 ml-auto" />
//                 )}
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* Mobile Nav */}
//         <div className="md:hidden w-full mb-4">
//           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
//             {navItems.map((item) => (
//               <button
//                 key={item.key}
//                 onClick={() => setActiveSection(item.key)}
//                 className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeSection === item.key
//                     ? 'bg-green-600 text-white'
//                     : 'bg-white text-gray-600 border border-gray-200'
//                   }`}
//               >
//                 {item.icon}
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <main className="flex-1 space-y-5 min-w-0">
//           <AnimatePresence mode="wait">
//             {/* ── General ── */}
//             {activeSection === 'general' && (
//               <SectionCard key="general" title="General Settings" icon={<Globe className="w-5 h-5" />}>
//                 <Field label="Website Name" hint="Displayed in the browser tab and across the storefront.">
//                   <Input
//                     value={settings.websiteName}
//                     onChange={(v) => dispatch(updateWebsiteName(v))}
//                     placeholder="e.g. FreshMart"
//                   />
//                 </Field>
//                 <Field label="Currency Symbol" hint="Used throughout the store for pricing display.">
//                   <Input
//                     value={settings.currencySymbol}
//                     onChange={(v) => dispatch(updateCurrencySymbol(v))}
//                     placeholder="$"
//                   />
//                 </Field>
//                 <Field label="Tax Rate (%)" hint="Applied to all orders at checkout.">
//                   <Input
//                     type="number"
//                     value={settings.taxRate}
//                     onChange={(v) => dispatch(updateTaxRate(Number(v)))}
//                     prefix="%"
//                     placeholder="8.5"
//                   />
//                 </Field>
//               </SectionCard>
//             )}

//             {/* ── Banner ── */}
//             {activeSection === 'banner' && (
//               <SectionCard key="banner" title="Hero Banner Slides" icon={<Image className="w-5 h-5" />}>
//                 <p className="text-xs text-gray-400 -mt-2">
//                   Manage the rotating banner on your homepage. Each slide supports a title, subtitle, CTA text, and background image URL.
//                 </p>
//                 <div className="space-y-3">
//                   {settings.bannerSlides.map((slide:any) => (
//                     <div key={slide.id} className="border border-gray-100 rounded-xl overflow-hidden">
//                       {editingBannerId === slide.id ? (
//                         <div className="p-4 space-y-3 bg-green-50/40">
//                           <Field label="Title">
//                             <Input value={bannerDraft.title} onChange={(v) => setBannerDraft({ ...bannerDraft, title: v })} />
//                           </Field>
//                           <Field label="Subtitle">
//                             <Input value={bannerDraft.subtitle} onChange={(v) => setBannerDraft({ ...bannerDraft, subtitle: v })} />
//                           </Field>
//                           <Field label="Button Text">
//                             <Input value={bannerDraft.btnText} onChange={(v) => setBannerDraft({ ...bannerDraft, btnText: v })} />
//                           </Field>
//                           <Field label="Background Image URL">
//                             <Input value={bannerDraft.bg} onChange={(v) => setBannerDraft({ ...bannerDraft, bg: v })} placeholder="https://..." />
//                           </Field>
//                           <div className="flex gap-2 pt-1">
//                             <button onClick={saveBanner} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-medium hover:bg-green-700">
//                               <Check className="w-3.5 h-3.5" /> Save Slide
//                             </button>
//                             <button onClick={() => setEditingBannerId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium hover:bg-gray-200">
//                               <X className="w-3.5 h-3.5" /> Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-between p-4">
//                           <div className="flex items-center gap-3 min-w-0">
//                             {slide.bg && (
//                               <div
//                                 className="w-12 h-9 rounded-lg bg-cover bg-center shrink-0 border border-gray-200"
//                                 style={{ backgroundImage: `url(${slide.bg})` }}
//                               />
//                             )}
//                             <div className="min-w-0">
//                               <p className="text-sm font-medium text-gray-800 truncate">{slide.title}</p>
//                               <p className="text-xs text-gray-400 truncate">{slide.subtitle}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-1 shrink-0 ml-2">
//                             <button
//                               onClick={() => startEditBanner(slide)}
//                               className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
//                             >
//                               <Edit3 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => dispatch(removeBannerSlide(slide.id))}
//                               className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={addNewBanner}
//                   className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-green-200 text-green-600 text-sm font-medium rounded-xl hover:bg-green-50 transition-all"
//                 >
//                   <Plus className="w-4 h-4" /> Add New Slide
//                 </button>
//               </SectionCard>
//             )}

//             {/* ── Delivery ── */}
//             {activeSection === 'delivery' && (
//               <SectionCard key="delivery" title="Delivery Settings" icon={<Truck className="w-5 h-5" />}>
//                 <Field label="Standard Delivery Fee" hint="Charged when order total is below the free delivery threshold.">
//                   <Input
//                     type="number"
//                     value={settings.deliveryFee}
//                     onChange={(v) => dispatch(updateDeliveryFee(Number(v)))}
//                     prefix={settings.currencySymbol}
//                     placeholder="40"
//                   />
//                 </Field>
//                 <Field label="Free Delivery Threshold" hint="Orders above this amount get free delivery.">
//                   <Input
//                     type="number"
//                     value={settings.freeDeliveryThreshold}
//                     onChange={(v) => dispatch(updateFreeDeliveryThreshold(Number(v)))}
//                     prefix={settings.currencySymbol}
//                     placeholder="100"
//                   />
//                 </Field>
//                 <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 border border-green-100">
//                   <p className="font-medium mb-1">📦 Current Rule</p>
//                   <p className="text-xs text-green-600">
//                     Orders over <strong>{settings.currencySymbol}{settings.freeDeliveryThreshold}</strong> get free delivery.
//                     Otherwise, a <strong>{settings.currencySymbol}{settings.deliveryFee}</strong> delivery fee is applied.
//                   </p>
//                 </div>
//               </SectionCard>
//             )}

//             {/* ── Contact & Social ── */}
//             {activeSection === 'contact' && (
//               <>
//                 <SectionCard key="contact" title="Contact Information" icon={<Phone className="w-5 h-5" />}>
//                   <Field label="Support Email">
//                     <Input value={contactDraft.email} onChange={(v) => setContactDraft({ ...contactDraft, email: v })} placeholder="support@yourstore.com" />
//                   </Field>
//                   <Field label="Support Phone">
//                     <Input value={contactDraft.phone} onChange={(v) => setContactDraft({ ...contactDraft, phone: v })} placeholder="+1 (800) 000-0000" />
//                   </Field>
//                   <Field label="Business Address">
//                     <Input value={contactDraft.address} onChange={(v) => setContactDraft({ ...contactDraft, address: v })} placeholder="123 Main St, City, Country" />
//                   </Field>
//                 </SectionCard>
//                 <SectionCard key="social" title="Social Media Links" icon={<Share2 className="w-5 h-5" />}>
//                   <Field label="Facebook">
//                     <Input value={socialDraft.facebook} onChange={(v) => setSocialDraft({ ...socialDraft, facebook: v })} prefix="🔗" placeholder="https://facebook.com/..." />
//                   </Field>
//                   <Field label="Instagram">
//                     <Input value={socialDraft.instagram} onChange={(v) => setSocialDraft({ ...socialDraft, instagram: v })} prefix="🔗" placeholder="https://instagram.com/..." />
//                   </Field>
//                   <Field label="Twitter / X">
//                     <Input value={socialDraft.twitter} onChange={(v) => setSocialDraft({ ...socialDraft, twitter: v })} prefix="🔗" placeholder="https://twitter.com/..." />
//                   </Field>
//                 </SectionCard>
//               </>
//             )}

//             {/* ── Store Rules ── */}
//             {activeSection === 'store' && (
//               <SectionCard key="store" title="Store Rules" icon={<ShoppingCart className="w-5 h-5" />}>
//                 <Toggle
//                   enabled={settings.allowGuestCheckout}
//                   onToggle={() => dispatch(toggleGuestCheckout())}
//                   label="Guest Checkout"
//                   description="Allow users to checkout without creating an account."
//                 />
//                 <div className="py-3 border-b border-gray-50">
//                   <Field label="Max Items Per Cart" hint="Limit the number of individual products a user can add to their cart.">
//                     <Input
//                       type="number"
//                       value={settings.maxCartItems}
//                       onChange={(v) => dispatch(updateMaxCartItems(Number(v)))}
//                       placeholder="50"
//                     />
//                   </Field>
//                 </div>
//                 <div className="py-3">
//                   <Field label="Tax Rate (%)" hint="Tax percentage applied at checkout.">
//                     <Input
//                       type="number"
//                       value={settings.taxRate}
//                       onChange={(v) => dispatch(updateTaxRate(Number(v)))}
//                       prefix="%"
//                       placeholder="8.5"
//                     />
//                   </Field>
//                 </div>
//               </SectionCard>
//             )}

//             {/* ── Danger Zone ── */}
//             {activeSection === 'danger' && (
//               <SectionCard key="danger" title="Danger Zone" icon={<ShieldAlert className="w-5 h-5" />}>
//                 <Toggle
//                   enabled={settings.maintenanceMode}
//                   onToggle={() => dispatch(toggleMaintenanceMode())}
//                   label="Maintenance Mode"
//                   description="When enabled, the storefront is hidden from customers and shows a maintenance page."
//                 />
//                 {settings.maintenanceMode && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
//                   >
//                     <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
//                     <p className="text-xs text-amber-700 font-medium">
//                       Maintenance mode is <strong>active</strong>. Your store is currently hidden from customers.
//                     </p>
//                   </motion.div>
//                 )}
//                 <div className="pt-2 border-t border-gray-100">
//                   <p className="text-sm font-medium text-gray-700 mb-1">Reset All Settings</p>
//                   <p className="text-xs text-gray-400 mb-3">
//                     This will restore all settings to their factory defaults. This action cannot be undone.
//                   </p>
//                   <button
//                     onClick={handleReset}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${resetConfirm
//                         ? 'bg-red-600 text-white'
//                         : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
//                       }`}
//                   >
//                     {resetConfirm ? (
//                       <><Check className="w-4 h-4" /> Click again to confirm</>
//                     ) : (
//                       <><RotateCcw className="w-4 h-4" /> Reset to Defaults</>
//                     )}
//                   </button>
//                 </div>
//               </SectionCard>
//             )}
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminSettingsPage;







'use client';
// src/components/AdminSettingsPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import {
  Settings, Globe, Image, Truck, Phone, Share2,
  ShieldAlert, ShoppingCart, Save, RotateCcw,
  ChevronRight, Plus, Trash2, Edit3, Check, X,
  ToggleLeft, ToggleRight, AlertTriangle, Loader2,
} from 'lucide-react';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSettings, saveSettings, setLocalSettings, ISettings } from '@/redux/settingsSlice';

type SectionKey = 'general' | 'banner' | 'delivery' | 'contact' | 'social' | 'store' | 'danger';

const SectionCard = ({ children, title, icon }: { children: React.ReactNode; title: string; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-linear-to-r from-green-50 to-white">
      <span className="text-green-600">{icon}</span>
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="px-6 py-5 space-y-5">{children}</div>
  </motion.div>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', prefix }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; prefix?: string;
}) => (
  <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all overflow-hidden bg-gray-50">
    {prefix && <span className="px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-200 self-stretch flex items-center">{prefix}</span>}
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400" />
  </div>
);

const Toggle = ({ enabled, onToggle, label, description }: {
  enabled: boolean; onToggle: () => void; label: string; description?: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    <button onClick={onToggle}
      className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {enabled ? 'On' : 'Off'}
    </button>
  </div>
);

const navItems: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
  { key: 'banner', label: 'Banner Slides', icon: <Image className="w-4 h-4" /> },
  { key: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
  { key: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  { key: 'social', label: 'Social', icon: <Share2 className="w-4 h-4" /> },
  { key: 'store', label: 'Store Rules', icon: <ShoppingCart className="w-4 h-4" /> },
  { key: 'danger', label: 'Danger Zone', icon: <ShieldAlert className="w-4 h-4" /> },
];

const AdminSettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: settings, isLoading, isSaving, error } = useSelector((s: RootState) => s.settings);

  const [activeSection, setActiveSection] = useState<SectionKey>('general');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [draft, setDraft] = useState<ISettings>(settings);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [bannerDraft, setBannerDraft] = useState({ id: 0, title: '', subtitle: '', btnText: '', bg: '' });

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);
  useEffect(() => { setDraft(settings); }, [settings]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const updateDraft = (patch: Partial<ISettings>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    dispatch(setLocalSettings(draft));
    const result = await dispatch(saveSettings(draft));
    if (saveSettings.fulfilled.match(result)) {
      toast.success('Settings saved successfully!');
    }
  };

  const handleReset = async () => {
    if (!resetConfirm) { setResetConfirm(true); setTimeout(() => setResetConfirm(false), 4000); return; }
    await dispatch(saveSettings({ websiteName: 'FreshMart', deliveryFee: 40, freeDeliveryThreshold: 100, maintenanceMode: false, allowGuestCheckout: true, maxCartItems: 50, currencySymbol: '$', taxRate: 8.5 }));
    toast.success('Settings reset to defaults');
    setResetConfirm(false);
  };

  const startEditBanner = (slide: typeof bannerDraft) => { setBannerDraft(slide); setEditingBannerId(slide.id); };
  const saveBannerEdit = () => {
    updateDraft({ bannerSlides: draft.bannerSlides.map((s) => (s.id === bannerDraft.id ? bannerDraft : s)) });
    setEditingBannerId(null);
  };
  const addNewBanner = () => {
    const newSlide = { id: Date.now(), title: 'New Slide', subtitle: 'Subtitle here', btnText: 'Shop Now', bg: '' };
    updateDraft({ bannerSlides: [...draft.bannerSlides, newSlide] });
    startEditBanner(newSlide);
  };
  const removeBanner = (id: number) => updateDraft({ bannerSlides: draft.bannerSlides.filter((s) => s.id !== id) });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        <p className="text-sm">Loading settings…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-xl"><Settings className="w-5 h-5 text-green-600" /></div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Admin Settings</h1>
              <p className="text-xs text-gray-400">{draft.websiteName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${resetConfirm ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {resetConfirm ? <><AlertTriangle className="w-3.5 h-3.5" /> Confirm?</> : <><RotateCcw className="w-3.5 h-3.5" /> Reset</>}
            </button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 transition-all">
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        <aside className="w-48 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-24">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeSection === item.key ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                {item.icon} {item.label}
                {activeSection === item.key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-5 min-w-0">
          <AnimatePresence mode="wait">
            {activeSection === 'general' && (
              <SectionCard key="general" title="General Settings" icon={<Globe className="w-5 h-5" />}>
                <Field label="Website Name" hint="Shown in the browser tab and storefront header.">
                  <Input value={draft.websiteName} onChange={(v) => updateDraft({ websiteName: v })} placeholder="FreshMart" />
                </Field>
                <Field label="Currency Symbol">
                  <Input value={draft.currencySymbol} onChange={(v) => updateDraft({ currencySymbol: v })} placeholder="$" />
                </Field>
                <Field label="Tax Rate (%)" hint="Applied to all orders at checkout.">
                  <Input type="number" value={draft.taxRate} onChange={(v) => updateDraft({ taxRate: Number(v) })} prefix="%" placeholder="8.5" />
                </Field>
              </SectionCard>
            )}

            {activeSection === 'banner' && (
              <SectionCard key="banner" title="Hero Banner Slides" icon={<Image className="w-5 h-5" />}>
                <p className="text-xs text-gray-400 -mt-2">Edit slides shown on the homepage hero carousel. Click Save Changes when done.</p>
                <div className="space-y-3">
                  {draft.bannerSlides.map((slide) => (
                    <div key={slide.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      {editingBannerId === slide.id ? (
                        <div className="p-4 space-y-3 bg-green-50/40">
                          <Field label="Title"><Input value={bannerDraft.title} onChange={(v) => setBannerDraft({ ...bannerDraft, title: v })} /></Field>
                          <Field label="Subtitle"><Input value={bannerDraft.subtitle} onChange={(v) => setBannerDraft({ ...bannerDraft, subtitle: v })} /></Field>
                          <Field label="Button Text"><Input value={bannerDraft.btnText} onChange={(v) => setBannerDraft({ ...bannerDraft, btnText: v })} /></Field>
                          <Field label="Background Image URL"><Input value={bannerDraft.bg} onChange={(v) => setBannerDraft({ ...bannerDraft, bg: v })} placeholder="https://..." /></Field>
                          <div className="flex gap-2 pt-1">
                            <button onClick={saveBannerEdit} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-medium hover:bg-green-700"><Check className="w-3.5 h-3.5" /> Save Slide</button>
                            <button onClick={() => setEditingBannerId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200"><X className="w-3.5 h-3.5" /> Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 min-w-0">
                            {slide.bg && <div className="w-12 h-9 rounded-lg bg-cover bg-center shrink-0 border border-gray-200" style={{ backgroundImage: `url(${slide.bg})` }} />}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{slide.title}</p>
                              <p className="text-xs text-gray-400 truncate">{slide.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button onClick={() => startEditBanner(slide)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => removeBanner(slide.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addNewBanner} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-green-200 text-green-600 text-sm font-medium rounded-xl hover:bg-green-50 transition-all">
                  <Plus className="w-4 h-4" /> Add New Slide
                </button>
              </SectionCard>
            )}

            {activeSection === 'delivery' && (
              <SectionCard key="delivery" title="Delivery Settings" icon={<Truck className="w-5 h-5" />}>
                <Field label="Standard Delivery Fee" hint="Charged when order total is below the free delivery threshold.">
                  <Input type="number" value={draft.deliveryFee} onChange={(v) => updateDraft({ deliveryFee: Number(v) })} prefix={draft.currencySymbol} placeholder="40" />
                </Field>
                <Field label="Free Delivery Threshold" hint="Orders above this amount get free delivery.">
                  <Input type="number" value={draft.freeDeliveryThreshold} onChange={(v) => updateDraft({ freeDeliveryThreshold: Number(v) })} prefix={draft.currencySymbol} placeholder="100" />
                </Field>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="font-medium text-green-700 text-sm mb-1">📦 Current Rule</p>
                  <p className="text-xs text-green-600">Orders over <strong>{draft.currencySymbol}{draft.freeDeliveryThreshold}</strong> get free delivery. Otherwise a <strong>{draft.currencySymbol}{draft.deliveryFee}</strong> fee applies.</p>
                </div>
              </SectionCard>
            )}

            {activeSection === 'contact' && (
              <SectionCard key="contact" title="Contact Information" icon={<Phone className="w-5 h-5" />}>
                <Field label="Email"><Input value={draft.contactInfo.email} onChange={(v) => updateDraft({ contactInfo: { ...draft.contactInfo, email: v } })} placeholder="hello@yourstore.com" /></Field>
                <Field label="Phone"><Input value={draft.contactInfo.phone} onChange={(v) => updateDraft({ contactInfo: { ...draft.contactInfo, phone: v } })} placeholder="+1 (800) 000-0000" /></Field>
                <Field label="Address"><Input value={draft.contactInfo.address} onChange={(v) => updateDraft({ contactInfo: { ...draft.contactInfo, address: v } })} placeholder="123 Main St, City" /></Field>
              </SectionCard>
            )}

            {activeSection === 'social' && (
              <SectionCard key="social" title="Social Media Links" icon={<Share2 className="w-5 h-5" />}>
                <Field label="Facebook"><Input value={draft.socialLinks.facebook} onChange={(v) => updateDraft({ socialLinks: { ...draft.socialLinks, facebook: v } })} prefix="🔗" placeholder="https://facebook.com/..." /></Field>
                <Field label="Instagram"><Input value={draft.socialLinks.instagram} onChange={(v) => updateDraft({ socialLinks: { ...draft.socialLinks, instagram: v } })} prefix="🔗" placeholder="https://instagram.com/..." /></Field>
                <Field label="Twitter / X"><Input value={draft.socialLinks.twitter} onChange={(v) => updateDraft({ socialLinks: { ...draft.socialLinks, twitter: v } })} prefix="🔗" placeholder="https://twitter.com/..." /></Field>
              </SectionCard>
            )}

            {activeSection === 'store' && (
              <SectionCard key="store" title="Store Rules" icon={<ShoppingCart className="w-5 h-5" />}>
                <Toggle enabled={draft.allowGuestCheckout} onToggle={() => updateDraft({ allowGuestCheckout: !draft.allowGuestCheckout })} label="Guest Checkout" description="Allow users to checkout without an account." />
                <div className="py-3">
                  <Field label="Max Items Per Cart" hint="Limit products a user can add to cart.">
                    <Input type="number" value={draft.maxCartItems} onChange={(v) => updateDraft({ maxCartItems: Number(v) })} placeholder="50" />
                  </Field>
                </div>
              </SectionCard>
            )}

            {activeSection === 'danger' && (
              <SectionCard key="danger" title="Danger Zone" icon={<ShieldAlert className="w-5 h-5" />}>
                <Toggle enabled={draft.maintenanceMode} onToggle={() => updateDraft({ maintenanceMode: !draft.maintenanceMode })} label="Maintenance Mode" description="Hides the storefront from customers." />
                {draft.maintenanceMode && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">Maintenance mode is <strong>active</strong>. Click <strong>Save Changes</strong> to apply.</p>
                  </motion.div>
                )}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reset All Settings</p>
                  <p className="text-xs text-gray-400 mb-3">Restores all settings to factory defaults. Cannot be undone.</p>
                  <button onClick={handleReset} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${resetConfirm ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}>
                    {resetConfirm ? <><Check className="w-4 h-4" /> Click again to confirm</> : <><RotateCcw className="w-4 h-4" /> Reset to Defaults</>}
                  </button>
                </div>
              </SectionCard>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;