import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import InputField from '../components/InputField'

const Salary = ({handleChange, handleClick}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-lg font-medium mb-2">{t('sidebar.salary')}</h4>

        <div className="">
        <label className='sidebar-label-container'>
                <input
                    type="radio"
                    id="test"
                    name="test"
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>{t('sidebar.all')}
            </label>

            <InputField handleChange={handleChange} value={50000} title="< 50 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={100000} title="< 100 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={150000} title="< 150 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={200000} title="< 200 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={300000} title="< 300 000 ₽" name="test2" />
        </div>
    </div>
  )
}

export default Salary