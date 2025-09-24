/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicionamos esta seção para configurar imagens externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dcdn-us.mitiendanube.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho de imagem nesse domínio
      },
    ],
  },
};

module.exports = nextConfig;
