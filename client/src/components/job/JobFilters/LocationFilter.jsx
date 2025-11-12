import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../../ui/InputField'

const LocationFilter = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-sm font-medium mb-1">{t('sidebar.location')}</h4>

        <div className="space-y-0.5">
            <label className='sidebar-label-container'>
                <input
                    type="radio"
                    id="location-all"
                    name="location"
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>{t('sidebar.all')}
            </label>

            <InputField handleChange={handleChange} value={t('location.Elista.en')} title={t('location.Elista')} name="location" />
            <InputField handleChange={handleChange} value={t('location.Lagan.en')} title={t('location.Lagan')} name="location" />
            <InputField handleChange={handleChange} value={t('location.Gorodovikovsk.en')} title={t('location.Gorodovikovsk')} name="location" />
        </div>
    </div>
  )
}

export default LocationFilter