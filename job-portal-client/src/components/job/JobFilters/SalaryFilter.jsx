import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../ui/Button'
import InputField from '../../ui/InputField'

const SalaryFilter = ({handleChange, handleClick}) => {
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

            <InputField handleChange={handleChange} value={20000} title="< 20 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={30000} title="< 30 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={40000} title="< 40 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={50000} title="< 50 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={60000} title="< 60 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={70000} title="< 70 000 ₽" name="test2" />
            <InputField handleChange={handleChange} value={80000} title="< 80 000 ₽" name="test2" />
        </div>
    </div>
  )
}

export default SalaryFilter