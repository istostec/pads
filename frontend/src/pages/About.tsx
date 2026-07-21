import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Eye, Heart } from 'lucide-react';
import {
  pageTransition,
  fadeInUp,
  staggerContainer,
} from '../animations/framer-variants';

const About: React.FC = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pb-20 space-y-20 min-h-screen"
    >
      {/* Intro Header */}
      <section className="bg-gradient-to-br from-[#FFF8F2] to-white py-20 text-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#FF7A00]/5 blur-3xl" />

        <div className="max-w-3xl mx-auto px-4 space-y-4 relative z-10">
          <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider block">
            Our Story
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-800 leading-tight">
            Purity In Every Layer
          </h1>

          <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Lumina Care was founded on a simple premise: no woman should have
            to trade skin health for period protection.
          </p>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl font-bold text-slate-800 leading-snug">
              Why Organic Cotton?
            </h2>

            <p className="text-slate-500 font-light text-sm leading-relaxed">
              Standard sanitary pads contain synthetic polyester sheets,
              plastic bottom liners, chemical bleach residues, and artificial
              deodorizers. This mixture locks in heat and sweat, creating a
              warm, damp environment that leads to micro-rashes and skin
              chafing.
            </p>

            <p className="text-slate-500 font-light text-sm leading-relaxed">
              Lumina Care uses GOTS certified organic cotton top sheets and
              breathable bamboo fibers. Our pads are processed without chlorine,
              bleach, or synthetic dyes, ensuring a completely hypoallergenic,
              rash-free period experience.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600"
              alt="Comfort pads science"
              className="rounded-3xl shadow-premium border-4 border-white w-full object-cover max-h-[400px]"
            />
          </motion.div>

        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-slate-800">
              Our Core Pillars
            </h2>

            <p className="text-slate-400 text-sm font-light">
              The principles behind our product designs.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >

            <motion.div
              variants={fadeInUp}
              className="text-center p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mx-auto">
                <Leaf className="w-5 h-5" />
              </div>

              <h3 className="font-serif font-bold text-slate-800 text-base">
                Pure Raw Materials
              </h3>

              <p className="text-slate-400 text-xs font-light leading-relaxed">
                GOTS organic cotton and premium unbleached bamboo dry weaves.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mx-auto">
                <Award className="w-5 h-5" />
              </div>

              <h3 className="font-serif font-bold text-slate-800 text-base">
                Dermatologist Verified
              </h3>

              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Hypoallergenic testing certified to cause zero recurring skin
                chafing.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mx-auto">
                <Eye className="w-5 h-5" />
              </div>

              <h3 className="font-serif font-bold text-slate-800 text-base">
                Radical Transparency
              </h3>

              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Full ingredient declarations, free from hidden plastics or
                synthetics.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mx-auto">
                <Heart className="w-5 h-5" />
              </div>

              <h3 className="font-serif font-bold text-slate-800 text-base">
                Eco Commitment
              </h3>

              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Fully biodegradable wrapper films and card packaging boxes.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;