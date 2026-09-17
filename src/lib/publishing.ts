// src/lib/publishing.ts
import { getCollection } from 'astro:content';

/** Posts ready to be public. Drafts render in dev, never in production. */
export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Blog routes stay noindex until three real posts exist. */
export async function isBlogIndexable() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.length >= 3;
}
