import { SHOP_ENABLED, COURSE_ENABLED } from "@/lib/config";

export type NavLink = {
  href: string;
  label: string;
};

const ALL_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/course", label: "Course" },
  { href: "/shop", label: "Shop" },
  { href: "/premium", label: "Premium" },
  { href: "/contact", label: "Contact" },
];

export const NAV_LINKS: NavLink[] = ALL_NAV_LINKS.filter((link) => {
  if (link.href === "/shop") return SHOP_ENABLED;
  if (link.href === "/course") return COURSE_ENABLED;
  return true;
});
