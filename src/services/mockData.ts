import { Role, CohortStatus, SubmissionStatus } from '../types/schema';
import type {
  User,
  Cohort,
  CurriculumItem,
  StudentProfile,
  Assignment,
  Submission,
} from '../types/schema';

export const mockCohorts: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Cohort 1',
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-11-01T00:00:00Z',
    status: CohortStatus.ACTIVE,
  },
  {
    id: 'cohort-2',
    name: 'Cohort 2',
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2023-12-01T00:00:00Z',
    status: CohortStatus.PLANNED,
  },
];

export const mockCurriculum: CurriculumItem[] = [
  {
    id: 'week-1',
    week: 1,
    title: 'Digital Sales Fundamentals & Mindset',
    description:
      'Understand the modern sales landscape and develop the growth mindset required for success.',
    durationMinutes: 120,
    orderIndex: 1,
    topics: [
      'Evolution of Sales: Traditional vs. Digital',
      "The Modern Buyer's Journey",
      'Sales Psychology & Emotional Intelligence',
      'Setting SMART Goals & KPIs',
    ],
    icon: 'BookOpen',
  },
  {
    id: 'week-2',
    week: 2,
    title: 'Lead Generation & AI Prospecting',
    description:
      'Learn to find high-quality leads using advanced tools and AI-driven strategies.',
    durationMinutes: 120,
    orderIndex: 2,
    topics: [
      'Ideal Customer Profile (ICP) & Buyer Personas',
      'LinkedIn Sales Navigator Mastery',
      'Using ChatGPT for Personalized Outreach',
      'Building & Cleaning Email Lists',
    ],
    icon: 'Users',
  },
  {
    id: 'week-3',
    week: 3,
    title: 'Outreach, CRM & Pipeline Management',
    description:
      'Master the tools of the trade and manage your sales pipeline effectively.',
    durationMinutes: 120,
    orderIndex: 3,
    topics: [
      'Cold Email & Cold Calling Frameworks',
      'CRM Fundamentals (HubSpot/Salesforce)',
      'Automating Follow-ups',
      'Pipeline Health & Forecasting',
    ],
    icon: 'Target',
  },
  {
    id: 'week-4',
    week: 4,
    title: 'Closing, Negotiation & Career Launch',
    description:
      'Seal the deal and prepare yourself for a high-paying career in tech sales.',
    durationMinutes: 120,
    orderIndex: 4,
    topics: [
      'Objection Handling Techniques',
      'The Art of Negotiation',
      'Closing Strategies that Work',
      'Resume Building & Interview Prep',
    ],
    icon: 'Trophy',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    role: Role.STUDENT,
    name: 'John Doe',
    initials: 'JD',
    createdAt: '2023-10-24T00:00:00Z',
    updatedAt: '2023-10-24T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'alice@example.com',
    role: Role.STUDENT,
    name: 'Alice Smith',
    initials: 'AS',
    createdAt: '2023-10-25T00:00:00Z',
    updatedAt: '2023-10-25T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'michael@example.com',
    role: Role.STUDENT,
    name: 'Michael Ross',
    initials: 'MR',
    createdAt: '2023-10-26T00:00:00Z',
    updatedAt: '2023-10-26T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'tanya@example.com',
    role: Role.STUDENT,
    name: 'Tanya Kim',
    initials: 'TK',
    createdAt: '2023-10-27T00:00:00Z',
    updatedAt: '2023-10-27T00:00:00Z',
  },
  {
    id: 'user-5',
    email: 'brandon@example.com',
    role: Role.STUDENT,
    name: 'Brandon Lee',
    initials: 'BL',
    createdAt: '2023-10-28T00:00:00Z',
    updatedAt: '2023-10-28T00:00:00Z',
  },
  {
    id: 'user-6',
    email: 'sarah@example.com',
    role: Role.STUDENT,
    name: 'Sarah Jones',
    initials: 'SJ',
    createdAt: '2023-10-29T00:00:00Z',
    updatedAt: '2023-10-29T00:00:00Z',
  },
  {
    id: 'user-7',
    email: 'kevin@example.com',
    role: Role.STUDENT,
    name: 'Kevin White',
    initials: 'KW',
    createdAt: '2023-10-30T00:00:00Z',
    updatedAt: '2023-10-30T00:00:00Z',
  },
  {
    id: 'user-current',
    email: 'john.smith@example.com',
    role: Role.STUDENT,
    name: 'John Smith',
    initials: 'JS',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
  },
];

