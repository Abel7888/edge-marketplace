import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://demo.developer.flavor.dev/wp-json/wp/v2'

async function getPost(slug) {
  try {
    const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return null
    const posts = await res.json()
    return posts[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found - Edge Marketplace',
    }
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 160)

  return {
    title: `${post.title.rendered.replace(/<[^>]+>/g, '')} - Edge Marketplace Blog`,
    description: excerpt,
    openGraph: {
      title: post.title.rendered.replace(/<[^>]+>/g, ''),
      description: excerpt,
      type: 'article',
      publishedTime: post.date,
      images: featuredImage ? [{ url: featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered.replace(/<[^>]+>/g, ''),
      description: excerpt,
      images: featuredImage ? [featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const author = post._embedded?.author?.[0]?.name || 'Edge Team'
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const shareUrl = `https://edgemarketplace.xyz/blog/${params.slug}`
  const shareTitle = post.title.rendered.replace(/<[^>]+>/g, '')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              {author}
            </span>
          </div>

          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {featuredImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={featuredImage} 
                alt={post.title.rendered.replace(/<[^>]+>/g, '')}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div 
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
              prose-pre:bg-slate-900"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </article>

      {/* Share Section */}
      <section className="py-12 border-t">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Share2 size={18} />
              <span className="font-semibold">Share this article:</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Share on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Explore Emerging Tech Solutions?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover vetted vendors across PropTech, FinTech, ConTech, AI, and more on Edge Marketplace.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Explore Marketplace
          </Link>
        </div>
      </section>
    </div>
  )
}
