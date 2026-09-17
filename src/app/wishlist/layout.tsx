import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Research Items",
  description: "Private saved-item list. Not a product catalog.",
  robots: { index: false, follow: true },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
