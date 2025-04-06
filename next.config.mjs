/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turboMode: true, // Speeds up local refreshes
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
    };
    return config;
  },
  images: {
    unoptimized: true, // 👈 Add this line
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.16",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "app.mazzl.ae",
        pathname: "/uploads/**",
      },
    ],
  },
};

// Optionally disable SSL verification in dev (if using self-signed certs)
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("⚠️  SSL verification disabled for local development");
}

export default nextConfig;
