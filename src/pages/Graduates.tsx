import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

import graduate1 from '../assets/graduate-1.png';
import graduate2 from '../assets/graduate-2.png';
import graduate3 from '../assets/graduate-3.png';
import graduate4 from '../assets/graduate-4.png';

type Grad = {
  name: string;
  role: string;
  location: string;
  graduatedDate: string;
  bio: string;
  skills: string[];
  available: boolean;
  linkedin?: string;
  image?: string;
};

const GRADUATES: Grad[] = [
  {
    name: 'Amara Okoye',
    role: 'Sales Development Representative',
    location: 'Lagos, Nigeria',
    graduatedDate: 'Nov 2025',
    bio: 'Focused on pipeline generation and discovery. Proven success in Western markets.',
    skills: [
      'Uri Platform',
      'HubSpot',
      'Cold Email',
      'Discovery Calls',
      'LinkedIn Nav',
    ],
    available: true,
    linkedin: 'https://linkedin.com',
    image: graduate1,
  },
  {
    name: 'Kwame Mensah',
    role: 'Account Executive',
    location: 'Accra, Ghana',
    graduatedDate: 'Oct 2025',
    bio: 'Closed multiple mid-market deals during residency. Strong negotiation and closing.',
    skills: ['Negotiation', 'HubSpot', 'Outbound', 'Objection Handling'],
    available: false,
    linkedin: 'https://linkedin.com',
    image: graduate2,
  },
  {
    name: 'Adaeze Nwankwo',
    role: 'Sales Development Representative',
    location: 'Remote',
    graduatedDate: 'Dec 2025',
    bio: 'Expert in cold outreach with culturally adaptive communication for US/UK markets.',
    skills: ['Cold Email', 'Sales Psychology', 'Time Zones', 'CRM Hygiene'],
    available: true,
    linkedin: 'https://linkedin.com',
    image: graduate3,
  },
  {
    name: 'Yusuf Bello',
    role: 'Account Executive',
    location: 'London, UK',
    graduatedDate: 'Nov 2025',
    bio: 'Full-cycle AE with experience running outbound campaigns and closing deals.',
    skills: ['Outbound Strategy', 'Closing', 'HubSpot', 'Uri Platform'],
    available: false,
    linkedin: 'https://linkedin.com',
    image: graduate4,
  },
];

export function Graduates() {
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const counts = useMemo(() => {
    const total = GRADUATES.length;
    const available = GRADUATES.filter((g) => g.available).length;
    return { total, available };
  }, []);

  const list = useMemo(() => {
    return GRADUATES.filter((g) =>
      filter === 'available' ? g.available : true
    );
  }, [filter]);

  return (
    <div className="bg-white">
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hire Uri Graduates
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our roster of trained sales professionals ready to join your
            team. All graduates have completed our intensive 12-week residency
            program.
          </p>
          <div className="mt-8 inline-flex gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setFilter('all')}
              aria-label="Show all graduates"
            >
              All Graduates • {counts.total}
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'available'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setFilter('available')}
              aria-label="Show available graduates"
            >
              Available Now • {counts.available}
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {list.map((g, i) => {
              const extra = Math.max(0, g.skills.length - 3);
              const shownSkills = g.skills.slice(0, 3);
              return (
                <div
                  key={g.name + i}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-slide-up h-full flex flex-col"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {g.image && (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {g.name}
                        </h3>
                        <p className="text-gray-600">
                          {g.role} • {g.location}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          g.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {g.available ? 'Available' : 'Placed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Graduated {g.graduatedDate}
                    </p>
                    <p className="text-gray-700 mt-3 line-clamp-3">{g.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {shownSkills.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{extra} more
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <Link
                        to="/contact"
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          g.available
                            ? 'bg-brand-600 text-white hover:bg-brand-700'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        aria-disabled={!g.available}
                      >
                        Contact
                      </Link>
                      <a
                        href={g.linkedin || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        aria-label="View LinkedIn profile"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Looking for trained sales talent?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Partner with Uri Academy to access our pipeline of skilled,
            job-ready graduates. No recruitment fees, just talented
            professionals ready to contribute from day one.
          </p>
          <Link to="/contact" className="btn-primary mt-8">
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
