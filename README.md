<img width="1919" height="1079" alt="Screenshot 2026-05-14 002910" src="https://github.com/user-attachments/assets/a6becbcf-a4c5-4065-9da7-3cb51338c5a1" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002859" src="https://github.com/user-attachments/assets/2e0bdc4e-1f5d-4682-be76-a96be7916463" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002839" src="https://github.com/user-attachments/assets/e5a38f4d-d7d0-4441-8a62-f0956608c35e" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002815" src="https://github.com/user-attachments/assets/3e10bb96-7149-4911-a8f4-aa7173fbc83f" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002802" src="https://github.com/user-attachments/assets/75425afb-9354-42e0-8375-5d0d52709b8f" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002745" src="https://github.com/user-attachments/assets/50b7aa97-c24a-46c6-9e6c-60bc2f73a961" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002728" src="https://github.com/user-attachments/assets/ad1fd002-2a58-4321-8b5b-aee7155c71f8" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002706" src="https://github.com/user-attachments/assets/53bb8641-2b43-47dc-82a8-1ef459d1084b" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002706 - Copy" src="https://github.com/user-attachments/assets/95e64c7c-cfb9-489f-b78d-9019c3235113" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002659" src="https://github.com/user-attachments/assets/c774e1e5-0790-436b-b2de-1ed6b3c91c7d" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002659 - Copy" src="https://github.com/user-attachments/assets/06dc0768-3c91-47db-b296-36d271b1b82f" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002650" src="https://github.com/user-attachments/assets/deadacd4-adbe-4535-8628-719843f0807e" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002650 - Copy" src="https://github.com/user-attachments/assets/51252d8e-b894-4529-af5d-36f9131d2df3" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002633" src="https://github.com/user-attachments/assets/fc9c76df-3608-493b-be52-69cd05354a31" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002633 - Copy" src="https://github.com/user-attachments/assets/f6b3e6c2-1c35-47bc-b0ab-34afc631d741" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002551 - Copy" src="https://github.com/user-attachments/assets/c22ad20e-cbcd-4d60-b0fd-0197a64cb41b" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002531" src="https://github.com/user-attachments/assets/f2a72aa1-5359-4752-90cf-7dd0f76582e7" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002517" src="https://github.com/user-attachments/assets/f2955691-b080-4b43-a4eb-539f3a594a4c" />
<img width="1919" height="1076" alt="Screenshot 2026-05-14 002455" src="https://github.com/user-attachments/assets/e2023ad7-7bb6-46e1-aa37-2c9a717a4d4c" />
<img width="1919" height="1079" alt="Screenshot 2026-05-14 002350" src="https://github.com/user-attachments/assets/c0a5367c-dc5b-4c78-94b5-47ed19ff257d" />
## 🛒 Grocery Store App

A full-stack grocery e-commerce web application built with **Next.js**, **Redux Toolkit**, **Tailwind CSS**, **stripe Payment**, **socket Server**  — featuring real-time product search, autocomplete suggestions,  real-time chat, OTP for delivery confirmation, stripe payment, and a clean responsive UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| API | Next.js API Routes |
| socket Server for instant messaging (other repo)
| websocket for stripe payment check (other repo)
| 

---

## ✨ Features

- 🔍 **Real-time Search** — Live product filtering as the user types
- 💡 **Autocomplete Dropdown** — Suggests up to 6 matching product names instantly
- ❌ **No Results Feedback** — Shows a friendly message when no products match the query
- 🔄 **Redux Global State** — Search query synced across all components via Redux
- 🧭 **Smart Routing** — Automatically redirects to home page on search to show filtered results
- 🧹 **Clear Button** — One-click input reset with focus restoration
- ⌨️ **Keyboard Friendly** — Full form submit support via Enter key
---

## 📁 Project Structure

