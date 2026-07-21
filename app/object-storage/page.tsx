import type { Metadata } from "next"
import { ObjectStorageHub } from "@/packages/ui/components/Layouts/ObjectStorage/object-storage-hub"
import { getObjectStoragePlans } from "@/packages/core/products/billing-service"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { OBJECT_STORAGE_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

export const metadata: Metadata = {
  title: "Object Storage",
  description:
    "S3-compatible object storage with generous free egress, self-service access keys, and 99.99% enterprise-grade reliability.",
}

export default async function ObjectStoragePage() {
  const hub = await getCategoryHub(OBJECT_STORAGE_HUB_SLUGS)
  const categorySlugs = hub?.children.map((c) => c.slug) ?? []

  const plansByCategory = await Promise.all(categorySlugs.map((slug) => getObjectStoragePlans(slug)))
  const plans = plansByCategory.flat()

  return <ObjectStorageHub plans={plans} />
}
