// components/DeliveryBoyDashboard.tsx
'use client';
import axios from 'axios';
import React, { useEffect } from 'react'

const DeliveryBoyDashboard = () => {
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignments")
        console.log(result.data);

      } catch (error) {

      }
    }
    fetchAssignment();
  }, [])

  return (
    <div>
      Delivery Boy Dashboard
    </div>
  )
}

export default DeliveryBoyDashboard

