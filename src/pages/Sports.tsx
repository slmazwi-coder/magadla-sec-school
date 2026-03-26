import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Target, Dumbbell } from 'lucide-react';
import { getActivities, type Activity } from '../admin/utils/storage';

const iconFor = (name: string) => {
	const n = name.toLowerCase();
	if (n.includes('soccer')) return Target;
	if (n.includes('netball')) return Users;
	if (n.includes('athletics')) return Trophy;
	return Dumbbell;
};

export const Sports = () => {
	const [items, setItems] = useState<Activity[]>(getActivities());

	useEffect(() => {
		setItems(getActivities());
	}, []);

	const sports = items.filter((a) => a.category === 'Sport');

	return (
		<div className="py-16 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="section-title text-center">Sports</h1>
				<p className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
					At Magadla Senior Secondary School, sport builds teamwork, discipline, and confidence.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sports.map((s) => {
						const Icon = iconFor(s.name);
						return (
							<motion.div
								key={s.id}
								whileHover={{ scale: 1.02 }}
								className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
							>
								<div className="aspect-video bg-school-green/10 flex items-center justify-center">
									<Icon size={64} className="text-school-green/40" />
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-2">{s.name}</h3>
									<p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
