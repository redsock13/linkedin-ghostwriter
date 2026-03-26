/** @type {import('next').NextConfig} */
module.exports = { 
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei']
};
