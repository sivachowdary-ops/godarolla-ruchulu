import { getAdminEmail } from './authService';

/**
 * Logs an administrative action to the database for auditing purposes.
 * 
 * @param supabase Admin Supabase client instance
 * @param actionType The type of action performed (e.g., 'CREATE_PRODUCT', 'IMAGE_UPLOAD')
 * @param details Additional context or details about the action
 */
export async function logAction(supabase: any, actionType: string, details: any) {
  try {
    const adminEmail = await getAdminEmail();
    await supabase.from('admin_logs').insert({
      admin_email: adminEmail,
      action: actionType,
      details
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
