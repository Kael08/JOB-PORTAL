import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../../ui/InputField'

const EmploymentTypeFilter = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-sm font-medium mb-1">{t('sidebar.employmentType')}</h4>

        <div className="space-y-0.5">
            <label className='sidebar-label-container'>
                <input
                    type="radio"
                    id="employmentType-all"
                    name="employmentType"
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>{t('sidebar.allType')}
            </label>

            <InputField handleChange={handleChange} value="Temporary" title={t('sidebar.temporary')} name="employmentType" />
            <InputField handleChange={handleChange} value="Part-Time" title={t('sidebar.partTime')} name="employmentType" />
            <InputField handleChange={handleChange} value="Full-Time" title={t('sidebar.fullTime')} name="employmentType" />
        </div>
    </div>
  )
}

export default EmploymentTypeFilter