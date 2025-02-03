import Stripe from 'stripe';
import { db } from 'configs/db.js';
import { eq } from 'drizzle-orm';
import { subscriptions } from 'configs/schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map plan names to actual Stripe price IDs
const PLAN_PRICE_MAP = {
  'Boost': process.env.STRIPE_BOOST_PRICE_ID,
  'Boost+': process.env.STRIPE_BOOST_PLUS_PRICE_ID
};

export async function POST(req) {
  try {
    const { planName, userId, email } = await req.json();

    // Validate input
    if (!planName || !userId || !email) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          details: 'planName, userId, and email are required' 
        }), 
        { status: 400 }
      );
    }

    // Get price ID based on plan
    const priceId = PLAN_PRICE_MAP[planName];
    if (!priceId) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid plan name', 
          details: `Plan ${planName} not found` 
        }), 
        { status: 400 }
      );
    }

    // Create or get customer
    let customer;
    const existingCustomers = await stripe.customers.list({ 
      email,
      limit: 1
    });

    if (existingCustomers.data.length === 0) {
      customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });
    } else {
      customer = existingCustomers.data[0];
      
      // Update customer metadata if needed
      if (!customer.metadata.userId) {
        await stripe.customers.update(customer.id, {
          metadata: {
            userId,
          },
        });
      }
    }

    // Check for existing active subscriptions
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    if (existingSubscription) {
      // Optionally cancel existing subscription or handle as needed
      try {
        await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error canceling existing subscription:', error);
        // Continue with new subscription creation even if cancellation fails
      }
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      metadata: {
        userId,
        planName,
      },
      expand: ['latest_invoice.payment_intent'],
    });

    // Store subscription info in database
    await db.insert(subscriptions).values({
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    }));
    
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    // Enhanced error handling
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Stripe.errors.StripeError) {
      statusCode = error.statusCode || 500;
      errorMessage = error.message;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        code: error.code,
        type: error.type
      }), 
      { status: statusCode }
    );
  }
}