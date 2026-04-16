"use client";

import { useState } from "react";
import { PhoneHome } from "@/components/layouts/PhoneHome";
import { TabletHome } from "@/components/layouts/TabletHome";
import { DesktopHome } from "@/components/layouts/DesktopHome";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="sm:hidden flex-1 flex flex-col">
        <PhoneHome menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div className="hidden sm:flex lg:hidden flex-1 flex-col">
        <TabletHome />
      </div>
      <div className="hidden lg:flex flex-1 flex-col">
        <DesktopHome />
      </div>
    </>
  );
}
