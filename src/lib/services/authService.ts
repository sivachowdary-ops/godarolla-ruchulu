import { createClient } from '@/lib/supabase/server';
import { getAdminSupabase } from '@/lib/supabase';

/**
 * Checks if the current request is from an authenticated and authorized admin.
 * Throws an error if unauthorized.
 */
export async function checkAuth(): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Authorize: Check if user exists in admins table
  const adminDb = getAdminSupabase();
  const { data: adminData, error: adminError } = await adminDb
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (adminError || !adminData) {
    throw new Error('Unauthorized: Insufficient privileges');
  }
}

/**
 * Gets the authenticated admin email for logging purposes.
 */
export async function getAdminEmail(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email || 'unknown@admin.com';
}
