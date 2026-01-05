import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    experience: '',
  });

  return (
    <div className="overflow-hidden">
      <section id="about" className="relative pt-20 pb-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Launch your career in tech sales
            </h1>
            <p className="text-xl text-brand-700 mt-4">
              We find you a job, train you, AND pay you.
            </p>
            <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
              The world has enough junior coders. It's starving for people who
              can actually sell the product. Join the Uri Residency to master
              modern B2B sales, build a portfolio of closed deals, and unlock
              remote roles in the African, US & UK market.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary px-8 py-4 text-lg shadow-brand-200 hover:shadow-brand-300"
              >
                Apply Today
              </button>
              <a href="#process" className="btn-secondary px-8 py-4 text-lg">
                <PlayCircle className="mr-2 w-5 h-5" />
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="trust" className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 font-medium">
            Graduates prepared for roles at
          </p>
        </div>
      </section>

      <section id="process" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How does it work?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">The Academy</h3>
              <p className="text-gray-600 mt-2">
                Master modern sales psychology and the Uri Tech Stack.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">The Residency</h3>
              <p className="text-gray-600 mt-2">
                Don't just study. Generate live leads for real companies using
                Uri. Earn commissions while you learn.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                The Deployment
              </h3>
              <p className="text-gray-600 mt-2">
                Top 5% get hired by Uri. The rest get placed with our partner
                network.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            The Roadmap
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold text-brand-600">Weeks 1-3</p>
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                The Download
              </h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>Deep dive into Cold Email Copywriting</li>
                <li>Cultural Nuance (Western Markets)</li>
                <li>CRM Management & Data Hygiene</li>
                <li>Sales Psychology Fundamentals</li>
              </ul>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold text-brand-600">Weeks 4-5</p>
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                Live Fire
              </h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>You are assigned a quota</li>
                <li>You use Uri to hunt leads</li>
                <li>You book real meetings</li>
                <li>Earn your first commissions</li>
              </ul>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold text-brand-600">Week 6+</p>
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                Placement
              </h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>Interview preparation</li>
                <li>Portfolio review & polish</li>
                <li>Intro to hiring partners</li>
                <li>Career coaching & support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="what-is-uri" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Tech-Stack Fluency
              </h3>
              <p className="text-gray-600 mt-2">
                Mastery of Uri, HubSpot, and LinkedIn Sales Nav. You'll leave
                knowing the tools that top SDRs use daily.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Uri Platform',
                  'HubSpot CRM',
                  'LinkedIn Sales Navigator',
                  'Outreach.io',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Cultural Camouflage
              </h3>
              <p className="text-gray-600 mt-2">
                How to communicate with US/UK prospects without the "outsider"
                friction. Master tone, timing, and context.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Western Communication Styles',
                  'Time Zone Management',
                  'Cultural Nuances',
                  'Email Etiquette',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Real-World Practice
              </h3>
              <p className="text-gray-600 mt-2">
                No simulations. You will prospect real companies and launch full
                outbound campaigns that generate revenue.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Live Lead Generation',
                  'Real Quota Targets',
                  'Commission Earnings',
                  'Portfolio Building',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="graduates" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Hire Uri Graduates
          </h2>
          <Link to="/contact" className="btn-primary mt-6">
            Browse Graduates
          </Link>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              We're here to ensure you're successful
            </h2>
            <p className="text-gray-600 mt-4">
              Uri's training platform and sales coaches are here to provide you
              as much 1:1 personalized training as you need during the first 3
              months of your career.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              'Within days after our kick off call, Uri promptly provided us with candidates based on our ideal SDR profile. We initially had head count for 1 however were so impressed with 2 candidates Uri had supplied, we ended up hiring both.',
              "Wouldn't be where I am today without Uri. They opened the door for me to start at an incredible company and gave me a lot of training and mentorship as I transitioned into the role.",
              'Uri helped me get my foot in the door after graduating from college. Their program taught me the fundamentals of being a successful SDR and how to go beyond. I am truly grateful for all the support they offered.',
            ].map((q, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <p className="text-gray-700">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold">Your career is waiting.</h2>
            <p className="text-xl mt-2">Your visa is irrelevant.</p>
            <p className="text-brand-200 mt-6">
              Join a global cohort of ambitious professionals ready to break
              into tech sales. Remote roles, real commissions, no boundaries.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="btn-primary bg-white text-brand-700 hover:bg-brand-50"
              >
                Start Your Application
              </Link>
            </div>
            <p className="text-sm text-brand-300 mt-4">
              Limited spots available for Cohort 1 • Applications close soon
            </p>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            {!submitted ? (
              <>
                <h3 className="text-xl font-bold text-gray-900">
                  Apply for Residency
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join Cohort 1 • Limited spots
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div>
                    <label
                      htmlFor="apply-full-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="apply-full-name"
                      title="Full Name"
                      placeholder="Enter your full name"
                      className="mt-1 w-full rounded-lg border-gray-300 focus:ring-brand-500 focus:border-brand-500"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apply-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="apply-email"
                      title="Email Address"
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border-gray-300 focus:ring-brand-500 focus:border-brand-500"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apply-experience"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tell us about your sales experience (if any)
                    </label>
                    <textarea
                      id="apply-experience"
                      title="Sales Experience"
                      placeholder="Share a brief summary"
                      className="mt-1 w-full rounded-lg border-gray-300 focus:ring-brand-500 focus:border-brand-500"
                      rows={4}
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    By applying, you agree to our terms and conditions. We'll
                    never share your information.
                  </p>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubmitted(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Submit Application
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Application Received!
                </h3>
                <p className="text-gray-600 mt-2">
                  We'll review your application and get back to you within 48
                  hours.
                </p>
                <div className="mt-6">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitted(false);
                      setForm({ fullName: '', email: '', experience: '' });
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
