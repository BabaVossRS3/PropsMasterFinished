
import { db } from './../configs';
import { eq, and, desc } from 'drizzle-orm';
import { UserPlan } from './../configs/schema';

export async function updateUserPlan(userId, newPlan) {
    try {
        const now = new Date();
        
        // Calculate new end date (30 days from now)
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + 30);

        // First, deactivate any existing active plans
        await db
            .update(UserPlan)
            .set({ 
                isActive: false,
                endDate: now  // Set the end date of the old plan to now
            })
            .where(
                and(
                    eq(UserPlan.userId, userId),
                    eq(UserPlan.isActive, true)
                )
            );

        // Create new plan with fresh 30-day period
        const newPlanValues = {
            userId,
            plan: newPlan,
            startDate: now,
            endDate: endDate,  // This will be 30 days from now
            isActive: true
        };

        // Insert the new plan
        await db
            .insert(UserPlan)
            .values(newPlanValues);

        return {
            ...newPlanValues,
            remainingDays: 30  // Always starts with 30 days
        };
    } catch (error) {
        console.error('Error updating user plan:', error);
        throw error;
    }
}

export const getCurrentUserPlan = async (userId) => {
    try {
      const result = await db
        .select()
        .from(UserPlan)
        .where(eq(UserPlan.userId, userId))
        .limit(1);
  
      if (result && result[0]) {
        const plan = result[0];
        const now = new Date();
        const endDate = new Date(plan.endDate);
        const remainingDays = Math.max(
          0,
          Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
        );
  
        return {
          plan: plan.plan,
          isActive: plan.isActive && remainingDays > 0,
          remainingDays,
          startDate: plan.startDate,
          endDate: plan.endDate
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user plan:', error);
      throw error;
    }
  };

export async function fixUserPlanStatus(userId) {
    try {
        const userPlans = await db
            .select()
            .from(UserPlan)
            .where(eq(UserPlan.userId, userId))
            .orderBy(desc(UserPlan.startDate));

        if (userPlans.length > 0) {
            const mostRecentPlan = userPlans[0];
            const now = new Date();
            const endDate = new Date(mostRecentPlan.endDate);
            
            // Check if plan should still be active
            if (now < endDate && !mostRecentPlan.isActive) {
                // Reactivate the plan
                await db
                    .update(UserPlan)
                    .set({ isActive: true })
                    .where(eq(UserPlan.id, mostRecentPlan.id));

                return await getCurrentUserPlan(userId);
            } else if (now >= endDate && mostRecentPlan.isActive) {
                // Deactivate expired plan
                await db
                    .update(UserPlan)
                    .set({ isActive: false })
                    .where(eq(UserPlan.id, mostRecentPlan.id));
            }
        }

        return null;
    } catch (error) {
        console.error('Error fixing user plan status:', error);
        throw error;
    }
}

export async function deactivateExpiredPlans() {
    try {
        const now = new Date();
        
        // Find and deactivate all expired plans
        await db
            .update(UserPlan)
            .set({ 
                isActive: false,
            })
            .where(
                and(
                    eq(UserPlan.isActive, true),
                    lte(UserPlan.endDate, now)
                )
            );
    } catch (error) {
        console.error('Error deactivating expired plans:', error);
        throw error;
    }
}

export async function cancelUserPlan(userId) {
    try {
        await db
            .update(UserPlan)
            .set({ 
                isActive: false,
                endDate: new Date()
            })
            .where(
                and(
                    eq(UserPlan.userId, userId),
                    eq(UserPlan.isActive, true)
                )
            );

        return true;
    } catch (error) {
        console.error('Error canceling user plan:', error);
        throw error;
    }
}