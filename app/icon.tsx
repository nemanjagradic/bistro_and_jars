import { brandImage } from "./lib/brand-image";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return brandImage(size, 2);
}
