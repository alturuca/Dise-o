import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // Agrega esta configuración para permitir el manejo de archivos binarios (PDF)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Tu backend de Django
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Este proxy es vital para que React reciba el archivo binario correctamente
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
});
