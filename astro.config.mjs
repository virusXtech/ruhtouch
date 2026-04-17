import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import siteConfig from './src/data/site';

export default defineConfig({
	output: 'static',
	site: siteConfig.siteUrl,
	integrations: [tailwind(), sitemap()],
});
