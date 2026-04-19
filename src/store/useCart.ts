import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedOptions?: { [key: string]: string };
}

interface CartStore {
    items: CartItem[];
    _hasHydrated: boolean;
    isCartOpen: boolean;
    setHasHydrated: (state: boolean) => void;
    setIsCartOpen: (open: boolean) => void;
    addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string, selectedOptions?: { [key: string]: string }) => void;
    updateQuantity: (id: string, quantity: number, selectedOptions?: { [key: string]: string }) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            _hasHydrated: false,
            isCartOpen: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setIsCartOpen: (open) => set({ isCartOpen: open }),

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingIndex = items.findIndex((item) =>
                    item.id === product.id &&
                    JSON.stringify(item.selectedOptions ?? {}) === JSON.stringify(product.selectedOptions ?? {})
                );

                if (existingIndex >= 0) {
                    const updated = [...items];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        quantity: updated[existingIndex].quantity + quantity,
                    };
                    set({ items: updated });
                } else {
                    set({ items: [...items, { ...product, quantity }] });
                }
            },

            removeItem: (id, selectedOptions) => {
                set({
                    items: get().items.filter((item) => {
                        if (item.id !== id) return true;
                        if (selectedOptions !== undefined) {
                            return JSON.stringify(item.selectedOptions ?? {}) !== JSON.stringify(selectedOptions ?? {});
                        }
                        return false;
                    }),
                });
            },

            updateQuantity: (id, quantity, selectedOptions) => {
                set({
                    items: get().items.map((item) => {
                        if (item.id !== id) return item;
                        if (selectedOptions !== undefined &&
                            JSON.stringify(item.selectedOptions ?? {}) !== JSON.stringify(selectedOptions ?? {})) {
                            return item;
                        }
                        return { ...item, quantity: Math.max(1, quantity) };
                    }),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((acc, item) => {
                    let price = item.price;
                    // Wholesale Logic
                    if (item.quantity >= 25) {
                        price = item.price * 0.60; // 40% off
                    } else if (item.quantity >= 10) {
                        price = item.price * 0.75; // 25% off
                    } else if (item.quantity >= 3) {
                        price = item.price * 0.90; // 10% off
                    }
                    return acc + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'biolongevity-cart-v2',
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
