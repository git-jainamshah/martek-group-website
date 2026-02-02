import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Twitter, Youtube, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 text-foreground py-20 border-t border-border">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <Link href="/" className="inline-block mb-4">
              <div className="bg-white rounded-full p-6 w-28 h-28 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-shadow duration-300">
                <Image
                  src="/assets/martek-only-logo.png"
                  alt="Martek Group Logo"
                  width={60}
                  height={60}
                  className="w-auto h-12"
                />
              </div>
            </Link>

            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Martek Group</h3>

            <div className="flex space-x-6">
              <Link href="https://instagram.com" className="bg-white/10 p-2 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com" className="bg-white/10 p-2 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="https://youtube.com" className="bg-white/10 p-2 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link href="/blogs" className="text-muted-foreground hover:text-primary transition-colors text-sm">News & Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Services</h3>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Web Development</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Data Analytics</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Digital Marketing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>info@martekgroup.com</span>
              </li>
              <li className="flex items-start space-x-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Toronto, ON, Canada</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} Martek Group. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}