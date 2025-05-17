import React, { useState, useEffect } from 'react';
import FloatingChat from './FloatingChat';
import AppLayout from '../layout/AppLayout';

/**
 * Responsive AI‑Grant Navigator dashboard built with TailwindCSS + React.
 * Features:
 * - Metrics grid adapts from 1 → 2 → 4 columns
 * - Uses semantic sections for clarity
 * - Integrated with AppLayout for consistent navigation
 */
const businessStatus = [
  {
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2 4-4" /></svg>
    ),
    title: 'SME Status',
    value: 'Eligible - Tier 2',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
    ),
    title: 'Application Deadline',
    value: '28 days remaining',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" /></svg>
    ),
    title: 'Missing Documents',
    value: '2 documents needed',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
];

const progressSteps = [
  {
    label: 'Initial Registration',
    status: 'done',
    desc: 'Completed on May 1, 2025',
  },
  {
    label: 'Business Validation',
    status: 'done',
    desc: 'Completed on May 8, 2025',
  },
  {
    label: 'Documentation Submission',
    status: 'active',
    desc: 'In progress - Due May 20, 2025',
  },
  {
    label: 'Application Review',
    status: 'pending',
    desc: 'Pending',
  },
  {
    label: 'Final Approval',
    status: 'pending',
    desc: 'Expected by June 15, 2025',
  },
];

const regulations = [
  {
    title: 'Updated SME Definition Guidelines',
    desc: 'New criteria for technology-focused businesses',
    date: 'May 15, 2025',
  },
  {
    title: 'Tax Incentives for Digital Adoption',
    desc: '30% tax reduction for qualified AI implementations',
    date: 'May 10, 2025',
  },
  {
    title: 'Revised Export Compliance Standards',
    desc: 'New documentation requirements for software exports',
    date: 'May 5, 2025',
  },
  {
    title: 'Cybersecurity Compliance Update',
    desc: 'Mandatory security protocols for SMEs',
    date: 'Apr 28, 2025',
  },
];

const recommendedGrants = [
  {
    name: 'Digital Transformation Grant',
    desc: 'For SMEs adopting digital solutions and automation.',
  },
  {
    name: 'Green Technology Innovation Fund',
    desc: 'Supports eco-friendly and sustainable business projects.',
  },
  {
    name: 'SME Export Development Program',
    desc: 'Helps SMEs expand into international markets.',
  },
];

const faqs = [
  {
    q: 'How do I determine my SME size category?',
    a: 'Your SME category is determined by your annual revenue and number of employees. Micro enterprises have revenue up to RM300,000, small enterprises up to RM15 million, and medium enterprises up to RM50 million.'
  },
  {
    q: 'What documents do I need for grant applications?',
    a: 'Typically required documents include business registration, financial statements, tax returns, and a detailed project proposal. Specific requirements vary by grant type.'
  },
  {
    q: 'How long does the approval process take?',
    a: 'The approval process typically takes 4-8 weeks, depending on the complexity of your application and the current volume of applications being processed.'
  }
];

const statusCards = [
  {
    icon: (
      <span className="status-icon success">✓</span>
    ),
    title: 'SME Status',
    desc: 'Eligible - Tier 2',
    style: 'success',
  },
  {
    icon: (
      <span className="status-icon info">⏱</span>
    ),
    title: 'Application Deadline',
    desc: '28 days remaining',
    style: 'info',
  },
  {
    icon: (
      <span className="status-icon warning">!</span>
    ),
    title: 'Missing Documents',
    desc: '2 documents needed',
    style: 'warning',
  },
];

const timelineSteps = [
  {
    label: 'Initial Registration',
    desc: 'Completed on May 1, 2025',
    status: 'done',
  },
  {
    label: 'Business Validation',
    desc: 'Completed on May 8, 2025',
    status: 'done',
  },
  {
    label: 'Documentation Submission',
    desc: 'In progress - Due May 20, 2025',
    status: 'active',
  },
  {
    label: 'Application Review',
    desc: 'Pending',
    status: 'pending',
  },
  {
    label: 'Final Approval',
    desc: 'Expected by June 15, 2025',
    status: 'pending',
  },
];

const regulationIcons = [
  '📄', '💰', '🔄', '🔒'
];

