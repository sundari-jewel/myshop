# PRD Appendices
## Jewellery Brand E-Commerce Platform

---

## Appendix A — Prisma Database Schema

Full relational schema. Run `npx prisma migrate dev` to apply.

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum Role {
  SUPER_ADMIN
  CATALOGUE_MANAGER
  ORDERS_MANAGER
  MARKETING_MANAGER
  SUPPORT_AGENT
  FINANCE_ADMIN
  CONTENT_EDITOR
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

enum Gender {
  WOMEN
  MEN
  UNISEX
  KIDS
}

enum MetalType {
  GOLD
  SILVER
  PLATINUM
  ROSE_GOLD
  WHITE_GOLD
  PALLADIUM
  MIXED
}

enum CertificationBody {
  GIA
  IGI
  HRD
  BIS
  NONE
}

enum OrderStatus {
  PENDING_PAYMENT
  PAYMENT_FAILED
  PAYMENT_CONFIRMED
  PROCESSING
  PACKED
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  ON_HOLD
  PARTIALLY_REFUNDED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  AUTHORISED
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
  VOIDED
}

enum PaymentMethod {
  CARD
  UPI
  NET_BANKING
  WALLET
  EMI
  BNPL
  COD
  GIFT_CARD
  STORE_CREDIT
  PAYPAL
}

enum ReturnStatus {
  REQUESTED
  APPROVED
  REJECTED
  PICKUP_SCHEDULED
  PICKED_UP
  RECEIVED
  INSPECTED
  REFUND_ISSUED
  EXCHANGE_INITIATED
  CLOSED
}

enum RefundMode {
  ORIGINAL_PAYMENT_METHOD
  STORE_CREDIT
  BANK_TRANSFER
}

enum ShippingCarrier {
  BLUEDART
  DTDC
  DELHIVERY
  EKART
  INDIA_POST
  FEDEX
  DHL
  UPS
}

enum DiscountType {
  PERCENTAGE
  FLAT_AMOUNT
  FREE_SHIPPING
  FREE_PRODUCT
  BUY_X_GET_Y
}

enum LoyaltyTier {
  BRONZE
  SILVER
  GOLD
  PLATINUM
}

enum OrderSource {
  WEB
  MOBILE_APP
  ADMIN
  POS
  API
}

enum NotificationChannel {
  EMAIL
  SMS
  WHATSAPP
  PUSH
}

enum MediaType {
  IMAGE
  VIDEO
  MODEL_3D
  DOCUMENT
}

// ─────────────────────────────────────────────
// USER / AUTH
// ─────────────────────────────────────────────

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  emailVerified     DateTime?
  phone             String?   @unique
  phoneVerified     DateTime?
  passwordHash      String?
  firstName         String
  lastName          String
  avatarUrl         String?
  dateOfBirth       DateTime?
  anniversary       DateTime?
  gender            Gender?
  isGuest           Boolean   @default(false)
  isActive          Boolean   @default(true)
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  gstin             String?   // for B2B customers

  // Relations
  accounts          OAuthAccount[]
  sessions          Session[]
  addresses         Address[]
  orders            Order[]
  cart              Cart?
  wishlist          WishlistItem[]
  reviews           Review[]
  loyaltyAccount    LoyaltyAccount?
  notificationPrefs NotificationPreference[]
  giftCards         GiftCard[]              @relation("GiftCardIssuedTo")
  referralCode      String?                 @unique
  referredBy        String?                 // referral code used
  tags              CustomerTag[]
  supportTickets    SupportTicket[]
  adminNotes        CustomerNote[]

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime? // soft delete

  @@index([email])
  @@index([phone])
  @@index([createdAt])
}

