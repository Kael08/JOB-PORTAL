import React from 'react'
import { useTranslation } from 'react-i18next'
import LocationFilter from './LocationFilter'
import SalaryFilter from './SalaryFilter'
import JobPostingData from './JobPostingData'
import WorkExperienceFilter from './WorkExperienceFilter'
import EmploymentTypeFilter from './EmploymentTypeFilter'

const Sidebar = ({handleChange, handleClick}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-3'>
    <h3 className="text-base font-bold mb-1">{t('sidebar.filters')}</h3>

    <LocationFilter handleChange={handleChange}/>
    <SalaryFilter handleChange={handleChange} handleClick={handleClick}/>
    {/* {<JobPostingData handleChange = {handleChange}/>} */}
    <WorkExperienceFilter handleChange = {handleChange}/>
    <EmploymentTypeFilter handleChange = {handleChange}/>

    </div>
  )
}

export default Sidebar