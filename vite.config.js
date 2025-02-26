import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import * as sass from "sass";
import tailwindcss from "@tailwindcss/vite";

function getHtmlEntryFiles(srcDir) {
	const entry = {};

	function traverseDir(currentDir) {
		const files = fs.readdirSync(currentDir);

		files.forEach((file) => {
			const filePath = path.join(currentDir, file);
			const isDirectory = fs.statSync(filePath).isDirectory();

			if (isDirectory) {
				// If it's a directory, recursively traverse it
				traverseDir(filePath);
			} else if (path.extname(file) === ".html") {
				// If it's an HTML file, add it to the entry object
				const name = path.relative(srcDir, filePath).replace(/\..*$/, "");
				entry[name] = filePath;
			}
		});
	}

	traverseDir(srcDir);

	return entry;
}

export default defineConfig({
	root: "src",
	base: "./",
	build: {
		css: {
			preprocessorOptions: {
				scss: {
					implementation: sass,
					api: "modern-compiler",
				},
			},
		},
		rollupOptions: {
			input: getHtmlEntryFiles("src"),
			output: {
				assetFileNames: (assetInfo) => {
					if (/\.css$/.test(assetInfo.name)) {
						return `assets/css/styles.css`;
					}
					if (/\.png$|\.jpe?g$|\.svg$|\.gif$|\.webp$/.test(assetInfo.name)) {
						return "assets/img/[name][extname]"; // Без хешу
					}

					if (/\.js$/.test(assetInfo.name)) {
						return `assets/js/[name][extname]`;
					}

					if (/woff|woff2/.test(assetInfo.name)) {
						return `assets/fonts/[name][extname]`;
					}
					return "assets/[name][extname]";
				},

				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
			},
		},
		outDir: "../dist",
		emptyOutDir: true,
	},
	server: {
		port: 3000, // Порт локального сервера
		open: true, // Відкривати браузер при запуску
	},
	optimizeDeps: {
		entries: 'src/**/*{.html,.css,.scss,.js}'
	},

	plugins: [tailwindcss()],
});
