import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface RecentlyViewedStore {
    items: Product[];
    addItem: (product: Product) => void;
    clearItems: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) => set((state) => {
                // Remove if already exists to move it to the front
                const filtered = state.items.filter(item => item.id !== product.id);
                // Keep only last 10 items
                const newItems = [product, ...filtered].slice(0, 10);
                return { items: newItems };
            }),
            clearItems: () => set({ items: [] }),
        }),
        {
            name: 'biolongevity-recently-viewed',
        }
    )
);
