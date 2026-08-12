import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // El limite por defecto de Next.js para Server Actions es 1MB, muy
    // bajo para subir logos/imagenes (hasta 8MB) o contenido de video
    // (hasta 60MB) desde el panel.
    serverActions: {
      bodySizeLimit: "65mb",
    },
  },
};

export default nextConfig;
