import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Pocket Chaplain",
    short_name: "Pocket Chaplain",
    description: "Support for those who serve.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1730",
    theme_color: "#0b1730",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
