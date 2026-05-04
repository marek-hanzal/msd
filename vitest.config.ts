import { defineConfig } from "vitest/config";

export default defineConfig({
	build: {
		target: "esnext",
		minify: false,
	},
	optimizeDeps: {
		include: [
			"vitest",
		],
	},
	cacheDir: "./node_modules/.vite",
	test: {
		environment: "node",
		globals: true,
		include: [
			"./test/**/*.test.ts",
		],
		passWithNoTests: false,
		isolate: false,
		sequence: {
			shuffle: false,
		},
		//
		pool: "forks",
		maxConcurrency: 4,
		//
		maxWorkers: 8,
		bail: 1,
		silent: false,
		ui: false,
	},
});
