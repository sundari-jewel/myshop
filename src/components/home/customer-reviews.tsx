import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Aarohi Temple Necklace is absolutely stunning. Every detail is so intricate and the craftsmanship is impeccable. It was perfect for my daughter's wedding.",
    avatar: "/assets/Ellipse_10_3.png",
    product: "Aarohi Temple Necklace",
    verified: true,
  },
  {
    id: 2,
    name: "Ananya Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "I purchased the diamond hoops for my anniversary and my husband was speechless. The quality and shine are beyond what I expected at this price point.",
    avatar: "/assets/Ellipse_10_4.png",
    product: "Noor Diamond Hoops",
    verified: true,
  },
  {
    id: 3,
    name: "Deepika Menon",
    location: "Bengaluru",
    rating: 5,
    text: "Sundari's pieces have the perfect balance of traditional and modern. The packaging was luxurious too. Will definitely be a repeat customer!",
    avatar: "/assets/Ellipse_10_5.png",
    product: "Vanya Polki Drops",
    verified: true,
  },
  {
    id: 4,
    name: "Kavya Iyer",
    location: "Chennai",
    rating: 5,
    text: "The gold stack ring is so elegant for daily wear. Light, durable, and the 18K purity is clear. Exactly what I was looking for.",
    avatar: "/assets/Ellipse_10_6.png",
    product: "Ira Gold Stack Ring",
    verified: true,
  },
  {
    id: 5,
    name: "Ritu Agarwal",
    location: "Delhi",
    rating: 5,
    text: "Purchased the bridal set for my niece. The ceremony and reception looks were both perfection. The quality and finish gave us complete confidence.",
    avatar: "/assets/Ellipse_10_7.png",
    product: "Meera Pearl Choker",
    verified: true,
  },
] as const;

const REVIEW_TRACKS = [
  [...REVIEWS, ...REVIEWS],
  [...REVIEWS.slice(2), ...REVIEWS.slice(0, 2), ...REVIEWS],
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? "#ffb42d" : "none"}
          stroke="#ffb42d"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function CustomerReviews() {
  return (
    <section className="overflow-hidden py-8 sm:py-10" style={{ background: "var(--bg-dark)" }}>
      <div className="mb-8 flex items-center justify-center gap-5 sm:gap-7">
        <span className="hidden h-px w-28 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
        <h2 className="display-font text-center text-[2.2rem] font-semibold italic leading-none tracking-[0.08em] text-[var(--gold)] drop-shadow-[0_2px_1px_rgba(70,40,0,0.32)] sm:text-[2.75rem]">
          Customers Review
        </h2>
        <span className="hidden h-px w-28 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent sm:block" />
      </div>

      <div className="review-carousel space-y-12">
        {REVIEW_TRACKS.map((track, trackIndex) => (
          <div
            key={trackIndex}
            className={`review-track ${trackIndex === 1 ? "review-track-reverse" : ""}`}
          >
            {track.map((review, index) => (
              <article
                key={`${trackIndex}-${review.id}-${index}`}
                className="review-frame"
                aria-label={`Review from ${review.name}`}
              >
                <div className="review-frame-content">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full shadow-[0_3px_10px_rgba(40,24,10,0.22)]">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold leading-5 text-[var(--cream)]">
                      My experience was amazing after purchasing this product. I was eagerly waiting to buy this. Price and quality is amazing you can buy it. It&apos;s give a tough competition to gold products.
                    </p>
                    <div className="mt-3">
                      <StarRating count={review.rating} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-dim)]">
        <span>4.9 rated</span>
        <span className="h-px w-9 bg-[var(--gold)]" />
        <span>2,400+ reviews</span>
      </div>
    </section>
  );
}
