import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiX, FiPlayCircle } from 'react-icons/fi';
import { HomeSectionLink, HOME_SECTIONS } from '../../utils/homeSectionNavigation.jsx';
import SectionHeading from '../common/SectionHeading';
import { SkeletonGrid, ErrorState, EmptyState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

const CATEGORIES = ['All', 'Silambam', 'Karate', 'Yoga', 'Skating', 'Archery', 'Hindi', 'Training', 'Competitions', 'Events', 'Award Ceremony'];

const GalleryItem = ({ item, index, onSelect, className = '' }) => (
  <motion.button
    key={item.id}
    initial={{ opacity: 0, scale: 0.96 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: (index % 7) * 0.04 }}
    onClick={() => onSelect(item)}
    className={`relative overflow-hidden rounded-md group bg-ink-700 ${className}`}
  >
    <img
      src={item.media_type === 'video' ? item.video_url : item.image_url}
      alt={item.title || item.category}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
    {item.media_type === 'video' && (
      <FiPlayCircle className="absolute inset-0 m-auto text-3xl text-parchment-100 drop-shadow" />
    )}
  </motion.button>
);

const Gallery = ({ preview = false }) => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setItems(null);
    publicService
      .getGallery(active === 'All' ? undefined : active)
      .then(({ data }) => setItems(data.data))
      .catch(() => setError(true));
  }, [active]);

  // A stable preview makes the home composition intentional and keeps every
  // item (including these seven) available on the full Gallery route.
  const previewItems = items?.slice(0, 7) || [];
  const lightboxIndex = lightbox && items ? items.findIndex((item) => item.id === lightbox.id) : -1;
  const showPrevious = () => {
    if (!items?.length || lightboxIndex < 0) return;
    setLightbox(items[(lightboxIndex - 1 + items.length) % items.length]);
  };
  const showNext = () => {
    if (!items?.length || lightboxIndex < 0) return;
    setLightbox(items[(lightboxIndex + 1) % items.length]);
  };

  return (
    <section id="gallery" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl">
        <SectionHeading eyebrow="Gallery" title="Moments from the mat, the ring and the field" />

        {!preview && <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`min-h-10 text-xs px-4 py-2 rounded-full border transition-colors ${
                active === c
                  ? 'bg-brass-500 text-onaccent border-brass-500 font-semibold'
                  : 'border-parchment-100/15 text-slate-400 hover:border-brass-500/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>}

        {!items && !error && <SkeletonGrid count={preview ? 7 : 8} className="sm:grid-cols-3 lg:grid-cols-4" />}
        {error && <ErrorState message="Couldn't load the gallery right now." />}
        {items && items.length === 0 && <EmptyState message="No media in this category yet." />}

        {items && items.length > 0 && (
          <>
          {preview ? (
            <div className="gallery-preview-grid">
              {previewItems[0] && <GalleryItem item={previewItems[0]} index={0} onSelect={setLightbox} className="gallery-preview__large" />}
              <div className="gallery-preview__mediums">
                {previewItems.slice(1, 3).map((item, index) => (
                  <GalleryItem key={item.id} item={item} index={index + 1} onSelect={setLightbox} />
                ))}
              </div>
              <div className="gallery-preview__smalls">
                {previewItems.slice(3, 7).map((item, index) => (
                  <GalleryItem key={item.id} item={item} index={index + 3} onSelect={setLightbox} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {items.map((item, index) => (
                <GalleryItem key={item.id} item={item} index={index} onSelect={setLightbox} className="aspect-square" />
              ))}
            </div>
          )}
          {preview && (
            <div className="mt-8 flex justify-center">
              <HomeSectionLink to="/gallery" section={HOME_SECTIONS.gallery} className="btn-secondary group w-40 sm:w-auto">
                View All Photos
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </HomeSectionLink>
            </div>
          )}
          </>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink-950/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-parchment-100 text-2xl" onClick={() => setLightbox(null)}>
              <FiX />
            </button>
            {items.length > 1 && (
              <>
                <button type="button" aria-label="Previous gallery item" onClick={(e) => { e.stopPropagation(); showPrevious(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-parchment-100/20 bg-ink-900/70 p-3 text-2xl text-parchment-100 transition-colors hover:border-brass-400 hover:text-brass-400 sm:left-8">
                  <FiChevronLeft />
                </button>
                <button type="button" aria-label="Next gallery item" onClick={(e) => { e.stopPropagation(); showNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-parchment-100/20 bg-ink-900/70 p-3 text-2xl text-parchment-100 transition-colors hover:border-brass-400 hover:text-brass-400 sm:right-8">
                  <FiChevronRight />
                </button>
              </>
            )}
            <div className="max-h-[85vh] max-w-full" onClick={(e) => e.stopPropagation()}>
              {lightbox.media_type === 'video' ? (
                <video src={lightbox.video_url} controls autoPlay className="max-h-[72vh] max-w-full rounded-md" />
              ) : (
                <img src={lightbox.image_url} alt={lightbox.title || lightbox.category} className="max-h-[72vh] max-w-full rounded-md object-contain" />
              )}
              <div className="mt-3 text-center">
                <p className="mt-1 text-xs text-brass-400">{lightbox.category}</p>
                <h3 className="font-display text-lg font-semibold text-parchment-100">{lightbox.title || lightbox.category}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
