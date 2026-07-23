import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

const GET_VARIANTS_QUERY = `
  query GetVariants($handle: String!) {
    product(handle: $handle) {
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type VariantsData = {
  product: {
    variants: {
      nodes: { id: string; title: string; availableForSale: boolean }[];
    };
  } | null;
};

type CartCreateData = {
  cartCreate: {
    cart: { checkoutUrl: string } | null;
    userErrors: { field: string; message: string }[];
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      items: { slug: string; qty: number; size?: string }[];
      customer?: {
        name: string;
        email: string;
        phone: string;
        address: { line1: string; line2?: string; city: string; state: string; pincode: string };
      };
    };

    if (!body.items?.length) {
      return NextResponse.json({ error: "missing_items" }, { status: 400 });
    }

    const lines: { merchandiseId: string; quantity: number }[] = [];

    for (const item of body.items) {
      const data = await shopifyFetch<VariantsData>(GET_VARIANTS_QUERY, { handle: item.slug });

      if (!data.product) {
        return NextResponse.json(
          { error: `product_not_found:${item.slug}` },
          { status: 400 },
        );
      }

      const variants = data.product.variants.nodes;
      // Match by size title if provided (e.g. rings/bangles), else take first variant
      const variant =
        (item.size ? variants.find(v => v.title === item.size) : null) ??
        variants.find(v => v.availableForSale) ??
        variants[0];

      if (!variant) {
        return NextResponse.json(
          { error: `no_variant:${item.slug}` },
          { status: 400 },
        );
      }

      lines.push({ merchandiseId: variant.id, quantity: item.qty });
    }

    // Optionally pre-fill buyer identity if caller provides customer details
    let buyerIdentity: Record<string, unknown> = {};
    if (body.customer) {
      const [firstName, ...rest] = body.customer.name.trim().split(" ");
      buyerIdentity = {
        email: body.customer.email,
        phone: body.customer.phone,
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              firstName,
              lastName:  rest.join(" ") || ".",
              address1:  body.customer.address.line1,
              address2:  body.customer.address.line2 ?? "",
              city:      body.customer.address.city,
              province:  body.customer.address.state,
              zip:       body.customer.address.pincode,
              country:   "IN",
              phone:     body.customer.phone,
            },
          },
        ],
      };
    }

    const cartData = await shopifyFetch<CartCreateData>(CART_CREATE_MUTATION, { lines, buyerIdentity });

    if (cartData.cartCreate.userErrors.length > 0) {
      console.error("[shopify-checkout] cart errors:", cartData.cartCreate.userErrors);
      return NextResponse.json({ error: "cart_creation_failed" }, { status: 400 });
    }

    const checkoutUrl = cartData.cartCreate.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "no_checkout_url" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("[shopify-checkout]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
