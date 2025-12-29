/**
 * Courier data with logos
 * Using local assets for reliable loading
 */

// Import logo images from assets
import jneLogo from '../assets/jne.png';
import jntLogo from '../assets/jnt.png';
import sicepatLogo from '../assets/sicepat.png';
import posLogo from '../assets/pos.png';
import stpLogo from '../assets/stp.png';

export const COURIERS = [
  {
    code: 'jne',
    name: 'JNE',
    fullName: 'Jalur Nugraha Ekakurir',
    logo: jneLogo,
    bgColor: '#1E3A8A', // Navy Blue
    textColor: '#DC2626' // Red
  },
  {
    code: 'jnt',
    name: 'J&T',
    fullName: 'J&T Express',
    logo: jntLogo,
    bgColor: '#DC2626', // Red
    textColor: '#FFFFFF'
  },
  {
    code: 'sicepat',
    name: 'SiCepat',
    fullName: 'SiCepat Ekspres',
    logo: sicepatLogo,
    bgColor: '#991B1B', // Dark Red
    textColor: '#FFFFFF'
  },
  {
    code: 'pos',
    name: 'POS',
    fullName: 'POS Indonesia',
    logo: posLogo,
    bgColor: '#EA580C', // Orange
    textColor: '#FFFFFF'
  },
  {
    code: 'stp',
    name: 'STP',
    fullName: 'STP Express',
    logo: stpLogo,
    bgColor: '#0284C7', // Blue
    textColor: '#FFFFFF'
  },
  {
    code: 'tiki',
    name: 'TIKI',
    fullName: 'Titipan Kilat',
    logo: '/couriers/tiki.png',
    bgColor: '#FBBF24', // Yellow
    textColor: '#000000'
  },
  {
    code: 'ninja',
    name: 'Ninja',
    fullName: 'Ninja Xpress',
    logo: '/couriers/ninja.png',
    bgColor: '#000000', // Black
    textColor: '#FFFFFF'
  },
  {
    code: 'sap',
    name: 'SAP',
    fullName: 'SAP Express',
    logo: '/couriers/sap.png',
    bgColor: '#0284C7', // Blue
    textColor: '#FFFFFF'
  },
  {
    code: 'wahana',
    name: 'Wahana',
    fullName: 'Wahana Prestasi Logistik',
    logo: '/couriers/wahana.png',
    bgColor: '#DC2626', // Red
    textColor: '#FFFFFF'
  },
  {
    code: 'lion',
    name: 'Lion',
    fullName: 'Lion Parcel',
    logo: '/couriers/lion.png',
    bgColor: '#FBBF24', // Yellow
    textColor: '#000000'
  }
];

/**
 * Get courier by code
 */
export const getCourierByCode = (code) => {
  return COURIERS.find(c => c.code === code);
};

/**
 * Get courier logo by code
 */
export const getCourierLogo = (code) => {
  const courier = getCourierByCode(code);
  return courier ? courier.logo : null;
};

/**
 * Get courier name by code
 */
export const getCourierName = (code) => {
  const courier = getCourierByCode(code);
  return courier ? courier.name : code;
};

export default COURIERS;
