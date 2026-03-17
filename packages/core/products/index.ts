export type { ProductEntry, ProductType, StockStatus } from "./types"
export {
  getAllProducts,
  getProductsByType,
  getProductsByCategory,
  isCategoryOutOfStock,
  getCategoryStartingPrice,
} from "./service"
