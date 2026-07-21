import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';

export const OrderHistory: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Centralize order history checks inside profile page
    navigate('/profile?tab=orders', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
      <Loader />
    </div>
  );
};
export default OrderHistory;
