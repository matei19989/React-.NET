import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './layout'  // Make sure this import is correct

console.log("main.tsx is executing");

const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Layout />
    </React.StrictMode>
  );
  console.log("Rendered Layout into root element");
} else {
  console.error("Could not find root element to render into!");
}