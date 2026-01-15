import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form"
import CreatableSelect from "react-select/creatable";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../services/api/apiClient';
import Swal from 'sweetalert2';
import { validateMultipleFields, validateSkills } from '../../utils/profanity-checker';

const CreateJobPage = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, token, loading } = useAuth();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [phoneValue, setPhoneValue] = useState('');

    const {
      register,
      handleSubmit,
      reset,
      watch,
      setValue,
      control,
      formState: { errors },
    } = useForm();

  const minPrice = watch("minPrice");

  const formatPhoneInput = (value) => {
    const digits = value.replace(/\D/g, '');
    
    const limitedDigits = digits.slice(0, 11);
    
    let formatted = limitedDigits;
    if (formatted.startsWith('8')) {
      formatted = '7' + formatted.slice(1);
    }
    
    if (formatted.length > 0 && !formatted.startsWith('7')) {
      formatted = '7' + formatted;
    }
    
    if (formatted.length === 0) {
      return '';
    } else if (formatted.length <= 1) {
      return `+${formatted}`;
    } else if (formatted.length <= 4) {
      return `+7 (${formatted.slice(1)}`;
    } else if (formatted.length <= 7) {
      return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4)}`;
    } else if (formatted.length <= 9) {
      return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`;
    } else {
      return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneInput(input);
    setPhoneValue(formatted);
    const digits = formatted.replace(/\D/g, '');
    setValue('phone', digits.length === 11 ? digits : '');
  };

  const validateRussianPhone = (value) => {
    if (!value) return true;
    
    const digits = value.replace(/\D/g, '');
    
    if (digits.length !== 11) {
      return 'Номер должен содержать 11 цифр';
    }
    
    if (!digits.startsWith('7')) {
      return 'Номер должен начинаться с 7';
    }
    
    const secondDigit = digits[1];
    if (!['9', '8', '7', '6', '5', '4', '3'].includes(secondDigit)) {
      return 'Неверный формат российского номера';
    }
    
    return true;
  };

  const cities = ["Elista", "Lagan", "Gorodovikovsk"];

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

    useEffect(() => {
        if(loading) return;
        
        if (!isAuthenticated) {
            navigate('/', { replace: true });
        } else if (user?.role !== 'employer') {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate, loading]);

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

    
    
      const onSubmit = async (data) => {
        if (!token || !user) {
          await Swal.fire({
            icon: 'error',
            title: 'Ошибка авторизации',
            text: 'Пожалуйста, войдите снова',
          });
          navigate('/login');
          return;
        }

        const profanityErrors = validateMultipleFields({
          'Название вакансии': data.jobTitle,
          'Название компании': data.companyName,
          'Улица': data.street,
          'Описание': data.description,
        });

        if (profanityErrors) {
          const errorMessages = Object.values(profanityErrors).join('\n');
          await Swal.fire({
            icon: 'error',
            title: 'Обнаружено недопустимое содержание',
            text: errorMessages,
          });
          return;
        }

        if (selectedOption && selectedOption.length > 0) {
          const skillsError = validateSkills(selectedOption);
          if (skillsError) {
            await Swal.fire({
              icon: 'error',
              title: 'Обнаружено недопустимое содержание',
              text: skillsError,
            });
            return;
          }
        }

        data.skills = selectedOption;

        if (!data.postedBy) {
          data.postedBy = user.email || user.phone || `user_${user.id}`;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        data.postingDate = formattedDate;

        if (data.phone) {
          const digits = data.phone.replace(/\D/g, '');
          if (digits.length === 11 && digits.startsWith('7')) {
            data.phone = digits;
          } else {
            delete data.phone;
          }
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
            setPhoneValue('');
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

  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
<div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

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

    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.minSalary')}</label>
        <input type="text" placeholder={t('createJob.placeholders.minSalary')}
        {...register("minPrice", {
          required: t('validation.required'),
          min: { value: 0, message: t('validation.nonNegative')},
          pattern: {
            value: /^\d+$/,
            message: 'Введите число'
          }
        })} 
        className='create-job-input'/>
        {errors.minPrice && (
          <p className="form-error">{errors.minPrice.message}</p>
        )}
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.maxSalary')}</label>
        <input type="text" placeholder={t('createJob.placeholders.maxSalary')}
        {...register("maxPrice",{
          required: t('validation.required'),
          min: { value: 0, message: t('validation.nonNegative')},
          pattern: {
            value: /^\d+$/,
            message: 'Введите число'
          },
          validate: value =>
            Number(value) > Number(minPrice) || t('validation.maxGreaterMin')
        })} 
        className='create-job-input'/>
        {errors.maxPrice && (
          <p className="form-error">{errors.maxPrice.message}</p>
        )}
        </div>
    </div>

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

    <div className="create-job-flex">
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.street')}</label>
        <input type="text" placeholder={t('createJob.placeholders.street')}
        {...register("street", { required: true })} className='create-job-input'/>
        </div>
        <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.apartment')}</label>
        <input type="text" placeholder={t('createJob.placeholders.apartment')}
        {...register("apartment",{
          required: t('validation.required'),
          min: { value: 0, message: t('validation.nonNegative')},
          pattern: {
            value: /^\d+$/,
            message: 'Введите число'
          }
        })} className='create-job-input'/>
        {errors.apartment && (
          <p className="form-error">{errors.apartment.message}</p>
        )}
        </div>
    </div>

    <div className="create-job-flex">
      <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.experience')}</label>
        <select {...register("experienceLevel", { required: true })} className='create-job-input'>
            <option value="">{t('createJob.placeholders.chooseExperience')}</option>
            <option value="Fresher/No Experience">{t('createJob.experienceOptions.fresher')}</option>
            <option value="Internship">{t('createJob.experienceOptions.internship')}</option>
            <option value="Remote Work">{t('createJob.experienceOptions.experienced')}</option>
        </select>
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

    <div className="">
      <label className='block mb-2 text-lg'>{t('createJob.requiredSkills')}</label>
      <CreatableSelect
      defaultValue={selectedOption}
      onChange={setSelectedOption}
      options={options}
      isMulti
      className='create-job-input py-4'
      placeholder={t('skills.selectPlaceholder')}
      formatCreateLabel={() => t('skills.createLabel')}/>
    </div>

    <div className="w-full">
      <label className='block mb-2 text-lg'>{t('createJob.description')}</label>
      <textarea className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
      rows={6}
      defaultValue={""}
      placeholder={t('createJob.placeholders.description')}
      {...register("description", { required: true })}
      style={{ resize: 'none' }}/>
    </div>

    <div className="create-job-flex">
      <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.postedBy')}</label>
        <input type="email" placeholder={t('createJob.placeholders.postedBy')}
              {...register("postedBy", { required: true })} className='create-job-input'/>
      </div>
      <div className="lg:w-1/2 w-full">
        <label className='block mb-2 text-lg'>{t('createJob.phone')}</label>
        <Controller
          name="phone"
          control={control}
          rules={{
            validate: validateRussianPhone
          }}
          render={({ field }) => (
            <input 
              type="tel" 
              placeholder="+7 (___) ___-__-__"
              value={phoneValue}
              onChange={(e) => {
                handlePhoneChange(e);
                const digits = e.target.value.replace(/\D/g, '');
                field.onChange(digits.length === 11 ? digits : '');
              }}
              onBlur={(e) => {
                field.onBlur();
                const digits = e.target.value.replace(/\D/g, '');
                if (digits.length === 11 && digits.startsWith('7')) {
                  const formatted = formatPhoneInput(digits);
                  setPhoneValue(formatted);
                  field.onChange(digits);
                } else if (digits.length === 0) {
                  setPhoneValue('');
                  field.onChange('');
                }
              }}
              className='create-job-input'
              maxLength={18}
            />
          )}
        />
        {errors.phone && (
          <p className="form-error text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Формат: +7 (999) 123-45-67
        </p>
      </div>
    </div>


      <input type="submit" value={t('createJob.submit')} className='block bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer'/>
    </form>
</div>
    </div>
  )
}

export default CreateJobPage