import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const SETTINGS_JSON = path.join(process.cwd(), 'src/data/settings.json');

function readSettingsLocal() {
    if (!fs.existsSync(SETTINGS_JSON)) {
        return {
            general: {
                storeName: 'BioLongevity Labs',
                supportEmail: 'support@biolongevitylabss.com',
                maintenanceMode: false,
                currency: 'USD'
            },
            taxConfig: "auto",
            shipping: {
                usa: { standardRate: "15.00", priorityRate: "45.00", freeShippingThreshold: "149.00" },
                international: { standardRate: "55.00", priorityRate: "85.00", freeShippingThreshold: "299.00" }
            },
            paymentMethods: []
        };
    }
    const content = fs.readFileSync(SETTINGS_JSON, 'utf-8');
    return JSON.parse(content);
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('site_settings')
                .select('config')
                .eq('id', 1)
                .single();

            if (!error && data?.config) {
                return NextResponse.json(data.config);
            }
        }

        // Fallback to local
        const settings = readSettingsLocal();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
