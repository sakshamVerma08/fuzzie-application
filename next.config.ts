import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Can remove the eslint and typescript here, was just testing something
  eslint:{ignoreDuringBuilds:true},
  typescript:{
    ignoreBuildErrors:true
  },
  images:{
    domains:["res.cloudinary.com"],
  }
};

export default nextConfig;
