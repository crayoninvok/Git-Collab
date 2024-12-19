export interface IUser {
  username: string;
  email: string;
  avatar: string;
  refCode: string;
  percentage: number;
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
  userCouponId?: number;
}
