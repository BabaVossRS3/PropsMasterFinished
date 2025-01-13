
import { db } from './../configs';
import { eq, and, desc } from 'drizzle-orm';
import { UserPlan } from './../configs/schema';

export async function updateUserPlan(userId, newPlan) {
    try {
        const now = new Date();
        
        // Calculate end date based on plan type
        const daysToAdd = newPlan === 'Boost+' ? 60 : 30;
        const endDate = new Date(now.getTime());
        endDate.setDate(endDate.getDate() + daysToAdd);
        
        // Format dates
        const startDateFormatted = now.toISOString().split('T')[0];
        const endDateFormatted = endDate.toISOString().split('T')[0];
        
        // First check if user has an existing plan
        const existingPlan = await db
            .select()
            .from(UserPlan)
            .where(eq(UserPlan.userId, userId))
            .limit(1);
        
        if (existingPlan.length > 0) {
            // Update existing plan
            await db
                .update(UserPlan)
                .set({
                    plan: newPlan,
                    startDate: startDateFormatted,
                    endDate: endDateFormatted,
                    isActive: true
                })
                .where(eq(UserPlan.userId, userId));
        } else {
            // Insert new plan only if user doesn't have one
            await db
                .insert(UserPlan)
                .values({
                    userId,
                    plan: newPlan,
                    startDate: startDateFormatted,
                    endDate: endDateFormatted,
                    isActive: true
                });
        }
        
        return {
            plan: newPlan,
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            isActive: true,
            remainingDays: daysToAdd
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