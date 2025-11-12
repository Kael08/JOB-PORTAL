import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api/apiClient';
import Swal from 'sweetalert2';

const MyJobsPage = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

//Set Current Page
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 4;

    // Проверяем авторизацию и роль
    useEffect(() => {
        if(loading) return;

        if (!isAuthenticated) {
            navigate('/', { replace: true });
            return;
        }
        if (user?.role !== 'employer') {
            navigate('/', { replace: true });
            return;
        }
    }, [isAuthenticated, user, navigate, loading]);

    useEffect(() => {
      // Ждем загрузки данных из localStorage
      if (loading) return;
      
      if (!user?.id) {
        console.log('MyJobsPage: Нет ID у пользователя');
        return;
      }

      setIsLoading(true);
      console.log('MyJobsPage: Загрузка вакансий для userId:', user.id);

      // apiClient уже добавляет базовый URL, поэтому передаем только путь
      apiClient.get('/myJobs')
        .then(data => {
          console.log('MyJobsPage: Получены вакансии:', data);
          console.log('MyJobsPage: Количество вакансий:', data.length);
          setJobs(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("MyJobsPage: Ошибка загрузки вакансий:", error);
          setIsLoading(false);
        });
  }, [loading, user]);

    //Pagination

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);

    // For Next and Previous Button

    const nextPage = () => {
      if (indexOfLastItem < jobs.length){
        setCurrentPage(currentPage + 1);
      }
    }

    const prevPage = () => {
      if (currentPage > 1){
        setCurrentPage(currentPage - 1);
      }
    }

    const handleSearch = () => {
      const filter = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
      setJobs(filter);
      setIsLoading(false)
    }

    const handleDelete = async (id) => {
      try {
        const result = await apiClient.delete(`/job/${id}`);

        if(result.message === "Вакансия успешно удалена"){
          await Swal.fire({
            icon: 'success',
            title: t('myJobs.deleteSuccess'),
            timer: 2000,
            showConfirmButton: false
          });
          // Refresh the jobs list
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: error.message || t('myJobs.deleteError')
        });
      }
    };

    // console.log(searchText)
      return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
      <div className="my-jobs-container">
        <h1 className="text-center p-4">{t('myJobs.title')}</h1>
      <div className="search-box p-2 text-center mb-2">
        <input
        onChange={(e) => setSearchText(e.target.value)}
          type="text"
          id="search"
          name="search"
          placeholder={t('myJobs.searchPlaceholder')}
          className="py-2 pl-3 border focus-within:ring-indigo-600 lg:w-6/12 mb-4 w-full"
          style={{ // Inline style to set focus ring color
            outlineColor: '#4F46E5', // Replace with your desired blue color
          }}
        />
        <button className="bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4" onClick={handleSearch}>
          {t('myJobs.search')}
        </button>
      </div>
      </div>

      {/* Table */}
      <section className="py-1 bg-blueGray-50">
<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-5">
  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
    <div className="rounded-t mb-0 px-4 py-3 border-0">
      <div className="flex flex-wrap items-center">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-base text-blueGray-700">{t('myJobs.allJobs')}</h3>
        </div>
        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
        <Link to="/post-job">  <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">{t('myJobs.postNewJob')}</button> </Link>
        </div>
      </div>
    </div>

    <div className="block w-full overflow-x-auto">
      <table className="items-center bg-transparent w-full border-collapse ">
        <thead>
          <tr>
            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.no')}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.jobTitle')}
                        </th>
           <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.companyName')}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.salary')}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.edit')}
                        </th>
          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          {t('myJobs.delete')}
                        </th>
          </tr>
        </thead>

        {
          isLoading ? (
            <tbody>
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <p className="">{t('common.loading')}</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {
                currentJobs.map((job, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {index + 1}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                      {job.jobTitle}
                    </td>
                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {job.companyName}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {Math.round(job.minPrice).toLocaleString('ru-RU')} ₽ - {Math.round(job.maxPrice).toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <button>
                        <Link to={`/edit-job/${job.id}`}>{t('myJobs.edit')}</Link>
                      </button>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <button onClick={() => handleDelete(job.id)} className="bg-red-700 py-2 px-6 text-white rounded-sm">
                        {t('myJobs.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          )
        }

      </table>
    </div>
  </div>
</div>

{/* Pagination */}

<div className="flex justify-center text-black space-x-8 mb-8">
  {
    currentPage > 1 && (
      <button className="hover:underline font-bold" onClick={prevPage}>
        {t('myJobs.previous')}
      </button>
    )
  }
  {
    indexOfLastItem < jobs.length && (
      <button className="hover:underline font-bold" onClick={nextPage}>
        {t('myJobs.next')}
      </button>
    )
  }
</div>

<footer className="relative pt-8 pb-6 mt-16">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap items-center md:justify-between justify-center">
      <div className="w-full md:w-6/12 px-4 mx-auto text-center">
      
      </div>
    </div>
  </div>
</footer>
</section>

    </div>
  )
};

export default MyJobsPage
