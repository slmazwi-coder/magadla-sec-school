import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Music, Star, BookOpen, Mic } from 'lucide-react';
import { getActivities, type Activity } from '../admin/utils/storage';

const ProgramCard: React.FC<{ prog: Activity }> = ({ prog }) => (
	<motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
		<div className="aspect-video bg-school-green/10 flex items-center justify-center relative">
			{prog.image ? (
				<img src={prog.image} alt={prog.name} className="h-full w-full object-cover" />
			) : (
				<Music size={64} className="text-school-green/40" />
			)}
			<div className="absolute inset-0 bg-school-green/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
				<Star size={48} className="text-white" />
			</div>
		</div>
		<div className="p-6">
			<div className="flex items-center gap-2 mb-2">
				<span
					className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
						prog.category === 'Academic' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
					}`}
				>
					{prog.category}
				</span>
			</div>
			<h3 className="text-xl font-bold text-gray-900 mb-2">{prog.name}</h3>
			<p className="text-gray-600 text-sm leading-relaxed">{prog.description}</p>
		</div>
	</motion.div>
);

export const ExtraCurricular = () => {
	const [activities, setActivities] = useState<Activity[]>(getActivities());

	useEffect(() => {
		setActivities(getActivities());
	}, []);

	const academicPrograms = activities.filter((a) => a.category === 'Academic');
	const culturePrograms = activities.filter((a) => a.category === 'Culture');

	const accolades = [
		{ title: 'Choir performances and competitions', year: 'Ongoing', category: 'Culture' },
		{ title: 'Spelling Bee participation', year: 'Ongoing', category: 'Academic' },
		{ title: 'Maths Olympiad participation', year: 'Ongoing', category: 'Academic' },
	];

	return (
		<div className="py-16 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="section-title text-center">Extra-Curricular</h1>

				<p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
					Beyond the classroom, Magadla Senior Secondary School supports learners through academic competitions and cultural
					programs.
				</p>

				{/* Academic competitions */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-school-green mb-8 flex items-center gap-3">
						<BookOpen className="text-school-green" /> Academic Competitions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{academicPrograms.map((prog) => (
							<ProgramCard key={prog.id} prog={prog} />
						))}
					</div>
				</section>

				{/* Arts & Culture */}
				<section className="mb-24">
					<h2 className="text-2xl font-bold text-school-green mb-8 flex items-center gap-3">
						<Music className="text-school-green" /> Arts & Culture
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{culturePrograms.map((prog) => (
							<ProgramCard key={prog.id} prog={prog} />
						))}
					</div>
				</section>

				{/* Highlights */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					<section>
						<h2 className="text-3xl font-bold text-school-green mb-8 flex items-center gap-3">
							<Trophy className="text-yellow-600" /> Highlights
						</h2>
						<div className="space-y-4">
							{accolades.map((acc, i) => (
								<motion.div
									key={i}
									whileHover={{ scale: 1.01 }}
									className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
								>
									<div>
										<h4 className="font-bold text-lg">{acc.title}</h4>
										<p className="text-gray-500 text-sm">{acc.category} • {acc.year}</p>
									</div>
									<div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
										<Trophy size={20} />
									</div>
								</motion.div>
							))}
						</div>
					</section>

					<section>
						<h2 className="text-3xl font-bold text-school-green mb-8 flex items-center gap-3">
							<Mic className="text-school-green" /> Participation
						</h2>
						<div className="bg-school-green rounded-3xl p-8 text-white">
							<p className="text-lg italic mb-8 text-white/80">
								"Deeds Not Words" means we show our growth through consistent participation and effort.
							</p>
							<ul className="space-y-3 text-white/90">
								<li>Spelling Bee</li>
								<li>Maths Olympiad</li>
								<li>Debating and public speaking</li>
								<li>Choir and cultural performances</li>
							</ul>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
