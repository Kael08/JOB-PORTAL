import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../components/InputField'

const WorkExperience = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-lg font-medium mb-2">{t('sidebar.experience')}</h4>

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
                <span className="checkmark"></span>{t('sidebar.anyExperience')}
            </label>

            <InputField handleChange={handleChange} value="Internship" title={t('sidebar.internship')} name="test" />
            <InputField handleChange={handleChange} value="Work Remotely" title={t('sidebar.remoteWork')} name="test" />
        </div>
    </div>
  )
}

export default WorkExperience