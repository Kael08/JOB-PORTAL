import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import CreatableSelect from "react-select/creatable";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../services/api/apiClient';
import Swal from 'sweetalert2';
import AuthDebugPanel from '../../components/debug/AuthDebugPanel';

const CreateJobPage = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);

    // Проверяем, что пользователь авторизован и является работодателем
    useEffect(() => {
        if (!isAuthenticated) {
            // Перенаправляем на страницу входа, если не авторизован
            navigate('/login', { replace: true });
        } else if (user?.role !== 'employer') {
            // Если пользователь не работодатель, перенаправляем на главную
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    // Если пользователь не работодатель, показываем сообщение
    if (!isAuthenticated || user?.role !== 'employer') {
        return (
            <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Доступ запрещен</h2>
                    <p className="text-red-700 mb-6">
                        Только работодатели могут размещать вакансии.
                        {!isAuthenticated && ' Пожалуйста, войдите в систему.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                            На главную
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/login" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Доступные города для выбора
    const cities = ["Elista", "Lagan", "Gorodovikovsk"];

    const {
        register,
        handleSubmit,reset,
        formState: { errors },
      } = useForm()
    
      const onSubmit = async (data) => {
        console.log('📝 CreateJobPage: Отправка формы...');
        console.log('🔑 Token from context:', token ? `${token.substring(0, 20)}...` : 'ОТСУТСТВУЕТ');
        console.log('👤 User from context:', user);
        console.log('💾 Token from localStorage:', localStorage.getItem('auth_token') ? 'ЕСТЬ' : 'НЕТ');

        if (!token || !user) {
          console.error('❌ Токен или пользователь отсутствуют!');
          await Swal.fire({
            icon: 'error',
            title: 'Ошибка авторизации',
            text: 'Пожалуйста, войдите снова',
          });
          navigate('/login');
          return;
        }

        // Добавляем навыки и email пользователя
        data.skills = selectedOption;

        // Автоматически добавляем postedBy из данных пользователя
        // Используем email если есть, иначе phone
        if (!data.postedBy) {
          data.postedBy = user.email || user.phone || `user_${user.id}`;
        }

        try {
          const result = await apiClient.post('/post-job', data);

          if (result.message && result.job) {
            await Swal.fire({
              icon: 'success',
              title: 'Успешно!',
              text: t('createJob.successMessage'),
              timer: 2000,
            });
            reset();
            setSelectedOption(null);
          }
        } catch (error) {
          console.error("Error posting job:", error);
          await Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: error.message || t('createJob.errorMessage'),
          });
        }
      };

        const options = [
          {value: "communication", label: "Коммуникабельность"},
          {value: "teamwork", label: "Работа в команде"},
          {value: "initiative", label: "Инициативность"},
          {value: "responsibility", label: "Ответственность"},
          {value: "creativity", label: "Креативность"},
          {value: "problem_solving", label: "Решение проблем"},
          {value: "time_management", label: "Тайм-менеджмент"},
          {value: "adaptability", label: "Адаптивность"},
          {value: "leadership", label: "Лидерство"},
          {value: "critical_thinking", label: "Критическое мышление"},
          {value: "customer_service", label: "Клиентоориентированность"},
          {value: "negotiation", label: "Навыки переговоров"},
          {value: "presentation", label: "Презентационные навыки"},
          {value: "analytical_thinking", label: "Аналитическое мышление"},
          {value: "organization", label: "Организационные навыки"},
          {value: "multitasking", label: "Мультизадачность"},
          {value: "conflict_resolution", label: "Разрешение конфликтов"},
          {value: "decision_making", label: "Принятие решений"},
          {value: "strategic_planning", label: "Стратегическое планирование"},
          {value: "project_management", label: "Управление проектами"},
          {value: "sales_skills", label: "Навыки продаж"},
          {value: "marketing", label: "Маркетинг"},
          {value: "financial_literacy", label: "Финансовая грамотность"},
          {value: "foreign_language", label: "Знание иностранных языков"},
          {value: "emotional_intelligence", label: "Эмоциональный интеллект"},
          {value: "stress_management", label: "Стрессоустойчивость"},
          {value: "learning_ability", label: "Обучаемость"},
          {value: "mentoring", label: "Наставничество"},
          {value: "public_speaking", label: "Публичные выступления"},
          {value: "networking", label: "Нетворкинг"},
          {value: "attention_to_detail", label: "Внимание к деталям"},
          {value: "persuasion", label: "Убеждение"},
          {value: "research", label: "Исследовательские навыки"},
          {value: "writing_skills", label: "Письменные навыки"},
          {value: "active_listening", label: "Активное слушание"},
          {value: "delegation", label: "Делегирование"},
          {value: "coaching", label: "Коучинг"},
          {value: "change_management", label: "Управление изменениями"},
          {value: "quality_control", label: "Контроль качества"},
          {value: "business_etiquette", label: "Деловой этикет"},
          {value: "other", label: "Другое"}
      ];

  return (
    <>
    <AuthDebugPanel />
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
{/* Form */}
<div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

    {/* First Row */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.jobTitle')}</label>
        <input type="text" placeholder={t('createJob.placeholders.jobTitle')} defaultValue={""}
        {...register("jobTitle", { required: true })} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.companyName')}</label>
        <input type="text" placeholder={t('createJob.placeholders.companyName')}
        {...register("companyName", { required: true })} className='create-job-input'/>
        </div>
    </div>

    {/* 2nd Row */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.minSalary')}</label>
        <input type="text" placeholder={t('createJob.placeholders.minSalary')}
        {...register("minPrice")} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.maxSalary')}</label>
        <input type="text" placeholder={t('createJob.placeholders.maxSalary')}
        {...register("maxPrice", { required: true })} className='create-job-input'/>
        </div>
    </div>

    {/* Third Row */}

    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.salaryType')}</label>
        <select {...register("salaryType", { required: true })} className='create-job-input'>
        <option value="">{t('createJob.placeholders.chooseSalaryType')}</option>
        <option value="Hourly">{t('createJob.hourly')}</option>
        <option value="Monthly">{t('createJob.monthly')}</option>
      </select>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.city')}</label>
        <select {...register("city", { required: true })} className='create-job-input'>
        <option value="">{t('createJob.placeholders.chooseCity')}</option>
        {cities.map((city) => (
          <option key={city} value={city}>{t(`location.${city}`)}</option>
        ))}
      </select>
        </div>
    </div>

    {/* Address Row - Street and Apartment */}
    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.street')}</label>
        <input type="text" placeholder={t('createJob.placeholders.street')}
        {...register("street", { required: true })} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.apartment')}</label>
        <input type="text" placeholder={t('createJob.placeholders.apartment')}
        {...register("apartment", { required: true })} className='create-job-input'/>
        </div>
    </div>

    {/* Fourth Row */}

    <div className="create-job-flex">
    <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.jobPosting')}</label>
        <input type="date" placeholder={t('createJob.placeholders.postingDate')}
        {...register("postingDate")} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.experience')}</label>
        <select {...register("experienceLevel", { required: true })} className='create-job-input'>
        <option value="">{t('createJob.placeholders.chooseExperience')}</option>
        <option value="Fresher/No Experience">{t('createJob.experienceOptions.fresher')}</option>
        <option value="Internship">{t('createJob.experienceOptions.internship')}</option>
        <option value="Remote Work">{t('createJob.experienceOptions.experienced')}</option>
      </select>
        </div>
    </div>

    {/* Sixth Row */}

<div className="">
<label className='block mb-2 text-lg'>{t('createJob.requiredSkills')}</label>
<CreatableSelect
defaultValue={selectedOption}
onChange={setSelectedOption}
options={options}
isMulti
className='create-job-input py-4'
placeholder={t('skills.selectPlaceholder')}
formatCreateLabel={(inputValue) => t('skills.createLabel', { inputValue })}/>
</div>

{/* Sixth Row */}
<div className="create-job-flex">
    <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.companyLogo')}</label>
        <input type="url" placeholder={t('createJob.placeholders.companyLogo')}
        {...register("companyLogo")} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.employmentType')}</label>
        <select {...register("employmentType", { required: true })} className='create-job-input'>
        <option value="">{t('createJob.placeholders.chooseEmploymentType')}</option>
        <option value="Full-Time">{t('createJob.employmentOptions.fullTime')}</option>
        <option value="Part-Time">{t('createJob.employmentOptions.partTime')}</option>
        <option value="Temporary">{t('createJob.employmentOptions.temporary')}</option>
      </select>
        </div>
    </div>

{/* 8th Row */}
<div className="w-full">
<label className='block mb-2 text-lg'>{t('createJob.description')}</label>
<textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
rows={6}
defaultValue={""}
placeholder={t('createJob.placeholders.description')}
{...register("description", { required: true })}
style={{ resize: 'none' }}/>
</div>

{/* Last Row */}
<div className="create-job-flex">
  <div className="lg:w-1/2 w-full">
    <label className='block mb-2 text-lg'>{t('createJob.postedBy')}</label>
    <input type="email" placeholder={t('createJob.placeholders.postedBy')}
          {...register("postedBy", { required: true })} className='create-job-input'/>
  </div>
  <div className="lg:w-1/2 w-full">
    <label className='block mb-2 text-lg'>{t('createJob.phone')}</label>
    <input type="tel" placeholder={t('createJob.placeholders.phone')}
          {...register("phone")} className='create-job-input'/>
  </div>
</div>


      <input type="submit" value={t('createJob.submit')} className='block bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer'/>
    </form>
</div>
    </div>
    </>
  )
}

export default CreateJobPage
