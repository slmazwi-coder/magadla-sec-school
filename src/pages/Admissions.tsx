import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  CheckCircle,
  X,
  FileText,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import {
  generateId,
  generateStudentNumber,
  getApplications,
  setApplications,
  type Application,
  type UploadedFile,
} from '../admin/utils/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadField = { key: string; label: string; required?: boolean };

const uploadFields: UploadField[] = [
  { key: 'learnerId',     label: 'Copy of Birth Certificate / ID',                    required: true },
  { key: 'reportCard',    label: 'Progress Report from Previous School',              required: true },
  { key: 'guardianId',    label: 'Parent/Guardian ID Copy',                           required: true },
  { key: 'residence',     label: 'Proof of Residence',                                required: true },
  { key: 'transfer',      label: 'Transfer Letter from Previous School (if applicable)' },
  { key: 'immunisation',  label: 'Copy of Immunisation Records (if available)' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── Small reusable UI pieces ─────────────────────────────────────────────────

const Field = ({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inp =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C8A400]/40 focus:border-[#166534] transition w-full bg-white';

const sel = inp + ' cursor-pointer';

const SectionHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-4">
    <span className="text-[#166534]">{icon}</span>
    <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">{title}</h3>
  </div>
);

const StepBadge = ({
  num, label, active, done,
}: { num: number; label: string; active: boolean; done: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
        ${done   ? 'bg-[#C8A400] border-[#166534] text-white'
        : active ? 'bg-white border-white text-[#166534]'
        :          'bg-white/20 border-white/30 text-white/60'}`}
    >
      {done ? <CheckCircle size={14} /> : num}
    </div>
    <span
      className={`text-xs font-bold uppercase tracking-widest transition-all
        ${active ? 'text-white' : done ? 'text-green-200' : 'text-white/50'}`}
    >
      {label}
    </span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const Admissions = () => {
  const [step,       setStep]       = useState<1 | 2 | 3>(1);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [disclaimer, setDisclaimer] = useState(false);
  const [files,      setFiles]      = useState<Record<string, File | null>>({});

  // ── Step 1 state ─────────────────────────────────────────────────────────

  const [learner, setL] = useState({
    surname: '', firstName: '', initials: '', otherNames: '',
    dob: '', gender: '', identificationNumber: '', citizenship: '', race: '',
    grade: '', year: '2027',
    highestGradePassed: '', yearWhenGradeWasPassed: '', accessionNo: '',
    countryOfResidence: '', province: '', physicalAddress: '', citySuburb: '', postalCode: '',
    homeLanguage: '', preferredLanguageOfInstruction: '',
    homeTelephone: '', emergencyTelephone: '', learnerCell: '', learnerEmail: '',
    isBoarder: '', modeOfTransport: '', deceasedParent: 'None', religion: '',
  });

  const [prevSchool, setPrevSchool] = useState({
    name: '', address: '', code: '', province: '', country: '',
  });

  const [medical, setMedical] = useState({
    medicalAidNumber: '', medicalAidName: '', medicalAidMainMember: '',
    doctorName: '', doctorTelephoneNumber: '', doctorAddress: '',
    medicalCondition: '', specialProblemsRequiringCounselling: '',
    dexterity: '', socialGrantReg: '', socialGrantRec: '',
  });

  // ── Step 2 state ─────────────────────────────────────────────────────────

  const [siblings, setSiblings] = useState({
    numberOfOtherChildrenAtSchool: '', positionInFamily: '',
    sibling1Name: '', sibling1Grade: '',
    sibling2Name: '', sibling2Grade: '',
    sibling3Name: '', sibling3Grade: '',
  });

  // ── Step 3 state ─────────────────────────────────────────────────────────

  const [hasSecondParent, setHasSecondParent] = useState(false);

  const emptyParent = (accountPayer: string) => ({
    title: '', initials: '', firstName: '', surname: '', gender: '', race: '',
    homeLanguage: '', identificationNumber: '', accountPayer,
    residentialStreetAddress: '', citySuburb: '', code: '',
    employer: '', occupation: '',
    surnameOfSpouse: '', occupationOfSpouse: '', spouseIdNumber: '',
    learnerResidesWithThisParent: '', relationshipToLearner: '', maritalStatusOfParent: '',
  });

  const [parent1, setParent1] = useState(emptyParent('Yes'));
  const [parent2, setParent2] = useState(emptyParent('No'));

  const [correspondence, setCorrespondence] = useState({
    title: '', surname: '', postalAddress: '', citySuburb: '', code: '',
  });

  const [otherContact, setOtherContact] = useState({
    homeTelephone: '', faxNumber: '', workTelephone: '', cellNumber: '',
    spouseWorkTelephoneNumber: '', spouseCellNumber: '',
    emailAddress: '', spouseEmailAddress: '',
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  const missingRequiredUploads = useMemo(
    () => uploadFields.filter((f) => f.required && !files[f.key]),
    [files],
  );

  const patchL  = (k: string, v: string) => setL(p => ({ ...p, [k]: v }));
  const patchPS = (k: string, v: string) => setPrevSchool(p => ({ ...p, [k]: v }));
  const patchM  = (k: string, v: string) => setMedical(p => ({ ...p, [k]: v }));
  const patchSib= (k: string, v: string) => setSiblings(p => ({ ...p, [k]: v }));
  const patchP1 = (k: string, v: string) => setParent1(p => ({ ...p, [k]: v }));
  const patchP2 = (k: string, v: string) => setParent2(p => ({ ...p, [k]: v }));
  const patchCC = (k: string, v: string) => setCorrespondence(p => ({ ...p, [k]: v }));
  const patchOC = (k: string, v: string) => setOtherContact(p => ({ ...p, [k]: v }));

  const validateStep = () => {
    if (step === 1) {
      if (!learner.firstName || !learner.surname || !learner.dob || !learner.gender) {
        setError('Please complete learner name, surname, date of birth and gender.');
        return false;
      }
      if (!learner.grade) { setError('Please select the grade applied for.'); return false; }
    }
    if (step === 3) {
      if (!parent1.firstName || !parent1.surname) {
        setError('Please complete Parent/Guardian 1 first name and surname.');
        return false;
      }
      if (missingRequiredUploads.length > 0) {
        setError(`Please upload all required documents (${missingRequiredUploads.map(f => f.label).join(', ')}).`);
        return false;
      }
      if (!disclaimer) {
        setError('Please read and accept the declaration before submitting.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const goNext = () => { if (validateStep()) setStep(s => (s < 3 ? (s + 1) as 1|2|3 : s)); };
  const goBack = () => { setStep(s => (s > 1 ? (s - 1) as 1|2|3 : s)); setError(''); };

  const handleFileChange = async (key: string, file: File | null) => {
    setFiles(p => ({ ...p, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setError('');

    try {
      const uploads: UploadedFile[] = await Promise.all(
        Object.entries(files)
          .filter(([, f]) => f)
          .map(async ([key, file]) => ({
            key,
            name: file!.name,
            dataUrl: await fileToDataUrl(file!),
          })),
      );

      const application: Application = {
        id: generateId(),
        studentNumber: generateStudentNumber(),
        submittedAt: todayISO(),
        learner,
        prevSchool,
        medical,
        siblings,
        parent1,
        parent2,
        correspondence,
        otherContact,
        uploads,
        status: 'pending',
      };

      const existing = getApplications();
      setApplications([...existing, application]);

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#FDF9EC' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#166534' }}>
            Admissions
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full mb-4" style={{ background: '#C8A400' }} />
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Complete all three steps to submit your application to Magadla Senior Secondary School.
          </p>
        </div>

        {/* Step progress bar */}
        <div className="flex items-center justify-center gap-6 mb-10" style={{ background: '#166534', borderRadius: '1rem', padding: '1rem 2rem' }}>
          <StepBadge num={1} label="Learner Info"     active={step === 1} done={step > 1} />
          <div className="w-12 h-0.5 rounded-full" style={{ background: step > 1 ? '#C8A400' : '#ffffff30' }} />
          <StepBadge num={2} label="Family & Medical" active={step === 2} done={step > 2} />
          <div className="w-12 h-0.5 rounded-full" style={{ background: step > 2 ? '#C8A400' : '#ffffff30' }} />
          <StepBadge num={3} label="Documents"        active={step === 3} done={false} />
        </div>

        <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl overflow-hidden shadow-lg"
                style={{ background: '#FFFBEF', border: '1px solid #C8A400' }}
              >

                {/* ── Step 1: Learner Information ── */}
                {step === 1 && (
                  <div className="p-8 space-y-8">
                    <SectionHeading icon={<FileText size={16} />} title="Learner Information" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Field label="Surname *"><input className={inp} value={learner.surname} onChange={e => patchL('surname', e.target.value)} /></Field>
                      <Field label="First Name *"><input className={inp} value={learner.firstName} onChange={e => patchL('firstName', e.target.value)} /></Field>
                      <Field label="Initials"><input className={inp} value={learner.initials} onChange={e => patchL('initials', e.target.value)} /></Field>
                      <Field label="Date of Birth *"><input className={inp} type="date" value={learner.dob} onChange={e => patchL('dob', e.target.value)} /></Field>
                      <Field label="Gender *">
                        <select className={sel} value={learner.gender} onChange={e => patchL('gender', e.target.value)}>
                          <option value="">Select</option><option>Male</option><option>Female</option>
                        </select>
                      </Field>
                      <Field label="ID / Passport Number"><input className={inp} value={learner.identificationNumber} onChange={e => patchL('identificationNumber', e.target.value)} /></Field>
                      <Field label="Citizenship"><input className={inp} value={learner.citizenship} onChange={e => patchL('citizenship', e.target.value)} /></Field>
                      <Field label="Grade Applying For *">
                        <select className={sel} value={learner.grade} onChange={e => patchL('grade', e.target.value)}>
                          <option value="">Select</option>{['8','9','10','11','12'].map(g => <option key={g}>Grade {g}</option>)}
                        </select>
                      </Field>
                      <Field label="Home Language"><input className={inp} value={learner.homeLanguage} onChange={e => patchL('homeLanguage', e.target.value)} /></Field>
                      <Field label="Physical Address"><input className={inp} value={learner.physicalAddress} onChange={e => patchL('physicalAddress', e.target.value)} /></Field>
                      <Field label="City / Suburb"><input className={inp} value={learner.citySuburb} onChange={e => patchL('citySuburb', e.target.value)} /></Field>
                      <Field label="Postal Code"><input className={inp} maxLength={6} value={learner.postalCode} onChange={e => patchL('postalCode', e.target.value)} /></Field>
                      <Field label="Home Telephone"><input className={inp} type="tel" value={learner.homeTelephone} onChange={e => patchL('homeTelephone', e.target.value)} /></Field>
                      <Field label="Learner Cell"><input className={inp} type="tel" value={learner.learnerCell} onChange={e => patchL('learnerCell', e.target.value)} /></Field>
                      <Field label="Learner Email"><input className={inp} type="email" value={learner.learnerEmail} onChange={e => patchL('learnerEmail', e.target.value)} /></Field>
                      <Field label="Religion"><input className={inp} value={learner.religion} onChange={e => patchL('religion', e.target.value)} /></Field>
                    </div>

                    <SectionHeading icon={<FileText size={16} />} title="Previous School" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Field label="School Name"><input className={inp} value={prevSchool.name} onChange={e => patchPS('name', e.target.value)} /></Field>
                      <Field label="Address"><input className={inp} value={prevSchool.address} onChange={e => patchPS('address', e.target.value)} /></Field>
                      <Field label="School Code"><input className={inp} value={prevSchool.code} onChange={e => patchPS('code', e.target.value)} /></Field>
                      <Field label="Province"><input className={inp} value={prevSchool.province} onChange={e => patchPS('province', e.target.value)} /></Field>
                      <Field label="Country"><input className={inp} value={prevSchool.country} onChange={e => patchPS('country', e.target.value)} /></Field>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Medical & Family ── */}
                {step === 2 && (
                  <div className="p-8 space-y-8">
                    <SectionHeading icon={<FileText size={16} />} title="Medical Information" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Field label="Medical Aid Number"><input className={inp} value={medical.medicalAidNumber} onChange={e => patchM('medicalAidNumber', e.target.value)} /></Field>
                      <Field label="Medical Aid Name"><input className={inp} value={medical.medicalAidName} onChange={e => patchM('medicalAidName', e.target.value)} /></Field>
                      <Field label="Medical Aid Main Member"><input className={inp} value={medical.medicalAidMainMember} onChange={e => patchM('medicalAidMainMember', e.target.value)} /></Field>
                      <Field label="Doctor Name"><input className={inp} value={medical.doctorName} onChange={e => patchM('doctorName', e.target.value)} /></Field>
                      <Field label="Doctor Telephone"><input className={inp} type="tel" value={medical.doctorTelephoneNumber} onChange={e => patchM('doctorTelephoneNumber', e.target.value)} /></Field>
                      <Field label="Medical Condition"><input className={inp} value={medical.medicalCondition} onChange={e => patchM('medicalCondition', e.target.value)} /></Field>
                    </div>

                    <SectionHeading icon={<FileText size={16} />} title="Siblings at School" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Field label="No. of Other Children at School"><input className={inp} value={siblings.numberOfOtherChildrenAtSchool} onChange={e => patchSib('numberOfOtherChildrenAtSchool', e.target.value)} /></Field>
                      <Field label="Position in Family"><input className={inp} value={siblings.positionInFamily} onChange={e => patchSib('positionInFamily', e.target.value)} /></Field>
                      <Field label="Sibling 1 Name"><input className={inp} value={siblings.sibling1Name} onChange={e => patchSib('sibling1Name', e.target.value)} /></Field>
                      <Field label="Sibling 1 Grade"><input className={inp} value={siblings.sibling1Grade} onChange={e => patchSib('sibling1Grade', e.target.value)} /></Field>
                      <Field label="Sibling 2 Name"><input className={inp} value={siblings.sibling2Name} onChange={e => patchSib('sibling2Name', e.target.value)} /></Field>
                      <Field label="Sibling 2 Grade"><input className={inp} value={siblings.sibling2Grade} onChange={e => patchSib('sibling2Grade', e.target.value)} /></Field>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Parents & Documents ── */}
                {step === 3 && (
                  <>
                    <div className="p-8 space-y-8">
                      <SectionHeading icon={<FileText size={16} />} title="Parent / Guardian 1" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          ['title','Title'],['initials','Initials'],['firstName','First Name *'],['surname','Surname *'],
                          ['identificationNumber','ID / Passport Number'],['residentialStreetAddress','Residential Street Address'],
                          ['citySuburb','City / Suburb'],['code','Code'],['occupation','Occupation'],
                        ].map(([k,l]) => (
                          <Field key={k} label={l}>
                            <input className={inp} value={parent1[k as keyof typeof parent1]} onChange={e => patchP1(k, e.target.value)} />
                          </Field>
                        ))}
                        <Field label="Gender">
                          <select className={sel} value={parent1.gender} onChange={e => patchP1('gender', e.target.value)}>
                            <option value="">Select</option><option>Male</option><option>Female</option>
                          </select>
                        </Field>
                        <Field label="Learner Resides with This Parent?">
                          <select className={sel} value={parent1.learnerResidesWithThisParent} onChange={e => patchP1('learnerResidesWithThisParent', e.target.value)}>
                            <option value="">Select</option><option>Yes</option><option>No</option>
                          </select>
                        </Field>
                        <Field label="Relationship to Learner">
                          <select className={sel} value={parent1.relationshipToLearner} onChange={e => patchP1('relationshipToLearner', e.target.value)}>
                            <option value="">Select</option>
                            <option>Father</option><option>Mother</option><option>Guardian</option><option>Grandparent</option><option>Other</option>
                          </select>
                        </Field>
                        <Field label="Marital Status">
                          <select className={sel} value={parent1.maritalStatusOfParent} onChange={e => patchP1('maritalStatusOfParent', e.target.value)}>
                            <option value="">Select</option>
                            <option>Married</option><option>Single</option><option>Divorced</option><option>Widowed</option><option>Other</option>
                          </select>
                        </Field>
                      </div>

                      {/* Toggle second parent */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setHasSecondParent(p => !p)}
                          className="text-sm font-semibold text-[#166534] underline underline-offset-2"
                        >
                          {hasSecondParent ? '− Remove second parent/guardian' : '+ Add second parent/guardian'}
                        </button>
                        <span className="text-xs text-gray-400">(living at a different address)</span>
                      </div>

                      {/* Parent 2 */}
                      {hasSecondParent && (
                        <section>
                          <SectionHeading icon={<FileText size={16} />} title="Parent / Guardian 2" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              ['title','Title'],['initials','Initials'],['firstName','First Name'],['surname','Surname'],
                            ].map(([k,l]) => (
                              <Field key={k} label={l}>
                                <input className={inp} value={parent2[k as keyof typeof parent2]} onChange={e => patchP2(k, e.target.value)} />
                              </Field>
                            ))}
                            <Field label="Gender">
                              <select className={sel} value={parent2.gender} onChange={e => patchP2('gender', e.target.value)}>
                                <option value="">Select</option><option>Male</option><option>Female</option>
                              </select>
                            </Field>
                            <Field label="ID / Passport Number">
                              <input className={inp} value={parent2.identificationNumber} onChange={e => patchP2('identificationNumber', e.target.value)} />
                            </Field>
                            <Field label="Residential Street Address">
                              <input className={inp} value={parent2.residentialStreetAddress} onChange={e => patchP2('residentialStreetAddress', e.target.value)} />
                            </Field>
                            <Field label="City / Suburb">
                              <input className={inp} value={parent2.citySuburb} onChange={e => patchP2('citySuburb', e.target.value)} />
                            </Field>
                            <Field label="Relationship to Learner">
                              <select className={sel} value={parent2.relationshipToLearner} onChange={e => patchP2('relationshipToLearner', e.target.value)}>
                                <option value="">Select</option>
                                <option>Father</option><option>Mother</option><option>Guardian</option><option>Grandparent</option><option>Other</option>
                              </select>
                            </Field>
                            <Field label="Account Payer">
                              <select className={sel} value={parent2.accountPayer} onChange={e => patchP2('accountPayer', e.target.value)}>
                                <option>Yes</option><option>No</option>
                              </select>
                            </Field>
                          </div>
                        </section>
                      )}

                      {/* Correspondence */}
                      <section>
                        <SectionHeading icon={<FileText size={16} />} title="Correspondence Details" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Field label="Title"><input className={inp} value={correspondence.title} onChange={e => patchCC('title', e.target.value)} /></Field>
                          <Field label="Surname"><input className={inp} value={correspondence.surname} onChange={e => patchCC('surname', e.target.value)} /></Field>
                          <Field label="Postal Address"><input className={inp} value={correspondence.postalAddress} onChange={e => patchCC('postalAddress', e.target.value)} /></Field>
                          <Field label="City / Suburb"><input className={inp} value={correspondence.citySuburb} onChange={e => patchCC('citySuburb', e.target.value)} /></Field>
                          <Field label="Code"><input className={inp} value={correspondence.code} onChange={e => patchCC('code', e.target.value)} maxLength={6} /></Field>
                        </div>
                      </section>

                      {/* Other Contact Details */}
                      <section>
                        <SectionHeading icon={<FileText size={16} />} title="Other Contact Details" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            ['homeTelephone','Home Telephone'],['faxNumber','Fax Number'],
                            ['workTelephone','Work Telephone'],['cellNumber','Cell Number'],
                            ['spouseWorkTelephoneNumber','Spouse Work Telephone'],['spouseCellNumber','Spouse Cell Number'],
                            ['emailAddress','E-Mail Address'],['spouseEmailAddress','Spouse E-Mail Address'],
                          ].map(([k,l]) => (
                            <Field key={k} label={l}>
                              <input className={inp} type={k.includes('email') || k.includes('Email') ? 'email' : 'tel'} value={otherContact[k as keyof typeof otherContact]} onChange={e => patchOC(k, e.target.value)} />
                            </Field>
                          ))}
                        </div>
                      </section>

                      {/* Document Uploads */}
                      <section>
                        <SectionHeading icon={<Upload size={16} />} title="Required Documents" />
                        <p className="text-xs text-gray-500 mb-4">
                          If the learner is accepted, the following documents must be submitted to the school.
                          Please upload them now where possible.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {uploadFields.map(field => {
                            const file = files[field.key];
                            return (
                              <div
                                key={field.key}
                                className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition
                                  ${file
                                    ? 'border-[#166534] bg-[#FDF9EC]'
                                    : field.required
                                      ? 'border-dashed border-red-300 bg-red-50/40'
                                      : 'border-dashed border-gray-300 bg-gray-50'}`}
                              >
                                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${file ? 'bg-[#C8A400] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                  {file ? <CheckCircle size={16} /> : <Upload size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold text-gray-700 leading-tight">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  {file && <div className="text-xs text-[#166534] truncate mt-0.5">{file.name}</div>}
                                  {!file && <div className="text-xs text-gray-400 mt-0.5">No file chosen</div>}
                                </div>
                                <label className="shrink-0 text-xs font-bold text-[#166534] cursor-pointer hover:underline">
                                  {file ? 'Change' : 'Upload'}
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={e => handleFileChange(field.key, e.target.files?.[0] ?? null)}
                                  />
                                </label>
                                {file && (
                                  <button type="button" onClick={() => handleFileChange(field.key, null)} className="shrink-0 text-gray-400 hover:text-red-500">
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* Declaration */}
                      <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-3">Declaration</h4>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          I hereby declare that to the best of my knowledge, the above information as supplied is <strong>accurate and correct</strong>. I understand that completing this form does not necessarily mean that the learner has been accepted into the school. All changes to be initialled or signed by parent/guardian.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={disclaimer}
                            onChange={e => setDisclaimer(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#C8A400] cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            I, the parent/guardian, confirm that the information provided is accurate and correct, and I agree to the above declaration.
                          </span>
                        </label>
                      </section>
                    </>
                  </>
                )}

                {/* Error banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 p-8">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition shadow"
                      style={{ background: '#C8A400' }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition shadow"
                      style={{ background: '#C8A400' }}
                    >
                      {submitting ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                      ) : (
                        <><CheckCircle size={16} /> Submit Application</>
                      )}
                    </button>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Applications and uploads are saved in the school's browser storage. For a live deployment, connect the staff portal to a database.
        </p>
      </div>
    </div>
  );
};
