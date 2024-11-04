import React from 'react';
import { clsx } from 'clsx';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={clsx(styles.footer, 'bg-gray-100 p-4 text-center')}>
      <p className="text-gray-600">
        &copy; {new Date().getFullYear()} Fitness Tracker. All rights reserved.
      </p>
      <ul className="flex justify-center mt-2">
        <li className="ml-2">
          <a href="/" className="text-gray-600 hover:text-brand-primary">
            About Us
          </a>
        </li>
        <li className="ml-2">
          <a href="/" className="text-gray-600 hover:text-brand-primary">
            Privacy Policy
          </a>
        </li>
        <li className="ml-2">
          <a href="/" className="text-gray-600 hover:text-brand-primary">
            Terms of Service
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;