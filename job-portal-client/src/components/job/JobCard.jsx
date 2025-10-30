import React from 'react'
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiPhone } from 'react-icons/fi';
import { TbCurrencyRubel } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

const JobCard = ({data}) => {
const {_id, companyName, jobTitle, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, postingDate, description, phone} = data;
const { i18n, t } = useTranslation();

// Format salary in rubles
const formatSalary = (min, max) => {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  return `${Math.round(minVal).toLocaleString('ru-RU')} ₽ - ${Math.round(maxVal).toLocaleString('ru-RU')} ₽`;
};

// Format date to YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

  return (
   
  <section className="card">
    <Link to={`/job/${_id}`} className='flex gap-4 flex-col sm:flex-row items-start'>
    <img src={companyLogo} alt="" className="w-16 h-16 object-contain flex-shrink-0" />
    <div className="">
      <h4 className="text-primary mb-1">{companyName}</h4>
      <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>

      <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
        <span className="flex items-center gap-2"><FiMapPin/> {jobLocation} </span>
        <span className="flex items-center gap-2"><FiClock/> {t(`employmentTypes.${employmentType}`, { defaultValue: employmentType })} </span>
        <span className="flex items-center gap-2"> {formatSalary(minPrice, maxPrice)} </span>
        <span className="flex items-center gap-2"><FiCalendar/> {formatDate(postingDate)} </span>
        {phone && <span className="flex items-center gap-2"><FiPhone/> {phone} </span>}
      </div>

      <p className="text-base text-primary/70"> {description} </p>
    </div>
    </Link>
  </section>
  )
}

export default JobCard
