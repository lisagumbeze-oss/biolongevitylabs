import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const SETTINGS_JSON = path.join(process.cwd(), 'src/data/settings.json');

function readSettingsLocal() {
    if (!fs.existsSync(SETTINGS_JSON)) {
        return {
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

function writeSettingsLocal(settings: any) {
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 4));
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('store_settings')
                .select('data')
                .eq('id', 1)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
                throw error;
            }

            if (data) {
                return NextResponse.json(data.data);
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

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();

        if (supabase) {
            const { error } = await supabase
                .from('store_settings')
                .upsert({ id: 1, data: newSettings, updated_at: new Date().toISOString() });

            if (error) throw error;
            return NextResponse.json({ success: true, settings: newSettings });
        } else {
            // Local fallback (will fail on Vercel but work locally)
            writeSettingsLocal(newSettings);
            return NextResponse.json({ success: true, settings: newSettings });
        }
    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
