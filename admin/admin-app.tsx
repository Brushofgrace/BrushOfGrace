import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminUploadPage from './AdminUploadPage';

const rootElement = document.getElementById('admin-root');
if (!rootElement) {
  throw new Error("Could not find admin-root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AdminUploadPage />
  </React.StrictMode>
);