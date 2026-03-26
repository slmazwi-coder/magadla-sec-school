import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { Chatbot } from './components/Chatbot';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Documents } from './pages/Documents';
import { Achievements } from './pages/Achievements';
import { ExtraCurricular } from './pages/ExtraCurricular';
import { Sports } from './pages/Sports';
import { Admissions } from './pages/Admissions';
import { Contact } from './pages/Contact';

// Admin imports
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/Dashboard';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { NewsEditor } from './admin/editors/NewsEditor';
import { AboutEditor } from './admin/editors/AboutEditor';
import { AchievementsEditor } from './admin/editors/AchievementsEditor';
import { DocumentsEditor } from './admin/editors/DocumentsEditor';
import { ExtraCurricularEditor } from './admin/editors/ExtraCurricularEditor';
import { ApplicationsEditor } from './admin/editors/ApplicationsEditor';
import { ContactEditor } from './admin/editors/ContactEditor';

const HomePage = () => (
	<>
		<Hero />
		<NewsSection />
		<Home />
	</>
);

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<>
		<Navbar />
		<main className="flex-grow">{children}</main>
		<Footer />
		<Chatbot />
	</>
);

export default function App() {
	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<PageShell><HomePage /></PageShell>} />
				<Route path="/about" element={<PageShell><About /></PageShell>} />
				<Route path="/documents" element={<PageShell><Documents /></PageShell>} />
				<Route path="/achievements" element={<PageShell><Achievements /></PageShell>} />
				<Route path="/extra-curricular" element={<PageShell><ExtraCurricular /></PageShell>} />
				<Route path="/sports" element={<PageShell><Sports /></PageShell>} />
				<Route path="/admissions" element={<PageShell><Admissions /></PageShell>} />
				<Route path="/contact" element={<PageShell><Contact /></PageShell>} />

				{/* Admin routes */}
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
					<Route index element={<AdminDashboard />} />
					<Route path="news" element={<NewsEditor />} />
					<Route path="about" element={<AboutEditor />} />
					<Route path="achievements" element={<AchievementsEditor />} />
					<Route path="documents" element={<DocumentsEditor />} />
					<Route path="extra-curricular" element={<ExtraCurricularEditor />} />
					<Route path="applications" element={<ApplicationsEditor />} />
					<Route path="contact" element={<ContactEditor />} />
				</Route>
			</Routes>
		</Router>
	);
}
