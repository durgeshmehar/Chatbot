/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
    return [
      {
        source: '/users/signin',
        destination: 'http://localhost:8000/users/signin',
      },
      {
        source: '/users/signup',
        destination: 'http://localhost:8000/users/signup',
      },
      {
        source: '/chats/chat',
        destination: 'http://localhost:8000/chats/chat',
      },
    ]
  },
};

export default nextConfig;
