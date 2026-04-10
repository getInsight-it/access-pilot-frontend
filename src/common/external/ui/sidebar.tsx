import { cn } from "../../../config/lib/utils.ts";
import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, X } from "lucide-react";
import "./sidebar.scss";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if(!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "ui-sidebar ui-sidebar--desktop",
          !open && "ui-sidebar--collapsed",
          className
        )}
        animate={{
          width: animate
            ? (open ? "var(--size-layout-sidebar)" : "var(--size-layout-sidebar-collapsed)")
            : "var(--size-layout-sidebar)"
        }}
        {...props}
      >
        <div className="ui-sidebar__desktop-content">
          {children}
        </div>
        <footer className="ui-sidebar__footer">
          <button
            type="button"
            className="ui-sidebar__footer-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Recolher menu" : "Expandir menu"}>
            <ChevronLeft
              className={cn(
                "ui-sidebar__footer-icon",
                !open && "ui-sidebar__footer-icon--collapsed"
              )}
            />
            {open && (
              <span className="ui-sidebar__footer-label">Recolher menu</span>
            )}
          </button>
        </footer>
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className="ui-sidebar ui-sidebar--mobile-trigger"
        {...props}
      >
        <div className="ui-sidebar__mobile-menu">
          <Menu
            className="ui-sidebar__mobile-menu-icon"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3
              }}
              className={cn(
                "ui-sidebar ui-sidebar--mobile-sheet",
                className
              )}
            >
              <div
                className="ui-sidebar__mobile-close"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
