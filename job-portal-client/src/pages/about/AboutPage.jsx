import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">О проекте Kalmykia.Work</h1>
          <p className="text-xl text-gray-600">
            Платформа для поиска работы и подбора персонала в Республике Калмыкия
          </p>
        </div>

        {/* О проекте */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">О платформе</h2>
          <p className="text-gray-700 mb-4">
            Kalmykia.Work - это современная онлайн-платформа, созданная для помощи жителям
            Республики Калмыкия в поиске работы и работодателям в подборе квалифицированного персонала.
            Наша миссия - сделать процесс трудоустройства максимально простым, быстрым и эффективным.
          </p>
          <p className="text-gray-700">
            Платформа предоставляет удобный интерфейс для размещения и поиска вакансий,
            позволяя работодателям и соискателям быстро находить друг друга.
          </p>
        </section>

        {/* Для соискателей */}
        <section className="mb-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Для соискателей</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Бесплатный доступ к актуальным вакансиям в регионе</li>
            <li>Просмотр контактной информации работодателей после регистрации</li>
            <li>Удобный поиск и фильтрация вакансий по различным параметрам</li>
            <li>Информация о зарплате, графике работы и требованиях</li>
          </ul>
        </section>

        {/* Для работодателей */}
        <section className="mb-12 bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Для работодателей</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Простое и быстрое размещение вакансий</li>
            <li>Возможность указать детальные требования к кандидатам</li>
            <li>Прямой контакт с соискателями</li>
            <li>Редактирование и управление размещенными вакансиями</li>
          </ul>
        </section>

        {/* Юридическая информация */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Юридическая информация</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Пользовательское соглашение</h3>
              <p className="text-gray-700 mb-2">
                Используя платформу Kalmykia.Work, вы соглашаетесь с условиями использования сервиса.
                Мы обязуемся защищать ваши персональные данные и использовать их исключительно
                в рамках функционирования платформы.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Обработка персональных данных</h3>
              <p className="text-gray-700 mb-2">
                Платформа собирает и обрабатывает следующие персональные данные:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Имя пользователя</li>
                <li>Номер телефона для авторизации</li>
                <li>Роль (соискатель или работодатель)</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Все данные хранятся в защищенной базе данных и не передаются третьим лицам
                без вашего согласия. Вы имеете право на доступ, изменение и удаление своих данных.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ответственность</h3>
              <p className="text-gray-700">
                Администрация платформы не несет ответственности за содержание размещенных вакансий
                и действия пользователей. Мы рекомендуем соблюдать осторожность при взаимодействии
                с незнакомыми людьми и компаниями.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Авторские права</h3>
              <p className="text-gray-700">
                Все материалы, размещенные на платформе, защищены авторским правом.
                Использование материалов без разрешения администрации запрещено.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Модерация контента</h3>
              <p className="text-gray-700">
                Администрация оставляет за собой право удалять вакансии, нарушающие законодательство
                Российской Федерации или содержащие недостоверную информацию.
              </p>
            </div>
          </div>
        </section>

        {/* Благодарности */}
        <section className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Благодарности</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              Мы выражаем искреннюю благодарность всем, кто внес вклад в развитие платформы Kalmykia.Work:
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Технологии</h3>
              <p className="mb-2">Проект построен на основе современных технологий:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Frontend:</strong> React, React Router, Tailwind CSS, React Icons</li>
                <li><strong>Backend:</strong> NestJS, PostgreSQL</li>
                <li><strong>Авторизация:</strong> JWT, SMS-аутентификация</li>
                <li><strong>Интернационализация:</strong> i18next (поддержка русского и калмыцкого языков)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Сообщество</h3>
              <p>
                Особая благодарность сообществу разработчиков открытого программного обеспечения,
                чьи библиотеки и инструменты сделали возможным создание этой платформы.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Пользователи</h3>
              <p>
                Спасибо всем пользователям за доверие и помощь в улучшении платформы.
                Ваши отзывы и предложения помогают нам становиться лучше!
              </p>
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Контакты</h2>
          <p className="text-gray-700 mb-4">
            Если у вас есть вопросы, предложения или вы обнаружили проблему на платформе,
            пожалуйста, свяжитесь с нами:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> support@kalmykia.work (пример)</p>
            <p><strong>Telegram:</strong> @kalmykiawork (пример)</p>
          </div>
        </section>

        {/* Кнопка назад */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Вернуться к вакансиям
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;