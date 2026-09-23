import reviewsManifest from "./reviews.json";

export type Review = {
  id: string;
  name: string;
  stars: number;
  text: string;
};

export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://share.google/Vvij6HRcQcacRW1bp";

const reviews = reviewsManifest as Review[];

export function getReviews(): Review[] {
  return reviews;
}
