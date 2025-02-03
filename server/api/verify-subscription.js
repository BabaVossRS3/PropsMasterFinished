import Stripe from 'stripe';
import { db } from '../configs/db.js';
import { UserPlan } from '../configs/schema.js';
import { sql } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 20000,
  maxNetworkRetries: 2,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://propsmaster.gr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'application/json');

  console.log('Starting subscription verification...');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      code: 'method_not_allowed'
    });
  }

  try {
    const { sessionId } = req.body;
    console.log('Session ID received:', sessionId);

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID is missing',
        code: 'missing_session_id'
      });
    }

    console.log('Retrieving Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription']
    });
    
    console.log('Session retrieved:', {
      payment_status: session.payment_status,
      metadata: session.metadata,
      customer: session.customer?.id,
      subscription: session.subscription?.id
    });

    if (session.payment_status === 'paid') {
      const planType = session.metadata?.planName;
      const userId = session.metadata?.userId;
      const customerId = session.customer?.id || null;
      const subscriptionId = session.subscription?.id || null;
      const priceId = session.subscription?.items?.data[0]?.price?.id || null;

      console.log('Processing paid session:', { 
        planType, 
        userId, 
        customerId,
        subscriptionId,
        priceId
      });

      if (!planType || !userId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required metadata',
          code: 'missing_metadata'
        });
      }

      const daysToAdd = 0
      try {
        await db.transaction(async (tx) => {
          // Deactivate existing plans
          await tx
            .update(UserPlan)
            .set({
              isActive: false,
              updatedAt: new Date()
            })
            .where(sql`${UserPlan.userId} = ${userId}`);

          // Insert new plan with proper handling of nullable fields
          await tx
            .insert(UserPlan)
            .values({
              userId: userId,
              plan: planType,
              startDate: sql`CURRENT_DATE`,
              endDate: sql`CURRENT_DATE + INTERVAL '${daysToAdd} day'`,
              isActive: true,
              stripeCustomerId: customerId,
              stripeStatus: session.payment_status,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              createdAt: new Date(),
              updatedAt: new Date()
            });
        });

        console.log('Database transaction completed successfully');

        return res.json({
          success: true,
          planType: planType,  // Move planType to top level
          data: {
            startDate: new Date(),
            endDate: new Date(Date.now() + (daysToAdd * 24 * 60 * 60 * 1000))
          }
        });

      } catch (dbError) {
        console.error('Database error:', {
          message: dbError.message,
          code: dbError.code,
          stack: dbError.stack
        });
        
        return res.status(500).json({
          success: false,
          error: 'Failed to update subscription in database',
          code: 'database_error',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }
    } else if (session.payment_status === 'unpaid') {
      return res.status(402).json({
        success: false,
        error: 'Payment required',
        code: 'payment_required'
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed',
        code: 'payment_incomplete'
      });
    }

  } catch (error) {
    console.error('Error in verify-subscription:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    });

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID',
        code: 'invalid_session'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      code: 'server_error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}