model OAuthAccount {
  id                String  @id @default(uuid())
  userId            String
  provider          String  // "google" | "facebook" | "apple"
  providerAccountId String
  accessToken       String?
  refreshToken      String?
  expiresAt         Int?
  tokenType         String?
  scope             String?
  idToken           String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  sessionToken String   @unique
  ipAddress    String?
  userAgent    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model AdminUser {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  role         Role
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?

  auditLogs    AuditLog[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

// ─────────────────────────────────────────────
// CATALOGUE
// ─────────────────────────────────────────────

model Category {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  metaTitle       String?
  metaDescription String?

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([slug])
  @@index([parentId])
}

model Collection {
  id              String             @id @default(uuid())
  name            String
  slug            String             @unique
  description     String?
  shortDescription String?
  heroImageUrl    String?
  isActive        Boolean            @default(true)
  isFeatured      Boolean            @default(false)
  sortOrder       Int                @default(0)
  publishedAt     DateTime?
  expiresAt       DateTime?
  metaTitle       String?
  metaDescription String?

  products        CollectionProduct[]
  rules           CollectionRule[]    // for dynamic collections

  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([slug])
}

model CollectionProduct {
  collectionId String
  productId    String
  sortOrder    Int     @default(0)

  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@id([collectionId, productId])
}

model CollectionRule {
  id           String     @id @default(uuid())
  collectionId String
  field        String     // "tag", "price", "metal_type", "category_id"
  operator     String     // "equals", "greater_than", "less_than", "contains"
  value        String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
}

model Product {
  id                  String          @id @default(uuid())
  sku                 String          @unique
  name                String
  slug                String          @unique
  description         Json?           // Portable text (Sanity) or Tiptap JSON
  shortDescription    String?
  
  // Pricing
  basePrice           Decimal         @db.Decimal(12, 2)
  salePrice           Decimal?        @db.Decimal(12, 2)
  costPrice           Decimal?        @db.Decimal(12, 2)
  taxClass            String          @default("GST_3") // GST_3, GST_5, GST_12, GST_18
  
  // Classification
  categoryId          String
  category            Category        @relation(fields: [categoryId], references: [id])
  collections         CollectionProduct[]
  tags                String[]
  occasions           String[]
  gender              Gender          @default(UNISEX)
  
  // Jewellery-specific
  metalType           MetalType
  metalPurity         String?         // "18K", "22K", "925 Sterling"
  metalWeight         Decimal?        @db.Decimal(8, 3)  // grams
  grossWeight         Decimal?        @db.Decimal(8, 3)  // grams
  stoneTypes          String[]
  stoneCarat          Decimal?        @db.Decimal(8, 3)
  stoneCut            String?
  stoneClarity        String?
  stoneColour         String?
  certificationNumber String?
  certificationBody   CertificationBody @default(NONE)
  certificationDocUrl String?
  makingCharge        Decimal?        @db.Decimal(12, 2)
  makingChargeType    String?         // "FLAT" | "PER_GRAM" | "PERCENTAGE"
  
  // Customisation
  isCustomisable      Boolean         @default(false)
  customisationConfig Json?           // engraving options, stone choices, etc.
  
  // Variants
  variants            ProductVariant[]
  optionTypes         ProductOptionType[]
  
  // Media
  media               ProductMedia[]
  
  // SEO
  metaTitle           String?
  metaDescription     String?
  canonicalUrl        String?
  structuredData      Json?
  
  // Flags
  status              ProductStatus   @default(DRAFT)
  isFeatured          Boolean         @default(false)
  isNewArrival        Boolean         @default(false)
  isLimitedEdition    Boolean         @default(false)
  allowOversell       Boolean         @default(false)
  publishedAt         DateTime?
  expiresAt           DateTime?       // for limited drops
  
  // Relations
  reviews             Review[]
  wishlistItems       WishlistItem[]
  orderItems          OrderItem[]
  cartItems           CartItem[]
  
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt
  createdBy           String?

  @@index([slug])
  @@index([categoryId])
  @@index([status])
  @@index([metalType])
  @@index([basePrice])
}

model ProductOptionType {
  id        String              @id @default(uuid())
  productId String
  name      String              // "Size", "Metal", "Stone Colour"
  position  Int                 @default(0)
  values    ProductOptionValue[]
  product   Product             @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductOptionValue {
  id           String           @id @default(uuid())
  optionTypeId String
  value        String           // "18K Yellow Gold", "7", "Ruby"
  displayName  String?
  colourHex    String?          // for swatch display
  imageUrl     String?
  position     Int              @default(0)
  optionType   ProductOptionType @relation(fields: [optionTypeId], references: [id], onDelete: Cascade)
  variantOptions VariantOption[]

  @@index([optionTypeId])
}

model ProductVariant {
  id              String          @id @default(uuid())
  productId       String
  sku             String          @unique
  barcode         String?
  name            String
  price           Decimal?        @db.Decimal(12, 2)
  salePrice       Decimal?        @db.Decimal(12, 2)
  costPrice       Decimal?        @db.Decimal(12, 2)
  stock           Int             @default(0)
  reservedStock   Int             @default(0)
  lowStockThreshold Int           @default(3)
  weight          Decimal?        @db.Decimal(8, 3)
  isDefault       Boolean         @default(false)
  isAvailable     Boolean         @default(true)
  metalWeight     Decimal?        @db.Decimal(8, 3)
  grossWeight     Decimal?        @db.Decimal(8, 3)

  options         VariantOption[]
  media           ProductMedia[]
  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  cartItems       CartItem[]
  orderItems      OrderItem[]
  inventoryLogs   InventoryLog[]
  notifyRequests  StockNotification[]

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([productId])
  @@index([sku])
  @@index([stock])
}

model VariantOption {
  variantId    String
  optionValueId String
  variant      ProductVariant   @relation(fields: [variantId], references: [id], onDelete: Cascade)
  optionValue  ProductOptionValue @relation(fields: [optionValueId], references: [id], onDelete: Cascade)

  @@id([variantId, optionValueId])
}

model ProductMedia {
  id          String     @id @default(uuid())
  productId   String?
  variantId   String?
  type        MediaType  @default(IMAGE)
  url         String
  cloudinaryId String?
  altText     String?
  width       Int?
  height      Int?
  sortOrder   Int        @default(0)
  isPrimary   Boolean    @default(false)

  product     Product?   @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant     ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([variantId])
}

model InventoryLog {
  id          String         @id @default(uuid())
  variantId   String
  change      Int            // positive = restock, negative = sale/reserve
  reason      String         // "SALE", "RETURN", "MANUAL_ADJUST", "IMPORT", "RESERVE", "RELEASE"
  reference   String?        // order ID, import batch ID, etc.
  stockBefore Int
  stockAfter  Int
  actorId     String?        // admin user or system
  createdAt   DateTime       @default(now())

  variant     ProductVariant @relation(fields: [variantId], references: [id])

  @@index([variantId])
  @@index([createdAt])
}

model StockNotification {
  id        String         @id @default(uuid())
  variantId String
  email     String
  phone     String?
  notified  Boolean        @default(false)
  notifiedAt DateTime?
  createdAt DateTime       @default(now())

  variant   ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@index([variantId])
  @@index([email])
}

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────

model Cart {
  id          String     @id @default(uuid())
  userId      String?    @unique
  sessionId   String?    @unique  // for guest carts
  email       String?
  items       CartItem[]
  couponCode  String?
  isGift      Boolean    @default(false)
  giftMessage String?
  giftWrapped Boolean    @default(false)
  
  user        User?      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  expiresAt   DateTime?

  @@index([sessionId])
}

model CartItem {
  id              String         @id @default(uuid())
  cartId          String
  productId       String
  variantId       String
  quantity        Int
  customisation   Json?          // engraving text, font, position
  unitPrice       Decimal        @db.Decimal(12, 2)  // price at time of add
  addedAt         DateTime       @default(now())

  cart            Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product         Product        @relation(fields: [productId], references: [id])
  variant         ProductVariant @relation(fields: [variantId], references: [id])

  @@index([cartId])
}

// ─────────────────────────────────────────────
// ADDRESS
// ─────────────────────────────────────────────

model Address {
  id           String   @id @default(uuid())
  userId       String?
  firstName    String
  lastName     String
  phone        String
  addressLine1 String
  addressLine2 String?
  city         String
  state        String
  pinCode      String
  country      String   @default("IN")
  isDefault    Boolean  @default(false)
  label        String?  // "Home", "Office"
  
  user         User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  shippingOrders Order[] @relation("ShippingAddress")
  billingOrders  Order[] @relation("BillingAddress")

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
}

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

model Order {
  id                  String        @id @default(uuid())
  orderNumber         String        @unique  // "JW-2026-000142"
  customerId          String?
  email               String
  phone               String
  source              OrderSource   @default(WEB)
  
  // Line items
  items               OrderItem[]
  
  // Address IDs (snapshot stored separately for immutability)
  shippingAddressId   String
  billingAddressId    String
  shippingAddressSnap Json          // immutable snapshot at order time
  billingAddressSnap  Json
  
  // Pricing
  subtotal            Decimal       @db.Decimal(12, 2)
  discountAmount      Decimal       @db.Decimal(12, 2) @default(0)
  couponCode          String?
  couponDiscount      Decimal       @db.Decimal(12, 2) @default(0)
  shippingCost        Decimal       @db.Decimal(12, 2) @default(0)
  taxAmount           Decimal       @db.Decimal(12, 2) @default(0)
  taxBreakdown        Json?         // {cgst: x, sgst: x, igst: x}
  totalAmount         Decimal       @db.Decimal(12, 2)
  currency            String        @default("INR")
  
  // Payment
  paymentMethod       PaymentMethod
  paymentStatus       PaymentStatus @default(PENDING)
  paymentReference    String?       // Stripe/Razorpay payment intent ID
  paymentGateway      String?       // "stripe" | "razorpay"
  payments            Payment[]
  
  // Fulfilment
  status              OrderStatus   @default(PENDING_PAYMENT)
  shippingCarrier     ShippingCarrier?
  trackingNumber      String?
  trackingUrl         String?
  estimatedDelivery   DateTime?
  shippedAt           DateTime?
  deliveredAt         DateTime?
  packingSlipUrl      String?
  shippingLabelUrl    String?
  
  // Gifting
  isGift              Boolean       @default(false)
  giftMessage         String?
  giftWrapped         Boolean       @default(false)
  hidePriceFromRecipient Boolean    @default(false)
  
  // Returns
  returns             Return[]
  
  // Notes
  customerNotes       String?
  internalNotes       String?
  
  // Invoice
  invoiceNumber       String?
  invoiceUrl          String?
  gstin               String?       // customer's GSTIN for B2B
  
  // Loyalty
  loyaltyPointsEarned Int           @default(0)
  loyaltyPointsUsed   Int           @default(0)
  
  // Store credit / gift card
  storeCreditUsed     Decimal       @db.Decimal(12, 2) @default(0)
  giftCardUsed        Decimal       @db.Decimal(12, 2) @default(0)
  
  // Relations
  customer            User?         @relation(fields: [customerId], references: [id])
  shippingAddress     Address       @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  billingAddress      Address       @relation("BillingAddress", fields: [billingAddressId], references: [id])
  statusHistory       OrderStatusHistory[]
  
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  @@index([orderNumber])
  @@index([customerId])
  @@index([status])
  @@index([createdAt])
  @@index([email])
}

model OrderItem {
  id              String         @id @default(uuid())
  orderId         String
  productId       String
  variantId       String
  sku             String
  name            String         // snapshot
  variantName     String         // snapshot
  imageUrl        String?        // snapshot
  quantity        Int
  unitPrice       Decimal        @db.Decimal(12, 2)
  totalPrice      Decimal        @db.Decimal(12, 2)
  taxRate         Decimal        @db.Decimal(5, 2)
  taxAmount       Decimal        @db.Decimal(12, 2)
  discountAmount  Decimal        @db.Decimal(12, 2) @default(0)
  customisation   Json?

  order           Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product        @relation(fields: [productId], references: [id])
  variant         ProductVariant @relation(fields: [variantId], references: [id])
  returnItems     ReturnItem[]

  @@index([orderId])
}

model OrderStatusHistory {
  id        String      @id @default(uuid())
  orderId   String
  status    OrderStatus
  note      String?
  actorId   String?     // admin user ID or "system"
  actorType String?     // "ADMIN" | "SYSTEM" | "CUSTOMER"
  createdAt DateTime    @default(now())

  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}

model Payment {
  id              String        @id @default(uuid())
  orderId         String
  amount          Decimal       @db.Decimal(12, 2)
  currency        String        @default("INR")
  status          PaymentStatus
  method          PaymentMethod
  gateway         String        // "stripe" | "razorpay"
  gatewayRef      String?       // gateway's transaction/charge ID
  gatewayResponse Json?
  refunds         Refund[]
  createdAt       DateTime      @default(now())

  order           Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([gatewayRef])
}

model Refund {
  id          String     @id @default(uuid())
  paymentId   String
  amount      Decimal    @db.Decimal(12, 2)
  reason      String
  mode        RefundMode
  status      String     // "PENDING" | "PROCESSED" | "FAILED"
  gatewayRef  String?
  processedAt DateTime?
  createdAt   DateTime   @default(now())

  payment     Payment    @relation(fields: [paymentId], references: [id])
  return      Return?    @relation(fields: [returnId], references: [id])
  returnId    String?

  @@index([paymentId])
}

// ─────────────────────────────────────────────
// RETURNS
// ─────────────────────────────────────────────

model Return {
  id               String       @id @default(uuid())
  returnNumber     String       @unique  // "RET-2026-000042"
  orderId          String
  customerId       String?
  status           ReturnStatus @default(REQUESTED)
  type             String       @default("RETURN") // "RETURN" | "EXCHANGE"
  reason           String
  reasonDetail     String?
  items            ReturnItem[]
  pickupAddress    Json?
  pickupScheduled  DateTime?
  pickedUpAt       DateTime?
  receivedAt       DateTime?
  inspectionNote   String?
  refundAmount     Decimal?     @db.Decimal(12, 2)
  refundMode       RefundMode?
  refunds          Refund[]
  exchangeOrderId  String?
  internalNotes    String?
  images           String[]     // customer-uploaded damage photos
  
  order            Order        @relation(fields: [orderId], references: [id])

  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([orderId])
  @@index([status])
}

model ReturnItem {
  id          String     @id @default(uuid())
  returnId    String
  orderItemId String
  quantity    Int
  reason      String

  return      Return     @relation(fields: [returnId], references: [id], onDelete: Cascade)
  orderItem   OrderItem  @relation(fields: [orderItemId], references: [id])

  @@index([returnId])
}

// ─────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────

model Coupon {
  id                  String       @id @default(uuid())
  code                String       @unique
  description         String?
  type                DiscountType
  value               Decimal      @db.Decimal(10, 2)  // % or flat amount
  minOrderValue       Decimal?     @db.Decimal(12, 2)
  maxDiscountAmount   Decimal?     @db.Decimal(12, 2)  // cap on % discounts
  usageLimit          Int?         // total uses allowed
  usageLimitPerUser   Int          @default(1)
  usedCount           Int          @default(0)
  isFirstOrderOnly    Boolean      @default(false)
  isActive            Boolean      @default(true)
  startsAt            DateTime?
  expiresAt           DateTime?
  applicableProducts  String[]     // product IDs (empty = all)
  applicableCollections String[]
  applicableUserIds   String[]     // empty = all users
  usages              CouponUsage[]

  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  @@index([code])
  @@index([isActive])
}

model CouponUsage {
  id        String   @id @default(uuid())
  couponId  String
  userId    String?
  orderId   String?
  usedAt    DateTime @default(now())

  coupon    Coupon   @relation(fields: [couponId], references: [id], onDelete: Cascade)

  @@index([couponId])
  @@index([userId])
}

// ─────────────────────────────────────────────
// GIFT CARDS
// ─────────────────────────────────────────────

model GiftCard {
  id              String   @id @default(uuid())
  code            String   @unique
  initialBalance  Decimal  @db.Decimal(12, 2)
  currentBalance  Decimal  @db.Decimal(12, 2)
  issuedToUserId  String?
  issuedToEmail   String?
  purchasedByUserId String?
  orderId         String?
  isActive        Boolean  @default(true)
  expiresAt       DateTime?
  transactions    GiftCardTransaction[]

  issuedTo        User?    @relation("GiftCardIssuedTo", fields: [issuedToUserId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([code])
}

model GiftCardTransaction {
  id          String   @id @default(uuid())
  giftCardId  String
  amount      Decimal  @db.Decimal(12, 2)
  type        String   // "CREDIT" | "DEBIT"
  orderId     String?
  note        String?
  createdAt   DateTime @default(now())

  giftCard    GiftCard @relation(fields: [giftCardId], references: [id], onDelete: Cascade)

  @@index([giftCardId])
}

// ─────────────────────────────────────────────
// LOYALTY
// ─────────────────────────────────────────────

model LoyaltyAccount {
  id           String                 @id @default(uuid())
  userId       String                 @unique
  points       Int                    @default(0)
  lifetimePoints Int                  @default(0)
  tier         LoyaltyTier            @default(BRONZE)
  transactions LoyaltyTransaction[]

  user         User                   @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt    DateTime               @default(now())
  updatedAt    DateTime               @updatedAt
}

model LoyaltyTransaction {
  id               String         @id @default(uuid())
  loyaltyAccountId String
  change           Int            // positive = earn, negative = redeem
  type             String         // "PURCHASE", "REVIEW", "REFERRAL", "BIRTHDAY", "REDEMPTION", "EXPIRY", "MANUAL"
  reference        String?        // order ID, review ID, etc.
  description      String?
  expiresAt        DateTime?
  createdAt        DateTime       @default(now())

  account          LoyaltyAccount @relation(fields: [loyaltyAccountId], references: [id], onDelete: Cascade)

  @@index([loyaltyAccountId])
  @@index([createdAt])
}

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

model Review {
  id               String   @id @default(uuid())
  productId        String
  userId           String
  orderId          String?
  rating           Int      // 1–5
  title            String?
  body             String
  images           String[] // Cloudinary URLs
  isVerifiedPurchase Boolean @default(false)
  isApproved       Boolean  @default(false)
  helpfulCount     Int      @default(0)
  response         String?  // brand response
  respondedAt      DateTime?

  product          Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  votes            ReviewVote[]

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([productId, userId, orderId])
  @@index([productId])
  @@index([userId])
  @@index([rating])
}

model ReviewVote {
  reviewId  String
  userId    String
  isHelpful Boolean

  review    Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@id([reviewId, userId])
}

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────

model WishlistItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  variantId String?
  addedAt   DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
}

// ─────────────────────────────────────────────
// SHIPPING CONFIG
// ─────────────────────────────────────────────

model ShippingZone {
  id          String         @id @default(uuid())
  name        String
  countries   String[]
  states      String[]       // for sub-national zones
  pinCodes    String[]       // specific pin code ranges
  rates       ShippingRate[]
  isActive    Boolean        @default(true)

  createdAt   DateTime       @default(now())
}

model ShippingRate {
  id              String       @id @default(uuid())
  zoneId          String
  name            String       // "Standard", "Express", "Same Day"
  carrier         ShippingCarrier?
  minWeight       Decimal?     @db.Decimal(8, 3)
  maxWeight       Decimal?     @db.Decimal(8, 3)
  price           Decimal      @db.Decimal(10, 2)
  freeThreshold   Decimal?     @db.Decimal(12, 2)  // free shipping over this order value
  estimatedDays   Int
  isCOD           Boolean      @default(false)
  isActive        Boolean      @default(true)

  zone            ShippingZone @relation(fields: [zoneId], references: [id], onDelete: Cascade)

  @@index([zoneId])
}

// ─────────────────────────────────────────────
// CMS / CONTENT
// ─────────────────────────────────────────────

model Banner {
  id           String   @id @default(uuid())
  placement    String   // "HOMEPAGE_HERO", "ANNOUNCEMENT_BAR", "COLLECTION_HERO", "PDP_BANNER"
  title        String?
  subtitle     String?
  ctaText      String?
  ctaUrl       String?
  imageUrl     String?
  videoUrl     String?
  bgColour     String?
  textColour   String?
  isActive     Boolean  @default(true)
  sortOrder    Int      @default(0)
  startsAt     DateTime?
  expiresAt    DateTime?
  mobileImageUrl String?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([placement, isActive])
}

model NavMenu {
  id       String       @id @default(uuid())
  handle   String       @unique  // "header-main", "footer-brand", "footer-help"
  name     String
  items    NavMenuItem[]
  updatedAt DateTime    @updatedAt
}

model NavMenuItem {
  id        String       @id @default(uuid())
  menuId    String
  label     String
  url       String?
  type      String       // "LINK" | "COLLECTION" | "PRODUCT" | "PAGE" | "EXTERNAL"
  targetId  String?
  parentId  String?
  position  Int          @default(0)
  children  NavMenuItem[] @relation("NavMenuItemHierarchy")
  parent    NavMenuItem?  @relation("NavMenuItemHierarchy", fields: [parentId], references: [id])
  menu      NavMenu      @relation(fields: [menuId], references: [id], onDelete: Cascade)

  @@index([menuId])
}

// ─────────────────────────────────────────────
// NOTIFICATIONS / PREFERENCES
// ─────────────────────────────────────────────

model NotificationPreference {
  id      String              @id @default(uuid())
  userId  String
  channel NotificationChannel
  type    String              // "ORDER_UPDATE", "PROMOTIONS", "RESTOCK", "NEWSLETTER"
  enabled Boolean             @default(true)

  user    User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, channel, type])
}

// ─────────────────────────────────────────────
// CUSTOMER SUPPORT
// ─────────────────────────────────────────────

model SupportTicket {
  id          String   @id @default(uuid())
  ticketNumber String  @unique
  userId      String?
  email       String
  subject     String
  category    String   // "ORDER", "RETURN", "PRODUCT", "PAYMENT", "OTHER"
  priority    String   @default("NORMAL")  // "LOW" | "NORMAL" | "HIGH" | "URGENT"
  status      String   @default("OPEN")    // "OPEN" | "IN_PROGRESS" | "PENDING_CUSTOMER" | "RESOLVED" | "CLOSED"
  channel     String   // "EMAIL" | "CHAT" | "WHATSAPP" | "PHONE"
  orderId     String?
  messages    TicketMessage[]
  assignedTo  String?
  resolvedAt  DateTime?
  csatScore   Int?     // 1–5 customer satisfaction

  user        User?    @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([email])
}

model TicketMessage {
  id        String        @id @default(uuid())
  ticketId  String
  body      String
  authorType String       // "CUSTOMER" | "AGENT" | "SYSTEM"
  authorId  String?
  attachments String[]
  isInternal Boolean      @default(false)
  createdAt DateTime      @default(now())

  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([ticketId])
}

model CustomerNote {
  id        String   @id @default(uuid())
  userId    String
  note      String
  authorId  String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CustomerTag {
  userId String
  tag    String   // "VIP", "HIGH_SPENDER", "AT_RISK", "INFLUENCER"

  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, tag])
}

// ─────────────────────────────────────────────
// AUDIT
// ─────────────────────────────────────────────

model AuditLog {
  id         String    @id @default(uuid())
  adminId    String
  action     String    // "CREATE_PRODUCT", "UPDATE_ORDER_STATUS", "ISSUE_REFUND", etc.
  entityType String    // "Product", "Order", "User", etc.
  entityId   String?
  before     Json?
  after      Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime  @default(now())

  admin      AdminUser @relation(fields: [adminId], references: [id])

  @@index([adminId])
  @@index([entityType, entityId])
  @@index([createdAt])
}

// ─────────────────────────────────────────────
// GOLD RATE
// ─────────────────────────────────────────────

model GoldRate {
  id        String   @id @default(uuid())
  date      DateTime @db.Date
  purity    String   // "22K", "18K", "24K"
  ratePerGram Decimal @db.Decimal(10, 2)
  source    String   @default("IBJA")
  createdAt DateTime @default(now())

  @@unique([date, purity])
  @@index([date])
}
```

---

## Appendix B — API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.3
info:
  title: Jewellery Brand E-Commerce API
  version: 1.0.0
  description: |
    Public REST API for the jewellery platform.
    All endpoints return JSON. Authentication via Bearer JWT.
    Rate limits: 300 req/min (authenticated), 60 req/min (unauthenticated).
  contact:
    email: api@yourbrand.com

servers:
  - url: https://yourbrand.com/api/v1
    description: Production

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        statusCode:
          type: integer

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer
        hasNext:
          type: boolean
        hasPrev:
          type: boolean

    Product:
      type: object
      properties:
        id:
          type: string
          format: uuid
        sku:
          type: string
        name:
          type: string
        slug:
          type: string
        shortDescription:
          type: string
        basePrice:
          type: number
        salePrice:
          type: number
          nullable: true
        currency:
          type: string
          default: INR
        metalType:
          type: string
          enum: [GOLD, SILVER, PLATINUM, ROSE_GOLD, WHITE_GOLD]
        metalPurity:
          type: string
        gender:
          type: string
          enum: [WOMEN, MEN, UNISEX, KIDS]
        category:
          $ref: '#/components/schemas/CategorySummary'
        images:
          type: array
          items:
            $ref: '#/components/schemas/ProductImage'
        variants:
          type: array
          items:
            $ref: '#/components/schemas/ProductVariant'
        rating:
          type: number
        reviewCount:
          type: integer
        isFeatured:
          type: boolean
        isNewArrival:
          type: boolean
        certification:
          type: string
          nullable: true
        status:
          type: string
          enum: [ACTIVE, DRAFT, ARCHIVED]

    ProductVariant:
      type: object
      properties:
        id:
          type: string
        sku:
          type: string
        name:
          type: string
        price:
          type: number
        salePrice:
          type: number
          nullable: true
        stock:
          type: integer
        isAvailable:
          type: boolean
        options:
          type: array
          items:
            type: object
            properties:
              name:
                type: string
              value:
                type: string

    ProductImage:
      type: object
      properties:
        url:
          type: string
        altText:
          type: string
        width:
          type: integer
        height:
          type: integer
        isPrimary:
          type: boolean

    CategorySummary:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        slug:
          type: string

    CartItem:
      type: object
      properties:
        id:
          type: string
        productId:
          type: string
        variantId:
          type: string
        productName:
          type: string
        variantName:
          type: string
        imageUrl:
          type: string
        quantity:
          type: integer
        unitPrice:
          type: number
        totalPrice:
          type: number
        customisation:
          type: object
          nullable: true

    Cart:
      type: object
      properties:
        id:
          type: string
        items:
          type: array
          items:
            $ref: '#/components/schemas/CartItem'
        subtotal:
          type: number
        discountAmount:
          type: number
        estimatedShipping:
          type: number
        estimatedTax:
          type: number
        total:
          type: number
        currency:
          type: string
        couponCode:
          type: string
          nullable: true
        itemCount:
          type: integer

    Order:
      type: object
      properties:
        id:
          type: string
        orderNumber:
          type: string
        status:
          type: string
        paymentStatus:
          type: string
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        subtotal:
          type: number
        discountAmount:
          type: number
        shippingCost:
          type: number
        taxAmount:
          type: number
        totalAmount:
          type: number
        currency:
          type: string
        trackingNumber:
          type: string
          nullable: true
        trackingUrl:
          type: string
          nullable: true
        estimatedDelivery:
          type: string
          format: date
          nullable: true
        createdAt:
          type: string
          format: date-time

    OrderItem:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        variantName:
          type: string
        sku:
          type: string
        imageUrl:
          type: string
        quantity:
          type: integer
        unitPrice:
          type: number
        totalPrice:
          type: number

paths:

  # ── PRODUCTS ───────────────────────────────────────

  /products:
    get:
      summary: List products
      tags: [Products]
      security: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 24
            maximum: 100
        - name: category
          in: query
          schema:
            type: string
          description: Category slug
        - name: collection
          in: query
          schema:
            type: string
          description: Collection slug
        - name: metalType
          in: query
          schema:
            type: string
        - name: minPrice
          in: query
          schema:
            type: number
        - name: maxPrice
          in: query
          schema:
            type: number
        - name: gender
          in: query
          schema:
            type: string
        - name: inStock
          in: query
          schema:
            type: boolean
        - name: sort
          in: query
          schema:
            type: string
            enum: [featured, newest, price_asc, price_desc, rating, bestselling]
            default: featured
        - name: q
          in: query
          schema:
            type: string
          description: Search query
      responses:
        '200':
          description: Product list
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

  /products/{slug}:
    get:
      summary: Get product by slug
      tags: [Products]
      security: []
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product detail
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  # ── COLLECTIONS ────────────────────────────────────

  /collections:
    get:
      summary: List collections
      tags: [Collections]
      security: []
      responses:
        '200':
          description: Collections list

  /collections/{slug}:
    get:
      summary: Get collection with products
      tags: [Collections]
      security: []
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Collection detail with products

  # ── CART ───────────────────────────────────────────

  /cart:
    get:
      summary: Get cart
      tags: [Cart]
      responses:
        '200':
          description: Current cart
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'

  /cart/items:
    post:
      summary: Add item to cart
      tags: [Cart]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [productId, variantId, quantity]
              properties:
                productId:
                  type: string
                variantId:
                  type: string
                quantity:
                  type: integer
                  minimum: 1
                customisation:
                  type: object
                  nullable: true
      responses:
        '200':
          description: Updated cart
        '400':
          description: Insufficient stock or invalid item
        '404':
          description: Product/variant not found

  /cart/items/{itemId}:
    patch:
      summary: Update cart item quantity
      tags: [Cart]
      parameters:
        - name: itemId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [quantity]
              properties:
                quantity:
                  type: integer
                  minimum: 0
      responses:
        '200':
          description: Updated cart

    delete:
      summary: Remove cart item
      tags: [Cart]
      parameters:
        - name: itemId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Updated cart

  /cart/coupon:
    post:
      summary: Apply coupon to cart
      tags: [Cart]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [code]
              properties:
                code:
                  type: string
      responses:
        '200':
          description: Coupon applied successfully
        '400':
          description: Invalid or expired coupon

    delete:
      summary: Remove coupon from cart
      tags: [Cart]
      responses:
        '200':
          description: Coupon removed

  # ── ORDERS ─────────────────────────────────────────

  /orders:
    get:
      summary: List customer orders
      tags: [Orders]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Order list

    post:
      summary: Create order from cart
      tags: [Orders]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [shippingAddress, paymentMethod]
              properties:
                shippingAddressId:
                  type: string
                  nullable: true
                shippingAddress:
                  type: object
                billingAddressSameAsShipping:
                  type: boolean
                  default: true
                billingAddress:
                  type: object
                  nullable: true
                shippingRateId:
                  type: string
                paymentMethod:
                  type: string
                paymentToken:
                  type: string
                  description: Stripe PaymentMethod ID or Razorpay token
                isGift:
                  type: boolean
                giftMessage:
                  type: string
                giftWrapped:
                  type: boolean
                loyaltyPointsToRedeem:
                  type: integer
                giftCardCode:
                  type: string
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Validation error
        '422':
          description: Payment failed

  /orders/{id}:
    get:
      summary: Get order by ID
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order detail
        '403':
          description: Not authorised

  /orders/{id}/cancel:
    post:
      summary: Cancel order
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [reason]
              properties:
                reason:
                  type: string
      responses:
        '200':
          description: Order cancelled
        '400':
          description: Order cannot be cancelled (already shipped)

  /orders/{id}/returns:
    post:
      summary: Initiate return
      tags: [Orders]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [items, reason]
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      orderItemId:
                        type: string
                      quantity:
                        type: integer
                reason:
                  type: string
                reasonDetail:
                  type: string
                images:
                  type: array
                  items:
                    type: string
                preferredResolution:
                  type: string
                  enum: [REFUND, EXCHANGE, STORE_CREDIT]
      responses:
        '201':
          description: Return initiated

  # ── CUSTOMERS ──────────────────────────────────────

  /customers/me:
    get:
      summary: Get authenticated customer profile
      tags: [Customers]
      responses:
        '200':
          description: Customer profile

    patch:
      summary: Update customer profile
      tags: [Customers]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                firstName:
                  type: string
                lastName:
                  type: string
                phone:
                  type: string
                dateOfBirth:
                  type: string
                  format: date
                anniversary:
                  type: string
                  format: date
      responses:
        '200':
          description: Profile updated

  /customers/me/addresses:
    get:
      summary: List customer addresses
      tags: [Customers]
      responses:
        '200':
          description: Address list

    post:
      summary: Add new address
      tags: [Customers]
      responses:
        '201':
          description: Address created

  /customers/me/wishlist:
    get:
      summary: Get wishlist
      tags: [Customers]
      responses:
        '200':
          description: Wishlist items

    post:
      summary: Add to wishlist
      tags: [Customers]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [productId]
              properties:
                productId:
                  type: string
      responses:
        '201':
          description: Added to wishlist

  /customers/me/wishlist/{productId}:
    delete:
      summary: Remove from wishlist
      tags: [Customers]
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Removed from wishlist

  /customers/me/loyalty:
    get:
      summary: Get loyalty account summary
      tags: [Customers]
      responses:
        '200':
          description: Loyalty balance, tier, recent transactions

  # ── AUTH ───────────────────────────────────────────

  /auth/register:
    post:
      summary: Register new customer
      tags: [Auth]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password, firstName, lastName]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
                firstName:
                  type: string
                lastName:
                  type: string
                phone:
                  type: string
      responses:
        '201':
          description: Account created; email verification sent
        '409':
          description: Email already registered

  /auth/login:
    post:
      summary: Login
      tags: [Auth]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Login successful; returns access + refresh tokens
        '401':
          description: Invalid credentials
        '429':
          description: Too many attempts

  /auth/refresh:
    post:
      summary: Refresh access token
      tags: [Auth]
      security: []
      responses:
        '200':
          description: New access token

  /auth/logout:
    post:
      summary: Logout (invalidate refresh token)
      tags: [Auth]
      responses:
        '200':
          description: Logged out

  /auth/send-otp:
    post:
      summary: Send OTP to phone
      tags: [Auth]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [phone]
              properties:
                phone:
                  type: string
      responses:
        '200':
          description: OTP sent

  /auth/verify-otp:
    post:
      summary: Verify OTP and login
      tags: [Auth]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [phone, otp]
              properties:
                phone:
                  type: string
                otp:
                  type: string
      responses:
        '200':
          description: Authenticated

  # ── SEARCH ─────────────────────────────────────────

  /search:
    get:
      summary: Search products
      tags: [Search]
      security: []
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 24
      responses:
        '200':
          description: Search results

  # ── SHIPPING ───────────────────────────────────────

  /shipping/rates:
    post:
      summary: Get available shipping rates
      tags: [Shipping]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [pinCode, country]
              properties:
                pinCode:
                  type: string
                country:
                  type: string
                  default: IN
      responses:
        '200':
          description: Available shipping options with rates and ETAs

  /shipping/serviceability:
    get:
      summary: Check delivery serviceability for a pin code
      tags: [Shipping]
      security: []
      parameters:
        - name: pinCode
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Serviceability + COD availability

  # ── TRACKING ───────────────────────────────────────

  /track/{orderNumber}:
    get:
      summary: Public order tracking (no auth required)
      tags: [Tracking]
      security: []
      parameters:
        - name: orderNumber
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tracking status and timeline
        '404':
          description: Order not found

  # ── REVIEWS ────────────────────────────────────────

  /products/{productId}/reviews:
    get:
      summary: Get product reviews
      tags: [Reviews]
      security: []
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: sort
          in: query
          schema:
            type: string
            enum: [newest, highest_rated, lowest_rated, most_helpful]
      responses:
        '200':
          description: Reviews with summary

    post:
      summary: Submit review
      tags: [Reviews]
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [rating, body, orderId]
              properties:
                orderId:
                  type: string
                rating:
                  type: integer
                  minimum: 1
                  maximum: 5
                title:
                  type: string
                body:
                  type: string
                images:
                  type: array
                  items:
                    type: string
      responses:
        '201':
          description: Review submitted (pending approval)
        '409':
          description: Review already submitted for this order

  # ── GOLD RATE ──────────────────────────────────────

  /gold-rate:
    get:
      summary: Get today's gold rate
      tags: [Gold Rate]
      security: []
      responses:
        '200':
          description: Current gold rates by purity
          content:
            application/json:
              schema:
                type: object
                properties:
                  date:
                    type: string
                    format: date
                  rates:
                    type: array
                    items:
                      type: object
                      properties:
                        purity:
                          type: string
                        ratePerGram:
                          type: number
                        currency:
                          type: string

  # ── WEBHOOKS (inbound, from payment gateways) ──────

  /webhooks/stripe:
    post:
      summary: Stripe webhook handler
      tags: [Webhooks]
      security: []
      responses:
        '200':
          description: Acknowledged

  /webhooks/razorpay:
    post:
      summary: Razorpay webhook handler
      tags: [Webhooks]
      security: []
      responses:
        '200':
          description: Acknowledged

  /webhooks/shiprocket:
    post:
      summary: Shiprocket tracking webhook
      tags: [Webhooks]
      security: []
      responses:
        '200':
          description: Acknowledged
```

---

## Appendix C — Design System Token Reference

All tokens are defined as CSS custom properties in `globals.css` and referenced via Tailwind's `extend` config.

```css
/* ── COLOUR PALETTE ──────────────────────────── */
:root {
  /* Brand – Jewellery Luxury Neutral Base */
  --colour-brand-50:  #fdf9f3;   /* Warm ivory – page bg */
  --colour-brand-100: #f5ead5;   /* Light champagne */
  --colour-brand-200: #e8d0a5;   /* Sand */
  --colour-brand-300: #d4b07a;   /* Warm gold tint */
  --colour-brand-400: #c49a50;   /* Gold light */
  --colour-brand-500: #b07d2a;   /* Primary brand gold */
  --colour-brand-600: #8f6220;   /* Deep gold */
  --colour-brand-700: #6a4718;   /* Rich amber */
  --colour-brand-800: #422c0e;   /* Dark brown */
  --colour-brand-900: #1e1208;   /* Near black brown */

  /* Neutral – for text, borders, backgrounds */
  --colour-neutral-0:   #ffffff;
  --colour-neutral-50:  #fafafa;
  --colour-neutral-100: #f5f5f5;
  --colour-neutral-200: #e5e5e5;
  --colour-neutral-300: #d4d4d4;
  --colour-neutral-400: #a3a3a3;
  --colour-neutral-500: #737373;
  --colour-neutral-600: #525252;
  --colour-neutral-700: #404040;
  --colour-neutral-800: #262626;
  --colour-neutral-900: #171717;
  --colour-neutral-950: #0a0a0a;

  /* Semantic */
  --colour-success:       #16a34a;
  --colour-success-light: #dcfce7;
  --colour-warning:       #d97706;
  --colour-warning-light: #fef9c3;
  --colour-error:         #dc2626;
  --colour-error-light:   #fee2e2;
  --colour-info:          #2563eb;
  --colour-info-light:    #dbeafe;

  /* Surface tokens */
  --colour-bg-base:       var(--colour-brand-50);
  --colour-bg-elevated:   var(--colour-neutral-0);
  --colour-bg-sunken:     var(--colour-neutral-100);
  --colour-bg-overlay:    rgba(0, 0, 0, 0.5);

  /* Text tokens */
  --colour-text-primary:  var(--colour-neutral-900);
  --colour-text-secondary: var(--colour-neutral-600);
  --colour-text-tertiary: var(--colour-neutral-400);
  --colour-text-inverse:  var(--colour-neutral-0);
  --colour-text-brand:    var(--colour-brand-600);
  --colour-text-link:     var(--colour-brand-600);

  /* Border tokens */
  --colour-border-default: var(--colour-neutral-200);
  --colour-border-strong:  var(--colour-neutral-300);
  --colour-border-brand:   var(--colour-brand-400);

  /* ── TYPOGRAPHY ───────────────────────────────── */

  /* Font families */
  --font-display:  'Cormorant Garamond', 'Garamond', serif;  /* Headlines, hero */
  --font-body:     'Inter', 'Helvetica Neue', sans-serif;    /* Body copy, UI */
  --font-mono:     'JetBrains Mono', monospace;              /* Code, SKUs */

  /* Font sizes (fluid type scale using clamp) */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  clamp(2rem, 3vw, 2.5rem);    /* 32–40px */
  --text-5xl:  clamp(2.5rem, 5vw, 3.75rem); /* 40–60px */
  --text-6xl:  clamp(3rem, 7vw, 5rem);      /* 48–80px */
  --text-hero: clamp(3.5rem, 9vw, 7rem);    /* Hero headlines */

  /* Line heights */
  --leading-tight:  1.2;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose:  2;

  /* Font weights */
  --font-light:     300;
  --font-regular:   400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;

  /* Letter spacing */
  --tracking-tight:  -0.025em;
  --tracking-normal:  0;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;
  --tracking-widest:  0.15em;  /* Use for all-caps labels */

  /* ── SPACING (8pt grid) ───────────────────────── */
  --space-0:   0;
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */

  /* ── BORDER RADIUS ────────────────────────────── */
  --radius-none: 0;
  --radius-sm:   0.25rem;  /* 4px – chips, tags */
  --radius-md:   0.5rem;   /* 8px – cards, inputs */
  --radius-lg:   0.75rem;  /* 12px – modals, drawers */
  --radius-xl:   1rem;     /* 16px – panels */
  --radius-2xl:  1.5rem;   /* 24px – large cards */
  --radius-full: 9999px;   /* Pills, avatars */

  /* ── SHADOWS ──────────────────────────────────── */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-2xl: 0 25px 50px rgba(0,0,0,0.25);
  --shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06);
  --shadow-gold: 0 4px 20px rgba(176, 125, 42, 0.25);  /* Brand gold glow */

  /* ── TRANSITIONS ──────────────────────────────── */
  --transition-fast:   150ms ease;
  --transition-base:   250ms ease;
  --transition-slow:   400ms ease;
  --transition-spring: 350ms cubic-bezier(0.34, 1.56, 0.64, 1);  /* Springy */

  /* ── Z-INDEX SCALE ────────────────────────────── */
  --z-below:    -1;
  --z-base:      0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;

  /* ── LAYOUT ───────────────────────────────────── */
  --max-w-content: 1400px;   /* Max content width */
  --max-w-narrow:  800px;    /* Blog, editorial */
  --max-w-form:    560px;    /* Forms, modals */
  --sidebar-w:     280px;    /* Filter sidebar */
  --admin-sidebar: 240px;    /* Admin nav */
}

/* Dark mode overrides (if implemented) */
@media (prefers-color-scheme: dark) {
  :root {
    --colour-bg-base:       #0f0d0b;
    --colour-bg-elevated:   #1a1610;
    --colour-bg-sunken:     #0a0908;
    --colour-text-primary:  #f5ead5;
    --colour-text-secondary: #a89070;
    --colour-border-default: #2a2318;
  }
}
```

```js
// tailwind.config.ts — extend with token references
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--colour-brand-50)',
          100: 'var(--colour-brand-100)',
          300: 'var(--colour-brand-300)',
          500: 'var(--colour-brand-500)',
          600: 'var(--colour-brand-600)',
          700: 'var(--colour-brand-700)',
          900: 'var(--colour-brand-900)',
        },
        surface: {
          base: 'var(--colour-bg-base)',
          elevated: 'var(--colour-bg-elevated)',
          sunken: 'var(--colour-bg-sunken)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        gold: 'var(--shadow-gold)',
      },
      maxWidth: {
        content: 'var(--max-w-content)',
        narrow: 'var(--max-w-narrow)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    }
  }
}
export default config
```

---

## Appendix D — Incident Response Playbook

### Severity Levels

| Level | Definition | Response Time | Stakeholder Notification |
|-------|-----------|--------------|--------------------------|
| P0 — Critical | Site down; checkout broken; data breach | Immediate (< 15 min) | CTO, CEO, Engineering lead |
| P1 — High | Payment failures; major feature broken; > 10% error rate | < 1 hour | Engineering lead, Product |
| P2 — Medium | Degraded performance; partial feature failure; < 5% error rate | < 4 hours | Engineering on-call |
| P3 — Low | Minor UI bug; non-critical feature broken | Next business day | Ticket created |

### P0 Response Protocol

1. **Detect:** PagerDuty / Sentry alert fires → on-call engineer paged
2. **Acknowledge:** On-call acknowledges within 5 minutes
3. **Assess:** Check Sentry error rates, Vercel deployment logs, Stripe/Razorpay dashboards, Upstash Redis status
4. **Communicate:** Post in `#incidents` Slack channel: "P0 active — [description] — investigating"
5. **Mitigate:**
   - Site down → Roll back to last known good deployment via `vercel rollback`
   - DB overload → Enable maintenance mode (`NEXT_PUBLIC_MAINTENANCE=true`); check PgBouncer pool
   - Payment failures → Check Stripe/Razorpay status pages; fall back to alternate gateway
   - Cache failure → Bypass Redis with `REDIS_BYPASS=true` env var
6. **Resolve:** Confirm system healthy; clear maintenance mode
7. **Post-mortem:** Written within 48 hours; timeline, root cause, action items

### Runbook: Deployment Rollback

```bash
# List recent Vercel deployments
vercel ls --scope=your-team

# Roll back to specific deployment
vercel rollback [deployment-url] --scope=your-team

# Verify rollback
curl -s https://yourbrand.com/api/v1/health | jq .
```

### Runbook: Database Emergency

```bash
# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Kill long-running queries (> 30s)
psql $DATABASE_URL -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE state = 'active'
  AND query_start < NOW() - INTERVAL '30 seconds'
  AND query NOT LIKE '%pg_stat_activity%';"

# Point-in-time restore (Supabase)
# Use Supabase dashboard: Project > Database > Backups > Restore
```

### Runbook: Redis Cache Failure

All Redis operations are wrapped in try/catch. System degrades gracefully:
- Cart falls back to database-only (slower, but functional)
- Rate limiting disabled (log increased; Cloudflare WAF provides fallback protection)
- Session validation falls back to JWT-only (stateless; refresh token revocation unavailable)

```bash
# Flush specific cache namespace
redis-cli -u $REDIS_URL --scan --pattern "product:*" | xargs redis-cli -u $REDIS_URL del

# Check memory usage
redis-cli -u $REDIS_URL info memory
```

### Monitoring Checklist (daily check, 5 minutes)

- [ ] Sentry: error rate < 0.1% in last 24h
- [ ] Vercel Analytics: p95 response time < 500ms
- [ ] Stripe Dashboard: failed charge rate < 2%
- [ ] Upstash: Redis memory < 80% capacity
- [ ] Algolia: search latency < 50ms
- [ ] Shiprocket: no stuck shipments > 48h without update
- [ ] Database: connection pool utilisation < 70%

---

## Appendix E — Third-Party Vendor Evaluation Matrix

### Payment Gateway: Stripe vs Razorpay

| Criterion | Stripe | Razorpay | Decision |
|-----------|--------|----------|----------|
| UPI support | ❌ No | ✅ Yes | Razorpay for India |
| Card payments (India) | ✅ Yes | ✅ Yes | Both |
| International cards | ✅ Excellent | ⚠️ Limited | Stripe for international |
| EMI on credit cards | ❌ No | ✅ Yes | Razorpay |
| BNPL partners | ⚠️ Klarna (int'l) | ✅ Simpl, LazyPay | Razorpay |
| Fraud detection | ✅ Stripe Radar | ✅ Razorpay Shield | Both adequate |
| Settlement time | T+2 | T+2 | Equal |
| Transaction fee | 2.9% + $0.30 | 2% + ₹3 | Razorpay cheaper for INR |
| Subscription billing | ✅ Excellent | ✅ Good | Stripe for subscriptions |
| Developer experience | ✅ Excellent | ✅ Good | Stripe slightly better |
| **Recommendation** | International + subscriptions | India domestic | **Use both** |

### Search: Algolia vs Typesense vs ElasticSearch

| Criterion | Algolia | Typesense | ElasticSearch |
|-----------|---------|-----------|---------------|
| Setup time | Fast (< 1 day) | Fast | Slow (weeks) |
| Managed hosting | ✅ Yes | ✅ Yes (Cloud) | Self-host or Elastic Cloud |
| Typo tolerance | ✅ Excellent | ✅ Good | ✅ Good |
| Faceted search | ✅ Native | ✅ Native | ⚠️ Complex config |
| Personalisation | ✅ Algolia Recommend | ❌ No | ❌ Requires ML pipeline |
| Analytics | ✅ Built-in | ⚠️ Basic | ✅ Kibana |
| Pricing (10K records) | $29/mo | $0 (self-host) | $95/mo (Elastic Cloud) |
| Latency | < 50ms | < 50ms | 100–200ms |
| **Recommendation** | **Phase 1–2** | Budget alternative | Enterprise scale |

### Email: Resend vs SendGrid vs Postmark

| Criterion | Resend | SendGrid | Postmark |
|-----------|--------|----------|----------|
| Developer experience | ✅ Excellent | ⚠️ Complex | ✅ Good |
| Next.js integration | ✅ First-class | ✅ Good | ✅ Good |
| Deliverability | ✅ High | ✅ High | ✅ Excellent |
| Transactional pricing | $20/mo (50K) | $19.95/mo (50K) | $15/mo (10K) |
| Marketing emails | ❌ No | ✅ Yes | ❌ No |
| Templates | ✅ React Email | ✅ Dynamic Templates | ✅ Good |
| Analytics | ✅ Basic | ✅ Advanced | ✅ Detailed |
| **Recommendation** | **Transactional** | Marketing (if no Klaviyo) | High-volume transactional |

### CMS: Sanity vs Contentful vs Strapi

| Criterion | Sanity | Contentful | Strapi |
|-----------|--------|-----------|--------|
| Real-time collaboration | ✅ Excellent | ✅ Good | ❌ No |
| GROQ query language | ✅ Powerful | ❌ GraphQL/REST only | ❌ REST/GraphQL |
| Free tier | ✅ Generous | ⚠️ Limited | ✅ Open source |
| Customisable studio | ✅ React-based | ⚠️ Limited | ✅ Yes |
| Image CDN | ✅ Built-in | ⚠️ Add-on | ❌ External needed |
| Next.js support | ✅ First-class | ✅ Good | ✅ Good |
| Self-host option | ❌ SaaS | ❌ SaaS | ✅ Yes |
| **Recommendation** | **Primary choice** | Enterprise fallback | Budget/open-source |

---

## Appendix F — Competitive Benchmarking

Analysis of the top jewellery e-commerce platforms operating in India and globally as of 2026. Informs feature prioritisation.

### Competitor Overview

| Brand | Market | Platform | Est. Monthly Traffic | Price Positioning |
|-------|--------|----------|---------------------|------------------|
| CaratLane | India | Custom (React) | 8M+ | Mid-premium (₹2K–₹2L) |
| BlueStone | India | Custom | 5M+ | Mid-premium (₹1K–₹1L) |
| Melorra | India | Custom | 3M+ | Everyday (₹1K–₹30K) |
| Tanishq (Tata) | India | Hybris/Custom | 10M+ | Premium (₹5K–₹10L) |
| Kalyan Jewellers | India | Magento | 2M+ | Traditional/Mass (₹2K–₹5L) |
| Mejuri | Global | Shopify+ | 4M+ | Demi-fine ($50–$2,000) |
| Vrai | Global | Custom | 1M+ | Fine/Lab-grown ($500–$10K) |
| Brilliant Earth | Global | Custom | 5M+ | Ethical fine ($500–$20K) |

---

### CaratLane — Benchmark Analysis

**Strengths:**
- Try-at-Home service (physical trial, no commitment to buy) is a massive trust driver
- Excellent 3D product views + 360° rotation on every product
- Real-time inventory across 200+ physical stores shown on PDP ("Available at Koramangala store")
- "Design Your Own" solitaire configurator (stone picker + setting + band + metal)
- Ring size detection via on-screen tool using credit card as reference object

**Weaknesses:**
- Search is mediocre — filters don't persist on browser back
- Checkout is 5 steps (too long); high abandonment
- Mobile app is feature-lagging vs website
- Product descriptions are formulaic; little storytelling

**Features to Adopt:**
- Try-at-Home CTA prominently on PDP
- In-store availability indicator
- Solitaire configurator pattern (metal → shape → quality → price breakdown)

---

### BlueStone — Benchmark Analysis

**Strengths:**
- 30-day return policy (industry-leading; builds trust for high-ticket items)
- "Blue Label" certification programme (own authentication standard)
- "Lifetime Exchange" programme visible in the trust bar
- Strong filter UX: facets persist correctly; clear active filter chips
- "Price Drop" alert feature on product wishlists

**Weaknesses:**
- Homepage is visually cluttered; lacks luxury feel
- Product photography inconsistent across catalogue
- No editorial content / brand storytelling
- Slow page loads on mobile (TBT > 600ms on mid-range Android)

**Features to Adopt:**
- 30-day return window as a marketing headline, not a footnote
- Lifetime exchange programme (builds loyalty and reduces purchase anxiety)
- Price-drop wishlist alerts

---

### Mejuri — Benchmark Analysis (Global Best-in-Class)

**Strengths:**
- Best-in-class editorial storytelling; every collection has a campaign narrative
- Infinite scroll collection pages with no performance degradation
- "Fine Crew" community + loyalty programme deeply integrated with product discovery
- Social proof integrated at PDP level: "127 people have this in their wishlist"
- Frictionless checkout: single-page, Apple Pay / Google Pay one-click on mobile
- Subscription: "Mejuri for Everyday" — curated drops for subscribers

**Weaknesses:**
- India-specific payment methods absent (not their market)
- No jewellery customisation / engraving — purely standard catalogue
- AR try-on absent (despite having capability)

**Features to Adopt:**
- Wishlist social proof counter on PDP
- One-click checkout (Apple Pay / Google Pay) prominently on mobile
- Editorial storytelling pattern for new collections
- "X people are looking at this" urgency nudge (used with restraint)

---

### Feature Gap Matrix

Rate 1–5 where 5 = best-in-class.

| Feature | CaratLane | BlueStone | Melorra | Mejuri | **Our Target** |
|---------|-----------|-----------|---------|--------|----------------|
| Mobile UX | 4 | 3 | 4 | 5 | **5** |
| Product photography | 4 | 3 | 4 | 5 | **5** |
| 360°/3D view | 5 | 3 | 2 | 3 | **5** |
| AR try-on | 3 | 2 | 1 | 1 | **4** |
| Customisation/configurator | 5 | 3 | 2 | 1 | **5** |
| Search quality | 3 | 4 | 3 | 4 | **5** |
| Checkout speed | 2 | 3 | 3 | 5 | **5** |
| Editorial storytelling | 2 | 2 | 3 | 5 | **5** |
| Loyalty programme | 4 | 4 | 5 | 5 | **5** |
| Return policy UX | 4 | 5 | 3 | 4 | **5** |
| Certification display | 4 | 5 | 3 | 3 | **5** |
| Page performance | 3 | 2 | 3 | 5 | **5** |
| Personalisation | 4 | 3 | 4 | 4 | **5** |
| Social commerce | 3 | 2 | 4 | 4 | **4** |
| B2B / wholesale | 2 | 2 | 1 | 1 | **4** |

---

### Key Differentiators to Build

Based on competitive gaps, these are the 5 features where we can out-execute all competitors:

1. **Transparency Engine** — Real-time gold rate + making charge breakdown on every product. No competitor shows this clearly. Builds trust with price-conscious Indian buyers.

2. **One-Click Checkout on Mobile** — Mejuri does this globally; no Indian jewellery brand does it well. Apple Pay / Google Pay + UPI AutoPay at < 5-second checkout.

3. **Storytelling CMS** — Every collection gets a full editorial treatment (campaign images, founder notes, craftsmanship videos). CaratLane and BlueStone ignore this entirely.

4. **Smart Returns** — 30-day return window with instant store credit (not waiting for bank refund). Communicated as a hero trust signal, not buried in the footer.

5. **Jewellery Lifecycle CRM** — Post-purchase: care guide, warranty card, cleaning reminder at 6 months, anniversary gift suggestion at 1 year. No competitor does post-purchase relationship building well. Turns a one-time buyer into a lifetime customer.

---

*End of Appendices. Main PRD document: PRD.md*
