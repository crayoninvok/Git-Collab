export interface PromotorEvent {
    id: string;
    category: string;
    title: string;
    description: string;
    date: string; 
    location: string;
    ticketSold: number;
    totalRevenue: number;
    profit: number; 
    bannerImage: string;
  }
  
  export const dummyDataForPromotor: PromotorEvent[] = [
    {
      id: "1",
      category: "Music",
      title: "Westlife: The Wild Dreams Tour",
      description:
        "Experience an unforgettable night with Westlife as they perform their greatest hits in Jakarta.",
      date: "2024-08-15T19:00:00Z",
      location: "Jakarta International Expo, Kemayoran",
      ticketSold: 15000,
      totalRevenue: 7500000000,
      profit: 80,
      bannerImage:
        "https://res.cloudinary.com/dxpeofir6/image/upload/v1734584147/events/nbhrstag1uyacmo0rl0q.jpg",
    },
    {
      id: "2",
      category: "Music",
      title: "Cigarettes After Sex: Asia Tour 2024",
      description:
        "An intimate performance by Cigarettes After Sex, bringing their dreamy sound to Bali.",
      date: "2024-09-10T20:00:00Z",
      location: "Bali Convention Center, Nusa Dua",
      ticketSold: 12000,
      totalRevenue: 6000000000,
      profit: 85,
      bannerImage:
        "https://res.cloudinary.com/dxpeofir6/image/upload/v1734533628/events/hfpja4koaygimy26px2h.jpg",
    },
    {
      id: "3",
      category: "Orchestra",
      title: "The Anime Symphony: A Journey Through Music",
      description:
        "Dive into the world of anime with a full orchestra performing iconic soundtracks.",
      date: "2024-07-20T18:00:00Z",
      location: "Pakuwon Mall, Surabaya",
      ticketSold: 5000,
      totalRevenue: 2000000000,
      profit: 65,
      bannerImage:
        "https://res.cloudinary.com/dxpeofir6/image/upload/v1734685261/animesimponi_gw6cfb.jpg",
    },
    {
      id: "4",
      category: "Theater",
      title: "JKT48: Aturan Anti Cinta",
      description:
        "Witness a captivating theatrical performance by JKT48 that explores love and conflict.",
      date: "2024-06-05T14:00:00Z",
      location: "Teater JKT48, FX Sudirman, Jakarta",
      ticketSold: 3000,
      totalRevenue: 1200000000,
      profit: 50,
      bannerImage:
        "https://res.cloudinary.com/dxpeofir6/image/upload/v1734685261/Capture_gfh53y.jpg",
    },
    {
      id: "5",
      category: "Sports",
      title: "MXGP of Indonesia: Samota Circuit",
      description:
        "The world's best motocross riders compete in the breathtaking Samota Circuit.",
      date: "2024-10-12T10:00:00Z",
      location: "Rocket Motor Circuit, Samota, Sumbawa",
      ticketSold: 8000,
      totalRevenue: 4000000000,
      profit: 70,
      bannerImage:
        "https://res.cloudinary.com/dxpeofir6/image/upload/v1734685261/mxgp_nikf98.jpg",
    },
  ];
  