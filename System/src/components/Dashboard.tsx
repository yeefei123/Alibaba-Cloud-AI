import React, { useState } from 'react';
import FloatingChat from './FloatingChat';

/**
 * Responsive AI‑Grant Navigator dashboard built with TailwindCSS + React.
 * ‑ Collapsible sidebar on < md screens (hamburger toggles)
 * ‑ Metrics grid adapts from 1 → 2 → 4 columns
 * ‑ Uses semantic sections for clarity
 */
const Dashboard: React.FC = () => {
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const grants = [
    'Digital Transformation Grant',
    'Green Technology Innovation Fund',
    'SME Export Development Program',
  ];

  const nav = [
    { label: 'Home', icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M4.5 10.75V19a1.25 1.25 0 001.25 1.25h3.5A1.25 1.25 0 0010.5 19v-3.25A1.25 1.25 0 0111.75 14.5h.5A1.25 1.25 0 0113.5 15.75V19a1.25 1.25 0 001.25 1.25h3.5A1.25 1.25 0 0020.5 19v-8.25"/></svg>
    ) },
    { label: 'Eligible Grants', icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="2" fill="none"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ) },
    { label: 'Applications', icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#2563eb" strokeWidth="2" fill="none"/><path d="M8 8h8M8 12h8M8 16h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
    ) },
    { label: 'Regulations', icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#2563eb" strokeWidth="2" fill="none"/><path d="M9 8h6M9 12h6M9 16h3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
    ) },
    { label: 'Support', icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="2" fill="none"/><path d="M12 8v2m0 4h.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
    ) },
  ];
  const activeNav = 'Eligible Grants';

  const toggleGrant = (g: string) =>
    setSelectedGrants((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      {/* top-nav */}
      <header className="h-16 w-full bg-white border-b flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* left */}
        <div className="flex items-center gap-2">
          <button
            className="sm:hidden text-2xl"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <select className="border rounded px-2 py-1 text-sm bg-white">
            <option>English</option>
            <option>Malay</option>
          </select>
        </div>
        {/* center */}
        <h1 className="text-base sm:text-lg font-semibold text-gray-800 text-center flex-1">
          AI Grant & Regulation Navigator for SMEs
        </h1>
        {/* right */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 16.08V17a2 2 0 01-2 2H8a2 2 0 01-2-2v-1M12 19v2m-6-6V9a6 6 0 1112 0v6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="2"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="#6b7280" strokeWidth="2"/></svg>
            <span className="hidden sm:inline">My SME</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 bg-gray-100">
        {/* sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-60 bg-white border-r z-20 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        >
          <nav className="py-8 px-4 flex flex-col gap-2">
            {nav.map(({ label, icon }) => (
              <a
                key={label}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${label === activeNav ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* main content */}
        <main className="flex-1 flex justify-center ml-0 sm:ml-60">
          <div className="w-full max-w-7xl px-4 sm:px-8 py-8">
            {/* metrics grid */}
            <section className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {/* Eligibility */}
              <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#22c55e" strokeWidth="3" fill="none"/><path d="M11 16.5l3 3 6-6" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-green-600 text-lg font-bold">Eligible</span>
                </div>
                <h2 className="text-sm font-medium">Eligibility Status</h2>
              </div>
              {/* Timeline */}
              <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center">
                <h2 className="text-sm font-medium mb-1">Application Timeline</h2>
                <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M16 3v4M8 3v4M3 9h18" stroke="#2563eb" strokeWidth="2"/></svg>
                  <span>Next deadline: June 15, 2025</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Application</span>
                  <span>Review</span>
                  <span>Approval</span>
                  <span>Disbursement</span>
                </div>
              </div>
              {/* Latest Regulations */}
              <div className="bg-white shadow rounded-xl p-6 xl:col-span-2 xl:row-span-2 flex flex-col">
                <h2 className="text-sm font-medium mb-4">Latest regulations</h2>
                <ul className="text-[13px] text-gray-700 space-y-3 flex-1 overflow-y-auto">
                  {[
                    ['Updated SME Definition Guidelines', '15 May 2025'],
                    ['Tax Incentives for Digital Adoption', '10 May 2025'],
                    ['Revised Export Compliance Standards', '05 May 2025'],
                  ].map(([title, date]) => (
                    <li key={title} className="flex justify-between items-center">
                      <span className="font-semibold mb-0.5">{title}</span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Confusion Index */}
              <div className="bg-white shadow rounded-xl p-6 xl:col-span-1 flex flex-col items-center justify-center">
                <h2 className="text-sm font-medium mb-3">Confusion index</h2>
                <div className="w-full h-24 flex items-center justify-center">
                  <div className="w-20 h-14 bg-gray-100 rounded flex items-end gap-1 px-2">
                    {[2, 4, 3, 5].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h * 4}px` }}
                        className="flex-1 bg-gray-300 rounded"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 text-center">
                  Most users find grant eligibility confusing
                </p>
              </div>
            </section>

            {/* main lower layout */}
            <section className="mt-8 grid gap-6 grid-cols-1 xl:grid-cols-3">
              {/* Recommended Grants */}
              <div className="bg-white shadow rounded-xl p-6 xl:col-span-2">
                <h2 className="text-base font-medium mb-4">Recommended Grants</h2>
                <div className="space-y-3 mb-6">
                  {grants.map((g) => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedGrants.includes(g)}
                        onChange={() => toggleGrant(g)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      {g}
                    </label>
                  ))}
                </div>
                <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Apply for Selected
                </button>
              </div>
              {/* FAQs + Quick links stacked */}
              <div className="space-y-6">
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-base font-medium mb-3">FAQs</h2>
                  <ul className="text-[13px] text-gray-700 space-y-2">
                    <li>How do I determine my SME size category?</li>
                    <li>What documents do I need for grant applications?</li>
                    <li>How long does the approval process take?</li>
                  </ul>
                </div>
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-base font-medium mb-3">Quick links</h2>
                  <ul className="list-disc list-inside text-blue-600 text-[13px] space-y-1">
                    <li>
                      <a href="#" className="hover:underline">
                        SME Corporation Malaysia official portal
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Grant application guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:underline">
                        Document Q&A assistant
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <FloatingChat />
    </div>
  );
};

export default Dashboard; 