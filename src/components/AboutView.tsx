/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Shield, Heart, Award, CheckCircle, Factory, HelpCircle, FileText } from 'lucide-react';

export default function AboutView() {
  const processSteps = [
    { title: 'Sourcing Pure Organic Cotton', desc: '100% natural organic cotton fibers harvested from ethical, pesticide-free farms. Inspected for biological purity.' },
    { title: 'Oxygen-Based Sterilization', desc: 'Fibers are processed with active oxygenation instead of toxic chlorine gas, entirely avoiding dioxin contamination.' },
    { title: 'SAP Retention Integration', desc: 'Advanced gel-lock polymers are interspersed between breathable layers to assure maximal back-flow protection.' },
    { title: 'Biocompatible Layering Assembly', desc: 'Mechanical layering with 100% breathable backing pores that prevent microbial growth and maintain thermal equilibrium.' },
    { title: 'Individual Bio-Degradable Sealing', desc: 'Pads are individually packaged in protective wraps within a dust-free laboratory workspace to guarantee sterility.' }
  ];

  const certifications = [
    { title: 'ISO 9001:2015 Certification', desc: 'Global Manufacturing Quality Control Management Standards' },
    { title: 'Dermatologically Checked', desc: 'Clinically certified hypoallergenic and 100% rash-free on sensitive human skin trials' },
    { title: 'Oeko-Tex Standard 100', desc: 'Tested for harmful chemical substances and toxins' },
    { title: 'Obstetric-Endorsed Formulation', desc: 'Highly recommended by obstetricians for heavy bleeding, discharge, and post-natal care' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header & Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full">
            Clinical Origin
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 tracking-tight leading-none">
            Empowering Female Wellness With Medical-Grade Integrity
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Founded in 2018, Clinical Grace emerged as a sterile alternative to synthetic, plastic-heavy sanitary pads that dominate the commercial market. Operating out of our ISO certified pharmaceutical hygiene plant, we merge cutting-edge fluid dynamics with pure organic fabrics to ensure absolute protection and zero skin friction.
          </p>
          
          <div className="flex gap-4 border-l-4 border-brand-dark pl-4 text-xs italic text-gray-500">
            "We do not believe in masking synthetic layers with fake chemical perfumes. True hygiene is silent, pure, breathable, and clinically tested." <br />
            <strong className="text-gray-700 mt-1 block font-sans font-semibold">— Dr. Ananya Goel, Director of Clinical Compliance</strong>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-[4/3] bg-brand-blue/20 rounded-3xl overflow-hidden border border-brand-lavender p-4 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600"
            alt="Laboratory sterilizing workplace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-pink/40 text-brand-dark flex items-center justify-center border border-brand-purple/20">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-heading font-extrabold text-gray-900">Our Empathy Mission</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            To supply every woman with dermatologically validated, zero-friction, high-absorption menstrual hygiene products. We aim to break regional period distress, offering premium medical-standard protection that protects women against vulvovaginal health challenges and severe rashes.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/40 text-brand-dark flex items-center justify-center border border-brand-purple/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-heading font-extrabold text-gray-900">Our Efficacy Vision</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            To become the leading clinical FMCG women’s hygiene brand worldwide. We constantly test material alternatives, working closely with obstetric experts, chemical pathologists, and bio-engineers to pioneer a plastic-free, toxin-free, 100% bio-degradable hygiene system.
          </p>
        </div>
      </section>

      {/* 3. Manufacturing Process */}
      <section className="bg-brand-blue/30 py-16 px-8 rounded-3xl border border-brand-lavender space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-brand-purple/20">
            Plant Operations
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900">
            Our Dust-Free Sterile Manufacturing Setup
          </h2>
          <p className="text-xs text-gray-500">
            Explore how we fabricate, assemble, and seal Clinical Grace sanitary pads under strict hygienic oversight.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative border-l-2 border-brand-purple/40 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Bullet counter */}
              <div className="absolute -left-[35px] sm:-left-[43px] w-6 h-6 rounded-full bg-brand-dark text-white text-[10px] font-mono font-bold flex items-center justify-center shadow">
                {index + 1}
              </div>
              <h3 className="text-xs sm:text-sm font-heading font-bold text-gray-900">{step.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quality Assurance & Certifications */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full">
            Clinical Audit
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900">
            Rigorous Quality Certifications
          </h2>
          <p className="text-xs text-gray-500">
            Every batch of pads undergoes bio-burden analysis, absorbency threshold checks, and tear testing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-brand-lavender/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-brand-blue/30 text-brand-dark flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-heading font-bold text-gray-900">{cert.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{cert.desc}</p>
              </div>
              <div className="text-[9px] font-mono text-brand-dark font-bold tracking-widest uppercase">
                100% COMPLIANT
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Achievements Banner */}
      <section className="bg-brand-dark text-white p-8 sm:p-12 rounded-3xl border border-brand-purple/20 text-center space-y-6">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold">Clinical Grace Milestones</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-pink">5M+</div>
            <div className="text-[10px] text-gray-300 font-mono uppercase tracking-wider mt-1">Pads Distributed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-pink">450+</div>
            <div className="text-[10px] text-gray-300 font-mono uppercase tracking-wider mt-1">Hospitals Partnered</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-pink">0%</div>
            <div className="text-[10px] text-gray-300 font-mono uppercase tracking-wider mt-1">Rash Complaints</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-brand-pink">12+</div>
            <div className="text-[10px] text-gray-300 font-mono uppercase tracking-wider mt-1">Regional Awards</div>
          </div>
        </div>
      </section>

    </div>
  );
}
