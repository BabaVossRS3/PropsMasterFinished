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

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status === 'paid') {
      const planType = session.metadata.planName;
      const userId = session.metadata.userId;

      // Calculate startDate and endDate
      const startDate = new Date();
      let endDate = new Date(startDate);
      
      // Calculate endDate based on plan type
      const daysToAdd = planType === 'Boost+' ? 60 : 30;
      endDate = sql`CURRENT_DATE + INTERVAL '${daysToAdd} days'`;

      try {
        // First, try to update existing record
        const updateResult = await db
          .update(UserPlan)
          .set({
            plan: planType,
            startDate: sql`CURRENT_DATE`,
            endDate: endDate,
            isActive: true
          })
          .where(sql`${UserPlan.userId} = ${userId}`);

        // If no record was updated, insert a new one
        if (!updateResult || updateResult.rowCount === 0) {
          await db
            .insert(UserPlan)
            .values({
              userId: userId,
              plan: planType,
              startDate: sql`CURRENT_DATE`,
              endDate: endDate,
              isActive: true
            });
        }

        // Return success response
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