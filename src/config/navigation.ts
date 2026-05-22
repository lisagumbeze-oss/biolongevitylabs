export type NavLink = {
  href: string;
  label: string;
};

export type NavDropdown = {
  label: string;
  links: NavLink[];
};

/** Primary header links — highest traffic / conversion paths */
export const headerPrimaryLinks: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/research", label: "Research" },
];

/** Grouped tools & guides to keep the header compact */
export const headerDropdowns: NavDropdown[] = [
  {
    label: "Resources",
    links: [
      { href: "/resources/peptide-calculator", label: "Peptide Calculator" },
      { href: "/peptide-guide", label: "Peptide Guide" },
      { href: "/protocol-finder", label: "Protocol Finder" },
    ],
  },
];

export const headerSecondaryLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export type FooterLink =
  | NavLink
  | { label: string; modal: "privacy" | "ruo" };

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

/** Footer columns — secondary pages, account, and legal */
export const footerSections: FooterSection[] = [
  {
    title: "Explore",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/research", label: "Research Articles" },
      { href: "/protocol-finder", label: "Protocol Finder" },
      { href: "/wholesale", label: "Wholesale" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/resources/peptide-calculator", label: "Peptide Calculator" },
      { href: "/peptide-guide", label: "Peptide Guide" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Researcher Dashboard" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/support", label: "Customer Service" },
      { href: "/shipping-and-payments", label: "Shipping & Payments" },
      { href: "/refunds", label: "Refunds & Returns" },
      { href: "/terms", label: "Terms & Conditions" },
      { label: "Privacy Policy", modal: "privacy" },
      { label: "RUO Policy", modal: "ruo" },
    ],
  },
];

/** Flat list for mobile menu (header + dropdown items + wholesale) */
export function getMobileNavLinks(): NavLink[] {
  const dropdownLinks = headerDropdowns.flatMap((d) => d.links);
  return [
    ...headerPrimaryLinks,
    ...dropdownLinks,
    ...headerSecondaryLinks,
    { href: "/wholesale", label: "Wholesale" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/wishlist", label: "Wishlist" },
  ];
}

export function isFooterModalLink(
  link: FooterLink
): link is { label: string; modal: "privacy" | "ruo" } {
  return "modal" in link;
}
