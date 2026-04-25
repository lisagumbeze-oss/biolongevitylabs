export interface ProtocolGoal {
    id: string;
    title: string;
    description: string;
    icon: string;
    recommendedProducts: string[]; // Product IDs
}

export const protocolGoals: ProtocolGoal[] = [
    {
        id: 'tissue-repair',
        title: 'Tissue Repair & Recovery',
        description: 'Focus on accelerating the healing of musculoskeletal injuries, tendon repair, and systematic inflammation reduction.',
        icon: 'Activity',
        recommendedProducts: ['bpc-157-5mg', 'tb-500-5mg']
    },
    {
        id: 'cognitive',
        title: 'Cognitive Optimization',
        description: 'Research into neuroprotection, memory enhancement, and improved neurological signaling.',
        icon: 'Brain',
        recommendedProducts: ['semax-5mg', 'selank-5mg']
    },
    {
        id: 'longevity',
        title: 'Longevity & Anti-Aging',
        description: 'Cellular rejuvenation, telomere stabilization, and skin-level collagen synthesis research.',
        icon: 'Sparkles',
        recommendedProducts: ['epitalon-10mg', 'ghk-cu-50mg']
    },
    {
        id: 'metabolic',
        title: 'Metabolic Performance',
        description: 'Studies involving GH secretion, lipolysis acceleration, and lean muscle mass maintenance.',
        icon: 'Zap',
        recommendedProducts: ['cjc-1295-no-dac', 'ipamorelin-5mg']
    }
];
