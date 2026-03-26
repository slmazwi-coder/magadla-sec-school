import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
	{
		url: "/images/Hero%201.jpg",
		caption: "Deeds Not Words",
	},
	{
		url: "/images/Hero%202.jpg",
		caption: "Strive for Excellence",
	},
	{
		url: "/images/Hero%203.jpg",
		caption: "Learning & Growth",
	},
	{
		url: "/images/Hero%205.jpg",
		caption: "School Spirit",
	},
];

export const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % slides.length);
		}, 6000);
		return () => clearInterval(timer);
	}, []);

	const next = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
	const prev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

	return (
		<div className="relative h-[650px] w-full overflow-hidden bg-school-green">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8 }}
					className="absolute inset-0"
				>
					{/*
						Use a center-contained layout so the school images never crop.
						We keep a subtle dark overlay for readable text.
					*/}
					<div className="absolute inset-0 flex items-center justify-center">
						<img
							src={slides[currentIndex].url}
							alt={slides[currentIndex].caption}
							className="h-full w-full object-contain object-center"
						/>
					</div>
					<div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

					<div className="absolute bottom-20 left-0 right-0 text-center z-20">
						<motion.p
							initial={{ y: 12, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							key={`caption-${currentIndex}`}
							className="text-white/85 text-lg md:text-xl font-medium tracking-wide uppercase"
						>
							{slides[currentIndex].caption}
						</motion.p>
					</div>
				</motion.div>
			</AnimatePresence>

			<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
				<motion.h1
					initial={{ y: 14, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="text-4xl md:text-6xl font-bold mb-4 uppercase drop-shadow"
				>
					Magadla Senior Secondary School
				</motion.h1>
				<motion.p
					initial={{ y: 14, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.05 }}
					className="text-xl md:text-2xl font-light italic drop-shadow"
				>
					"Deeds Not Words"
				</motion.p>
				<motion.div
					initial={{ y: 14, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.1 }}
					className="mt-8 flex gap-4"
				>
					<a className="btn-primary bg-white text-school-green hover:bg-gray-100" href="/admissions">
						Admissions
					</a>
					<a className="btn-primary border-2 border-white bg-transparent hover:bg-white/10" href="/about">
						Learn More
					</a>
				</motion.div>
			</div>

			<button
				onClick={prev}
				className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
				aria-label="Previous slide"
			>
				<ChevronLeft size={32} />
			</button>
			<button
				onClick={next}
				className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
				aria-label="Next slide"
			>
				<ChevronRight size={32} />
			</button>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
				{slides.map((_, i) => (
					<div
						key={i}
						className={`h-2 w-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
					/>
				))}
			</div>
		</div>
	);
};
