import React, { useState } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { ShieldCheckIcon, ChevronDownIcon, ChevronUpIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import privasiKebijakanData from '../../data/privasiKebijakanData';

const PrivasiKebijakanPage = () => {
  const [expandedSections, setExpandedSections] = useState([]);

  // Ambil data dari file terpisah
  const { lastUpdated, introduction, sections, dataProtectionOfficer, compliance } = privasiKebijakanData;

  const toggleSection = (id) => {
    setExpandedSections((prev) =>
      prev.includes(id)
        ? prev.filter((sectionId) => sectionId !== id)
        : [...prev, id]
    );
  };

  return (
    <SellerSidebar>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Privasi & Kebijakan</h1>
          </div>
          <p className="text-gray-600">
            Komitmen kami dalam melindungi privasi dan data pribadi Anda
          </p>
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-800">
              <strong>Privasi Anda Penting:</strong> Kami berkomitmen untuk melindungi informasi pribadi Anda 
              dan menggunakannya secara bertanggung jawab sesuai dengan peraturan yang berlaku.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mb-6 text-sm text-gray-500">
          Terakhir diperbarui: {lastUpdated}
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{introduction.title}</h2>
          {introduction.content.map((paragraph, index) => (
            <p key={index} className={`text-gray-600 leading-relaxed ${index > 0 ? 'mt-4' : ''}`}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 text-left">{section.title}</h3>
                {expandedSections.includes(section.id) ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedSections.includes(section.id) && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-600 font-bold flex-shrink-0">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data Protection Officer */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{dataProtectionOfficer.title}</h3>
          <p className="text-gray-600 mb-4">
            {dataProtectionOfficer.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {dataProtectionOfficer.contacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-2">
                {contact.icon === 'mail' && <EnvelopeIcon className="h-5 w-5 text-blue-600" />}
                {contact.icon === 'phone' && <PhoneIcon className="h-5 w-5 text-blue-600" />}
                {contact.icon === 'location' && <MapPinIcon className="h-5 w-5 text-blue-600" />}
                <div>
                  <div className="text-xs text-gray-600">{contact.type}</div>
                  <div className="text-sm font-medium text-blue-700">{contact.value}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 italic">{dataProtectionOfficer.responseTime}</p>
        </div>

        {/* Compliance */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{compliance.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            {compliance.description}
          </p>
          <ul className="space-y-3">
            {compliance.regulations.map((regulation, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <div className="font-semibold text-gray-800">{regulation.name}</div>
                  <div className="text-sm text-gray-600">{regulation.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
};

export default PrivasiKebijakanPage;
