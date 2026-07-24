import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

/* -- Home sections -- */
import { HeroSection }        from "@/components/home/hero-section";
import { ShopByCategory }     from "@/components/home/shop-by-category";
import { ArchivalCollection } from "@/components/home/archival-collection";
import { ShopByGender }       from "@/components/home/shop-by-gender";
// import { FeatureBanners }     from "@/components/home/feature-banners";
import { WeddingShop }        from "@/components/home/wedding-shop";
import { WatchesAndRakhi }    from "@/components/home/watches-and-rakhi";
import { TopSelling }         from "@/components/home/top-selling";
import { getTopSellingProducts } from "@/lib/shopify-admin";
import { CustomerReels }      from "@/components/home/customer-reels";
import { CustomerReviews }    from "@/components/home/customer-reviews";

export const metadata: Metadata = createMetadata({
  description:
    "Sundari Jewellers - Shop fine gold, diamond, and bridal jewellery. Handcrafted pieces celebrating the art of Indian heritage.",
});

/* ISR - revalidate every 5 minutes */
export const revalidate = 300;

export default async function HomePage() {
  const topSelling = await getTopSellingProducts();

  return (
    <>
      <HeroSection />
      <ShopByCategory />
      <ArchivalCollection />
      <TopSelling products={topSelling} />
      <WatchesAndRakhi />
      <ShopByGender />
      {/* <FeatureBanners /> */}
      <WeddingShop />
      <CustomerReels />
      <CustomerReviews />
    </>
  );
}
