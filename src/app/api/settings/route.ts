import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_JSON = path.join(process.cwd(), 'src/data/settings.json');

function readSettings() {
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

function writeSettings(settings: any) {
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 4));
}

export async function GET() {
    try {
        const settings = readSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();
        writeSettings(newSettings);
        return NextResponse.json({ success: true, settings: newSettings });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
