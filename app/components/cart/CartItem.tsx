"use client";
import { ChangeEvent, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { LineItem } from "@lib/types";
import usePrice from "@lib/hooks/use-price";

import { EditItemQuantityButton } from "./EditCart";
import { DeleteItemButton } from "./DeleteButton";
type ItemOption = {
  name: string;
  nameId: number;
  value: string;
  valueId: number;
};

const placeholderImg = "/product-img-placeholder.svg";

const CartItem = ({
  item,

  currencyCode,
  ...rest
}: {
  item: LineItem;
  currencyCode: string;
}) => {
  const max = 6;
  const [removing, setRemoving] = useState(false);
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const { price } = usePrice({
    amount: item.variant.price?.value ?? 1 * item.quantity,
    baseAmount: item.variant.price?.retailPrice ?? 1 * item.quantity,
    currencyCode,
  });

  // TODO: Add a type for this
  const options = (item as any).options;

  useEffect(() => {
    // Reset the quantity state if the item quantity changes
    if (item.quantity !== Number(quantity)) {
      setQuantity(item.quantity);
    }
  }, [item.quantity]);

  return (
    <li
      className={`flex flex-col py-4 ${
        removing ? "opacity-50 pointer-events-none" : ""
      }`}
      {...rest}
    >
      <div className="flex flex-row space-x-4 py-4">
        <div className="w-16 h-16 bg-violet relative overflow-hidden cursor-pointer">
          <Link href={`/product/${item.path}`}>
            <Image
              //onClick={() => closeSidebarIfPresent()}
              // className={s.productImage}
              className="w-full h-full object-cover"
              width={64}
              height={64}
              src={item.variant.image?.url || placeholderImg}
              alt={item.variant.image?.alt || "Product Image"}
            />
          </Link>
        </div>
        <div className="flex-1 flex flex-col text-secondary">
          <Link href={`/product/${item.path}`}>
            <span
              // className={s.productName}
              className="font-medium cursor-pointer pb-1 mt-[-4px]"
            >
              {item.name}
            </span>
          </Link>
          {options && options.length > 0 && (
            <div className="flex items-center pb-1">
              {options.map((option: ItemOption, i: number) => (
                <div
                  key={`${item.id}-${option.name}`}
                  className="text-sm font-semibold text-secondary-3 inline-flex items-center justify-center"
                >
                  {option.name}
                  {option.name === "Color" ? (
                    <span
                      className="mx-2 rounded-full bg-transparent border w-5 h-5 p-1 text-secondary inline-flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: `${option.value}`,
                      }}
                    ></span>
                  ) : (
                    <span className="mx-2 rounded-full bg-transparent border h-5 p-1 text-secondary inline-flex items-center justify-center overflow-hidden">
                      {option.value}
                    </span>
                  )}
                  {i === options.length - 1 ? "" : <span className="mr-3" />}
                </div>
              ))}
            </div>
          )}

          <div className="text-sm tracking-wider">{quantity}x</div>
        </div>
        <div className="flex flex-col justify-between space-y-2 text-sm">
          <span>{price}</span>
        </div>
      </div>

      <div className="flex flex-row h-9">
        <button
          //className={s.actions}
          className="flex p-1 border-primary-2 border items-center justify-center hover:bg-primary-2 disabled:cursor-not-allowed"
          // onClick={handleRemove}
        >
          <DeleteItemButton item={item} />
        </button>
        <label className="w-full border-primary-2 border ml-2">
          <input
            //className={s.input}
            className="bg-transparent px-4 w-full h-full focus:outline-none select-none pointer-events-auto"
            // onChange={(e) =>
            //   Number(e.target.value) < max + 1 ? handleChange(e) : () => {}
            // }
            value={quantity}
            type="number"
            max={max}
            min="0"
            readOnly
          />
        </label>
        <button
          type="button"
          // onClick={() => increaseQuantity(-1)}
          className="flex p-1 border-primary-2 border items-center justify-center hover:bg-primary-2 disabled:cursor-not-allowed"
          // className={s.actions}
          style={{ marginLeft: "-1px" }}
          disabled={quantity <= 1}
        >
          <EditItemQuantityButton item={item} type="minus" />
        </button>
        <button
          type="button"
          // onClick={() => increaseQuantity(1)}
          className="flex p-1 border-primary-2 border items-center justify-center hover:bg-primary-2 disabled:cursor-not-allowed"
          // className={cn(s.actions)}
          style={{ marginLeft: "-1px" }}
          disabled={quantity < 1 || quantity >= max}
        >
          <EditItemQuantityButton item={item} type="plus" />
        </button>
      </div>
    </li>
  );
};

export default CartItem;