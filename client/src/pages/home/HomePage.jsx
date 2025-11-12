import { useEffect, useState } from "react";
import JobSearchBar from "../../components/job/JobSearchBar"
import JobCard from "../../components/job/JobCard";
import Jobs from "./components/Jobs";
import JobFilters from "../../components/job/JobFilters";
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const[currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/all-jobs`).then(res => res.json()).then(data => {
      setJobs(data);
      setIsLoading(false)
    }).catch(error => {
      console.error("Error fetching jobs:", error);
      setIsLoading(false);
    })
  }, [])

  // console.log(jobs)

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
  }

  // Radio Filtering
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  }

  // Button based Filtering
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  }

  //Calculate the index range
  const calculatePageRange = () => {
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {startIndex, endIndex};
  }

  // Функция для получения полного списка отфильтрованных вакансий (без пагинации)
  const getAllFilteredJobs = (jobs, selected, query) => {
    let filteredJobs = jobs;

    // Фильтрация по поисковому запросу (название вакансии)
    if(query){
      filteredJobs = filteredJobs.filter((job) => 
        job.jobTitle && job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }

    // Фильтрация по категориям
    if(selected) {
      filteredJobs = filteredJobs.filter(({city, minPrice, maxPrice, experienceLevel, salaryType, employmentType, postingDate}) => {
        // Check if selected is a number (salary filter)
        const selectedNum = parseInt(selected);
        if (!isNaN(selectedNum)) {
          // Фильтрация по зарплате
          // Отрицательные значения означают "меньше" (<), положительные - "больше или равно" (>=)
          if (selectedNum < 0) {
            // Для отрицательных значений: maxPrice < |selectedNum|
            // Например, -20000 означает maxPrice < 20000
            return parseInt(maxPrice) < Math.abs(selectedNum);
          } else {
            // Для положительных значений: maxPrice >= selectedNum
            // Например, 80000 означает maxPrice >= 80000
            return parseInt(maxPrice) >= selectedNum;
          }
        }

        // Check if selected is a date (YYYY-MM-DD format)
        if (/^\d{4}-\d{2}-\d{2}$/.test(selected)) {
          // Convert both dates to Date objects for comparison
          const jobDate = new Date(postingDate);
          const filterDate = new Date(selected);
          // Return jobs posted on or after the filter date
          return jobDate >= filterDate;
        }

        // Otherwise, filter by other categories
        return (
          city.toLowerCase() === selected.toLowerCase() ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
        );
      });
    }

    return filteredJobs;
  }

  // Получаем полный список отфильтрованных вакансий
  const allFilteredJobs = getAllFilteredJobs(jobs, selectedCategory, query);
  
  // Вычисляем количество страниц на основе отфильтрованных вакансий
  const totalPages = Math.ceil(allFilteredJobs.length / itemsPerPage);

  // Function for the next page
  const nextPage = () => {
    if (currentPage < totalPages){
      setCurrentPage(currentPage + 1);
    }
  }

  // Function for the previous page
  const prevPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1);
    }
  }

  // Функция для получения данных с пагинацией
  const getPaginatedData = () => {
    const {startIndex, endIndex} = calculatePageRange();
    const paginatedJobs = allFilteredJobs.slice(startIndex, endIndex);
    return paginatedJobs.map((data, i) => <JobCard key={i} data={data}/>);
  }

  const result = getPaginatedData();
  
  // Сбрасываем страницу на 1, если текущая страница больше доступных страниц
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div>
      <JobSearchBar query={query} handleInputChange={handleInputChange} />
    
    {/* Main Content */}
    <div className="bg-[#FAFAFA] flex flex-col md:flex-row gap-4 lg:px-24 px-4 py-12">
      {/* Left Side - Фильтры с фиксированной шириной */}
     <div className="bg-white p-4 rounded w-full md:w-64 flex-shrink-0">
      <JobFilters handleChange={handleChange} handleClick={handleClick}/>
     </div>

     {/* Jobs Cards */}
     <div className="bg-white p-4 rounded-sm flex-1 min-w-0">

      {
        isLoading ? (
          <p className="font-medium">{t('common.loading')}</p>
        ) : allFilteredJobs.length > 0 ? (
          <Jobs result={result} totalCount={allFilteredJobs.length}/>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-2">{t('jobs.vacancyCount', { count: 0 })}</h3>
            <p className="">{t('jobs.noDataFound')}</p>
          </>
        )
      }

      {/* PAGINATION */}

      {
        allFilteredJobs.length > 0 ? (
          <div className="flex justify-center mt-4 space-x-8">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1} 
              className="hover:underline font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('jobs.previous')}
            </button>
            <span className="mx-2">
              {t('common.page')} {currentPage} {t('common.of')} {totalPages || 1}
            </span>
            <button 
              onClick={nextPage} 
              disabled={currentPage >= totalPages} 
              className="hover:underline font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('jobs.next')}
            </button>
          </div>
        ) : ""
      }

    </div>
    </div>
    
    </div>
  )
}

export default HomePage
