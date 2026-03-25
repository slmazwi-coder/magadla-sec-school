import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './utils/storage';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (login(password)) {
			navigate('/admin');
		} else {
			setError('Invalid password. Please try again.');
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
			<div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={() => navigate('/')}
						className="text-gray-300 hover:text-white flex items-center gap-2 text-sm"
						type="button"
					>
						<ArrowLeft size={16} /> Back
					</button>
					<span className="text-xs text-gray-500">Authorized personnel only</span>
				</div>

				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-school-green rounded-full flex items-center justify-center mx-auto mb-4">
						<Lock className="text-white" size={28} />
					</div>
					<h1 className="text-2xl font-bold text-white">Staff Portal</h1>
					<p className="text-gray-400 text-sm mt-1">Magadla Senior Secondary School Administration</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setError('');
								}}
								className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-school-green focus:border-transparent"
								placeholder="Enter admin password"
								autoFocus
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					{error && <p className="text-red-400 text-sm text-center">{error}</p>}

					<button type="submit" className="w-full bg-school-green text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};
