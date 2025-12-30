import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Who is this course for?',
    a: "This course is designed for anyone looking to start or accelerate a career in digital sales. Whether you're a fresh graduate, a traditional sales professional looking to upskill, or an entrepreneur, this program will equip you with the latest AI tools and strategies.",
  },
  {
    q: 'Do I need prior sales experience?',
    a: 'No prior experience is required. We start with the fundamentals and build up to advanced concepts. However, a willingness to learn and interact with people is essential.',
  },
  {
    q: 'How much time do I need to commit?',
    a: 'The program is intensive but flexible. Expect to commit about 10-12 hours per week, including live sessions, self-paced learning, and practical assignments.',
  },
  {
    q: 'What tools will I learn?',
    a: 'You will learn to use industry-standard tools like HubSpot/Salesforce for CRM, LinkedIn Sales Navigator for prospecting, and AI tools like ChatGPT and Jasper for content and outreach.',
  },
  {
    q: 'Is the certificate recognized?',
    a: 'Yes! Our certificate is recognized by our hiring partners and demonstrates that you have practical, hands-on experience with modern digital sales workflows.',
  },
  {
    q: 'Do you offer job placement support?',
    a: "While we can't guarantee a job, we provide extensive career support including resume reviews, mock interviews, and access to our exclusive network of hiring partners.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-600 blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-800 border border-brand-700 text-brand-200 text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-brand-400">Questions</span>
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Everything you need to know about the Uri Sales Academy.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'border-brand-200 bg-brand-50 shadow-md'
                    : 'border-gray-200 hover:border-brand-200 bg-white'
                }`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`text-lg font-bold ${
                      openIndex === index ? 'text-brand-900' : 'text-gray-900'
                    }`}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`p-1 rounded-full ${
                      openIndex === index
                        ? 'bg-brand-200 text-brand-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </button>

                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index
                      ? 'max-h-48 pb-6 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <a
              href="mailto:support@uriacademy.com"
              className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline"
            >
              Contact our Support Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
