export interface IUser {
  id: string;
  username: string;
  email: string;
  refCode: string;
  avatar: string | null;
  points: number;
  userCouponId: number;
  percentage: number;
  userCoupon: string;
}
export interface IPromotor {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export type UserType = "user" | "promotor" | null;

export interface SessionContext {
  isAuth: boolean;
  type: UserType | null;
  user: IUser | null;
  promotor: IPromotor | null;
  checkSession: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  category: "Music" | "Orchestra" | "Opera" | "Other";
  location: "Bandung" | "Bali" | "Surabaya" | "Jakarta";
  venue: string;
  description: string;
  date: Date;
  time: Date;
  tickets: Ticket[];
  isPurchased?: boolean;
  ticketsSold: number;
  revenue: number;
  profitPercentage: number;
}

export interface Ticket {
  id: number;
  category: string;
  price: number;
  quantity: number;
  eventId?: number;
  orderDetailId?: number;
}

export interface Order {
  id: number;
  totalPrice: number;
  finalPrice: number;
  status: "PENDING" | "PAID" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  event: Event;
  details: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  quantity: number;
  tickets: Ticket[];
}

export interface PaymentData {
  ticketId: number;
  quantity: number;
  totalPrice: number;
  finalPrice: number;
  pointsRedeemed?: number;
  percentage?: number;
}

// interface UserTicket {
//   id: number;
//   eventId: number;
//   event: {
//     title: string;
//     thumbnail: string;
//     date: string;
//     venue: string;
//   };
//   status: "PENDING" | "PAID" | "CANCELED";
//   details: {
//     tickets: {
//       category: string;
//       price: number;
//     }[];
//     quantity: number;
//   }[];
//   totalPrice: number;
//   finalPrice: number;
//   createdAt: string;
// }
