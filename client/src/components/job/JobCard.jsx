import React from 'react'
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const JobCard = ({data}) => {
const {_id, companyName, jobTitle, minPrice, maxPrice, employmentType, postingDate, description} = data;
const { t } = useTranslation();

// Format salary in rubles
const formatSalary = (min, max) => {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  return `${Math.round(minVal).toLocaleString('ru-RU')} ₽ - ${Math.round(maxVal).toLocaleString('ru-RU')} ₽`;
};

// Get relative time (today, this week, this month, etc.)
const getRelativeTime = (dateString) => {
  if (!dateString) return t('jobCard.postedLongAgo');
  
  const now = new Date();
  const jobDate = new Date(dateString);
  
  // Set time to midnight for accurate day comparison
  now.setHours(0, 0, 0, 0);
  jobDate.setHours(0, 0, 0, 0);
  
  const diffTime = now - jobDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return t('jobCard.postedToday');
  } else if (diffDays === 1) {
    return t('jobCard.postedYesterday');
  } else if (diffDays < 7) {
    return t('jobCard.postedThisWeek');
  } else if (diffDays < 30) {
    return t('jobCard.postedThisMonth');
  } else if (diffDays < 365) {
    return t('jobCard.postedThisYear');
  } else {
    return t('jobCard.postedLongAgo');
  }
};

  return (
  <section className="card" style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
    <Link to={`/job/${_id}`} className='flex gap-4 flex-col sm:flex-row items-start flex-1' style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
    <div className="w-full flex flex-col" style={{ minHeight: '160px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
      <h4 className="text-primary mb-1 text-base break-words">{companyName}</h4>
      <h3 className="text-xl font-semibold mb-2 line-clamp-2 break-words" style={{ minHeight: '3rem' }}>{jobTitle}</h3>

      <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2 break-words">
        <span className="flex items-center gap-2 break-words"><FiClock/> <span className="break-words whitespace-normal">{t(`employmentTypes.${employmentType}`, { defaultValue: employmentType })}</span> </span>
        <span className="flex items-center gap-2 break-words"> <span className="break-words whitespace-normal">{formatSalary(minPrice, maxPrice)}</span> </span>
        <span className="flex items-center gap-2 break-words"><FiCalendar/> <span className="break-words whitespace-normal">{getRelativeTime(postingDate)}</span> </span>
      </div>

      <p className="text-base text-primary/70 line-clamp-3 overflow-hidden flex-1 break-words whitespace-normal" style={{ maxHeight: '4.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', wordWrap: 'break-word', overflowWrap: 'break-word' }}> {description} </p>
    </div>
    </Link>
  </section>
  )
}

export default JobCard
