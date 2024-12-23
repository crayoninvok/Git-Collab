export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  refCode: string;
  points: number;
  percentage: number;
  userCoupon?: {
    id: number;
    expiredAt: string;
    isRedeem: boolean;
  };
}
export interface IPromotor {
  name: string;
  email: string;
  avatar: string;
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
  UserCoupon?: {
    id: number;
    expiredAt: string;
    isRedeem: boolean;
  };
  userCouponId?: number;
}

export interface Order {
  id: number;
  totalPrice: number;
  finalPrice: number;
  paymentProof?: string;
  status: "PAID" | "CANCELED" | "PENDING";
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  eventId?: number;
  user?: IUser;
  details: OrderDetail[];
}
