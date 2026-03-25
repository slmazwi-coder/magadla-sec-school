import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = {
	id: string;
	sender: 'bot' | 'user';
	text: string;
	time: string;
};

function nowTime() {
	return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function replyTo(text: string) {
	const t = text.toLowerCase();

	if (t.includes('admission') || t.includes('apply') || t.includes('application')) {
		return 'Admissions are available on the Admissions page. You can also visit the school office for help with documents.';
	}

	if (t.includes('contact') || t.includes('phone') || t.includes('call') || t.includes('number')) {
		return 'You can contact the school on 079 632 9717 or 083 758 8856.';
	}

	if (t.includes('address') || t.includes('location') || t.includes('where') || t.includes('map')) {
		return 'Magadla Senior Secondary School is in Lunda A/A, Matatiele, 4730. Please see the Contact page for the map.';
	}

	if (t.includes('principal')) {
		return 'The school principal is Mr S S Mafunda.';
	}

	return 'Thanks for your message. For detailed help, please use the Contact page or send a message on the school Facebook page.';
}

export const Chatbot = () => {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>(() => [
		{
			id: 'welcome',
			sender: 'bot',
			text: 'Hello! I can help with admissions, contact details, and directions. What do you need?',
			time: nowTime(),
		},
	]);

	const listRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!open) return;
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
	}, [open, messages.length]);

	const canSend = useMemo(() => input.trim().length > 0, [input]);

	function send() {
		if (!canSend) return;
		const userText = input.trim();
		setInput('');

		const userMsg: ChatMessage = {
			id: `u-${Date.now()}`,
			sender: 'user',
			text: userText,
			time: nowTime(),
		};

		const botMsg: ChatMessage = {
			id: `b-${Date.now() + 1}`,
			sender: 'bot',
			text: replyTo(userText),
			time: nowTime(),
		};

		setMessages((prev) => [...prev, userMsg, botMsg]);
	}

	return (
		<div className="fixed bottom-6 right-6 z-[60]">
			{open && (
				<div className="w-[340px] max-w-[90vw] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white">
					<div className="bg-school-green text-white px-4 py-3 flex items-center justify-between">
						<div>
							<p className="font-bold leading-tight">Magadla SSS Chat</p>
							<p className="text-xs text-white/80">Deeds Not Words</p>
						</div>
						<button
							className="p-2 rounded-lg hover:bg-white/10"
							onClick={() => setOpen(false)}
							aria-label="Close chatbot"
						>
							<X size={18} />
						</button>
					</div>

					<div ref={listRef} className="h-[320px] overflow-y-auto p-4 space-y-3 bg-gray-50">
						{messages.map((m) => (
							<div
								key={m.id}
								className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
									m.sender === 'user'
										? 'ml-auto bg-school-green text-white'
										: 'bg-white text-gray-800 border border-gray-200'
								}`}
							>
								<p className="whitespace-pre-wrap">{m.text}</p>
								<p className={`mt-1 text-[10px] ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
									{m.time}
								</p>
							</div>
						))}
					</div>

					<div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') send();
							}}
							placeholder="Type a message..."
							className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-school-green/20"
						/>
						<button
							onClick={send}
							disabled={!canSend}
							className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
						>
							<Send size={16} />
						</button>
					</div>
				</div>
			)}

			{!open && (
				<button
					onClick={() => setOpen(true)}
					className="btn-primary rounded-full h-14 w-14 flex items-center justify-center shadow-xl"
					aria-label="Open chatbot"
				>
					<MessageCircle size={22} />
				</button>
			)}
		</div>
	);
};
