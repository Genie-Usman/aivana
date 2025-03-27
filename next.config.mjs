/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"], // ✅ Add Cloudinary to allowed domains
      },    
};

export default nextConfig;
