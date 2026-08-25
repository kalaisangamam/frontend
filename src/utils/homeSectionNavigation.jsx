import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const HOME_SECTIONS = Object.freeze({
  about: 'about',
  programs: 'programs',
  masters: 'masters',
  events: 'events',
  gallery: 'gallery',
  contact: 'contact',
});

export const homeSectionStorageKey = (historyKey) => `kalai-sangamam:home-section:${historyKey}`;

/** Records the Home section that initiated an internal CTA navigation. */
export const HomeSectionLink = ({ section, state, onClick, ...props }) => {
  const location = useLocation();

  const handleClick = (event) => {
    onClick?.(event);
    const isNormalNavigation = !event.defaultPrevented
      && event.button === 0
      && !event.metaKey
      && !event.altKey
      && !event.ctrlKey
      && !event.shiftKey;

    if (isNormalNavigation && location.pathname === '/') {
      sessionStorage.setItem(homeSectionStorageKey(location.key), section);
    }
  };

  const navigationState = location.pathname === '/'
    ? { ...state, returnTo: '/', returnSection: section }
    : state;

  return <Link {...props} state={navigationState} onClick={handleClick} />;
};
