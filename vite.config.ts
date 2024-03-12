import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('./templates/assets/dist/', import.meta.url)),
    emptyOutDir: true,
    minify: true,
    cssMinify: true,
    rollupOptions: {
      input: {
        // 指定两个入口文件
        main: path.resolve(__dirname, "src/main.ts"),
        search: path.resolve(__dirname, "src/ts/search.tsx"),
        photos: path.resolve(__dirname, "src/ts/photos.tsx")
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `style.css`,
        chunkFileNames: `[name].[hash].js`,
      },
    },
  }
});
