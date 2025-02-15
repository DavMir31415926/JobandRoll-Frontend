"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // For mobile menu icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          JobAndRoll
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          <Link href="/companies" className="hover:underline">Companies</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/post-job" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200">
            Post a Job
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-blue-700 p-4 flex flex-col space-y-4">
          <Link href="/" className="hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/jobs" className="hover:underline" onClick={() => setIsOpen(false)}>Jobs</Link>
          <Link href="/companies" className="hover:underline" onClick={() => setIsOpen(false)}>Companies</Link>
          <Link href="/contact" className="hover:underline" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/post-job" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => setIsOpen(false)}>
            Post a Job
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
