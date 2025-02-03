import { pgTable, serial, varchar, timestamp, text, boolean, date, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ProductListing Table
export const ProductListing = pgTable('ProductListing', {
  id: serial('id').primaryKey(),
  listingTitle: varchar('listingTitle').notNull(),
  typeoflist: varchar('typeoflist').notNull(),
  sellingPrice: varchar('sellingPrice').notNull(),
  negotiable: varchar('negotiable').notNull(),
  category: varchar('category').notNull(),
  condition: varchar('condition'),
  year: varchar('year'),
  brand: varchar('brand'),
  material: varchar('material').notNull(),
  color: varchar('color').notNull(),
  listingdescription: varchar('listingdescription'),
  ownerName: varchar('ownerName').notNull(),
  ownerTel: varchar('ownerTel').notNull(),
  addressPosted: varchar('addressPosted').notNull(),
  createdBy: varchar('createdBy').notNull().default('example@example.com'),
  postedOn: varchar('postedOn'),
  userImageUrl: varchar('userImageUrl'),
  userPlan: varchar('userPlan'),
  clerkUserId: varchar('userIdClerk').references(() => UserPlan.userId),
  views: integer('views').notNull().default(0),
  municipality: varchar('municipality').notNull().default('Unknown'),
  zipCode: integer('zipCode').notNull().default(12131)

});

// ProductImages Table
export const ProductImages = pgTable('productImages', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('imageUrl').notNull(),
  ProductListingId: integer('productListingId').notNull().references(() => ProductListing.id)
});

// UserPlan Table
export const UserPlan = pgTable('UserPlan', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull().unique(),
  plan: varchar('plan').notNull(),
  startDate: date('startDate').notNull().default(sql`CURRENT_DATE`),
  endDate: date('endDate'),
  isActive: boolean('isActive').notNull().default(true),
  
  // New fields for Stripe integration
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeStatus: varchar('stripe_status', { length: 50 }),
  
  // Audit fields
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  canceledAt: timestamp('canceled_at'),
  
  // Optional: for tracking trial periods
  trialEndsAt: timestamp('trial_ends_at')
});

// Modified Subscriptions table to reference UserPlan instead of users
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull().references(() => UserPlan.userId),
  stripeSubscriptionId: varchar('stripeSubscriptionId').notNull(),
  stripePriceId: varchar('stripePriceId').notNull(),
  stripeCurrentPeriodEnd: timestamp('stripeCurrentPeriodEnd').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// PolicyAcceptance Table
export const PolicyAcceptance = pgTable('policy_acceptance', {
  id: serial('id').primaryKey(),
  userId: varchar('userId').notNull().references(() => UserPlan.userId),
  acceptedAt: timestamp('accepted_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  version: varchar('version').notNull().default('1.0'),
});