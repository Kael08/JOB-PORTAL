import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import InputField from '../components/InputField'

const Salary = ({handleChange, handleClick}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-lg font-medium mb-2">{t('sidebar.salary')}</h4>
        <div className="mb-4">
            <Button onClickHandler={handleClick} value="" title={t('sidebar.hourly')} />
            <Button onClickHandler={handleClick} value="Monthly" title={t('sidebar.monthly')} />
            <Button onClickHandler={handleClick} value="Yearly" title={t('sidebar.yearly')} />
        </div>

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

            <InputField handleChange={handleChange} value={30} title="< 300000" name="test2" />
            <InputField handleChange={handleChange} value={50} title="< 500000" name="test2" />
            <InputField handleChange={handleChange} value={80} title="< 800000" name="test2" />
            <InputField handleChange={handleChange} value={100} title="< 1000000" name="test2" />
        </div>
    </div>
  )
}

export default Salary