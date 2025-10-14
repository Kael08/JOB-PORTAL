import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../components/InputField'

const Location = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-lg font-medium mb-2">{t('sidebar.location')}</h4>

        <div className="">
            <label className='sidebar-label-container'>
                <input
                    type="radio"
                    id="test"
                    name="test"
                    // placeholder="placeholder"
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>{t('sidebar.all')}
            </label>

            <InputField handleChange={handleChange} value={t('location.Elista.en')} title={t('location.Elista')} name="test" />
            <InputField handleChange={handleChange} value={t('location.Elista.en')} title={t('location.Lagan')} name="test" />
            <InputField handleChange={handleChange} value={t('location.Gorodovikovsk.en')} title={t('location.Gorodovikovsk')} name="test" />
        </div>
    </div>
  )
}

export default Location