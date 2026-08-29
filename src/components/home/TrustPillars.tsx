import { Award, Lock, BookOpen, Headphones } from 'lucide-react';

const PILLARS = [
  {
    icon: Award,
    title: 'Authentic Vedic Math',
    subtitle: '(with Swiss Ephemeris ref)',
    description: 'Calculated strictly using Swiss Ephemeris astronomical tables and Lahiri Chitrapaksha Ayanamsa.',
  },
  {
    icon: Lock,
    title: '100% Confidentiality',
    subtitle: 'Strict Data Privacy',
    description: 'Your birth details and consultation recordings remain strictly private and encrypted.',
  },
  {
    icon: BookOpen,
    title: 'Actionable Vedic Remedies',
    subtitle: 'Practical Guidance',
    description: 'Practical, easy-to-do remedies including specific Mantras, Charity, and Gemstone guidance.',
  },
  {
    icon: Headphones,
    title: 'Post-Consultation Support',
    subtitle: 'Follow-up Clarity',
    description: 'Get follow-up clarity on suggested remedies and timing windows after your consultation call.',
  },
];

export default function TrustPillars() {
  return (
    <section className="py-8 sm:py-10 bg-[#fffdfa] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#f3e8d2] flex flex-col items-center text-center hover:border-[#d97706] transition-all hover:-translate-y-1 shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center mb-3 shadow-xs">
                  <Icon className="w-6 h-6 text-[#d97706]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-0.5">{p.title}</h3>
                <span className="text-[11px] font-mono text-[#b45309] font-bold block mb-2">{p.subtitle}</span>
                <p className="text-gray-600 text-xs leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
