import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedOptions?: { [key: string]: string };
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setIsCartOpen: (open: boolean) => set({ isCartOpen: open }),
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => 
                    item.id === product.id && 
                    JSON.stringify(item.selectedOptions) === JSON.stringify(product.selectedOptions)
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            (item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(product.selectedOptions))
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity }] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            get total() {
                return get().items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            partialize: (state) => ({ 
                items: state.items 
            }),
        }
    )
);
