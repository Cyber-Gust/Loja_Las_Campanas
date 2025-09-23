import { Inter } from "next/font/google";
import "./globals.css";

// Importando os novos componentes
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Loja Legendarios",
  description: "Loja de Roupas com Next.js e Nuvemshop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-cream`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
