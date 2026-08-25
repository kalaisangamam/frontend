import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-ink-950 text-center px-4">
    <p className="font-mono text-brass-500 text-sm mb-3">404</p>
    <h1 className="font-display text-3xl text-parchment-100 mb-4">Page not found</h1>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
