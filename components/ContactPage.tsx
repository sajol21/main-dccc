import React, { useState } from 'react';
import { postContactMessage } from '../services/dataService';

const InfoCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl p-8 md:p-12 shadow-subtle ${className}`}>
        {children}
    </div>
);

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        try {
            await postContactMessage(name, email, message);
            setSubmitted(true);
        } catch (error) {
            setSubmitError('Failed to send message. Please try again later.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-16 pt-32 bg-dc-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-fadeInUp">
                    <h2 className="text-4xl md:text-5xl font-bold font-poppins text-dc-dark">Get In Touch</h2>
                    <p className="text-dc-text mt-2 max-w-2xl mx-auto">Have a question, a proposal, or just want to say hello? We'd love to hear from you.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <InfoCard>
                        <h3 className="text-2xl font-bold text-dc-dark mb-6">Send Us a Message</h3>
                        {submitted ? (
                            <div className="text-center p-8 bg-green-100 text-green-800 rounded-lg">
                                <h4 className="font-bold text-xl">Message Sent!</h4>
                                <p>Thank you for contacting us. We will get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input name="name" type="text" placeholder="Your Name" required className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400" />
                                <input name="email" type="email" placeholder="Your Email" required className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400" />
                                <textarea name="message" placeholder="Your Message" rows={5} required className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"></textarea>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-dc-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                                {submitError && <p className="text-red-500 text-center">{submitError}</p>}
                            </form>
                        )}
                    </InfoCard>

                    <div className="space-y-8">
                         <InfoCard>
                            <h3 className="text-2xl font-bold text-dc-dark mb-4">Contact Information</h3>
                            <div className="space-y-4 text-dc-text">
                                <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-dc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> contact@dcculturalclub.com</p>
                                <p className="flex items-center"><svg className="w-5 h-5 mr-3 text-dc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Dhaka College Cultural Club Room, Dhaka College, Dhaka</p>
                            </div>
                        </InfoCard>
                         <InfoCard>
                            <h3 className="text-2xl font-bold text-dc-dark mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-dc-blue"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
                                <a href="#" className="text-gray-400 hover:text-dc-blue"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.823v-7.04l6.02 3.52-6.02 3.52z" /></svg></a>
                            </div>
                        </InfoCard>
                    </div>
                </div>

                <div className="mt-16 rounded-xl overflow-hidden shadow-subtle">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.411691167931!2d90.38686601543324!3d23.73305098459736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8c12563583d%3A0x95448b2633f84862!2sDhaka%20College!5e0!3m2!1sen!2sbd!4v1628334433155!5m2!1sen!2sbd"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;