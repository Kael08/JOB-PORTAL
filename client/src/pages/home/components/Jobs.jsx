import React from 'react'
import { useTranslation } from 'react-i18next';

const Jobs = ({result, totalCount}) => {
  const { t } = useTranslation();

  return (
    <>
    <div className="">
      <h3 className="text-lg font-bold mb-2">{t('jobs.vacancyCount', { count: totalCount || result.length })}</h3>
    </div>
    <section className="">{result}</section>
    </>
  )
}

export default Jobs
