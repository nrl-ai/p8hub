/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// Configure proxy for development
if (process.env.NODE_ENV === "development") {
  nextConfig.rewrites = async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:5678/api/:path*",
    },
  ]
} else {
  nextConfig.output = "export"
}

export default nextConfig
