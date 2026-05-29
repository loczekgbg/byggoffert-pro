import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Camera,
  ChevronLeft,
  Clock3,
  FileText,
  Folder,
  LayoutDashboard,
  Menu,
  Pin,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  SunMoon,
  User,
  WandSparkles,
  X,
} from "lucide-react";
import marcinByggLogo from "../assets/marcin-bygg-logo.png";
import { translateText, useI18n } from "../i18n";

const sidebarCollapsedKey = "byggoffert-sidebar-collapsed";
const pinnedProjectsKey = "byggoffert-pinned-projects";

const statusMeta = {
  active: "bg-emerald-400",
  progress: "bg-yellow-400",
  problem: "bg-red-500",
  archive: "bg-zinc-500",
};

function normalizeStatus(status = "") {
  const normalized = status.toLowerCase();

  if (normalized.includes("nekad") || normalized.includes("problem")) return "problem";
  if (normalized.includes("slutförd") || normalized.includes("archive")) return "archive";
  if (normalized.includes("pågående") || normalized.includes("väntar") || normalized.includes("skickad")) return "progress";

  return "active";
}

function projectProgress(status = "") {
  const normalized = status.toLowerCase();

  if (normalized.includes("slutförd")) return 100;
  if (normalized.includes("pågående")) return 68;
  if (normalized.includes("accepterad")) return 52;
  if (normalized.includes("skickad")) return 34;
  if (normalized.includes("väntar")) return 42;
  if (normalized.includes("nekad")) return 18;

  return 22;
}

function createNotificationItems(t, savedOffers = []) {
  const lastOffer = savedOffers[0];

  return [
    {
      id: "report-ready",
      title: t("sidebar.notificationReport"),
      text: t("sidebar.notificationReportText"),
      tone: "active",
    },
    {
      id: "ai-ready",
      title: t("sidebar.notificationAi"),
      text: t("sidebar.notificationAiText"),
      tone: "progress",
    },
    lastOffer && {
      id: `offer-${lastOffer.id}`,
      title: t("sidebar.notificationOffer"),
      text: lastOffer.customer?.name || t("sidebar.noClient"),
      tone: normalizeStatus(lastOffer.projectStatus),
    },
  ].filter(Boolean);
}

