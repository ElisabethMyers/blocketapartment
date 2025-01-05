import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        minify: "terser",
},
    plugins: [],
    server: {
        host: true,
        strictPort: true,
        port: 3000
    }
})
