import { OG_CONFIGS, OG_CONTENT_TYPE, OG_SIZE, makeOGImage } from '../_og/image-generator'

export const alt = 'NodeByte Hosting — Brand & Press Kit'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return makeOGImage(OG_CONFIGS.brand)
}
