import React from 'react';
import {
  User, Cake, Droplet, IdCard, Users, Phone,
  MapPin, ShieldAlert, ShieldCheck, GraduationCap,
} from 'lucide-react';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-parchment-100/10 bg-ink-950/60 p-4">
    <div className="mb-1.5 flex items-center gap-1.5">
      <Icon size={14} className="text-brass-500" />
      <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-slate-500">{label}</span>
    </div>
    <p className="break-words text-sm leading-snug text-parchment-100">{value || '-'}</p>
  </div>
);

const ProfileSection = ({ title, children }) => (
  <div>
    <h2 className="mb-3 flex items-center gap-2 font-display text-base text-parchment-100">
      <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
      {title}
    </h2>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </div>
);

const StudentProfile = () => {
  const { profile } = useAuth();
  const registeredPrograms = profile?.program_names?.length
    ? profile.program_names
    : (profile?.student_programs || [])
      .filter((enrollment) => enrollment.status === 'active' || !enrollment.status)
      .map((enrollment) => enrollment.programs?.name)
      .filter(Boolean);
  const initials = (profile?.full_name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">My Profile</h1>
      <p className="mb-8 text-sm text-slate-500">Your academy details and active program enrolments.</p>

      <div className="card mb-6 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brass-500/70 bg-brass-500/10 text-base font-semibold text-brass-400">
              {initials || <User size={20} />}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink-900 bg-brass-500 text-onaccent" title="Active enrollment">
              <GraduationCap size={11} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl text-parchment-100">{profile?.full_name || '-'}</p>
            <p className="mt-0.5 truncate text-sm text-brass-400">{profile?.student_code || '-'}</p>
            {profile?.joining_date && <p className="mt-1 text-xs text-slate-500">Joined {profile.joining_date}</p>}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-parchment-100/10 pt-4 text-xs font-medium uppercase tracking-wide text-brass-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
          Active Student
        </div>
      </div>

      <div className="card grid gap-x-8 gap-y-7 p-5 sm:grid-cols-2 sm:p-7">
        <ProfileSection title="Personal Information">
          <InfoItem icon={User} label="Full Name" value={profile?.full_name} />
          <InfoItem icon={Cake} label="Date of Birth" value={profile?.date_of_birth} />
          <InfoItem icon={Droplet} label="Blood Group" value={profile?.blood_group} />
          <InfoItem icon={IdCard} label="Student ID" value={profile?.student_code} />
        </ProfileSection>

        <ProfileSection title="Parent / Guardian">
          <InfoItem icon={Users} label="Parent Name" value={profile?.parent_name} />
          <InfoItem icon={Phone} label="Parent Contact" value={profile?.parent_contact} />
        </ProfileSection>

        <ProfileSection title="Contact Information">
          <InfoItem icon={Phone} label="Contact Number" value={profile?.contact_number} />
          <InfoItem icon={MapPin} label="Address" value={profile?.address} />
        </ProfileSection>

        <ProfileSection title="Emergency Information">
          <InfoItem icon={ShieldAlert} label="Emergency Contact" value={profile?.emergency_contact} />
          <InfoItem icon={ShieldCheck} label="Safety Status" value={profile?.emergency_contact ? 'Contact on file' : 'Not provided'} />
        </ProfileSection>

        <div className="border-t border-parchment-100/10 pt-5 sm:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base text-parchment-100">
            <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
            Registered Programs
          </h2>
          {registeredPrograms.length ? (
            <div className="flex flex-wrap gap-2">
              {registeredPrograms.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5 rounded-full border border-brass-500/25 bg-ink-950/60 px-3 py-1.5 text-xs font-medium text-parchment-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No active programs on record.</p>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentProfile;
