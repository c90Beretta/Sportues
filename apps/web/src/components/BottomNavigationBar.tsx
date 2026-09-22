// src/components/BottomNavigationBar.tsx

import type { FC } from "react";

/** Shape of a single navigation destination */
interface NavItem {
  label: string;
  href: string;
  icon: string; // Material Symbols icon name
}

interface BottomNavigationBarProps {
  /** Current URL path, passed in from the Astro page (Astro.url.pathname) */
  currentPath: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: "home" },
  { label: "Máquinas", href: "/maquinas", icon: "fitness_center" },
  { label: "Rutinas", href: "/rutinas", icon: "local_fire_department" },
  { label: "Perfil", href: "/perfil", icon: "account_circle" },
];

const BottomNavigationBar: FC<BottomNavigationBarProps> = ({ currentPath }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center
                 bg-white/90 backdrop-blur-xl border-t border-stone-200 pb-safe"
      aria-label="Navegación móvil"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentPath === item.href;

        return (
          
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl
                       transition-transform active:scale-95"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                color: isActive ? "#781326" : "#a8a29e",
              }}
            >
              {item.icon}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: isActive ? "#781326" : "#a8a29e" }}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;