import { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Target,
  Trophy,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { CurriculumItem } from '../types/schema';

export function Program() {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const data = await api.getCurriculum();
        setCurriculum(data);
      } catch (error) {
        console.error('Failed to fetch curriculum:', error);
      }
    };
    fetchCurriculum();
  }, []);

  const getIcon = (name?: string) => {
    const props = { className: 'w-6 h-6 text-white' };
    switch (name) {
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'Target':
        return <Target {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-brand-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-800 border border-brand-700 text-brand-200 text-sm font-semibold mb-6">
            <Calendar className="w-4 h-4" />
            3-Week Intensive Program
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Comprehensive <span className="text-brand-400">Curriculum</span>
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10">
            From fundamentals to job-ready skills. Our curriculum is designed by
            industry experts to get you hired.
          </p>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {curriculum.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>

                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-brand-600 text-sm tracking-wider uppercase">
                      Week {item.week}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      10 Hours
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {item.description}
                  </p>

                  <ul className="space-y-2">
                    {(item.topics || []).map((topic, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="bg-brand-50 rounded-3xl p-10 md:p-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to start your career?
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Join hundreds of graduates who have transformed their careers
                through the Uri Sales Academy.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="btn-primary py-4 px-8 text-lg shadow-xl shadow-brand-200"
                >
                  Enroll in Next Cohort
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  View Tuition
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
