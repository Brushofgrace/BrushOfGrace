import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-4xl mx-auto">
        {/* ContactForm removed from here */}
        <div className="text-center mt-8 border-t border-slate-700 pt-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Brush Of Grace. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Artwork displayed is for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;