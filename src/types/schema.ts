export const Role = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const CohortStatus = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];

export const SubmissionStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
} as const;

export type SubmissionStatus =
  (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  CARD: 'CARD',
  BANK: 'BANK',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentProvider = {
  PAYSTACK: 'PAYSTACK',
  STRIPE: 'STRIPE',
} as const;

export type PaymentProvider =
  (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const ContentType = {
  VIDEO: 'VIDEO',
  DOC: 'DOC',
  LINK: 'LINK',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const CertificateStatus = {
  GENERATED: 'GENERATED',
  REVOKED: 'REVOKED',
} as const;

export type CertificateStatus =
  (typeof CertificateStatus)[keyof typeof CertificateStatus];

export const HelpTicketStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type HelpTicketStatus =
  (typeof HelpTicketStatus)[keyof typeof HelpTicketStatus];

export interface User {
  id: string;
  email: string;
  passwordHash?: string; // Should not be exposed to frontend usually
  role: Role;
  name: string;
  phoneNumber?: string | null;
  initials?: string | null;
  bio?: string | null;
  location?: string | null;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  profile?: StudentProfile;
  notifications?: NotificationPref;
}

export interface StudentProfile {
  id: string;
  userId: string;
  user?: User;
  cohortId?: string | null;
  cohort?: Cohort;
  progress: number;
  studentIdCode: string;
  submissions?: Submission[];
  grades?: Grade[];
  attendanceLogs?: AttendanceLog[];
  payments?: Payment[];
  certificates?: Certificate[];
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  status: CohortStatus;
  students?: StudentProfile[];
  sessions?: AttendanceSession[];
  assignments?: Assignment[];
  content?: ContentAsset[];
}

export interface CurriculumItem {
  id: string;
  week: number;
  title: string;
  description: string;
  durationMinutes: number;
  orderIndex: number;
  topics?: string[];
  icon?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueAt: string; // ISO Date
  maxScore: number;
  cohortId?: string | null;
  cohort?: Cohort;
  submissions?: Submission[];
  grades?: Grade[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignment?: Assignment;
  studentId: string;
  student?: StudentProfile;
  contentURL?: string | null;
  fileRef?: string | null;
  status: SubmissionStatus;
  score?: number | null;
  feedback?: string | null;
  notes?: string | null;
  submittedAt: string; // ISO Date
}

export interface Grade {
  id: string;
  studentId: string;
  student?: StudentProfile;
  assignmentId: string;
  assignment?: Assignment;
  score: number;
  gradedAt: string; // ISO Date
}

export interface AttendanceSession {
  id: string;
  date: string; // ISO Date
  cohortId: string;
  cohort?: Cohort;
  topic: string;
  startTime: string; // ISO Date
  endTime: string; // ISO Date
  logs?: AttendanceLog[];
}

export interface AttendanceLog {
  id: string;
  sessionId: string;
  session?: AttendanceSession;
  studentId: string;
  student?: StudentProfile;
  status: AttendanceStatus;
  notes?: string | null;
}

export interface Payment {
  id: string;
  studentId: string;
  student?: StudentProfile;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider: PaymentProvider;
  reference: string;
  receiptURL?: string | null;
  createdAt: string; // ISO Date
}

export interface Certificate {
  id: string;
  studentId: string;
  student?: StudentProfile;
  issuedAt: string; // ISO Date
  serialNumber: string;
  fileURL: string;
  status: CertificateStatus;
}

export interface ContentAsset {
  id: string;
  title: string;
  type: ContentType;
  url: string;
  cohortId?: string | null;
  cohort?: Cohort;
  publishedAt?: string | null; // ISO Date
}

export interface NotificationPref {
  id: string;
  userId: string;
  emailNews: boolean;
  emailAssignments: boolean;
  emailGrades: boolean;
}

export interface HelpTicket {
  id: string;
  userId?: string | null;
  user?: User;
  subject: string;
  message: string;
  status: HelpTicketStatus;
  createdAt: string; // ISO Date
}

export interface AuditLog {
  id: string;
  actorUserId?: string | null;
  actor?: User;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string; // ISO Date
}
