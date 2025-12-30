import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function Contact() {
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      'Message sent successfully! We will get back to you soon.',
      'success'
    );
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get in <span className="text-brand-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about the program? We're here to help you start your
            journey.
          </p>
        </div>
      </section>

      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">
                Our friendly team is here to help.
              </p>
              <a
                href="mailto:hello@uriacademy.com"
                className="text-brand-600 font-bold hover:underline"
              >
                hello@uriacademy.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with us directly.</p>
              <a
                href="https://wa.me/234123456789"
                className="text-brand-600 font-bold hover:underline"
              >
                +234 123 456 789
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">
                Come say hello at our office.
              </p>
              <p className="text-brand-900 font-medium">
                123 Innovation Drive,
                <br />
                Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-14 bg-brand-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-20 -ml-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-16 -mb-16"></div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6">Send us a message</h3>
                  <p className="text-brand-100 mb-8 leading-relaxed">
                    Fill out the form and our admissions team will get back to
                    you within 24 hours. We can't wait to hear from you!
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-brand-100">
                      <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-300 font-bold text-sm">
                        1
                      </div>
                      <p>Fill out your details</p>
                    </div>
                    <div className="flex items-center gap-4 text-brand-100">
                      <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-300 font-bold text-sm">
                        2
                      </div>
                      <p>Submit your inquiry</p>
                    </div>
                    <div className="flex items-center gap-4 text-brand-100">
                      <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-300 font-bold text-sm">
                        3
                      </div>
                      <p>Get a response via email</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-14">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
