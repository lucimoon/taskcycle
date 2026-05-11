import { useEffect, useRef, useState, type ReactNode } from "react";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Popover({ trigger, children, align = "right" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 top-full mt-1 ${align === "right" ? "right-0" : "left-0"} bg-bg border border-ink/15 shadow-lg rounded-xl min-w-[10rem] animate-pop-in`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
