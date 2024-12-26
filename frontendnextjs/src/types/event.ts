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
}

export interface Ticket {
  id: number;
  category: string;
  price: number;
  quantity: number;
  eventId?: number;
  orderDetailId?: number;
}

export interface OrderDetail {
  id: number;
  quantity: number;
  orderId?: number;
  tickets: Ticket[];
  userCouponId?: number;
}
