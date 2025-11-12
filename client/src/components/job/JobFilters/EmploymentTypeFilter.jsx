import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../../ui/InputField'

const EmploymentTypeFilter = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-lg font-medium mb-2">{t('sidebar.employmentType')}</h4>

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
                <span className="checkmark"></span>{t('sidebar.allType')}
            </label>

            <InputField handleChange={handleChange} value="Temporary" title={t('sidebar.temporary')} name="test" />
            <InputField handleChange={handleChange} value="Part-Time" title={t('sidebar.partTime')} name="test" />
            <InputField handleChange={handleChange} value="Full-Time" title={t('sidebar.fullTime')} name="test" />
        </div>
    </div>
  )
}

export default EmploymentTypeFilter