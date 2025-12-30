import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  PlayCircle,
} from 'lucide-react';

export function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-50 blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-50 blur-3xl opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-semibold mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              New Cohort Starts January 14th, 2026
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight animate-slide-up">
              Master the Art of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                Digital Sales
              </span>
            </h1>

            <p
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Launch your career with our AI-powered Digital Sales Assistant
              program. Learn practical skills, work on real projects, and get
              hired.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 hover:-translate-y-1"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/program"
                className="btn-secondary text-lg px-8 py-4 hover:-translate-y-1 hover:shadow-lg"
              >
                <PlayCircle className="mr-2 w-5 h-5 text-gray-500" />
                View Curriculum
              </Link>
            </div>

            <div
              className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-gray-500 text-sm font-medium animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Certified Program</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Job-Ready Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Expert Mentors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Why Uri Sales Academy?
            </h2>
            <p className="text-lg text-gray-600">
              We bridge the gap between traditional sales and the digital
              future, equipping you with tools that modern employers demand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'AI-Powered Learning',
                desc: 'Learn to leverage AI tools like ChatGPT and Jasper to automate outreach and enhance your sales process.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Real-world Projects',
                desc: "Don't just watch videos. Work on actual sales campaigns and build a portfolio that demonstrates your skills.",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Career Growth',
                desc: 'Get certified and gain access to our network of hiring partners looking for digital sales talent.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-100 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-900 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-gray-800 rounded-full text-brand-400 text-sm font-semibold mb-6">
                Who is this for?
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Designed for Ambitious <br />
                <span className="text-brand-400">Game Changers</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Whether you're starting your career or looking to pivot into
                tech sales, our curriculum adapts to your goals.
              </p>

              <div className="space-y-6">
                {[
                  'Fresh graduates looking to start a high-growth career',
                  'Traditional sales professionals wanting to upskill',
                  'Entrepreneurs who want to master digital sales',
                  'Anyone interested in the intersection of Sales and AI',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-brand-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-200 font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-brand-400 font-bold hover:text-white transition-colors group"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand-600 rounded-3xl rotate-6 opacity-20 scale-95"></div>
              <div className="relative bg-gray-800 p-10 rounded-3xl border border-gray-700 shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 text-white">
                  Program Outcomes
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-brand-400 border border-gray-600">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">
                        Master CRM Tools
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Gain proficiency in HubSpot & Salesforce.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-brand-400 border border-gray-600">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">
                        AI-Driven Campaigns
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Create high-converting email sequences using AI.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-brand-400 border border-gray-600">
                      3
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">
                        Personal Branding
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Optimize your LinkedIn profile for inbound leads.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-brand-400 border border-gray-600">
                      4
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">
                        Closing Confidence
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Learn negotiation tactics that actually work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-brand-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-200">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-brand-700 rounded-full opacity-50 blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to launch your career?
              </h2>
              <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
                Join the next cohort of the Digital Sales Assistant program.
                Limited seats available for the October intake.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-3xl mx-auto mb-10">
                <div className="text-left">
                  <p className="text-brand-200 text-sm uppercase tracking-wider font-semibold">
                    Tuition Fee
                  </p>
                  <p className="text-4xl font-bold">₦50,000</p>
                </div>
                <div className="h-12 w-px bg-white/20 hidden md:block"></div>
                <div className="text-left">
                  <p className="text-brand-200 text-sm uppercase tracking-wider font-semibold">
                    Duration
                  </p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> 4 Weeks
                  </p>
                </div>
                <div className="h-12 w-px bg-white/20 hidden md:block"></div>
                <Link
                  to="/register"
                  className="w-full md:w-auto bg-white text-brand-600 px-8 py-4 rounded-xl font-bold hover:bg-brand-50 transition-colors shadow-lg"
                >
                  Secure Your Spot
                </Link>
              </div>

              <p className="text-brand-200 text-sm">
                Need more info?{' '}
                <Link
                  to="/program"
                  className="text-white underline hover:text-brand-100"
                >
                  Download syllabus
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
