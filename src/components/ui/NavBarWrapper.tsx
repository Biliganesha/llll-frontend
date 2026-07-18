"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";

/**
 * NavBarWrapper — shows NavBar on tablet/desktop for all pages except homepage.
 * Homepage has its own OS-style navigation (dock/menu).
 */
export function NavBarWrapper() {
  const pathname = usePathname();

  // Don't show on homepage (has its own nav) or test pages
  if (pathname === "/") return null;

  return (
    <div className="hidden sm:block">
      <NavBar />
    </div>
  );
}
