import React from 'react'
import { useLocation, Navigate } from 'react-router-dom';

type ProtectRoutesProps = {
  children: React.ReactNode;
};

function ProtectRoutes({ children }: ProtectRoutesProps) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectRoutes
