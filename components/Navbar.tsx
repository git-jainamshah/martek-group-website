'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/martek-offical-logo.png"
              alt="Martek Group Logo"
              width={150}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/abstracts"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              ABSTRACTS
            </Link>
            
            <Link
              href="/services"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              BUSINESS SERVICES
            </Link>

            <Link
              href="/blogs"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              BLOGS
            </Link>
            
            <Link
              href="/contact"
              className="btn-primary"
            >
              BOOK NOW
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link
              href="/abstracts"
              className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              ABSTRACTS
            </Link>
            <Link
              href="/services"
              className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              BUSINESS SERVICES
            </Link>
            <Link
              href="/blogs"
              className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              BLOGS
            </Link>
            <Link
              href="/contact"
              className="block mt-4 btn-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              BOOK NOW
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
