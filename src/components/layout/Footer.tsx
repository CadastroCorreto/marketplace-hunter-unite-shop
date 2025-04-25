
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MarketHunter</h3>
            <p className="text-gray-600">
              Encontre as melhores ofertas em todos os marketplaces conectados em um só lugar.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-marketplace-blue">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-marketplace-blue">
                  Buscar Produtos
                </Link>
              </li>
              <li>
                <Link to="/marketplaces" className="text-gray-600 hover:text-marketplace-blue">
                  Conectar Marketplaces
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-600 hover:text-marketplace-blue">
                  Minha Conta
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-600">
              Para suporte ou dúvidas, entre em contato conosco.
            </p>
            <a 
              href="mailto:contato@markethunter.com" 
              className="text-marketplace-blue hover:underline mt-2 inline-block"
            >
              contato@markethunter.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MarketHunter. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
