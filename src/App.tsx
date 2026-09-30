/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickStatsStrip } from './components/QuickStatsStrip';
import { AboutSection } from './components/AboutSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { MembershipSection } from './components/MembershipSection';
import { TrainingSection } from './components/TrainingSection';
import { VideoSection } from './components/VideoSection';
import { GymStandards } from './components/GymStandards';
import { ContactSection } from './components/ContactSection';
import { SectionDivider } from './components/common/SectionDivider';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MembershipPlan, Facility, GalleryItem, SiteContent } from './types';
import { initialData } from './data/defaultData';
import { api } from './utils/api';

export default function App() {
  const [memberships, setMemberships] = useState<MembershipPlan[]>(initialData.memberships);
  const [facilities, setFacilities] = useState<Facility[]>(initialData.facilities);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialData.gallery);
  const [content, setContent] = useState<SiteContent>(initialData.content);
  const [isLoading, setIsLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<{ duration: string; type: string } | undefined>(undefined);

  const fetchLatestContent = useCallback(async () => {
    try {
      const data = await api.getContent();
      if (data.memberships && data.memberships.length > 0) {
        setMemberships(data.memberships);
      }
      if (data.facilities && data.facilities.length > 0) {
        setFacilities(data.facilities);
      }
      if (data.gallery && data.gallery.length > 0) {
        setGallery(data.gallery);
      }
      if (data.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.warn('Failed to fetch remote content, utilizing cached local data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestContent();
  }, [fetchLatestContent]);

  // Handle plan selection from membership card
  const handleSelectPlan = (plan: MembershipPlan, type: 'cardio' | 'nonCardio') => {
    setSelectedPlanForEnquiry({
      duration: plan.duration,
      type: type === 'cardio' ? 'Cardio Included' : 'Without Cardio',
    });
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070908] text-[#f2f3ee] flex flex-col font-sans selection:bg-[#1f472e] selection:text-[#f2f3ee]">
      {/* Top Header Navigation with Scroll Progress Indicator */}
      <Header
        phone={content.contact.phone}
        whatsapp={content.contact.whatsapp}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Experience Flow: HERO → BRAND/TRUST → ABOUT → FACILITIES → MEMBERSHIPS → TRAINING → GALLERY → STANDARDS → CONTACT */}
      <main className="flex-1">
        {/* 1. Cinematic Hero with Parallax & Staggered Reveal */}
        <Hero
          headline={content.heroHeadline}
          subhead={content.heroSubhead}
          whatsapp={content.contact.whatsapp}
        />

        {/* 2. Editorial Brand & Trust Credentials Strip */}
        <QuickStatsStrip stats={content.quickStats} />

        {/* 3. 01 / Authentic About & Chhatrapati Award Heritage */}
        <AboutSection content={content} />

        {/* Section Divider: 01 // 02 */}
        <SectionDivider
          index="01 // 02"
          label="Training Floor & Rig"
          tagline="Olympic Spec · Heavy Iron · 100% A/C"
        />

        {/* 4. 02 / Real Equipment & Facilities with Ladies Special Hours */}
        <FacilitiesSection
          facilities={facilities}
          whatsapp={content.contact.whatsapp}
        />

        {/* Section Divider: 02 // 03 */}
        <SectionDivider
          index="02 // 03"
          label="Direct Tariffs"
          tagline="Zero Hidden Fees · Kurla West Value"
        />

        {/* 5. 03 / Centralized Data-Driven Membership Matrix */}
        <MembershipSection
          plans={memberships}
          whatsapp={content.contact.whatsapp}
          phone={content.contact.phone}
          onSelectPlanForEnquiry={handleSelectPlan}
        />

        {/* Section Divider: 03 // 04 */}
        <SectionDivider
          index="03 // 04"
          label="Personal Coaching"
          tagline="Periodization · Biomechanical Spotting"
        />

        {/* 6. 04 / High-Performance Personal Coaching */}
        <TrainingSection whatsapp={content.contact.whatsapp} />

        {/* Section Divider: 04 // 05 */}
        <SectionDivider
          index="04 // 05"
          label="Floor Culture"
          tagline="Real Athletes · Zero Gimmicks"
        />

        {/* 7. 05 / Videography & Culture (Autoplays upon scroll arrival) */}
        <VideoSection />

        {/* Section Divider: 05 // 06 */}
        <SectionDivider
          index="05 // 06"
          label="Floor Standards"
          tagline="Discipline Over Ego · Re-Rack Weights"
        />

        {/* 8. 06 / Gym Rules & Operating Timings */}
        <GymStandards contact={content.contact} rules={content.rules} />

        {/* Section Divider: 06 // 07 */}
        <SectionDivider
          index="06 // 07"
          label="Find & Visit"
          tagline="Takia Ward, Kurla West · Book Free Visit"
        />

        {/* 9. Showstopper Final CTA, Location & Floor Trial Booking */}
        <ContactSection
          contact={content.contact}
          initialPlan={selectedPlanForEnquiry}
          onSuccessEnquiry={fetchLatestContent}
        />
      </main>

      {/* Final Chapter: Editorial Brand Footer */}
      <Footer content={content} onOpenAdmin={() => setAdminOpen(true)} />

      {/* Mobile Sticky Quick Action Bar (Under 15% mobile viewport cap) */}
      <MobileStickyBar
        phone={content.contact.phone}
        phoneRaw={content.contact.phoneRaw}
        whatsapp={content.contact.whatsapp}
        googleMapsUrl={content.contact.googleMapsUrl}
      />

      {/* Discrete Staff Login Portal Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataUpdated={fetchLatestContent}
      />
    </div>
  );
}
