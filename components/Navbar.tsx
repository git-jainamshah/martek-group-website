'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const serviceItems = [
    'Web Development',
    'Data & Analytics',
    'Social Media',
    'SEO & Ads',
    'Engineering'
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic classes based on scroll state
  const navBgClass = scrolled
    ? 'bg-white/10 dark:bg-black/80 backdrop-blur-md border-b border-white/20 dark:border-border shadow-sm py-[2.2rem] rounded-b-[2.5rem]'
    : 'bg-transparent py-[2.2rem]'

  const textClass = scrolled ? 'text-black dark:text-white' : 'text-white'
  const hoverClass = 'hover:text-primary transition-colors'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${navBgClass}`}
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10 group">
          <Image
            src="/assets/martek-only-logo.png"
            alt="Martek Group Logo"
            width={32}
            height={32}
            className="w-auto h-8 object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className={`text-xl md:text-2xl tracking-tight ${textClass} transition-colors`}>
            <span className="font-bold">Martek</span> <span className="font-light">Group</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/about"
            className={`${textClass} ${hoverClass} uppercase text-sm tracking-widest font-medium`}
          >
            <span className="font-bold">About</span> Us
          </Link>

          {/* Business Services Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link
              href="/services"
              className={`${textClass} ${hoverClass} uppercase text-sm tracking-widest cursor-pointer flex items-center gap-1 font-medium`}
            >
              <span className="font-bold">Business</span> Services
            </Link>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-300 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
              <div className="bg-background/95 backdrop-blur-xl border border-border rounded-xl p-4 w-64 shadow-xl">
                {serviceItems.map((item, index) => (
                  <Link
                    key={index}
                    href={`/services#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-foreground hover:text-primary hover:bg-muted/50 px-4 py-3 rounded-lg transition-colors text-sm font-medium uppercase tracking-wide"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/case-studies"
            className={`${textClass} ${hoverClass} uppercase text-sm tracking-widest font-bold`}
          >
            Case Studies
          </Link>

          <Link
            href="/blogs"
            className={`${textClass} ${hoverClass} uppercase text-sm tracking-widest font-bold`}
          >
            Blogs
          </Link>

          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-primary-foreground hover:text-white transition-all uppercase text-sm font-bold tracking-widest px-8 py-3 rounded-full shadow-lg hover:shadow-primary/30"
          >
            Book Now
          </Link>

          <ModeToggle className={textClass} />
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle className={textClass} />
          <button
            className={`z-50 relative ${isOpen ? 'text-foreground' : textClass}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          <Link
            href="/about"
            className="text-2xl text-foreground uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-bold">About</span> <span className="font-light">Us</span>
          </Link>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/services"
              className="text-2xl text-foreground uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-bold">Business</span> <span className="font-light">Services</span>
            </Link>
            {/* Mobile Service Links */}
            <div className="flex flex-col items-center gap-2">
              {serviceItems.map((item, index) => (
                <Link
                  key={index}
                  href={`/services#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-muted-foreground text-sm uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/case-studies"
            className="text-2xl text-foreground uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-bold">Case</span> Studies
          </Link>

          <Link
            href="/blogs"
            className="text-2xl text-foreground uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-bold">Blogs</span>
          </Link>

          <Link
            href="/contact"
            className="bg-primary text-primary-foreground text-xl font-bold uppercase tracking-widest px-10 py-4 rounded-full mt-8"
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  )
}