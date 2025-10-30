import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import {FaBarsStaggered, FaXmark} from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

import LogoutButton from '../auth/LogoutButton';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggler = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    }

    const navItems = [
        {path: "/", title: t('navbar.startSearch')},
        {path: "/my-job", title: t('navbar.myJobs')},
        {path: "/salary", title: t('navbar.salaryEstimate')},
        {path: "/post-job", title: t('navbar.postJob')},
    ]
  return (
    <header className='max-w-screen container mx-auto xl:px-24 px-4'>
        <nav className="flex justify-between items-center py-6">
            <a href="/" className="flex items-center gap-2 text-2xl text-black">
                <img
                    src="/icon.webp"
                    alt="Kalmykia.Work"
                    width="29"
                    height="30"
                    className=""
                />
                <span className="">Kalmykia.Work</span>
            </a>
            {/* {NAV ITEMS FOR LARGE DEVICES} */}
            <ul className="hidden md:flex gap-12">
                {
                    navItems.map(({path, title}) => (
                        <li key={path} className="text-base text-primary">
                            <NavLink
                            to={path}
                    className={({ isActive}) => isActive ? "active": "" }
                  >
                    {title}
                            </NavLink>
                        </li>
                    ))
                }
            </ul>

            {/* SIGNUP AND LOGIN BUTTON */}
            <div className="text-base text-primary font-medium space-x-5 hidden lg:block">
                <Link to = "/login" className='py-2 px-5 border rounded'>{t('navbar.login')}</Link>
                <Link to = "/sign-up" className='py-2 px-5 border rounded bg-blue text-white'>{t('navbar.signup')}</Link>
                {/* Language Switcher */}
                {/* {<button
                    onClick={() => changeLanguage(i18n.language === 'en' ? 'ru' : 'en')}
                    className='py-2 px-5 border rounded bg-gray-100 hover:bg-gray-200 transition-colors'
                    title={i18n.language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
                >
                    {i18n.language === 'en' ? 'RU' : 'EN'}
                </button>} */}
                
            </div>

            {/* MOBILE MENU */}
            <div className="md:hidden block">
                <button onClick={handleMenuToggler}>
                    {
                        isMenuOpen ? <FaXmark className='w-5 h-5 text-primary'/> : <FaBarsStaggered className='w-5 h-5 text-primary'/>
                    }
                </button>
            </div>
        </nav>

        {/* NAV ITEMS FOR MOBILE */}
        <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? "" : "hidden"}`}>
            <ul className="">
            {navItems.map(({path, title}) => (
                        <li key={path} className="text-base text-white first:text-white py-1">
                            <NavLink
                            to={path}
                    className={({ isActive}) => isActive ? "active": "" }
                  >
                    {title}
                            </NavLink>
                        </li>
                    ))
                }

<li className="text-white py-1"><Link to = "/login">{t('navbar.login')}</Link></li>
<li className="text-white py-1"><Link to = "/login">{t('navbar.logout')}</Link></li>
<li className="text-white py-1">
    <button
        onClick={() => changeLanguage(i18n.language === 'en' ? 'ru' : 'en')}
        className='py-2 px-5 border rounded bg-gray-100 text-black hover:bg-gray-200 transition-colors w-full'
    >
        {i18n.language === 'en' ? 'Русский (RU)' : 'English (EN)'}
    </button>
</li>
            </ul>
        </div>
    </header>
  )
}

export default Navbar;
