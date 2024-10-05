import prisma, { Product, Collection } from "@lib/prisma";
//import { cookies } from "next/headers";

//import { getCart } from "@lib/services";
//import { getCart } from "@lib/services/prismaServices";
//import { unstable_cache } from "next/cache";
import { TAGS } from "@lib/const";
import { getCartItem, getCartByIdUtil } from "@lib/actions/actions";
export { getCartItem, getCartByIdUtil };
interface Rule {
  field: string;
  condition: string;
  value: string;
}
export type ProductFields = keyof Product;
function isValidField(field: string): field is ProductFields {
  return [
    "name",
    "description",
    // "descriptionHtml",
    "sku",
    "slug",
    //"path",
    "vendor",
    "tags",
  ].includes(field);
}
export async function applyCollectionRules(collectionId: string) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: { rules: true },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  const products = await prisma.product.findMany();

  const matchingProducts = products.filter((product: any) => {
    return collection.rules.every((rule) => {
      if (!isValidField(rule.field)) {
        console.warn(`Field ${rule.field} is not valid on the product.`);
        return false;
      }

      const fieldValue = product[rule.field];
      if (typeof fieldValue != "string") {
        return false;
      }

      switch (rule.condition) {
        case "equals":
          return fieldValue === rule.value;
        case "contains":
          return fieldValue?.includes(rule.value);
        case "startsWith":
          return fieldValue?.startsWith(rule.value);
        case "endsWith":
          return fieldValue?.endsWith(rule.value);
        default:
          return false;
      }
    });
  });

  await prisma.productCollection.deleteMany({
    where: { collectionId },
  });

  await prisma.productCollection.createMany({
    data: matchingProducts.map((product) => ({
      productId: product.id,
      collectionId,
    })),
  });
}

// const getCartItem = unstable_cache(
//   async (id) => {
//     const cart = await getCart(id);
//     // const subtotalPrice = cart.items.reduce((total, item) => {
//     //   return (total += item.variant.price);
//     // }, 0);
//     // const totalPrice = subtotalPrice + (subtotalPrice * 15) / 100;
//     let cartC = addComputedCartPrices(cart);
//     // return { ...cart, subtotalPrice, totalPrice, currency: "ETB" };
//     return cartC;
//   },
//   [],
//   {
//     tags: [TAGS.cart],
//   }
// );

// export async function getCartByIdUtil() {
//   const cartId = cookies().get("cartId")?.value;
//   let cart;

//   if (cartId) {
//     cart = await getCartItem(cartId);
//   }
//   return cart;
// }
export function addComputedCartPrices(cart: any) {
  const subtotalPrice = cart?.items?.reduce((total: any, item: any) => {
    return (total += item.variant.price);
  }, 0);
  const delivery =
    cart?.deliveryMethod == "fedex"
      ? 10
      : cart?.deliveryMethod == "dhl"
      ? 15
      : 0;
  const totalPrice = subtotalPrice + (subtotalPrice * 15) / 100 + delivery;
  return {
    ...cart,
    subtotalPrice,
    totalPrice,
    currency: cart.currency ?? "ETB",
  };
}

export function rangeMap(n: number, fn: (i: number) => any) {
  const arr = [];
  while (n > arr.length) {
    arr.push(fn(arr.length));
  }
  return arr;
}
export function formatPrice({
  amount,
  currencyCode,
  locale,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  return formatCurrency.format(amount);
}

export function encodeProductName(productName: string): string {
  return encodeURIComponent(productName.replace(/\s+/g, "-").toLowerCase());
}

export function decodeProductName(urlParam: string): string {
  return decodeURIComponent(urlParam.replace(/-/g, " ")).toLowerCase();
}
export function convertToSlug(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters except spaces
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .toLowerCase(); // Convert to lowercase
}