const GrantEligibilityAnalysis: React.FC = () => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-8 w-full max-w-md mx-auto">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Grant Eligibility Analysis</h2>
    <div className="relative flex items-center justify-center mb-4">
      {/* Donut SVG */}
      <svg width="120" height="120" viewBox="0 0 120 120" className="block">
        <circle
          cx="60" cy="60" r="48"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
        />
        {/* Highly Eligible: 65% (234deg) */}
        <circle
          cx="60" cy="60" r="48"
          fill="none"
          stroke="#5B3DF6"
          strokeWidth="16"
          strokeDasharray="306.0197 301.5929"
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${0.65 * 2 * Math.PI * 48} ${2 * Math.PI * 48}`,
            strokeDashoffset: 0,
            transition: 'stroke-dasharray 0.5s',
          }}
        />
        {/* Partially Eligible: 20% (72deg) */}
        <circle
          cx="60" cy="60" r="48"
          fill="none"
          stroke="#3ECFFF"
          strokeWidth="16"
          strokeDasharray="60.3186 301.5929"
          strokeDashoffset="-195.91"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${0.20 * 2 * Math.PI * 48} ${2 * Math.PI * 48}`,
            strokeDashoffset: `-${0.65 * 2 * Math.PI * 48}`,
            transition: 'stroke-dasharray 0.5s',
          }}
        />
        {/* Not Eligible: 15% (54deg) */}
        <circle
          cx="60" cy="60" r="48"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="16"
          strokeDasharray="45.2386 301.5929"
          strokeDashoffset="-234.57"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${0.15 * 2 * Math.PI * 48} ${2 * Math.PI * 48}`,
            strokeDashoffset: `-${(0.65 + 0.20) * 2 * Math.PI * 48}`,
            transition: 'stroke-dasharray 0.5s',
          }}
        />
      </svg>
      {/* Center Percentage */}
      <span className="absolute text-3xl font-bold text-gray-800">76%</span>
    </div>
    {/* Legend */}
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded bg-[#5B3DF6] inline-block"></span>
        <span className="text-gray-700 text-sm">Highly Eligible <span className="text-gray-400">(65%)</span></span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded bg-[#3ECFFF] inline-block"></span>
        <span className="text-gray-700 text-sm">Partially Eligible <span className="text-gray-400">(20%)</span></span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded bg-[#D1D5DB] inline-block"></span>
        <span className="text-gray-700 text-sm">Not Eligible <span className="text-gray-400">(15%)</span></span>
      </div>
    </div>
  </div>
);

interface EligibilityData {
  totalRequirements: number;
  completedRequirements: number;
}

const Dashboard: React.FC = () => {
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [eligibilityData, setEligibilityData] = useState<EligibilityData>({
    totalRequirements: 0,
    completedRequirements: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEligibilityData = async () => {
      try {
        const response = await fetch('/api/agent/eligibility');
        if (!response.ok) {
          throw new Error('Failed to fetch eligibility data');
        }
        const data = await response.json();
        setEligibilityData(data);
      } catch (error) {
        console.error('Error fetching eligibility data:', error);
        // Set default values in case of error
        setEligibilityData({
          totalRequirements: 0,
          completedRequirements: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibilityData();
  }, []);

  const eligibilityScore = Math.round((eligibilityData.completedRequirements / eligibilityData.totalRequirements) * 100);

  const toggleGrant = (name: string) => {
    setSelectedGrants((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f5f7fb]">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#6c4beb] to-[#8e75f5] text-white py-6 mb-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Malaysia SME Grant Navigator</h1>
              <p className="text-base opacity-90">Your AI-powered assistant for grants, funding & compliance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-lg">Sarah Johari</div>
                <div className="text-sm opacity-90">Tech Solutions Sdn Bhd</div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#6c4beb] font-bold">SJ</div>
            </div>
          </div>
        </header>
        {/* Main Dashboard Grid */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (2 columns) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Grant Application Summary Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Grant Application Summary</h2>
                {isLoading ? (
                  <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Loading...</span>
                ) : (
                  <span className="bg-[#6c4beb] text-white text-xs font-semibold px-3 py-1 rounded-full">{eligibilityScore}% Complete</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Donut and Legend */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[180px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c4beb]"></div>
                    </div>
                  ) : (
                    <>
                      <div className="relative flex items-center justify-center mb-2">
                        <svg width="180" height="180" viewBox="0 0 180 180">
                          <circle cx="90" cy="90" r="82" fill="none" stroke="#f5f5f7" strokeWidth="16" />
                          <circle 
                            cx="90" 
                            cy="90" 
                            r="82" 
                            fill="none" 
                            stroke="#6c4beb" 
                            strokeWidth="16" 
                            strokeDasharray={`${(eligibilityScore / 100) * 2 * Math.PI * 82} ${2 * Math.PI * 82}`}
                            strokeDashoffset="0"
                            strokeLinecap="round" 
                          />
                        </svg>
                        <span className="absolute text-4xl font-bold text-[#1c1c1e]">{eligibilityScore}%</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-4 h-4 rounded bg-[#6c4beb] inline-block"></span>
                          Eligibility Score: {eligibilityScore}%
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="w-4 h-4 rounded bg-[#34c759] inline-block"></span>
                          Completed Requirements: {eligibilityData.completedRequirements}/{eligibilityData.totalRequirements}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Status Cards, Progress, Timeline */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {statusCards.map((card, idx) => (
                      <div key={idx} className={`flex items-center gap-3 rounded-lg px-3 py-2 status-card ${card.style === 'success' ? 'bg-green-50 border border-green-200' : card.style === 'info' ? 'bg-purple-50 border border-purple-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className={`status-icon ${card.style}`}>{card.icon}</div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{card.title}</div>
                          <div className="text-gray-500 text-xs">{card.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-base">Application Progress</h3>
                    <div className="w-full h-2 bg-gray-200 rounded mb-4">
                      <div className="h-2 rounded bg-[#6c4beb]" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex flex-col gap-4 ml-2 border-l-2 border-gray-200 pl-4">
                      {timelineSteps.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-2">
                          <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${step.status === 'done' ? 'bg-green-400 border-green-400' : step.status === 'active' ? 'bg-[#6c4beb] border-[#6c4beb]' : 'bg-gray-300 border-gray-300'}`}></span>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{step.label}</div>
                            <div className="text-xs text-gray-500">{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Recommended Grants Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Grants</h2>
                <a href="#" className="text-sm text-[#6c4beb] font-medium hover:underline">View All</a>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                {recommendedGrants.map((grant) => (
                  <label key={grant.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#8e75f5] transition">
                    <input
                      type="checkbox"
                      checked={selectedGrants.includes(grant.name)}
                      onChange={() => toggleGrant(grant.name)}
                      className="accent-[#6c4beb] w-5 h-5"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{grant.name}</div>
                      <div className="text-gray-500 text-xs">{grant.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <button
                className={`w-full bg-[#6c4beb] text-white text-base py-3 rounded-lg font-semibold transition-all duration-200 ${selectedGrants.length > 0 ? 'hover:bg-[#8e75f5]' : 'opacity-50 cursor-not-allowed'}`}
                disabled={selectedGrants.length === 0}
              >
                Apply for Selected ({selectedGrants.length})
              </button>
            </div>
          </div>
          {/* Sidebar (1 column) */}
          <div className="flex flex-col gap-6">
            {/* Latest Regulations Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Latest Regulations</h2>
                <a href="#" className="text-sm text-[#6c4beb] font-medium hover:underline">View All</a>
              </div>
              <div className="flex flex-col gap-4">
                {regulations.map((reg, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f5f7] text-xl">{regulationIcons[idx % regulationIcons.length]}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-base mb-0.5">{reg.title}</div>
                      <div className="text-gray-500 text-xs mb-1">{reg.desc}</div>
                      <div className="text-gray-400 text-xs">{reg.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* FAQ Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h2>
              <div className="flex flex-col gap-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`border border-gray-200 rounded-lg overflow-hidden ${openFaq === idx ? 'bg-gray-50' : ''}`}>
                    <button
                      className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none font-medium text-gray-800"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <span className={`ml-2 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className={`px-4 text-gray-600 text-sm leading-relaxed transition-all duration-300 ${openFaq === idx ? 'max-h-40 py-2' : 'max-h-0 overflow-hidden py-0'}`}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <FloatingChat />
      </div>
    </AppLayout>
  );
};

export default Dashboard; 