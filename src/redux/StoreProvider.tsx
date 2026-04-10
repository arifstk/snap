// StoreProvider.tsx
'use client';
import React from 'react'
import { Provider } from 'react-redux';
import { store } from './store';

const StoreProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default StoreProvider;

// to use layout.tsx because of layout.tsx not a client component
