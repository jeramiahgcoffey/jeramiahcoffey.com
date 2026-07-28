import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE_ALT, SocialImage } from "@/lib/social-image";

export const alt = SOCIAL_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialImage />, size);
}
