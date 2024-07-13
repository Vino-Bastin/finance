"use client";

import { useState } from "react";
import { useMedia } from "react-use";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Sheet, SheetContent } from "./ui/sheet";
import { routes } from "../lib/constant";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const navigateTo = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          variant="outline"
          size="sm"
          className="font-normal bg-white/10 hover:bg-white/20 text-white hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none focus:bg-white/30 transition"
        >
          <Menu className="size-4" />
        </Button>
        <SheetContent side="left" className="px-4">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                onClick={() => navigateTo(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <Button
          key={route.href}
          asChild
          size="sm"
          variant="outline"
          className={cn(
            "w-full lg:w-auto font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
            pathname === route.href ? "bg-white/10" : "bg-transparent"
          )}
        >
          <Link href={route.href}>{route.label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Navigation;