export default function AppShell({
  activeScreen,
  appSettings,
  children,
  onNavigateBack,
  onOpenScreen,
  onThemeChange,
  savedOffers = [],
}) {
  const { language, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(sidebarCollapsedKey) === "true");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pinnedProjectIds, setPinnedProjectIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(pinnedProjectsKey)) || [];
    } catch {
      return [];
    }
  });
  const touchStartX = useRef(null);
  const shellTouchStart = useRef(null);
  const notifications = useMemo(() => createNotificationItems(t, savedOffers), [savedOffers, t]);
  const theme = appSettings?.theme || "system";
  const recentProjects = useMemo(() => {
    const projects = [...savedOffers].sort((first, second) => {
      const firstPinned = pinnedProjectIds.includes(first.id) ? 1 : 0;
      const secondPinned = pinnedProjectIds.includes(second.id) ? 1 : 0;

      if (firstPinned !== secondPinned) return secondPinned - firstPinned;

      return new Date(second.updatedAt || second.date || 0) - new Date(first.updatedAt || first.date || 0);
    });

    return projects.slice(0, 5);
  }, [pinnedProjectIds, savedOffers]);

  useEffect(() => {
    localStorage.setItem(sidebarCollapsedKey, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem(pinnedProjectsKey, JSON.stringify(pinnedProjectIds));
  }, [pinnedProjectIds]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const openScreen = (screen) => {
    onOpenScreen(screen);
    setMobileOpen(false);
  };

  const isInteractiveTarget = (target) => {
    return Boolean(target?.closest?.("button, a, input, textarea, select, [role='button'], [data-no-swipe]"));
  };

  const handleShellTouchStart = (event) => {
    if (window.innerWidth >= 1024 || event.touches.length !== 1) return;

    const touch = event.touches[0];

    shellTouchStart.current = {
      edge: touch.clientX <= 24,
      interactive: isInteractiveTarget(event.target),
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleShellTouchMove = (event) => {
    if (!shellTouchStart.current || window.innerWidth >= 1024 || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const diffX = touch.clientX - shellTouchStart.current.x;
    const diffY = touch.clientY - shellTouchStart.current.y;
    const horizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.35;

    if (!horizontalSwipe) return;

    if (shellTouchStart.current.edge && diffX > 68 && !mobileOpen) {
      setMobileOpen(true);
      shellTouchStart.current = null;
      return;
    }

    if (!shellTouchStart.current.edge && !shellTouchStart.current.interactive && !mobileOpen && diffX > 92) {
      onNavigateBack?.();
      shellTouchStart.current = null;
    }
  };

  const togglePinned = (projectId) => {
    setPinnedProjectIds((currentIds) => (
      currentIds.includes(projectId)
        ? currentIds.filter((id) => id !== projectId)
        : [projectId, ...currentIds]
    ));
  };

  const navGroups = [
    {
      id: "main",
      items: [
        ["home", "sidebar.dashboard", LayoutDashboard],
        ["history", "sidebar.projects", Folder],
        ["tools", "sidebar.calculators", BarChart3],
        ["materials", "sidebar.materialGuide", BookOpen],
        ["shopping-list", "sidebar.shoppingList", ShoppingCart],
        ["categories", "sidebar.offer", ReceiptText],
        ["time-report", "sidebar.timeReport", Clock3],
        ["reports", "sidebar.reports", FileText],
      ],
    },
    {
      id: "ai",
      label: "sidebar.aiSection",
      ai: true,
      items: [
        ["ai-scan", "sidebar.aiScan", Camera],
        ["ai-offer", "sidebar.aiOffer", Bot],
        ["ai-area", "sidebar.aiAreaEstimate", Search],
        ["aiBeforeAfter", "sidebar.aiBeforeAfter", WandSparkles],
      ],
    },
    {
      id: "user",
      label: "sidebar.userSection",
      items: [
        ["profile", "sidebar.profile", User],
        ["history", "sidebar.history", Clock3],
        ["settings", "sidebar.settings", Settings],
      ],
    },
  ];

  const shellClassName = `app-shell ${collapsed ? "is-collapsed" : ""}`;
  const sidebarClassName = `sidebar-shell ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`;

  return (
    <div
      className={shellClassName}
      onTouchStart={handleShellTouchStart}
      onTouchMove={handleShellTouchMove}
      onTouchEnd={() => {
        shellTouchStart.current = null;
      }}
    >
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`sidebar-mobile-trigger fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/90 text-orange-300 shadow-2xl shadow-black/30 backdrop-blur transition-opacity lg:hidden ${
          mobileOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label={t("sidebar.openMenu")}
      >
        <Menu size={22} />
      </button>

      <div
        className={`sidebar-mobile-overlay fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={sidebarClassName}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(event) => {
          if (touchStartX.current === null) return;
          const diff = event.touches[0].clientX - touchStartX.current;

          if (diff < -70) {
            setMobileOpen(false);
            touchStartX.current = null;
          }
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-3 px-4 py-4">
            <img src={appSettings?.logoDataUrl || marcinByggLogo} alt="" className="h-11 w-11 rounded-2xl object-contain shadow-lg shadow-orange-500/20" />
            <div className="sidebar-label min-w-0">
              <p className="truncate text-sm font-black text-white">{appSettings?.companyName || "ByggOffert Pro"}</p>
              <p className="truncate text-xs text-orange-300">{t("sidebar.workspace")}</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] lg:hidden"
              aria-label={t("sidebar.closeMenu")}
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="ml-auto hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:text-orange-300 lg:flex"
              aria-label={t("sidebar.collapse")}
            >
              <ChevronLeft className={`transition ${collapsed ? "rotate-180" : ""}`} size={18} />
            </button>
          </div>

          <div className="grid gap-2 px-3">
            <QuickAction collapsed={collapsed} icon={Plus} label="sidebar.newProject" onClick={() => openScreen("categories")} />
            <QuickAction collapsed={collapsed} icon={Camera} label="sidebar.aiScan" onClick={() => openScreen("ai-scan")} />
            <QuickAction collapsed={collapsed} icon={ReceiptText} label="sidebar.newOffer" onClick={() => openScreen("categories")} />
            <QuickAction collapsed={collapsed} icon={Clock3} label="sidebar.startTimeReport" onClick={() => openScreen("time-report")} />
          </div>

          <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            {navGroups.map((group) => (
              <div key={group.id} className={`mt-4 ${group.ai ? "sidebar-ai-section" : ""}`}>
                {group.label && (
                  <p className="sidebar-label mb-2 px-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-zinc-500">
                    {t(group.label)}
                  </p>
                )}
                <div className="grid gap-1.5">
                  {group.items.map(([screen, label, Icon]) => {
                    const isActive = activeScreen === screen || (screen === "history" && activeScreen === "clientDetail");

                    return (
                      <button
                        key={`${group.id}-${screen}-${label}`}
                        type="button"
                        onClick={() => openScreen(screen)}
                        className={`sidebar-nav-item ${isActive ? "is-active" : ""}`}
                        title={collapsed ? t(label) : undefined}
                      >
                        <Icon size={20} />
                        <span className="sidebar-label truncate">{t(label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="sidebar-recent-panel sidebar-collapsible-panel mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                  {t("sidebar.recentProjects")}
                </p>
                <Folder size={16} className="text-orange-300" />
              </div>
              <div className="mt-3 grid gap-2">
                {recentProjects.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 p-3 text-xs text-zinc-500">
                    {t("sidebar.noRecentProjects")}
                  </p>
                ) : recentProjects.map((project) => {
                  const tone = normalizeStatus(project.projectStatus);
                  const progress = projectProgress(project.projectStatus);

                  return (
                    <div key={project.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <button
                        type="button"
                        onClick={() => openScreen("history")}
                        className="flex w-full items-start gap-2 text-left"
                      >
                        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusMeta[tone]}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-white">
                            {project.customer?.name || project.displayCategory || t("sidebar.project")}
                          </span>
                          <span className="block truncate text-xs text-zinc-500">
                            {translateText(project.projectStatus || "Ny förfrågan", language)}
                          </span>
                        </span>
                      </button>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-orange-400" style={{ width: `${progress}%` }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePinned(project.id)}
                          className={`rounded-lg p-1.5 ${pinnedProjectIds.includes(project.id) ? "text-orange-300" : "text-zinc-600"}`}
                          aria-label={t("sidebar.pinProject")}
                        >
                          <Pin size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="sidebar-nav-item w-full"
              >
                <span className="relative">
                  <Bell size={20} />
                  {notifications.length > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-400 ring-2 ring-zinc-950" />}
                </span>
                <span className="sidebar-label">{t("sidebar.notifications")}</span>
              </button>
              {notificationsOpen && (
                <div className="sidebar-notification-popover sidebar-collapsible-panel absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-2xl shadow-black/50">
                  <div className="grid gap-2">
                    {notifications.map((item) => (
                      <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${statusMeta[item.tone] || statusMeta.active}`} />
                          <p className="text-sm font-black text-white">{item.title}</p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar-theme-toggle sidebar-collapsible-panel mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-black/35 p-1">
              {["dark", "light", "system"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onThemeChange(mode)}
                  className={`flex min-h-10 items-center justify-center rounded-xl text-xs font-black transition ${
                    theme === mode ? "bg-orange-400 text-black" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {mode === "system" ? <SunMoon size={15} /> : t(`sidebar.theme.${mode}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="app-shell-main">
        {children}
      </main>
    </div>
  );
}

function QuickAction({ collapsed, icon: Icon, label, onClick }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="sidebar-quick-action"
      title={collapsed ? t(label) : undefined}
    >
      <Icon size={17} />
      <span className="sidebar-label">{t(label)}</span>
    </button>
  );
}
