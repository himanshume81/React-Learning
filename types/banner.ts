export type Banner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  featuredRank: number | null;
};

export type BannerInput = {
  title: string;
  description: string;
  imageUrl: string;
  featuredRank: number | null;
};
