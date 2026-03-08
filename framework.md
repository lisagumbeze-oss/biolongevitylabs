# Development Framework: Biolongevity Labs Migration

To ensure a pixel-perfect, high-performance migration from WordPress to Next.js, we will follow this structured, phase-based approach. Each phase requires user approval before moving to the next.

## Phase 1: Project Foundation & Core Design System
- **Next.js Initialization**: Setup App Router with TypeScript and Tailwind CSS.
- **State Management**: Initialize Zustand for cart and session management.
- **Design Tokens**: Export color palette, typography scales, and spacing from Stitch designs into Tailwind config.
- **Global Components**: Build responsive Navigation Bar and Footer.

## Phase 2: Homepage (Direct Shopping) Implementation
- **Layout Construction**: Implementation of the primary homepage section based on `StitchAssets/E-commerce_Homepage_Direct_Shopping`.
- **Interactivity**: Add hover states, smooth transitions, and core button functionality.
- **Mobile Verification**: Ensure the layout is fully responsive and visually identical to the design.

## Phase 3: Product Discovery & Filtering
- **Shop Page**: Implement `StitchAssets/Shop_Browse_and_Filter_Page`.
- **Dynamic Filtering**: Logic for categories, prices, and keywords.
- **Search Results**: Implement `StitchAssets/Search_Results_and_Product_Discovery`.

## Phase 4: Product Details & Cart Logic
- **PDP Implementation**: `StitchAssets/Product_Details_with_Guest_Checkout_focus`.
- **Zustand Cart**: Fully functional 'Add to Cart' and quantity management.
- **Quick Cart**: Implement `StitchAssets/Quick_Cart_Slide-out_Popup`.

## Phase 5: Checkout Flow & Regulatory Compliance
- **Checkout Process**: `StitchAssets/Guest_Checkout_and_Order_Summary`.
- **Policy Modals**: Implement RUO (Research Use Only) consent popups and age verification.
- **Terms & Legal**: Implementation of all policy pages and templates.

## Phase 6: Admin Interface & Dashboard
- **Dashboard Overview**: `StitchAssets/E-commerce_Admin_Dashboard_Overview`.
- **Order Management**: Implementation of order lists and detailed views.
- **Manual Payment Config**: Admin configuration for payment approvals.

## Phase 7: Polish, SEO & Final Verification
- **UX Polish**: Implementation of loading skeletons, micro-animations, and screen transitions.
- **SEO Audit**: Metadata optimization for all pages.
- **Performance Benchmarking**: Ensure fast LCP/FID scores.
