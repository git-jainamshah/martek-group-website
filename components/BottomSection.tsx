'use client'

import Link from 'next/link'

export default function BottomSection() {
  return (
    <section className="bg-background py-16 md:py-24 border-t border-border">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Browser Window Mockup */}
          <div className="order-2 lg:order-1 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-border/50">
              {/* Browser Window Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                {/* Window Controls */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                {/* Browser Icons - kept simplified */}
                <div className="flex gap-3 ml-4 opacity-50 text-black">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </div>
                </div>
                {/* URL Bar */}
                <div className="flex-1 ml-2 bg-white rounded-md h-7 flex items-center px-3 text-xs text-gray-500 shadow-sm">
                  martekgroup.com/trends
                </div>
              </div>

              {/* Browser Content */}
              <div className="flex h-[400px] md:h-[500px] bg-white text-black">
                {/* Main Content Area */}
                <div className="flex-1 p-6 relative overflow-hidden">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Trending Now</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex gap-4 items-start border border-gray-100">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-gray-900">Digital Transformation</h4>
                        <p className="text-sm text-gray-600 mt-1">Why every business needs a digital strategy.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex gap-4 items-start border border-gray-100">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-gray-900">Data-Driven Decisions</h4>
                        <p className="text-sm text-gray-600 mt-1">Analytics to outpace competitors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text and Buttons */}
          <div className="order-1 lg:order-2 flex flex-col justify-center text-foreground">
            <div className="space-y-8 pl-0 lg:pl-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-foreground">
                  Internet has made us all popular,<br /><br />
                  <span className="font-bold">But now it's time to be <span className="relative inline-block"><span className="relative z-10">relevant</span><span className="absolute bottom-1 left-[-4px] right-[-4px] h-[0.3em] bg-yellow-200/80 -rotate-1 skew-x-3 z-0 rounded-sm"></span></span>.</span>
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/services"
                  className="bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase py-4 px-10 rounded-full transition-all duration-300 text-center text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1"
                >
                  Learn How
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-4 px-10 rounded-full transition-all duration-300 text-center text-lg hover:shadow-lg hover:-translate-y-1"
                >
                  Call Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


