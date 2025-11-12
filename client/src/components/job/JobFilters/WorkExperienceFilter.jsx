import React from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '../../ui/InputField'

const WorkExperienceFilter = ({handleChange}) => {
  const { t } = useTranslation();

  return (
    <div>
        <h4 className="text-sm font-medium mb-1">{t('sidebar.experience')}</h4>

        <div className="space-y-0.5">
            <label className='sidebar-label-container'>
                <input
                    type="radio"
                    id="experience-all"
                    name="experience"
                    value=""
                    onChange={handleChange}
                />
                <span className="checkmark"></span>{t('sidebar.anyExperience')}
            </label>

            <InputField handleChange={handleChange} value="Fresher/No Experience" title={t('sidebar.fresher')} name="experience" />
            <InputField handleChange={handleChange} value="Internship" title={t('sidebar.internship')} name="experience" />
            <InputField handleChange={handleChange} value="Remote Work" title={t('sidebar.experienced')} name="experience" />
        </div>
    </div>
  )
}

export default WorkExperienceFilter