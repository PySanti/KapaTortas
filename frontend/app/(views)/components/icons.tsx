import { FcGoogle } from 'react-icons/fc';
import { VscStarFull } from 'react-icons/vsc';
import {
  Ban,
  CalendarDays,
  ChevronLeft,
  ClipboardPenLine,
  CreditCard,
  Loader2,
  LogOut,
  MapPin,
  Package,
  ShoppingCart,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  ban: Ban,
  booking: ClipboardPenLine,
  calendario: CalendarDays,
  chevronLeft: ChevronLeft,
  direccion: MapPin,
  estrella: VscStarFull,
  google: FcGoogle,
  logout: LogOut,
  paquete: Package,
  shoppingCart: ShoppingCart,
  spinner: Loader2,
  tarjeta: CreditCard,
  usuario: User,
  wallet: Wallet,
};
