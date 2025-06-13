import React, { useState, useEffect } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(false);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    console.log('Form data submitted:', formData);
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  };

  useEffect(() => {
    let timer: number; // Changed NodeJS.Timeout to number
    if (isSubmitted) {
      timer = window.setTimeout(() => { // Used window.setTimeout for clarity
        setIsSubmitted(false);
      }, 5000); // Success message disappears after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  return (
    <section aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="text-2xl sm:text-3xl font-semibold text-pink-400 mb-6 text-center">
        Contact the Artist
      </h2>
      {isSubmitted && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-center transition-opacity duration-300 ease-in-out" role="alert">
          Message sent successfully! We'll be in touch soon.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-200 transition-colors`}
            placeholder="Jane Doe"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-700 border ${errors.email ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-200 transition-colors`}
            placeholder="you@example.com"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-700 border ${errors.message ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-200 transition-colors resize-none`}
            placeholder="Your message..."
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p id="message-error" className="mt-1 text-xs text-red-400" role="alert">{errors.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:bg-pink-800 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send Message'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;