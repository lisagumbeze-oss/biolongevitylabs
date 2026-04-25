import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistStore {
    items: WishlistItem[];
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    toggleItem: (product: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            toggleItem: (product) => {
                const items = get().items;
                const exists = items.some((item) => item.id === product.id);

                if (exists) {
                    set({ items: items.filter((item) => item.id !== product.id) });
                } else {
                    set({ items: [...items, product] });
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'biolongevity-wishlist',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                }
            },
            partialize: (state) => ({ items: state.items }),
        }
    )
);
