// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server:{
//     proxy:{
//       '/api':{
//         target:'http://localhost:3000',
//         secure:false,
//       },
//     },
//   },
//   plugins: [react()],
// })



import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
})
