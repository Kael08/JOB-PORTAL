import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import PageHeader from '../../components/layout/PageHeader'
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiPhone, FiMail, FiBriefcase, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const JobDetailsPage = () => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const {id} = useParams();
    const [job, setJob] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/all-jobs/${id}`)
          .then(res => res.json())
          .then(data => {
            setJob(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching job:", error);
            setIsLoading(false);
          });
    }, [id])

    // Format salary in rubles
    const formatSalary = (min, max) => {
      if (!min || !max) return 'N/A';
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

    const handleApply = async() => {
        const { value: url } = await Swal.fire({
            input: "url",
            inputLabel: t('jobDetails.resumeLinkLabel'),
            inputPlaceholder: t('jobDetails.resumeLinkPlaceholder')
          });
          if (url) {
            Swal.fire(t('jobDetails.applySuccess') + id,  'success');
          }
    }

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <PageHeader title={t('jobDetails.title')} path={t('jobDetails.path')}/>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <PageHeader title={t('jobDetails.title')} path={t('jobDetails.path')}/>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">{t('common.noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <PageHeader title={job.jobTitle} path={t('jobDetails.path')}/>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              {job.companyLogo && (
                <img src={job.companyLogo} alt={job.companyName} className="w-20 h-20 object-contain" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.jobTitle}</h1>
                <h2 className="text-xl text-primary mb-3">{job.companyName}</h2>
              </div>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-blue text-xl" />
              <div>
                <p className="text-sm text-gray-600">{t('jobCard.location')}</p>
                {isAuthenticated ? (
                  <p className="font-semibold">
                    {job.city ? t(`location.${job.city}`) : job.jobLocation || 'N/A'}
                    {job.street && `, ${job.street}`}
                    {job.apartment && `, ${job.apartment}`}
                  </p>
                ) : (
                  <p className="font-semibold text-gray-400 flex items-center gap-2">
                    <FiLock className="text-sm" />
                    {job.city ? t(`location.${job.city}`) : 'N/A'}, *** (войдите для просмотра)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiDollarSign className="text-blue text-xl" />
              <div>
                <p className="text-sm text-gray-600">{t('jobCard.salary')}</p>
                <p className="font-semibold">{formatSalary(job.minPrice, job.maxPrice)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiClock className="text-blue text-xl" />
              <div>
                <p className="text-sm text-gray-600">{t('jobCard.employment')}</p>
                <p className="font-semibold">{t(`employmentTypes.${job.employmentType}`, { defaultValue: job.employmentType })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiBriefcase className="text-blue text-xl" />
              <div>
                <p className="text-sm text-gray-600">{t('createJob.experience')}</p>
                <p className="font-semibold">{job.experienceLevel || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FiCalendar className="text-blue text-xl" />
              <div>
                <p className="text-sm text-gray-600">{t('jobCard.posted')}</p>
                <p className="font-semibold">{formatDate(job.postingDate)}</p>
              </div>
            </div>

            {job.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="text-blue text-xl" />
                <div>
                  <p className="text-sm text-gray-600">{t('createJob.phone')}</p>
                  {isAuthenticated ? (
                    <p className="font-semibold">{job.phone}</p>
                  ) : (
                    <p className="font-semibold text-gray-400 flex items-center gap-2">
                      <FiLock className="text-sm" />
                      *** (войдите для просмотра)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('jobDetails.description')}</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {job.description || t('common.noResults')}
            </p>
          </div>

          {/* Skills Section */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('createJob.requiredSkills')}</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-blue text-white rounded-full text-sm">
                    {typeof skill === 'string' ? skill : skill.value || skill.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('createJob.postedBy')}</h3>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <FiMail className="text-blue text-xl" />
                <a href={`mailto:${job.postedBy}`} className="text-blue hover:underline">
                  {job.postedBy}
                </a>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <FiLock className="text-yellow-600 text-xl mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Контактная информация доступна только авторизованным пользователям.
                  </p>
                  <Link to="/login" className="text-blue hover:underline font-semibold">
                    Войдите, чтобы увидеть контакты работодателя
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue hover:bg-blue-700 px-12 py-3 text-white font-semibold rounded-lg transition-colors duration-200"
              onClick={handleApply}
            >
              {t('jobDetails.apply')}
            </button>
          </div>
        </div>
    </div>
  )
}

export default JobDetailsPage
