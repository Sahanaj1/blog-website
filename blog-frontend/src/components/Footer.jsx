import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-200 p-4">
      <div className="container mx-auto">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} Blog-App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
