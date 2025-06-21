import {
  LucideIcon,
  FileChartColumnIncreasing,
  Book,
  User,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          href: "/dashboard/manage-analysis",
          label: "Manage Analysis",
          icon: Book,
        },
        {
          href: "/dashboard/account",
          label: "Account",
          icon: User,
        },
      ],
    },
  ];
}
