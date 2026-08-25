import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import { publicService } from '../services/publicService';

const PublicLayout = ({ children }) => {
  const [site, setSite] = useState(null);

  useEffect(() => {
    publicService.getSiteSettings().then(({ data }) => setSite(data.data)).catch(() => {});
  }, []);

  return (
    <div className="public-site min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </div>
  );
};

export default PublicLayout;
