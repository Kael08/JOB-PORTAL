import React, { useState } from 'react'
import {FiMapPin, FiSearch} from "react-icons/fi"
import { useTranslation } from 'react-i18next'

const JobSearchBar = ({query, handleInputChange }) => {
  const { t } = useTranslation();

  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4 md:py py-14'>
        <h1 className="text-5xl font-bold text-primary mb-3">{t('home.title')} <span className="text-blue">{t('home.subtitle')}</span></h1>
        <p className="text-lg text-black/70 mb-8">{t('home.description')}</p>
    
    <form className="" action="" method="">
        <div className="flex justify-start md:flex-row flex-col md:gap-0 gap-4">
            <div className="flex md:rounded-s-md rounded shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 md:w-1/2 w-full">
                <input
                    type="text"
                    id="id"
                    name="name"
                    placeholder={t('home.searchPlaceholder')}
                    className = "block flex-1 border bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                    value={query}
                    required
                    />
                    <FiSearch className='absolute mt-2.5 ml-2 text-gray-400'/>
            </div>
            <div className="flex md:rounded-s-none rounded shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-inset
            focus-within:ring-indigo-600 md:w-1/3 w-full">
                <input
                    type="text"
                    id="id"
                    name="name"
                    placeholder={t('jobCard.location')}
                    className = "block flex-1 border bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6"
                    // onChange={handleInputChange}
                    // value={query}
                    />
                    <FiMapPin className='absolute mt-2.5 ml-2 text-gray-400'/>
            </div>

            <button type='submit' className="bg-blue py-2 px-8 text-white md:rounded-s-none rounded">
              {t('home.searchButton')}
            </button>
        </div>
    </form>
    </div>
  )
}

export default JobSearchBar