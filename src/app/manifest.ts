import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BIO COLOMBIA | Panel administrativo",
    short_name: "BIO COLOMBIA",
    description: "Panel administrativo del grupo empresarial BIO COLOMBIA.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0EA5A4",
    orientation: "portrait-primary",
    lang: "es-CO",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
