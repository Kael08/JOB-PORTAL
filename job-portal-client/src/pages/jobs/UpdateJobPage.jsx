
import { useLoaderData, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import CreatableSelect from "react-select/creatable";
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../services/api/apiClient';
import Swal from 'sweetalert2';

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
    
      const onSubmit = async (data) => {
        data.skills = selectedOption;

        try {
          const result = await apiClient.patch(`/update-job/${id}`, data);
          console.log(result);

          if(result.message === "Вакансия успешно обновлена"){
            await Swal.fire({
              icon: 'success',
              title: t('createJob.updateSuccessMessage'),
              timer: 2000,
              showConfirmButton: false
            });
            reset();
            window.location.href = '/my-job';
          }
        } catch (error) {
          console.error("Error updating job:", error);
          await Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: error.message || t('createJob.updateErrorMessage')
          });
        }
      };

        const skillKeys = [
          "communication", "teamwork", "initiative", "responsibility", "creativity",
          "problem_solving", "time_management", "adaptability", "leadership", "critical_thinking",
          "customer_service", "negotiation", "presentation", "analytical_thinking", "organization",
          "multitasking", "conflict_resolution", "decision_making", "strategic_planning", "project_management",
          "sales_skills", "marketing", "financial_literacy", "foreign_language", "emotional_intelligence",
          "stress_management", "learning_ability", "mentoring", "public_speaking", "networking",
          "attention_to_detail", "persuasion", "research", "writing_skills", "active_listening",
          "delegation", "coaching", "change_management", "quality_control", "business_etiquette", "other"
        ];

        const options = skillKeys.map(key => ({
          value: key,
          label: t(`skillOptions.${key}`)
        }));
            
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


          <input type="submit" value="Сохранить изменения" className='block bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer'/>
        </form>
    </div>
        </div>
  )
}

export default UpdateJobPage
