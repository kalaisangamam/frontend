import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo1.png';

const BRAND_SIZES = {
  navbar: {
    link: 'gap-2 sm:gap-2.5 lg:gap-3',
    logo: 'h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14',
    primary: 'text-[0.95rem] sm:text-lg lg:text-xl',
    secondary: 'text-[0.58rem] sm:text-[0.65rem]',
  },
  footer: {
    link: 'mb-5 gap-3 sm:gap-4',
    logo: 'h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24',
    primary: 'text-xl sm:text-2xl',
    secondary: 'text-[0.65rem] sm:text-xs',
  },
};

const BrandIdentity = ({ placement }) => {
  const sizes = BRAND_SIZES[placement];

  return (
    <Link
      to="/"
      className={`group flex shrink-0 items-center ${sizes.link}`}
      aria-label="Kalai Sangamam Dindigul home"
    >
      <img
        src={logo}
        alt="Kalai Sangamam Dindigul"
        width="1268"
        height="1241"
        className={`${sizes.logo} shrink-0 object-contain transition-transform duration-200 group-hover:scale-[1.03]`}
      />
      <span className="min-w-0 whitespace-nowrap">
        <span className={`block font-display font-semibold leading-none tracking-tight text-parchment-100 transition-colors group-hover:text-brass-400 ${sizes.primary}`}>
          Kalai Sangamam  
        </span>
        <span className={`mt-1 block font-body font-bold uppercase leading-none tracking-[0.16em] text-brass-400 ${sizes.secondary}`}>
          Dindigul
        </span>
      </span>
    </Link>
  );
};

export default BrandIdentity;
