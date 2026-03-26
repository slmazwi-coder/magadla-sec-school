// Storage utility — localStorage wrapper (swap with Supabase later)

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  grade: string;
  subject: string;
  fileData: string; // base64 for demo
  fileName: string;
  uploadDate: string;
}

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  dob: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  previousSchool: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  monThu: string;
  friday: string;
  weekend: string;
}

export interface AboutInfo {
  historyParagraphs: string[];
  principalName: string;
  principalTitle: string;
  principalMessage: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'Sport' | 'Academic' | 'Culture';
  image: string;
}

export interface AchieverEntry {
  id: string;
  name: string;
  achievement: string;
  image: string;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  title: string;
  year: string;
  desc: string;
  image: string;
}

export interface YearResults {
  overall: number;
  bachelor: number;
  bachelorRate: number;
  distinctions: number;
  wrote: number;
  subjects: { subject: string; rate: number }[];
}

// Generic CRUD helpers
function getItems<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function getObject<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setObject<T>(key: string, obj: T): void {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// News
const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: "2026 Admissions Open",
    date: "March 15, 2026",
    content: "Applications for the 2026 academic year are now officially open. Please visit the Admissions portal.",
    image: ""
  },
  {
    id: '2',
    title: "Term 1 Reports",
    date: "March 20, 2026",
    content: "Term 1 progress reports will be issued this Friday. Parents are encouraged to attend the briefing.",
    image: ""
  },
  {
    id: '3',
    title: "School Activities",
    date: "March 10, 2026",
    content: "We encourage all learners to participate in cultural, academic, and sports activities throughout the year.",
    image: ""
  }
];
export const getNews = () => getItems<NewsItem>('admin_news').length ? getItems<NewsItem>('admin_news') : defaultNews;
export const setNews = (items: NewsItem[]) => setItems('admin_news', items);

// Documents
export const getDocuments = () => getItems<DocumentItem>('admin_documents');
export const setDocuments = (items: DocumentItem[]) => setItems('admin_documents', items);

// Applications
export const getApplications = () => getItems<Application>('admin_applications');
export const setApplications = (items: Application[]) => setItems('admin_applications', items);

// Contact
const defaultContact: ContactInfo = {
  address: 'Lunda A/A, Matatiele, 4730',
  phone: '079 632 9717 / 083 758 8856',
  email: 'office@[school-domain].edu.za',
  monThu: '07:30 - 15:30',
  friday: '07:30 - 13:30',
  weekend: 'Closed',
};
export const getContact = () => getObject<ContactInfo>('admin_contact', defaultContact);
export const setContact = (info: ContactInfo) => setObject('admin_contact', info);

// About
const defaultAbout: AboutInfo = {
  historyParagraphs: [
    'Magadla Senior Secondary School is a public secondary school based in Matatiele, Eastern Cape. The school serves the local community with a focus on discipline, growth, and learner success.',
    'Our guiding motto is "Deeds Not Words". We believe that consistent effort, strong values, and respect for learning shape the future of every learner.',
    'We continue striving to build a supportive environment where learners can develop academically, socially, and culturally.',
  ],
  principalName: 'Mr S S Mafunda',
  principalTitle: 'School Principal',
  principalMessage: [
    'Welcome to Magadla Senior Secondary School. We are committed to creating a safe and focused learning environment that helps every learner do their best.',
    'As a school, we value character, respect, and hard work. Together with parents and the community, we strive for excellence.',
  ],
};
export const getAbout = () => getObject<AboutInfo>('admin_about', defaultAbout);
export const setAbout = (info: AboutInfo) => setObject('admin_about', info);

// Activities
const defaultActivities: Activity[] = [
  { id: '1', name: 'Soccer', category: 'Sport', description: 'Teamwork, fitness, and discipline through sport.', image: '' },
  { id: '2', name: 'Netball', category: 'Sport', description: 'Building confidence and competitive spirit.', image: '' },
  { id: '3', name: 'Athletics', category: 'Sport', description: 'Track and field development across all events.', image: '' },
  { id: '4', name: 'Spelling Bee', category: 'Academic', description: 'Sharpening language skills and vocabulary through competition.', image: '' },
  { id: '5', name: 'Maths Olympiad', category: 'Academic', description: 'Building strong problem-solving skills and mathematical confidence.', image: '' },
  { id: '6', name: 'Debating & Public Speaking', category: 'Academic', description: 'Developing confident speakers and critical thinkers.', image: '' },
  { id: '7', name: 'Choral Music', category: 'Culture', description: 'Celebrating culture and excellence through music.', image: '' },
];
export const getActivities = () => getItems<Activity>('admin_activities').length ? getItems<Activity>('admin_activities') : defaultActivities;
export const setActivities = (items: Activity[]) => setItems('admin_activities', items);

// Achievers by year
export const getAchieversByYear = (year: string) => getItems<AchieverEntry>(`admin_achievers_${year}`);
export const setAchieversByYear = (year: string, items: AchieverEntry[]) => setItems(`admin_achievers_${year}`, items);

// Hall of Fame
const defaultHall: HallOfFameEntry[] = [
  { id: '1', name: 'Top Learner', title: 'Academic Excellence', year: '2025', desc: '', image: 'https://images.unsplash.com/photo-1523240695661-92135f3d325e?q=80&w=2000&auto=format&fit=crop' },
  { id: '2', name: 'Top Achiever', title: 'Leadership & Service', year: '2025', desc: '', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2000&auto=format&fit=crop' },
];
export const getHallOfFame = () => getItems<HallOfFameEntry>('admin_hall_of_fame').length ? getItems<HallOfFameEntry>('admin_hall_of_fame') : defaultHall;
export const setHallOfFame = (items: HallOfFameEntry[]) => setItems('admin_hall_of_fame', items);

// Results by year
const defaultResults: Record<string, YearResults> = {
  "2025": { overall: 0, bachelor: 0, bachelorRate: 0, distinctions: 0, wrote: 0, subjects: [] },
};
export const getResultsByYear = (year: string) => getObject<YearResults | null>(`admin_results_${year}`, defaultResults[year] || null);
export const setResultsByYear = (year: string, data: YearResults) => setObject(`admin_results_${year}`, data);

// Auth
export const isAuthenticated = () => localStorage.getItem('admin_auth') === 'true';
export const login = (password: string): boolean => {
  if (password === 'magadla2026') {
    localStorage.setItem('admin_auth', 'true');
    return true;
  }
  return false;
};
export const logout = () => localStorage.removeItem('admin_auth');
