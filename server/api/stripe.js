import express from 'express';
import { db } from '../configs/db.js';
import { UserPlan } from '../configs/schema.js';
import { sql } from 'drizzle-orm';
import stripe from '../configs/stripe.js';

const router = express.Router();

// Webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    return res.status(400).json({ 
      error: 'No Stripe signature found',
      received: false 
    });
  }

  try {
    console.log('🔔 Webhook received:', {
      timestamp: new Date().toISOString(),
      signature: 'Present',
      bodyType: typeof req.body,
      contentType: req.headers['content-type']
    });

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('✅ Webhook verified:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        try {
          await handleSuccessfulSubscription(event.data.object);
          console.log('✅ Successfully processed checkout session');
        } catch (error) {
          console.error('❌ Error processing checkout session:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            details: error.details || {}
          });
          // Send error response with details
          return res.status(500).json({
            error: 'Failed to process subscription',
            details: error.message,
            code: error.code
          });
        }
        break;

      case 'customer.subscription.deleted':
        await handleCanceledSubscription(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.json({ 
      received: true,
      type: event.type
    });

  } catch (error) {
    if (error.type === 'StripeSignatureVerificationError') {
      return res.status(400).json({ 
        error: 'Invalid signature',
        received: false 
      });
    }

    console.error('❌ Webhook Error:', {
      message: error.message,
      stack: error.stack,
      type: error.type
    });

    return res.status(500).json({ 
      error: 'Internal server error',
      received: false 
    });
  }
});

// Create checkout session
router.post('/create-checkout-session', express.json(), async (req, res) => {
  try {
    console.log('Received request:', {
      body: req.body,
      headers: req.headers
    });

    const { priceId, userId, userEmail, planName } = req.body;

    if (!priceId || !userId || !userEmail || !planName) {
      console.error('Missing required fields:', { priceId, userId, userEmail, planName });
      return res.status(400).json({
        error: 'Missing required fields',
        received: { priceId, userId, userEmail, planName }
      });
    }

    console.log('Creating checkout session with:', {
      priceId,
      userId,
      userEmail,
      planName
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ 
        price: priceId, 
        quantity: 1 
      }],
      success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/choosePlan`,
      customer_email: userEmail,
      metadata: { 
        userId: userId.toString(),
        planName: planName
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    console.log('Created session:', {
      sessionId: session.id,
      metadata: session.metadata
    });

    res.status(200).json({ 
      sessionId: session.id,
      success: true
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Webhook handler with enhanced logging
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    console.log('🔔 Webhook received:', {
      timestamp: new Date().toISOString(),
      signature: sig ? 'Present' : 'Missing',
      bodyType: typeof req.body,
      contentType: req.headers['content-type'],
      bodyLength: req.body ? req.body.length : 0
    });

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('✅ Webhook event:', {
      type: event.type,
      id: event.id,
      metadata: event.data.object.metadata
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('💳 Checkout session completed:', {
        sessionId: session.id,
        metadata: session.metadata,
        customer: session.customer,
        paymentStatus: session.payment_status
      });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Processing checkout session:', {
          userId: session.metadata?.userId,
          planName: session.metadata?.planName
        });
        await handleSuccessfulSubscription(session);
        break;

      case 'customer.subscription.deleted':
        await handleCanceledSubscription(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Verify subscription endpoint
router.post('/verify-subscription', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status === 'paid') {
      try {
        await handleSuccessfulSubscription(session);
        return res.json({
          success: true,
          planType: session.metadata.planName
        });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        throw new Error('Failed to update user plan in database');
      }
    } else {
      throw new Error('Payment not completed');
    }
  } catch (error) {
    console.error('Error in verify-subscription:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    });
  }
});



// Webhook event handlers
async function handleSuccessfulSubscription(session) {
  try {
    console.log('🏁 Starting handleSuccessfulSubscription:', {
      sessionId: session.id,
      metadata: session.metadata,
      paymentStatus: session.payment_status,
      subscriptionId: session.subscription?.id || session.subscription,
      customer: session.customer
    });

    const { userId, planName } = session.metadata;
    
    // Validate required metadata
    if (!userId || !planName) {
      throw new Error(`Missing required metadata. userId: ${userId}, planName: ${planName}`);
    }

    const daysToAdd = 30;
    
    // Safely get subscription ID and price ID
    const subscriptionId = session.subscription?.id || session.subscription;
    let priceId = null;
    
    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (subscription?.items?.data?.[0]?.price?.id) {
          priceId = subscription.items.data[0].price.id;
        }
      } catch (error) {
        console.warn('Warning: Could not retrieve subscription details:', error.message);
      }
    }

    // Calculate dates explicitly
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysToAdd);

    console.log('📝 Database operation details:', {
      userId,
      planName,
      daysToAdd,
      startDate,
      endDate,
      subscriptionId,
      priceId
    });

    await db.transaction(async (tx) => {
      // First, try to find existing plan
      const existingPlan = await tx
        .select()
        .from(UserPlan)
        .where(sql`${UserPlan.userId} = ${userId}`)
        .limit(1);

      console.log('Existing plan:', existingPlan);

      if (existingPlan.length > 0) {
        // Update existing plan instead of creating new one
        console.log('🔄 Updating existing plan');
        await tx
          .update(UserPlan)
          .set({
            plan: planName,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            stripeSubscriptionId: subscriptionId ? subscriptionId.toString() : null,
            stripePriceId: priceId ? priceId.toString() : null,
            stripeCustomerId: (session.customer?.id || session.customer)?.toString() || null,
            stripeStatus: 'active',
            updatedAt: new Date(),
            canceledAt: null // Reset canceled date if it was set
          })
          .where(sql`${UserPlan.userId} = ${userId}`);
      } else {
        // Insert new plan
        console.log('➕ Creating new plan');
        await tx
          .insert(UserPlan)
          .values({
            userId: userId.toString(),
            plan: planName,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            stripeSubscriptionId: subscriptionId ? subscriptionId.toString() : null,
            stripePriceId: priceId ? priceId.toString() : null,
            stripeCustomerId: (session.customer?.id || session.customer)?.toString() || null,
            stripeStatus: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          });
      }
    });
    
    console.log('✅ Subscription processed successfully');
  } catch (error) {
    console.error('❌ Error in handleSuccessfulSubscription:', {
      message: error.message,
      stack: error.stack,
      sessionId: session.id,
      errorCode: error.code,
      errorType: error.type,
      details: error.details || {}
    });
    throw error;
  }
}

async function handleCanceledSubscription(subscription) {
  console.log('🚫 Processing subscription cancellation:', subscription.id);
  
  try {
    await db
      .update(UserPlan)
      .set({
        isActive: false,
        stripeStatus: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date()
      })
      .where(sql`${UserPlan.stripeSubscriptionId} = ${subscription.id}`);
      
    console.log('✅ Subscription cancellation processed');
  } catch (error) {
    console.error('❌ Error processing cancellation:', error);
    throw error;
  }
}

async function handleFailedPayment(invoice) {
  console.log('❌ Processing failed payment:', invoice.id);
  
  try {
    await stripe.subscriptions.retrieve(invoice.subscription);
    
    await db
      .update(UserPlan)
      .set({
        stripeStatus: 'past_due',
        updatedAt: new Date()
      })
      .where(sql`${UserPlan.stripeSubscriptionId} = ${invoice.subscription}`);
      
    console.log('✅ Failed payment processed');
  } catch (error) {
    console.error('❌ Error processing failed payment:', error);
    throw error;
  }
}

export default router;