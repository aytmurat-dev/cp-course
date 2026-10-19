import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Har bir sahifa foydalanuvchiga bog'liq (sessiya, yechimlar), shuning uchun
  // klassik dinamik rendering ishlatiladi.
  cacheComponents: false,
  // Markdown mavzular runtime'da fs orqali o'qiladi — Vercel funksiyalariga qo'shilsin.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
