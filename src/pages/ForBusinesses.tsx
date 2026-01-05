import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function ForBusinesses() {
  return (
    <div className="bg-white">
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-4">
            For Hiring Partners
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hire Pre-Trained Sales Talent</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access a pipeline of skilled, job-ready SDRs and AEs. No recruitment fees. No risk. Just results.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/graduates" className="btn-secondary">
              Browse Graduates
            </Link>
            <Link to="/contact" className="btn-primary">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">The Talent You Need, Ready to Perform</h2>
              <p className="text-lg text-gray-600 mt-4">
                Our graduates aren't just trained—they're tested. Each candidate has completed real sales campaigns, handled objections, and closed deals before they ever reach your interview room.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Trained on modern sales tools and CRM systems',
                  'Experienced in cold outreach and discovery calls',
                  'Culturally adaptable for global markets',
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-600" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-600 text-white rounded-2xl p-10 text-center shadow-lg">
              <div className="text-6xl font-extrabold">100%</div>
              <div className="mt-2 text-xl font-semibold">Job-Ready Graduates</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Partner with Uri?</h2>
            <p className="text-lg text-gray-600 mt-3">
              We take the risk and cost out of hiring entry-level sales talent.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Zero Recruitment Fees',
                desc: 'No upfront costs. We handle sourcing, screening, and training completely.',
              },
              {
                title: 'Job-Ready in 6 Weeks',
                desc: 'Our graduates come trained on modern sales stacks and best practices.',
              },
              {
                title: 'Pre-Vetted Talent',
                desc: 'Every candidate has proven their skills through live sales campaigns.',
              },
              {
                title: 'Diverse Global Pipeline',
                desc: 'Access motivated candidates from around the world, all trained to your standards.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 mt-3">
              A simple, streamlined process to get you the talent you need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                n: '01',
                title: 'Tell Us Your Needs',
                desc: 'Share your ideal candidate profile, tech stack, and team culture.',
              },
              {
                n: '02',
                title: 'We Match & Train',
                desc: 'We source candidates and train them specifically for your requirements.',
              },
              {
                n: '03',
                title: 'Interview Top Performers',
                desc: "Review portfolios and interview candidates who've proven themselves.",
              },
              {
                n: '04',
                title: 'Hire with Confidence',
                desc: 'Onboard graduates who are already familiar with enterprise sales.',
              },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="text-brand-600 font-extrabold text-xl">{step.n}</div>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{step.title}</h3>
                <p className="text-gray-600 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Build Your Sales Team?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Join 50+ companies who have successfully hired through Uri Academy.
          </p>
          <Link to="/graduates" className="btn-primary mt-8">
            View Available Graduates
          </Link>
        </div>
      </section>
    </div>
  );
}
