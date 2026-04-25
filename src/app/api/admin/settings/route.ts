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
            taxConfig: 'auto',
            shipping: {
                usa: { standardRate: "15.00", priorityRate: "45.00", freeShippingThreshold: "149.00" },
                international: { standardRate: "55.00", priorityRate: "85.00", freeShippingThreshold: "299.00" }
            },
            paymentMethods: []
        };
    }
    const content = fs.readFileSync(SETTINGS_JSON, 'utf-8');
    const data = JSON.parse(content);
    
    // Ensure general section exists
    if (!data.general) {
        data.general = {
            storeName: 'BioLongevity Labs',
            supportEmail: 'support@biolongevitylabss.com',
            maintenanceMode: false,
            currency: 'USD'
        };
    }
    return data;
}

function writeSettingsLocal(settings: any) {
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 4));
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase.from('site_settings').select('*').single();
            if (!error && data) return NextResponse.json(data.config || data);
        }

        const settings = readSettingsLocal();
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();

        if (supabase) {
            // Upsert into site_settings (assuming a single row system)
            const { error } = await supabase.from('site_settings').upsert({ id: 1, config: newSettings, updated_at: new Date().toISOString() });
            if (!error) return NextResponse.json(newSettings);
        }

        writeSettingsLocal(newSettings);
        return NextResponse.json(newSettings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
