import { create } from 'zustand';

interface ShippingZone {
    standardRate: string;
    priorityRate: string;
    freeShippingThreshold: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    instructions: string;
    enabled: boolean;
}

interface StoreSettings {
    general: {
        storeName: string;
        supportEmail: string;
        maintenanceMode: boolean;
        currency: string;
    };
    shipping: {
        usa: ShippingZone;
        international: ShippingZone;
    };
    paymentMethods: PaymentMethod[];
}

interface SettingsStore {
    settings: StoreSettings | null;
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
}

export const useSettings = create<SettingsStore>((set) => ({
    settings: null,
    loading: true,
    error: null,
    fetchSettings: async () => {
        set({ loading: true });
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Failed to fetch settings');
            const data = await res.json();
            set({ settings: data, loading: false, error: null });
        } catch (error: any) {
            set({ error: error.message, loading: false });
            console.error('Settings store error:', error);
        }
    }
}));
