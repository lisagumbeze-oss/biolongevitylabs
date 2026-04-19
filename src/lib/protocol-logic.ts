export interface ProtocolOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface ProtocolQuestion {
  id: string;
  text: string;
  options: ProtocolOption[];
}

export const PROTOCOL_QUESTIONS: ProtocolQuestion[] = [
  {
    id: 'goal',
    text: 'What is your primary research objective?',
    options: [
      { id: 'recovery', label: 'Tissue Repair & Recovery', description: 'Focus on healing, joints, and musculoskeletal integrity.', icon: '💪' },
      { id: 'longevity', label: 'Longevity & Anti-Aging', description: 'Biological age optimization and systemic cellular support.', icon: '🧬' },
      { id: 'cognitive', label: 'Cognitive & Neurological', description: 'Brain function, neuroprotection, and mental clarity.', icon: '🧠' },
      { id: 'metabolic', label: 'Metabolic & Physique', description: 'Fat loss, metabolic regulation, and energy homeostasis.', icon: '⚖️' },
      { id: 'sleep', label: 'Sleep & Circadian', description: 'Biorhythm optimization and sleep quality research.', icon: '🌙' },
      { id: 'immune', label: 'Immune Modulation', description: 'Systemic immune defense and T-cell regulation.', icon: '🛡️' },
      { id: 'cardio', label: 'Cardiovascular Integrity', description: 'Heart function and vascular health studies.', icon: '❤️' },
    ]
  },
  {
    id: 'form',
    text: 'Preferred administration route for the study?',
    options: [
      { id: 'vials', label: 'Lyophilized Vials', description: 'Traditional research format (Injection/Reconstitution).', icon: '🧪' },
      { id: 'capsules', label: 'Oral Capsules', description: 'Ease of use for behavioral study protocols.', icon: '💊' },
    ]
  }
];

export interface Recommendation {
  productId: string;
  reason: string;
}

export const getRecommendations = (answers: Record<string, string>): Recommendation[] => {
  const { goal, form } = answers;

  if (goal === 'recovery') {
    return [{ productId: 'prod_105727', reason: 'The Regeno Blend combines BPC-157, TB-500, and Cartalax for the most comprehensive systemic recovery profile.' }];
  }

  if (goal === 'cognitive') {
    return [{ productId: 'prod_3886', reason: 'Pinealon is a high-potency pineal bioregulator for intensive neurological studies.' }];
  }

  if (goal === 'metabolic') {
    return [{ productId: 'prod_65890', reason: 'BioZapetite is the premier choice for research into GLP-1/GIP receptor signaling.' }];
  }

  if (goal === 'longevity') {
    return [{ productId: 'prod_425', reason: 'Endoluten (Pineal A-8) is the hallmark bioregulator for longevity and telomere research.' }];
  }

  if (goal === 'sleep') {
    return [{ productId: 'prod_425', reason: 'Endoluten regulates the neuroendocrine system and melatonin production, essential for sleep studies.' }];
  }

  if (goal === 'immune') {
    return [{ productId: 'prod_201099', reason: 'Thymulin is a key factor in T-cell differentiation and systemic immune regulation.' }];
  }

  if (goal === 'cardio') {
    return [{ productId: 'prod_422', reason: 'Chelohart (Heart A-14) is specifically formulated to support cardiovascular metabolism research.' }];
  }

  return [];
};
