import React from "react";

function Footer() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="max-h-[9%] bg-gradient-to-b from-[#b9c8d1] to-[#f1f1c9] relative mt-6 py-4">
      <div className="max-w-full mx-auto px-4 flex flex-col md:flex-row justify-center items-center">
        {/* Copyright */}
        <div className="text-sm mt-4 md:mt-0">
          &copy; {currentYear} CrystalEstate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
