import React, { useState } from 'react';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import syaratKetentuanData from '../../data/syaratKetentuanData';

const SyaratKetentuanPage = () => {
  const [expandedSections, setExpandedSections] = useState([]);

  // Ambil data dari file terpisah
  const { lastUpdated, introduction, sections, contact, agreement, note } = syaratKetentuanData;

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
            <DocumentTextIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Syarat & Ketentuan</h1>
          </div>
          <p className="text-gray-600">
            Syarat dan ketentuan yang berlaku untuk penjual di platform kami
          </p>
          {note && (
            <div className={`mt-4 p-4 border-l-4 rounded ${
              note.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
            }`}>
              <p className={`text-sm ${note.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}`}>
                <strong>{note.title}:</strong> {note.message}
              </p>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="mb-6 text-sm text-gray-500">
          Terakhir diperbarui: {lastUpdated}
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{introduction.title}</h2>
          <p className="text-gray-600 leading-relaxed">
            {introduction.content}
          </p>
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

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{contact.title}</h3>
          <p className="text-gray-600 mb-4">
            {contact.description}
          </p>
          <div className="flex flex-wrap gap-4 mb-3">
            <a href={`mailto:${contact.email}`} className="text-red-600 hover:text-red-700 font-medium">
              {contact.email}
            </a>
            <span className="text-gray-400">|</span>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-red-600 hover:text-red-700 font-medium">
              {contact.phone}
            </a>
          </div>
          {contact.workingHours && (
            <p className="text-sm text-gray-600">Jam Kerja: {contact.workingHours}</p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="agree" 
              className="mt-1 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              {agreement.text}
            </label>
          </div>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
};

export default SyaratKetentuanPage;
