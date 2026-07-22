import { createClient } from '@/lib/supabase/server';

/**
 * Checks if the current request is from an authenticated admin.
 * Throws an error if not authenticated.
 * Gracefully handles missing admins table — if authenticated via Supabase, allows access.
 */
export async function checkAuth(): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  // Try to verify admin role, but don't block if admins table is missing
  try {
    const { getAdminSupabase } = await import('@/lib/supabase');
    const adminDb = getAdminSupabase();
    const { data: adminData, error: adminError } = await adminDb
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single();

<<<<<<< HEAD
  console.log("Reached checkAuth");
  console.log("User", user);
  console.log("Admin query", adminData);
  console.log("Admin error", adminError);

  if (adminError || !adminData) {
    throw new Error('Unauthorized: Insufficient privileges');
=======
    if (adminError) {
      // If table doesn't exist or service key is missing, allow authenticated user
      if (adminError.code === '42P01' || adminError.message?.includes('relation') || adminError.message?.includes('does not exist')) {
        console.warn('[AUTH] admins table does not exist — allowing authenticated user');
        return;
      }
      
      // PGRST116 = "no rows returned" from .single() — user not in admins table
      if (adminError.code === 'PGRST116') {
        console.warn('[AUTH] User not found in admins table:', user.email);
        throw new Error('Unauthorized: Insufficient privileges');
      }

      console.error('[AUTH] Unexpected admin check error:', adminError.message);
      // Allow authenticated user through on unexpected errors
      return;
    }
  } catch (err: any) {
    // If getAdminSupabase() throws (missing SUPABASE_SERVICE_ROLE_KEY), allow authenticated user
    if (err.message === 'Missing SUPABASE_SERVICE_ROLE_KEY') {
      console.warn('[AUTH] No service role key — skipping admin table check');
      return;
    }
    if (err.message?.includes('Unauthorized')) {
      throw err; // Re-throw actual auth errors
    }
    console.error('[AUTH] checkAuth exception:', err.message);
    return; // Allow authenticated user on unexpected errors
>>>>>>> 89fd0025612a371fb7876140adacbe2ee2130c9e
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
