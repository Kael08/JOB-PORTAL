
import { useLoaderData, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import CreatableSelect from "react-select/creatable";
import { useTranslation } from 'react-i18next';

const UpdateJobPage = () => {
    const { t } = useTranslation();
    const {id} = useParams();
    // console.log(id)
    const {_id, jobTitle, companyName, minPrice, maxPrice, salaryType, city, street, apartment, postingDate,
        experienceLevel, companyLogo, employmentType, description, postedBy, phone, skills} = useLoaderData();
        const [selectedOption, setSelectedOption] = useState(null);

    // Доступные города для выбора
    const cities = ["Elista", "Lagan", "Gorodovikovsk"];
    const {
        register,
        handleSubmit,reset,
        formState: { errors },
      } = useForm()
    
      const onSubmit = (data) => {
        data.skills = selectedOption;
        // console.log(data);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/update-job/${id}`, {
          method: "PATCH",
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if(result.message === "Job updated successfully"){
            alert(t('createJob.updateSuccessMessage'));
            reset()
            window.location.href = '/my-job';
          } else {
            alert(t('createJob.updateErrorMessage') + ": " + (result.message || "Unknown error"));
          }
        })
        .catch((error) => {
          console.error("Error updating job:", error);
          alert(t('createJob.updateErrorMessage') + ". Please check console for details.");
        });
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
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
    {/* Form */}
    <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
    
        {/* First Row */}
        <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.jobTitle')}</label>
            <input type="text" placeholder={t('createJob.placeholders.jobTitle')} defaultValue={jobTitle}
            {...register("jobTitle", { required: true })} className='create-job-input'/>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.companyName')}</label>
            <input type="text" placeholder={t('createJob.placeholders.companyName')} defaultValue={companyName}
            {...register("companyName", { required: true })} className='create-job-input'/>
            </div>
        </div>

        {/* 2nd Row */}
        <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.minSalary')}</label>
            <input type="text" placeholder={t('createJob.placeholders.minSalary')}
            {...register("minPrice")} className='create-job-input' defaultValue={minPrice}/>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.maxSalary')}</label>
            <input type="text" placeholder={t('createJob.placeholders.maxSalary')}
            {...register("maxPrice", { required: true })} className='create-job-input' defaultValue={maxPrice}/>
            </div>
        </div>
    
        {/* Third Row */}

        <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.salaryType')}</label>
            <select {...register("salaryType", { required: true })} className='create-job-input'>
            <option value={salaryType}>{salaryType}</option>
            <option value="Hourly">{t('createJob.hourly')}</option>
            <option value="Monthly">{t('createJob.monthly')}</option>
            <option value="Yearly">{t('createJob.yearly')}</option>
          </select>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.city')}</label>
            <select {...register("city", { required: true })} className='create-job-input'>
            <option value={city}>{t(`location.${city}`)}</option>
            {cities.filter(c => c !== city).map((cityOption) => (
              <option key={cityOption} value={cityOption}>{t(`location.${cityOption}`)}</option>
            ))}
          </select>
            </div>
        </div>

        {/* Address Row - Street and Apartment */}
        <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.street')}</label>
            <input type="text" placeholder={t('createJob.placeholders.street')} defaultValue={street}
            {...register("street", { required: true })} className='create-job-input'/>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.apartment')}</label>
            <input type="text" placeholder={t('createJob.placeholders.apartment')} defaultValue={apartment}
            {...register("apartment", { required: true })} className='create-job-input'/>
            </div>
        </div>

        {/* Fourth Row */}

        <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.jobPosting')}</label>
            <input type="date" placeholder={t('createJob.placeholders.postingDate')} defaultValue={postingDate}
            {...register("postingDate")} className='create-job-input'/>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.experience')}</label>
            <select {...register("experienceLevel", { required: true })} className='create-job-input'>
            <option value={experienceLevel}>{experienceLevel}</option>
            <option value="Fresher/No Experience">{t('createJob.experienceOptions.fresher')}</option>
            <option value="Internship">{t('createJob.experienceOptions.internship')}</option>
            <option value="Remote Work">{t('createJob.experienceOptions.experienced')}</option>
          </select>
            </div>
        </div>
    
        {/* Fifth Row */}

    <div className="">
    <label className='block mb-2 text-lg'>{t('createJob.requiredSkills')}</label>
    <CreatableSelect
    defaultValue={skills}
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
            <input type="url" placeholder={t('createJob.placeholders.companyLogo')} defaultValue={companyLogo}
            {...register("companyLogo")} className='create-job-input'/>
            </div>
            <div className="lg:w-1/2 w-full">
            <label className='block mb-2 text-lg'>{t('createJob.employmentType')}</label>
            <select {...register("employmentType", { required: true })} className='create-job-input'>
            <option value={employmentType}>{employmentType}</option>
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
    defaultValue={description}
    placeholder={t('createJob.placeholders.description')}
    {...register("description", { required: true })}
    style={{ resize: 'none' }}/>
    </div>

    {/* Last Row */}
    <div className="create-job-flex">
      <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.postedBy')}</label>
        <input type="email" placeholder={t('createJob.placeholders.postedBy')} defaultValue={postedBy}
              {...register("postedBy", { required: true })} className='create-job-input'/>
      </div>
      <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.phone')}</label>
        <input type="tel" placeholder={t('createJob.placeholders.phone')} defaultValue={phone}
              {...register("phone")} className='create-job-input'/>
      </div>
    </div>


          <input type="submit" value={t('createJob.submit')} className='block bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer'/>
        </form>
    </div>
        </div>
  )
}

export default UpdateJobPage
