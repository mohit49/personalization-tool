/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["localhost","192.168.1.16"], // Allow images from localhost
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "5000", // Change this to your backend port
          pathname: "/uploads/**", // Adjust based on your image URL path
        },
      ],
    },
  };
  
  export default nextConfig;
  