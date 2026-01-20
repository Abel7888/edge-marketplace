import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'px95kdle',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      "author": author->name,
      "categories": categories[]->slug.current
    }
  `)
}

export async function getPostBySlug(slug) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      body,
      "author": author->{name, image, bio},
      "categories": categories[]->{title, slug, emoji, color}
    }
  `,
    { slug }
  )
}

export async function getPostsByCategory(categorySlug) {
  return client.fetch(
    `
    *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      "author": author->name,
      "categories": categories[]->slug.current
    }
  `,
    { categorySlug }
  )
}
