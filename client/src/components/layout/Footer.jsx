import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
        <div className="mb-8 text-center">
          <a 
            href="https://elistory.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl font-semibold text-white hover:text-gray-300 transition-colors inline-block"
          >
            elistory.ru
          </a>
        </div>

        {/* Информация о компании */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 mb-2">ИП Муниев А.М.</p>
              <p className="text-gray-300 text-sm">ИНН 081407563384</p>
              <p className="text-gray-300 text-sm">ОГРНИП 319081600009565A</p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">Почтовый адрес:</p>
              <p className="text-gray-300 text-sm">
                358000, Республика Калмыкия,<br />
                ул. Клыкова, 1а
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                <a 
                  href="tel:+79275952227" 
                  className="hover:text-white transition-colors"
                >
                  +7 927 595-22-27
                </a>
              </p>
              <p className="text-gray-300">
                <a 
                  href="mailto:am@muniev.ru" 
                  className="hover:text-white transition-colors"
                >
                  am@muniev.ru
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Нижняя часть footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Все права защищены
              </p>
            </div>
            <div className="flex gap-6 items-center">
              <a 
                href="https://elistory.ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                elistory.ru
              </a>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-300 text-sm">Портал вакансий Калмыкии</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
