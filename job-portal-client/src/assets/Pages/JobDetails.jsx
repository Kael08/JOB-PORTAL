import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import PageHeader from '../../components/PageHeader'
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const JobDetails = () => {
    const { t } = useTranslation();
    const {id} = useParams();
    const [job, setJob] = useState([])
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/all-jobs/${id}`).then(res => res.json()).then(data => setJob(data))
        .catch(error => console.error("Error fetching job:", error));
    }, [])

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

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <PageHeader title={t('jobDetails.title')} path={t('jobDetails.path')}/>
        <div className="pt-16">
        <h2><span className="text-xl font-bold text-blue-500">{t('jobDetails.jobDetailsLabel')}</span>{id}</h2>
<h1><span className="text-xl font-display text-gray-900">{job.jobTitle}</span></h1>

</div>
    <button className="bg-blue px-8 py-2 text-white" onClick={handleApply}>
        {t('jobDetails.apply')}
    </button>

    </div>
  )
}

export default JobDetails
