import React from 'react';
import { User } from 'lucide-react';

interface StaffMember {
  name: string;
  position: string;
  subject?: string;
  category: string;
  image?: string;
}

const staffData: StaffMember[] = [
  // ── Leadership ──────────────────────────────────────────────────────────
  {
    name: 'Mr Banda',
    position: 'Principal',
    category: 'Leadership',
    image: '/PrinciPal%20Mr%20SS%20Magadla.jpg',
  },
  {
    name: 'Deputy Principal',
    position: 'Deputy Principal',
    category: 'Leadership',
  },

  // ── Departmental Heads ───────────────────────────────────────────────────
  {
    name: 'HOD — Humanities',
    position: 'Head of Department',
    subject: 'Humanities',
    category: 'Departmental Heads',
  },
  {
    name: 'HOD — Mathematics & Science',
    position: 'Head of Department',
    subject: 'Mathematics & Science',
    category: 'Departmental Heads',
  },
  {
    name: 'HOD — Languages',
    position: 'Head of Department',
    subject: 'Languages',
    category: 'Departmental Heads',
  },

  // ── Class Teachers ───────────────────────────────────────────────────────
  { name: 'Class Teacher', position: 'Class Teacher — Grade 8A',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 8B',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 8C',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 9A',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 9B',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 9C',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 10A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 10B', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 10C', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 11A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 11B', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 11C', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 12A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 12B', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 12C', category: 'Class Teachers' },

  // ── Support Staff ────────────────────────────────────────────────────────
  { name: 'School Administrator', position: 'School Administrator', category: 'Support Staff' },
  { name: 'Security Officer',     position: 'Security Officer',     category: 'Support Staff' },
  { name: 'Learner Support Agent',position: 'Learner Support Agent',category: 'Support Staff' },
];

const categories = [
  'Leadership',
  'Departmental Heads',
  'Class Teachers',
  'Support Staff',
];

const StaffCard = ({ member }: { member: StaffMember }) => (
  <div
    className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center p-6 text-center hover:-translate-y-1"
    style={ { background: '#FFFBEF', border: '1px solid #C8A400' } }
  >
    {/* Avatar */}
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden"
      style={ { background: '#FDF9EC', border: '3px solid #C8A400' } }
    >
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <User size={40} style={ { color: '#C8A400', opacity: 0.5 } } />
      )}
    </div>

    <h3 className="text-sm font-bold leading-tight" style={ { color: '#166534' } }>
      {member.name}
    </h3>
    <p className="text-xs font-semibold mt-1" style={ { color: '#C8A400' } }>
      {member.position}
    </p>
    {member.subject && (
      <span
        className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full"
        style={ { background: '#FDF9EC', color: '#166534', border: '1px solid #C8A400' } }
      >
        {member.subject}
      </span>
    )}
  </div>
);

export const Staff = () => {
  const [activeCategory, setActiveCategory] = React.useState('Leadership');
  const filtered = staffData.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen py-12 px-4" style={ { background: '#FDF9EC' } }>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={ { color: '#166534' } }>
            Our Staff
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full mb-4" style={ { background: '#C8A400' } } />
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Meet the dedicated team of educators and support staff at Magadla Senior Secondary School, led by Principal Mr Banda.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={
                activeCategory === cat
                  ? { background: '#C8A400', color: '#166534', border: '2px solid #C8A400', fontWeight: 700 }
                  : { background: '#FFFBEF', color: '#166534', border: '2px solid #C8A400' }
              }
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md"
            >
              {cat}
              <span className="ml-2 text-xs font-bold opacity-60">
                ({staffData.filter(m => m.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((member, index) => (
            <StaffCard key={index} member={member} />
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-gray-400 text-xs mt-10 italic">
          Staff names and photos will be updated progressively.
        </p>
      </div>
    </div>
  );
};