export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'profile-1',
    userId: 'user-1',
    user: mockUsers[0],
    cohortId: 'cohort-1',
    cohort: mockCohorts[0],
    progress: 75,
    studentIdCode: 'ST-001',
  },
  {
    id: 'profile-2',
    userId: 'user-2',
    user: mockUsers[1],
    cohortId: 'cohort-1',
    cohort: mockCohorts[0],
    progress: 45,
    studentIdCode: 'ST-002',
  },
  {
    id: 'profile-3',
    userId: 'user-3',
    user: mockUsers[2],
    cohortId: 'cohort-2',
    cohort: mockCohorts[1],
    progress: 90,
    studentIdCode: 'ST-003',
  },
  {
    id: 'profile-4',
    userId: 'user-4',
    user: mockUsers[3],
    cohortId: 'cohort-1',
    cohort: mockCohorts[0],
    progress: 25,
    studentIdCode: 'ST-004',
  },
  {
    id: 'profile-5',
    userId: 'user-5',
    user: mockUsers[4],
    cohortId: 'cohort-2',
    cohort: mockCohorts[1],
    progress: 60,
    studentIdCode: 'ST-005',
  },
  {
    id: 'profile-6',
    userId: 'user-6',
    user: mockUsers[5],
    cohortId: 'cohort-1',
    cohort: mockCohorts[0],
    progress: 85,
    studentIdCode: 'ST-006',
  },
  {
    id: 'profile-7',
    userId: 'user-7',
    user: mockUsers[6],
    cohortId: 'cohort-2',
    cohort: mockCohorts[1],
    progress: 10,
    studentIdCode: 'ST-007',
  },
  {
    id: 'profile-current',
    userId: 'user-current',
    user: mockUsers[7],
    cohortId: 'cohort-1',
    cohort: mockCohorts[0],
    progress: 35,
    studentIdCode: 'ST-100',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Create 5 Ideal Customer Profiles',
    description: 'Research and document 5 potential B2B clients.',
    dueAt: '2023-10-30T23:59:59Z',
    maxScore: 100,
    cohortId: 'cohort-1',
  },
  {
    id: 'assign-2',
    title: 'LinkedIn Profile Optimization',
    description: 'Update your headline and summary based on the template.',
    dueAt: '2023-11-05T23:59:59Z',
    maxScore: 50,
    cohortId: 'cohort-1',
  },
  {
    id: 'assign-3',
    title: 'Cold Email Templates',
    description: 'Write 3 cold email templates for different scenarios.',
    dueAt: '2023-11-12T23:59:59Z',
    maxScore: 100,
    cohortId: 'cohort-1',
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'assign-1',
    studentId: 'profile-current',
    status: SubmissionStatus.PENDING,
    submittedAt: '2023-10-29T10:00:00Z',
  },
  {
    id: 'sub-2',
    assignmentId: 'assign-1',
    studentId: 'profile-1',
    status: SubmissionStatus.REVIEWED,
    score: 95,
    submittedAt: '2023-10-28T14:30:00Z',
    feedback: 'Excellent work on the ICPs.',
  },
  {
    id: 'sub-3',
    assignmentId: 'assign-2',
    studentId: 'profile-2',
    status: SubmissionStatus.PENDING,
    submittedAt: '2023-11-04T09:15:00Z',
  },
];

export const mockAdminTasks = [
  {
    id: 'task-1',
    title: 'Review Capstone Project - John Doe',
    completed: false,
  },
  { id: 'task-2', title: 'Approve Refund Request #123', completed: false },
  { id: 'task-3', title: 'Upload Week 4 Content', completed: false },
  { id: 'task-4', title: 'Send Weekly Newsletter', completed: true },
];
