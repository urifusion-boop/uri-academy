import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

export function PricingSection() {
  const [isInstallment, setIsInstallment] = useState(false);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          Invest in Your <span className="text-brand-600">Future</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Simple, transparent pricing. No hidden fees. Just the skills you
          need to succeed.
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            {/* Left Side: Value Prop */}
            <div className="p-10 md:p-14 md:w-3/5 bg-white text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What you get
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  '4 Weeks Live Training',
                  'Personal Mentorship',
                  'Real-world Projects',
                  'CV & LinkedIn Review',
                  'Interview Preparation',
                  'Job Search Support',
                  'Certificate of Completion',
                  'Lifetime Community Access',
                  'Sales Script Templates',
                  'CRM Tool Access',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600 font-medium text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-brand-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      100% Satisfaction Guarantee
                    </h4>
                    <p className="text-sm text-gray-500">
                      We are confident in our program. If you're not satisfied
                      after the first week, we'll give you a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Price Card */}
            <div className="p-10 md:p-14 md:w-2/5 bg-brand-900 text-white flex flex-col justify-between relative overflow-hidden text-left">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-brand-800 rounded-full text-brand-300 text-xs font-bold uppercase tracking-wider mb-6">
                  Next Cohort: Jan 14, 2026
                </div>

                {/* Toggle */}
                <div className="flex bg-brand-800 p-1 rounded-lg mb-8 w-fit">
                  <button
                    onClick={() => setIsInstallment(false)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      !isInstallment
                        ? 'bg-white text-brand-900 shadow-sm'
                        : 'text-brand-200 hover:text-white'
                    }`}
                  >
                    Upfront
                  </button>
                  <button
                    onClick={() => setIsInstallment(true)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      isInstallment
                        ? 'bg-white text-brand-900 shadow-sm'
                        : 'text-brand-200 hover:text-white'
                    }`}
                  >
                    Payment Plan
                  </button>
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {isInstallment ? 'Flexible Payment' : 'Standard Tuition'}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold">
                    {isInstallment ? '₦35,000' : '₦30,000'}
                  </span>
                </div>
                <p className="text-brand-300 text-sm mb-8">
                  {isInstallment
                    ? '₦20,000 deposit required'
                    : 'One-time payment'}
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-brand-100">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span>Limited seats available</span>
                  </li>
                  {isInstallment && (
                    <li className="flex items-center gap-3 text-brand-100">
                      <Check className="w-5 h-5 text-brand-300" />
                      <span>Split into 2 payments</span>
                    </li>
                  )}
                </ul>

                <Link
                  to="/register"
                  className="block w-full bg-white text-brand-900 text-center py-4 rounded-xl font-bold hover:bg-brand-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Enroll Now
                </Link>
                <p className="text-center text-brand-400 text-xs mt-4">
                  Secure payment via Paystack/Flutterwave
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
