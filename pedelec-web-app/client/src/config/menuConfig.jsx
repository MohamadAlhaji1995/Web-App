export const menuItems = [
  { path: "/", label: "Home", icon: "fas fa-home" },
  {
    path: "/Dashboard",
    label: "Dashboard",
    icon: "fas fa-chart-line",
    adminOnly: true,
  },
  {
    path: "/rep-zeigen",
    label: "Reparaturanfragen anzeigen",
    icon: "fas fa-wrench",
    adminOnly: true,
  },
  {
    path: "/warenkorb",
    label: "Warenkorb",
    icon: "fas fa-shopping-cart",
    authenticated: true,
  },
  {
    path: "/reparatur-anfrage",
    label: "ReparaturAnfrage",
    icon: "fas fa-tools",
    authenticated: true,
  },
];
