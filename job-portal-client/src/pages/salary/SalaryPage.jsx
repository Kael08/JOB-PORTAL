import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import { useTranslation } from 'react-i18next';

const SalaryPage = () => {
  const { t, i18n } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [salary, setSalary] = useState([]);

  // Function to convert salary from USD to RUB
  const convertSalary = (salaryString) => {
    const currentLang = i18n.language;

    // Extract number from string like "Average Salary $34,331 per year"
    const match = salaryString.match(/\$([0-9,]+)/);
    if (!match) return salaryString;

    const usdAmount = parseInt(match[1].replace(/,/g, ''));

    if (currentLang === 'ru') {
      const rubAmount = Math.round(usdAmount * 90);
      return `${t('salary.averageSalary')} ${rubAmount.toLocaleString('ru-RU')} ₽ в год`;
    } else {
      return `${t('salary.averageSalary')} $${usdAmount.toLocaleString('en-US')} per year`;
    }
  };

  useEffect ( () => {
    fetch("salary.json").then(res => res.json()).then(data => setSalary(data))
  }, [searchText])
  const handleSearch = () => {
    const filter = salary.filter((job) => job.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    console.log(filter)
    setSalary(filter)
  }

  console.log(searchText)

  return (
    <div className='max-w-screen container mx-auto xl:px-24 px-4'>
        <PageHeader title={t('salary.title')} path={t('salary.title')}/>

    <div className="mt-5">
        <div className="search-box p-2 text-center mb-2">
            <input
                type="text"
                id="search"
                name="search"
                placeholder={t('salary.searchPlaceholder')}
                className="py-2 pl-3 border focus-within:ring-indigo-600
                lg:w-6/12 mb-4 w-full"
                onChange={e => setSearchText(e.target.value)}
                style={{ // Inline style to set focus ring color
                  outlineColor: '#4F46E5', // Replace with your desired blue color
                }}
            />
            <button onClick={handleSearch} className="bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4">
                {t('salary.search')}
            </button>
        </div>
    </div>
    
    {/* Salary Display Card */}
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 my-12 items-center">
      {
        salary.map((data) => (
          <div key={data.id} className='shadow px-4 py-8'>
            <h4 className="font-semibold text-xl">{data.title}</h4>
            <p className="my-2 font-medium text-blue text-lg">{convertSalary(data.salary)}</p>
            <div className="flex flex-wrap gap-4">
              <a href="/" className="font-bold">{t('salary.jobOpenings')}</a>
              <a href="/" className="font-bold">{t('salary.skills')}</a>
            </div>
          </div>
        ))
      }
    </div>
    </div>
  )
}

export default SalaryPage