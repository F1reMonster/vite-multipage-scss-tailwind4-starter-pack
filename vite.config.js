import { defineConfig } from "vite";
import { resolve } from "path";
import path from "path";
import fs from "fs";
import * as sass from "sass";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";
import images from "./src/data/images";

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
						return "assets/img/[name][extname]"; 
					}
					if (/\.svg$/.test(assetInfo.name)) {
						return "assets/img/svg/[name][extname]"; 
					}

					if (/\.js$/.test(assetInfo.name)) {
						return `assets/js/[name][extname]`;
					}

					if (/woff|woff2/.test(assetInfo.name)) {
						return `assets/fonts/[name][extname]`;
					}
					return "assets/[name][extname]";
				},

				entryFileNames: `assets/js/[name].js`,
				chunkFileNames: `assets/js/[name].js`,
			},
		},
		outDir: "../dist",
		emptyOutDir: true,
	},
	server: {
		port: 3000, // Порт локального сервера
		open: true, // Відкривати браузер при запуску
		host: true
	},
	optimizeDeps: {
		entries: "src/**/*{.html,.css,.scss,.js}",
	},

	plugins: [
		tailwindcss(),
		handlebars({
			partialDirectory: resolve("src", "partials"),
			context: {
				images
			},

			// щоб декілька - імпортуємо json файл і через кому додаємо
			// context: { images, data }
		}),
	],
});
