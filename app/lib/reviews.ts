import reviewsManifest from "./reviews.json";

export type Review = {
  id: string;
  name: string;
  stars: number;
  text: string;
};

export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/maps/place/Bistro+%26+Jars+Coffee+Bar/@44.8286295,20.3995135,17z/data=!4m8!3m7!1s0x475a6548b2e7dd8f:0x3ae56a561768f67f!8m2!3d44.8286295!4d20.4020884!9m1!1b1!16s%2Fg%2F11vy7cw3l1?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";

const reviews = reviewsManifest as Review[];

export function getReviews(): Review[] {
  return reviews;
}
