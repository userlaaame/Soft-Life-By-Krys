import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title:       z.string().max(70),
    description: z.string().min(50).max(160),
    date:        z.coerce.date(),
    location:    z.enum(['brooklyn', 'frenchtown', 'tropea', 'sedona', 'joshua-tree']),
    cover:       image().optional(),     // falls back to the location's tile photo
    coverAlt:    z.string().optional(),
    dek:         z.string().max(90).optional(),
    draft:       z.boolean().default(true),
  }).refine((d) => !d.cover || d.coverAlt, {
    message: 'coverAlt is required when cover is set',
    path: ['coverAlt'],
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/locations' }),
  schema: ({ image }) => z.object({
    name:     z.string(),
    region:   z.string(),
    country:  z.string(),
    lat:      z.number(),
    lng:      z.number(),
    hero:     image().optional(),
    heroAlt:  z.string().optional(),
    focus:    z.string().default('50% 50%'),            // object-position for the photo
    blurb:    z.string().max(120),
    accent:   z.string().regex(/^#[0-9A-Fa-f]{6}$/),   // this place's accent colour
    featured: z.boolean().default(false),
  }).refine((d) => !d.hero || d.heroAlt, {
    message: 'heroAlt is required when hero is set',
    path: ['heroAlt'],
  }),
});

export const collections = { blog, locations };