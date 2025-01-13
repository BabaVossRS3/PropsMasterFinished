import Stripe from 'stripe';
import { db } from './../configs/db.js';
import { UserPlan } from './../configs/schema.js';
import { sql } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is missing' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status === 'paid') {
      const planType = session.metadata.planName;
      const userId = session.metadata.userId;
      const daysToAdd = planType === 'Boost+' ? 60 : 30;

      try {
        // First deactivate any existing active plans
        await db
          .update(UserPlan)
          .set({
            isActive: false
          })
          .where(sql`${UserPlan.userId} = ${userId}`);

        // Insert new plan with calculated end date
        await db
          .insert(UserPlan)
          .values({
            userId: userId,
            plan: planType,
            startDate: sql`CURRENT_DATE`,
            endDate: sql`CURRENT_DATE + INTERVAL '${daysToAdd} day'`,
            isActive: true
          });

        return res.json({
          success: true,
          planType: planType
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
}