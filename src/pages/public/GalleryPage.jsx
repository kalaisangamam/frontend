import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Gallery from '../../components/gallery/Gallery.jsx';

const GalleryPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">
      <Gallery />
    </div>
  </PublicLayout>
);

export default GalleryPage;
