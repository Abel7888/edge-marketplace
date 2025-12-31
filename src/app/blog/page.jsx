import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://demo.developer.flavor.dev/wp-json/wp/v2'

async function getPosts() {
  try {
    const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=12`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export const metadata = {
  title: 'Blog - Edge Marketplace',
  description: 'Insights, guides, and news about emerging technology in PropTech, FinTech, ConTech, and more.',
  openGraph: {
    title: 'Blog - Edge Marketplace',
    description: 'Insights, guides, and news about emerging technology.',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-4 py-2 mb-6">
            <BookOpen className="text-blue-700" size={18} />
            <span className="text-blue-800 font-bold text-sm uppercase tracking-wider">Edge Insights</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6">
            Emerging Tech Blog
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, industry guides, and the latest news in PropTech, FinTech, ConTech, AI, and beyond.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h2>
              <p className="text-gray-500">Blog posts are being prepared. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const author = post._embedded?.author?.[0]?.name || 'Edge Team'
                const date = new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
                
                return (
                  <article key={post.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={featuredImage} 
                          alt={post.title.rendered}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {author}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </Link>
                      </h2>
                      
                      <div 
                        className="text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        Read More
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

