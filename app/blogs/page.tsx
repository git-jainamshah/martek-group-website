'use client'

import PageHero from '@/components/PageHero'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function BlogsPage() {
  const blogs = [
    {
      title: "The Future of Digital Enterprise in 2026",
      excerpt: "An in-depth analysis of emerging technological paradigms that will define the next decade of corporate efficiency.",
      category: "Market Vision",
      date: "Jan 12, 2026",
      readTime: "5 min read",
      image: "/assets/blog-1.jpg"
    },
    {
      title: "Optimizing Engineering Workflows via AI",
      excerpt: "Leveraging artificial intelligence to automate technical documentation and streamline complex engineering processes.",
      category: "Engineering Tech",
      date: "Jan 08, 2026",
      readTime: "7 min read",
      image: "/assets/blog-2.jpg"
    },
    {
      title: "Architecting Scalable Web Ecosystems",
      excerpt: "Strategic best practices for building resilient, high-availability digital platforms that support exponential growth.",
      category: "Infrastructure",
      date: "Jan 05, 2026",
      readTime: "6 min read",
      image: "/assets/blog-3.jpg"
    }
  ]

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <PageHero
        title="Market Insights"
        subtitle="Strategic analysis on technology, engineering, and the future of digital business."
        backgroundImage="/assets/blogs-banner-bg.jpg"
      />

      <section className="section-padding bg-background transition-colors duration-300">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-muted/20 border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Placeholder Image Area */}
                <div className="h-48 bg-muted relative overflow-hidden group-hover:opacity-90 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center text-muted-foreground text-xs font-medium mb-4 space-x-4 uppercase tracking-wide">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 font-light leading-relaxed text-sm">
                    {blog.excerpt}
                  </p>

                  <Link href="#" className="text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center">
                    Read Analysis <span className="ml-2">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
