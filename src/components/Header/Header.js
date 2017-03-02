/**
 * @module components/header
 * Reusable Header Component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.scss';

/**
 * Header component
 */
const Header = () => (
  <div>
    <div className={styles.header}>You are at an app</div>
    <Link to="/" className={styles.link} >Home</Link>
    <Link to="/ping" className={styles.link} >Ping</Link>
  </div>
);

export default Header;
