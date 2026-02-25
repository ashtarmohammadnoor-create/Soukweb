"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "@/i18n/navigation";

type DrawerChild = {
  label: string;
  href: string;
};

type DrawerGroup = {
  title: string;
  children: DrawerChild[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  lang?: "ar" | "en";
  items?: DrawerGroup[];
};

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

export default function SideDrawer({open, onClose, lang = "ar", items = []}: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const router = useRouter();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => panelRef.current?.focus(), 0);

    const onTrapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      );

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onTrapFocus);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onTrapFocus);
    };
  }, [open]);

  const isRTL = lang === "ar";
  const sideClass = isRTL ? "drawerPanel right" : "drawerPanel left";

  return (
    <>
      <div className={`drawerOverlay ${open ? "show" : ""}`} onClick={onClose} aria-hidden={!open} />

      <aside
        ref={panelRef}
        tabIndex={-1}
        className={`${sideClass} ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={isRTL ? "\u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062c\u0627\u0646\u0628\u064a\u0629" : "Side menu"}
      >
        <div className="drawerHeader">
          <div className="drawerTitle">{isRTL ? "\u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "Menu"}</div>
          <button className="drawerClose" onClick={onClose} aria-label={isRTL ? "\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "Close menu"}>
            X
          </button>
        </div>

        <nav className="drawerBody">
          {items.map((group) => (
            <AccordionGroup
              key={group.title}
              title={group.title}
              childrenItems={group.children}
              onPick={(href) => {
                onClose();
                if (href?.startsWith("#")) {
                  const element = document.querySelector(href);
                  element?.scrollIntoView({behavior: "smooth", block: "start"});
                  return;
                }
                if (href) router.push(href);
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

type AccordionProps = {
  title: string;
  childrenItems?: DrawerChild[];
  onPick: (href: string) => void;
};

function AccordionGroup({title, childrenItems = [], onPick}: AccordionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="acc">
      <button className="accBtn" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{title}</span>
        <span className={`accChevron ${open ? "up" : ""}`}>^</span>
      </button>

      <div className={`accPanel ${open ? "open" : ""}`}>
        {childrenItems.map((item) => (
          <button key={item.label} className="drawerLink" onClick={() => onPick(item.href)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
