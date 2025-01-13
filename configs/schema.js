import { pgTable, serial, varchar, timestamp, boolean, date, integer } from 'drizzle-orm/pg-core';
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
    clerkUserId: varchar('userIdClerk').references(() => UserPlan.userId), // Foreign key to UserPlan.userId
    views: integer('views').notNull().default(0),
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
    // Remove the default for endDate since we'll calculate it based on plan type
    endDate: date('endDate'),
    isActive: boolean('isActive').notNull().default(true)
});

// Subscriptions Table
export const Subscriptions = pgTable('subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id').notNull(), // Removed the reference since UserPlan.userId isn't a primary key
    status: varchar('status', { length: 20 }).notNull().default('inactive'),
    planType: varchar('plan_type', { length: 20 }).notNull(),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }).unique(),
    stripePriceId: varchar('stripe_price_id', { length: 100 }),
    stripeCurrentPeriodStart: timestamp('stripe_current_period_start'),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    canceledAt: timestamp('canceled_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

