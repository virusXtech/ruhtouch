import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig(({ command }) =>({
	integrations: [tailwind()],
	base: command === 'serve' ? '' : '/ruhtouch/',
});
