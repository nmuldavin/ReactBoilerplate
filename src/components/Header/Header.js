/**
 * @module components/header
 * Reusable Header Component
 */
import React from 'react';
import { Link } from 'react-router';

/**
 * Header component
 */
const Header = () => (
  <div>
    <div>You are at an app</div>
    <Link to="/">Home</Link>
    <Link to="/ping">Ping</Link>
  </div>
);

export default Header;
