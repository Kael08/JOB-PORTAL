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

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  }

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  }

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  }

  const calculatePageRange = () => {
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {startIndex, endIndex};
  }

  const getAllFilteredJobs = (jobs, selected, query) => {
    let filteredJobs = jobs;

    if(query){
      filteredJobs = filteredJobs.filter((job) => 
        job.jobTitle && job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }

    if(selected) {
      filteredJobs = filteredJobs.filter(({city, minPrice, maxPrice, experienceLevel, salaryType, employmentType, postingDate}) => {
        const selectedNum = parseInt(selected);
        if (!isNaN(selectedNum)) {
          if (selectedNum < 0) {
            return parseInt(maxPrice) < Math.abs(selectedNum);
          } else {
            return parseInt(maxPrice) >= selectedNum;
          }
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(selected)) {
          const jobDate = new Date(postingDate);
          const filterDate = new Date(selected);
          return jobDate >= filterDate;
        }

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

  const allFilteredJobs = getAllFilteredJobs(jobs, selectedCategory, query);
  
  const totalPages = Math.ceil(allFilteredJobs.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages){
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1);
    }
  }

  const getPaginatedData = () => {
    const {startIndex, endIndex} = calculatePageRange();
    const paginatedJobs = allFilteredJobs.slice(startIndex, endIndex);
    return paginatedJobs.map((data, i) => <JobCard key={i} data={data}/>);
  }

  const result = getPaginatedData();
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div>
      <JobSearchBar query={query} handleInputChange={handleInputChange} />
    
    <div className="bg-[#FAFAFA] flex flex-col md:flex-row gap-4 lg:px-24 px-4 py-12">
     <div className="bg-white p-4 rounded w-full md:w-64 flex-shrink-0">
      <JobFilters handleChange={handleChange} handleClick={handleClick}/>
     </div>

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
