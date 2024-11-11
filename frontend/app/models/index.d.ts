import { Icons } from '../(views)/components/icons';
import type { Icon } from '../(views)/components/icons';

export type MainNavItem = {
  title: string;
  href: string;
};

export type FeatureItem = {
  name: string;
  description: string;
  icon: keyof typeof Icons;
};

export type StatItem = {
  description: string;
  value: string;
};

export type TestimonialItem = {
  author: {
    name: string;
    imageUrl: string;
  };
  rating: number;
  body: string;
};

export type MarketingConfig = {
  mainNav: mainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  href: string;
  icon?: keyof typeof Icons;
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};
