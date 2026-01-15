import React from 'react'
import { FaEnvelopeOpenText, FaRocket } from "react-icons/fa6"
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      Swal.fire({
        icon: 'error',
        title: t('newsletter.errorTitle'),
        text: t('newsletter.errorMessage'),
      });
      return;
    }

      setEmail('');
      Swal.fire({
        icon: 'success',
        title: t('newsletter.successTitle'),
        text: t('newsletter.subscribeSuccess'),
      });
  };

  const handleResumeUpload = (event) => {
    const newSelectedFile = event.target.files[0];
    setSelectedFile(newSelectedFile);

    if (!newSelectedFile) {
      return;
    }

    console.log('Selected file:', newSelectedFile);

    Swal.fire({
      icon: 'success',
      title: t('newsletter.successTitle'),
      text: t('newsletter.uploadSuccess'),
    }).then(() => {
      setSelectedFile(null);
    });
  };

  return (
    <div>
      <div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <FaEnvelopeOpenText /> {t('newsletter.emailTitle')}
        </h3>
        <p className="text-primary/75 text-base mb-4">
          {t('newsletter.emailSubtitle')}
        </p>
        <div className="w-full space-y-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t('newsletter.emailPlaceholder')}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full block py-2 pl-3 border focus:outline-none"
          />
          <input
            type="submit"
            value={t('newsletter.subscribe')}
            required
            onClick={handleSubscribe}
            className="w-full block py-2 pl-3 border focus:outline-none bg-blue rounded-sm text-white cursor-pointer font-semibold"
          />
        </div>
      </div>

      <div className="mt-20">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <FaRocket /> {t('newsletter.uploadTitle')}
        </h3>
        <p className="text-primary/75 text-base mb-4">
          {t('newsletter.uploadSubtitle')}
        </p>
        <div className="w-full space-y-4">
          <input
            type="file"
            id="resumeInput"
            accept=".pdf, .doc, .docx"
            onChange={handleResumeUpload}
            className="w-full block py-2 pl-3 border focus:outline-none bg-blue rounded-sm text-white cursor-pointer font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;