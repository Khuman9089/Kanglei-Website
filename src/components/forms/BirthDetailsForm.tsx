'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Sparkles, ChevronRight } from 'lucide-react';

interface BirthDetailsFormProps {
  onSubmit?: (data: {
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeName: string;
    latitude: number;
    longitude: number;
    utcOffset: number;
    ayanamsa: string;
  }) => void;
  isLoading?: boolean;
}

export function BirthDetailsForm({ onSubmit, isLoading = false }: BirthDetailsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeName: 'Imphal, Manipur',
    latitude: 24.8170,
    longitude: 93.9368,
    utcOffset: 5.5,
    ayanamsa: 'LAHIRI'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white border border-[#f3e8d2] shadow-md rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#fefcf6] border-b border-[#fde68a] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0f172a]">
              Enter Birth Details for Free Kuthi
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Accurate birth date, time, and location are used for precise Lahiri Ayanamsa calculations.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              name="name"
              required 
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Sanatomba Meitei" 
            />
            
            <div className="w-full">
              <label className="mb-1.5 block text-sm font-extrabold text-[#0f172a]">Gender</label>
              <div className="flex space-x-6 h-11 items-center px-4 bg-[#fefcf6] rounded-xl border border-[#fde68a]">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center space-x-2 text-[#0f172a] font-extrabold text-sm cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={g} 
                      checked={formData.gender === g}
                      onChange={handleInputChange}
                      className="text-[#d97706] focus:ring-[#d97706] w-4 h-4" 
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <Input 
              type="date" 
              label="Date of Birth" 
              name="dateOfBirth"
              required 
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />

            <Input 
              type="time" 
              label="Time of Birth" 
              name="timeOfBirth"
              required 
              value={formData.timeOfBirth}
              onChange={handleInputChange}
            />
            
            <Input 
              label="Place of Birth" 
              name="placeName"
              required 
              value={formData.placeName}
              onChange={handleInputChange}
              placeholder="City, State, Country" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="number" 
                step="any"
                label="Latitude (°N)" 
                name="latitude"
                required 
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g. 24.8170" 
              />
              <Input 
                type="number" 
                step="any"
                label="Longitude (°E)" 
                name="longitude"
                required 
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g. 93.9368" 
              />
            </div>

            <Input 
              type="number" 
              step="0.5"
              label="UTC Offset (Hours)" 
              name="utcOffset"
              required 
              value={formData.utcOffset}
              onChange={handleInputChange}
              placeholder="e.g. 5.5 for IST" 
            />

            <div className="w-full">
              <label className="mb-1.5 block text-sm font-extrabold text-[#0f172a]">Ayanamsa System</label>
              <select 
                name="ayanamsa"
                value={formData.ayanamsa}
                onChange={handleSelectChange}
                className="flex w-full rounded-xl border border-[#fde68a] bg-[#fefcf6] px-4 py-2.5 text-sm font-extrabold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#d97706]/40 focus:border-[#d97706]"
              >
                <option value="LAHIRI" className="bg-white text-[#0f172a] font-bold">Lahiri (Chitra Paksha) - Standard Vedic</option>
                <option value="RAMAN" className="bg-white text-[#0f172a] font-bold">Raman Ayanamsa</option>
                <option value="KRISHNAMURTI" className="bg-white text-[#0f172a] font-bold">KP (Krishnamurti) System</option>
              </select>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-base shadow-md hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Calculating Kuthi...' : 'Generate Free Kuthi'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default BirthDetailsForm;
