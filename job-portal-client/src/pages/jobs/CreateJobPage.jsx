import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import CreatableSelect from "react-select/creatable";
import { useTranslation } from 'react-i18next';

const CreateJobPage = () => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);
    const {
        register,
        handleSubmit,reset,
        formState: { errors },
      } = useForm()
    
      const onSubmit = (data) => {
        data.skills = selectedOption;
        // console.log(data);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        fetch(`${apiUrl}/post-job`, {
          method: "POST",
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if(result.message && result.job){
            alert(t('createJob.successMessage'));
            reset()
          } else {
            alert(t('createJob.errorMessage') + ": " + (result.message || "Unknown error"));
          }
        })
        .catch((error) => {
          console.error("Error posting job:", error);
          alert(t('createJob.errorMessage') + ". Please check console for details.");
        });
        };

        const options = [
            {value: "JavaScript", label: "JavaScript"},
            {value: "HTML", label: "HTML"},
            {value: "CSS", label: "CSS"},
            {value: "DOM", label: "DOM"},
            {value: "Asynchronous Programming", label: "Asynchronous Programming"},
            {value: "React", label: "React"},
            {value: "Node.js", label: "Node.js"},
            {value: "Express.js", label: "Express.js"},
            {value: "MongoDB", label: "MongoDB"},
            {value: "SQL", label: "SQL"},
            {value: "Python", label: "Python"},
            {value: "Java", label: "Java"},
            {value: "C++", label: "C++"},
            {value: "Ruby", label: "Ruby"},
            {value: "PHP", label: "PHP"},
            {value: "Go", label: "Go"},
            {value: "Rust", label: "Rust"},
            {value: "TypeScript", label: "TypeScript"},
            {value: "Angular", label: "Angular"},
            {value: "Vue.js", label: "Vue.js"},
            {value: "Flutter", label: "Flutter"},
            {value: "React Native", label: "React Native"},
            {value: "Ionic", label: "Ionic"},
            {value: "Kotlin", label: "Kotlin"},
            {value: "Swift", label: "Swift"},
            {value: "Other", label: "Other"}
            
    ]

  return (
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
        <label className='block mb-2 text-lg'>{t('createJob.jobLocation')}</label>
        <input type="text" placeholder={t('createJob.placeholders.jobLocation')}
        {...register("jobLocation", { required: true })} className='create-job-input'/>
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

    {/* Fifth Row */}

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

{/* 7th Row */}
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
  )
}

export default CreateJobPage
