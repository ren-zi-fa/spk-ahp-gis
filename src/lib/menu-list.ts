import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  FileChartColumnIncreasing,
  Book,
  SquareChartGantt,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Create Analysis",
          icon: FileChartColumnIncreasing,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Manage Data",
      menus: [
        {
          href: "/all-analysis",
          label: "Analysis",
          icon: Book,
        },
        {
          href: "/all-result",
          label: "Results",
          icon: SquareChartGantt,
        },
      ],
    },
  ];
}
