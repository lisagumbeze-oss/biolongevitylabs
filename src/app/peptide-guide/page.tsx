"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Beaker, ShieldCheck, FileText, Anchor, PenTool, Hash } from "lucide-react";

const guides = [
    {
        title: "Peptides and Amino Acids: A Beginner's Guide",
        description: "Start your exploration with the fundamentals of peptide science. This introduction explores the 20 standard amino acids, how peptide bonds form complex chains, and key differences between peptides and proteins.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/peptide-molecules.webp",
        icon: BookOpen,
        link: "#"
    },
    {
        title: "Peptide Synthesis: How Peptides Are Made",
        description: "Discover how modern peptide synthesis has evolved from niche laboratory techniques to essential biomedical research tools. This comprehensive guide explores major synthesis methods including solid-phase and liquid-phase.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/lab-molecules.webp",
        icon: FlaskConical,
        link: "#"
    },
    {
        title: "Introduction to Peptide Purification Techniques",
        description: "Master essential peptide purification techniques to ensure clean, reliable research results. This guide covers reversed-phase chromatography, ion-exchange methods, size exclusion, and advanced techniques.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/laboratory-vials.webp",
        icon: Beaker,
        link: "#"
    },
    {
        title: "Peptide Quality Control: Methods & Standards",
        description: "Ensure research success with comprehensive peptide quality control methods and standards. This guide covers essential analytical techniques including HPLC, mass spectrometry, and NMR.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/quality-control.webp",
        icon: ShieldCheck,
        link: "#"
    },
    {
        title: "The Basics of Peptide Modification",
        description: "Discover essential peptide modification techniques that enhance stability, solubility, and functionality for research applications. This guide covers post-translational modifications and chemical enhancements.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/vials-test-in-laboratory.webp",
        icon: PenTool,
        link: "#"
    },
    {
        title: "Peptide Stability: Guidelines for Handling",
        description: "Protect your research investment with proven peptide stability guidelines and handling protocols. This comprehensive guide covers storage conditions, solubilization strategies, and essential SOPs.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/Artboard-1.webp",
        icon: Anchor,
        link: "#"
    },
    {
        title: "Peptide Nomenclature: Reference for Naming",
        description: "Navigate essential peptide naming conventions with confidence in this reference guide to IUPAC-IUBMB nomenclature standards. Learn amino acid codes, proper sequence notation, and modification symbols.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/bll-peptide-vials-banner.webp",
        icon: FileText,
        link: "#"
    },
    {
        title: "Peptide Glossary: Definitions and Terminology",
        description: "Master the language of peptide science with our comprehensive glossary of terms and definitions. An invaluable reference for researchers at all levels working with peptides.",
        image: "https://biolongevitylabs.com/wp-content/uploads/2025/06/peptide-glossary-featured.png",
        icon: Hash,
        link: "#"
    }
];

export default function PeptideGuidePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 dark:bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://biolongevitylabs.com/wp-content/uploads/2025/06/mobile-hero-peptide-guide.webp"
                        alt="Peptide Guide Hero"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold tracking-widest uppercase text-xs mb-6 border border-primary/20 backdrop-blur-md">
                            Knowledge Center
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Research Guide:</span><br />
                            An Online Reference for Researchers
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                            Research peptides are key to advancing science in biochemistry, cell biology and molecular research. This knowledge center provides laboratory scientists with the technical information and practical guidance to select, handle and work with research-grade peptides for in vitro and ex vivo applications.
                        </p>

                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md inline-flex">
                            <Image
                                src="https://biolongevitylabs.com/wp-content/uploads/2025/07/Asset-21.png"
                                alt="USA Made"
                                width={48}
                                height={32}
                                className="rounded"
                            />
                            <p className="text-sm text-slate-300 max-w-xs font-medium">
                                USA-made research peptides are for laboratory use only and not for human consumption.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Sections */}
            <section className="py-24 bg-white dark:bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Section 1 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div className="order-2 md:order-1 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://biolongevitylabs.com/wp-content/uploads/2025/07/peptides-in-research.webp"
                                alt="Peptides in Research"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                                Peptides in <span className="text-primary">Research</span>
                            </h2>
                            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                <p>Peptides are short chains of amino acids that play crucial roles in biological processes, making them invaluable tools for scientific research. These versatile molecules serve as hormones, neurotransmitters, signaling compounds, and regulatory factors in living systems.</p>
                                <p>For laboratory researchers, peptides offer unique advantages in studying cellular mechanisms, protein interactions, and biochemical pathways through controlled in vitro and ex vivo experimental systems.</p>
                                <p>Today&apos;s research labs rely on high-quality, well-characterized peptides to conduct reproducible experiments and generate meaningful data in controlled environments.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                                Why <span className="text-primary">Quality Matters</span> in Peptide Research
                            </h2>
                            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                <p>Your research depends heavily on the quality and consistency of your peptides. Purity, stability and proper storage can make a big difference in your outcomes. Understanding these key factors ensures reliable results and supports the integrity of your scientific work.</p>
                                <p>Modern peptide synthesis and purification techniques allow for the production of research grade peptides with defined specifications so you can work with confidence in your experimental design.</p>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://biolongevitylabs.com/wp-content/uploads/2025/07/Why-Quality-Matters-in-Peptide-Research.webp"
                                alt="Why Quality Matters"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Guides Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                            Essential Peptide Research Guides: <span className="text-primary">Choose Your Focus</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                            Browse our in-depth peptide guides for researchers to elevate your laboratory practices.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {guides.map((guide, index) => (
                            <Link
                                key={index}
                                href={guide.link}
                                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-xl">
                                        <guide.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-1 line-clamp-4">
                                        {guide.description}
                                    </p>
                                    <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                                        Read Guide
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Features */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Calculator Promotion */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 flex flex-col">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                                <span className="text-primary">Tools and Resources </span>for Peptide Researchers
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8">
                                Accurately reconstitute lyophilized peptides for research applications with this easy-to-use dilution calculator. Calculate concentrations and avoid common mistakes.
                            </p>
                            <div className="mt-auto self-start">
                                <Link href="/resources/peptide-calculator" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Try Peptide Calculator
                                </Link>
                            </div>
                        </div>

                        {/* Vacuum Seal Question */}
                        <div className="relative rounded-3xl overflow-hidden group">
                            <Image
                                src="https://biolongevitylabs.com/wp-content/uploads/2025/07/Why-Some-Vials-Arent-Vacuum-Sealed.webp"
                                alt="Lab Researcher"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                <h3 className="text-3xl font-black text-white mb-4">
                                    Why Some Vials <span className="text-primary">Aren&apos;t Vacuum Sealed?</span>
                                </h3>
                                <p className="text-lg text-slate-300 font-medium mb-8 max-w-md">
                                    Vacuum sealing isn&apos;t required for peptide quality or research effectiveness. Learn why some research-grade peptide vials lack vacuum seals.
                                </p>
                                <div className="self-start">
                                    <Link href="#" className="inline-flex items-center text-white font-bold group-hover:text-primary transition-colors">
                                        Learn more
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
