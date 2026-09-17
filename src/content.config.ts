import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob ({ pattern: '**/*.mdx', base: './src/content/blog' }),
    schema: z.object({
    title:       z.string().max(70),          // OG titles truncate past ~70
    description: z.string().min(50).max(160), // forces a real meta description
    date:        z.coerce.date(),
    location:    z.enum(['brooklyn', 'frenchtown', 'tropea']), //due to changes in Phase 2, this is now a required field
    cover:       z.string(),
    coverAlt:    z.string(),                  // required: a11y ≥95 is contractual
    draft:       z.boolean().default(true),   // opt-in publishing
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/locations' }),
  schema: z.object({
    name:    z.string(),          // "Brooklyn"
    region:  z.string(),          // "New York"
    country: z.string(),          // "United States"
    lat:     z.number(),          // unused in Phase 1 free for the Phase 2 map
    lng:     z.number(),
    hero:    z.string(),
    heroAlt: z.string(),          
    blurb:   z.string().max(120),
    accent:  z.string().regex(/^#[0-9A-Fa-f]{6}$/), // hex color for map pin
    featured: z.boolean().default(false), // false = in the data, off the homepage
  }),
});

export const collections = { blog, locations };