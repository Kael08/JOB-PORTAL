import React from 'react'
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Card = ({data}) => {
const {_id, companyName, jobTitle, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, postingDate, description} = data;
const { i18n, t } = useTranslation();

// Convert salary based on language
const formatSalary = (min, max) => {
  if (i18n.language === 'ru') {
    const minRub = Math.round(parseFloat(min) * 90);
    const maxRub = Math.round(parseFloat(max) * 90);
    return `${minRub.toLocaleString('ru-RU')} ₽ - ${maxRub.toLocaleString('ru-RU')} ₽`;
  } else {
    return `$${parseFloat(min).toLocaleString('en-US')} - $${parseFloat(max).toLocaleString('en-US')}`;
  }
};

  return (
   
  <section className="card">
    <Link to={`/job/${_id}`} className='flex gap-4 flex-col sm:flex-row items-start'>
    <img src={companyLogo} alt="" />
    <div className="">
      <h4 className="text-primary mb-1">{companyName}</h4>
      <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>

      <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
        <span className="flex items-center gap-2"><FiMapPin/> {jobLocation} </span>
        <span className="flex items-center gap-2"><FiClock/> {t(`employmentTypes.${employmentType}`, { defaultValue: employmentType })} </span>
        <span className="flex items-center gap-2"><FiDollarSign/> {formatSalary(minPrice, maxPrice)} </span>
        <span className="flex items-center gap-2"><FiCalendar/> {postingDate} </span>
      </div>

      <p className="text-base text-primary/70"> {description} </p>
    </div>
    </Link>
  </section>
  )
}

export default Card