```
├── 📁 public
│   ├── 📁 uploads
│   │   └── 🖼️ 1778262520781-1000048116.jpg
│   ├── 🖼️ file.svg
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 about
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 admin
│   │   │   ├── 📁 add-category
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 add-grocery
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 manage-orders
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 settings
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 view-grocery
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 api
│   │   │   ├── 📁 admin
│   │   │   │   ├── 📁 add-category
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 add-grocery
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 delete-category
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📄 route.ts
│   │   │   │   ├── 📁 delete-grocery
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📄 route.ts
│   │   │   │   ├── 📁 edit-category
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📄 route.ts
│   │   │   │   ├── 📁 get-groceries
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 get-orders
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 update-grocery
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📄 route.ts
│   │   │   │   └── 📁 update-order-status
│   │   │   │       └── 📁 [orderId]
│   │   │   │           └── 📄 route.ts
│   │   │   ├── 📁 auth
│   │   │   │   ├── 📁 [...nextauth]
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📁 register
│   │   │   │       └── 📄 route.ts
│   │   │   ├── 📁 categories
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 chat
│   │   │   │   ├── 📁 messages
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 room-info
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📁 save
│   │   │   │       └── 📄 route.ts
│   │   │   ├── 📁 check-for-admin
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 delivery
│   │   │   │   ├── 📁 assignment
│   │   │   │   │   └── 📁 [id]
│   │   │   │   │       └── 📁 accept-assignment
│   │   │   │   │           └── 📄 route.ts
│   │   │   │   ├── 📁 current-order
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 get-assignments
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📁 otp
│   │   │   │       ├── 📁 send
│   │   │   │       │   └── 📄 route.ts
│   │   │   │       └── 📁 verify
│   │   │   │           └── 📄 route.ts
│   │   │   ├── 📁 grocery
│   │   │   │   └── 📁 similar
│   │   │   │       └── 📁 [category]
│   │   │   │           └── 📄 route.ts
│   │   │   ├── 📁 me
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 products
│   │   │   │   └── 📁 names
│   │   │   │       └── 📄 route.ts
│   │   │   ├── 📁 settings
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 socket
│   │   │   │   ├── 📁 connect
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📁 update-location
│   │   │   │       └── 📄 route.ts
│   │   │   ├── 📁 upload
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 user
│   │   │   │   ├── 📁 edit-role-mobile
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 get-order
│   │   │   │   │   └── 📁 [orderId]
│   │   │   │   │       └── 📄 route.ts
│   │   │   │   ├── 📁 my-orders
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   ├── 📁 order
│   │   │   │   │   └── 📄 route.ts
│   │   │   │   └── 📁 payment
│   │   │   │       └── 📄 route.ts
│   │   │   └── 📁 webhook
│   │   │       └── 📄 route.ts
│   │   ├── 📁 contact
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 help-center
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 maintenance
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 offer
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 privacy
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 register
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 unauthorized
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 user
│   │   │   ├── 📁 cart
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 checkout
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 grocery
│   │   │   │   └── 📁 [id]
│   │   │   │       ├── 📄 GroceryDetailClient.tsx
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📁 my-orders
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 order-success
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 track-order
│   │   │       └── 📁 [orderId]
│   │   │           └── 📄 page.tsx
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 assets
│   │   └── 🖼️ googleLogo.png
│   ├── 📁 components
│   │   ├── 📄 AdminDashboard.tsx
│   │   ├── 📄 AdminDashboardClient.tsx
│   │   ├── 📄 AdminOrderCard.tsx
│   │   ├── 📄 AdminSettingsPage.tsx
│   │   ├── 📄 BannerImageUploader.tsx
│   │   ├── 📄 CategorySlider.tsx
│   │   ├── 📄 DeliveryBoy.tsx
│   │   ├── 📄 DeliveryBoyDashboard.tsx
│   │   ├── 📄 DeliveryChat.tsx
│   │   ├── 📄 EditRoleMobile.tsx
│   │   ├── 📄 Footer.tsx
│   │   ├── 📄 GeoUpdater.tsx
│   │   ├── 📄 GroceryItemCard.tsx
│   │   ├── 📄 GrocerySection.tsx
│   │   ├── 📄 HeroSection.tsx
│   │   ├── 📄 LiveMap.tsx
│   │   ├── 📄 LiveMapClient.tsx
│   │   ├── 📄 MaintenancePage.tsx
│   │   ├── 📄 MapView.tsx
│   │   ├── 📄 MapViewWrapper.tsx
│   │   ├── 📄 Navbar.tsx
│   │   ├── 📄 RegisterForm.tsx
│   │   ├── 📄 SearchBar.tsx
│   │   ├── 📄 UserChats.tsx
│   │   ├── 📄 UserDashboard.tsx
│   │   ├── 📄 UserOrderCard.tsx
│   │   └── 📄 Welcome.tsx
│   ├── 📁 hooks
│   │   └── 📄 useGetMe.tsx
│   ├── 📁 lib
│   │   ├── 📄 cloudinary.ts
│   │   ├── 📄 db.ts
│   │   ├── 📄 emitEventHandler.ts
│   │   ├── 📄 mailer.ts
│   │   └── 📄 socket.ts
│   ├── 📁 models
│   │   ├── 📄 category.model.ts
│   │   ├── 📄 deliveryAssignment.model.ts
│   │   ├── 📄 grocery.model.ts
│   │   ├── 📄 message.model.ts
│   │   ├── 📄 order.model.ts
│   │   ├── 📄 settings.model.ts
│   │   └── 📄 user.model.ts
│   ├── 📁 redux
│   │   ├── 📄 StoreProvider.tsx
│   │   ├── 📄 cartSlice.ts
│   │   ├── 📄 settingsSlice.ts
│   │   ├── 📄 store.ts
│   │   └── 📄 userSlice.ts
│   ├── 📄 InitUser.tsx
│   ├── 📝 README.md
│   ├── 📄 auth.ts
│   ├── 📄 global.d.ts
│   ├── 📄 next-auth.d.ts
│   ├── 📄 provider.tsx
│   └── 📄 proxy.ts
├── ⚙️ .gitignore
├── 📄 eslint.config.mjs
├── 📄 next.config.ts
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
└── ⚙️ tsconfig.json
---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

# Clone the repository
git clone https://github.com/your-username/grocery-store-app.git

# Navigate into the project
cd grocery-store-app

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔍 How Search Works

1. On mount, `SearchBar` fetches all product names from `/api/products/names`
2. As the user types, names are filtered **locally** (no extra API calls)
3. Up to **6 suggestions** are shown in a dropdown
4. If **no match** is found, a "Nothing matched — please try again" message appears
5. On selecting a suggestion or submitting the form, the query is dispatched to **Redux** and the user is navigated to the home page to view filtered results

---

## 🧠 State Management

Redux Toolkit manages the global `searchQuery` state via `userSlice`. This allows any component in the app to read or update the current search term without prop drilling.

```ts
dispatch(setSearchQuery(value));
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

> Built with ❤️ using Next.js & Redux Toolkit

