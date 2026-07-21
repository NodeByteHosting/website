import { makeOGBackgroundTemplate } from '../../_og/image-generator'

export async function GET() {
  return makeOGBackgroundTemplate()
}
