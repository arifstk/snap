// unauthorized page
import React from 'react'

const UnAuthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold text-red-600'>Access Denied 🚫</h1>
      <p className='text-gray-700'>You can not access this page</p>
    </div>
  )
}

export default UnAuthorized;

