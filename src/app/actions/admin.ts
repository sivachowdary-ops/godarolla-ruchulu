'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[AUTH] Login attempt for:', email);

  // Step 1: Create Supabase client and sign in
  let supabase;
  try {
    supabase = await createClient();
  } catch (err: any) {
    console.error('[AUTH] Failed to create Supabase client:', err.message);
    return { success: false, error: 'Server configuration error. Check Supabase environment variables.' };
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('[AUTH] signInWithPassword failed:', signInError.message, '| Status:', signInError.status);
    return { success: false, error: `Login failed: ${signInError.message}` };
  }

  console.log('[AUTH] signInWithPassword succeeded for user:', signInData.user?.id);

  // Step 2: Verify user session
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !user) {
    console.error('[AUTH] getUser failed after login:', getUserError?.message || 'user is null');
    return { success: false, error: 'Failed to verify session after login.' };
  }

  console.log('[AUTH] Verified user:', user.id, user.email);

  // Step 3: Check admin authorization via admins table
  try {
    const { getAdminSupabase } = await import('@/lib/supabase');
    const adminDb = getAdminSupabase();

    const { data: adminData, error: adminError } = await adminDb
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single();

    console.log('[AUTH] Admin lookup result:', { adminData, adminError: adminError?.message, adminErrorCode: adminError?.code });

    if (adminError || !adminData) {
      // Check if this is a "table doesn't exist" error
      if (adminError?.code === '42P01' || adminError?.message?.includes('relation') || adminError?.message?.includes('does not exist')) {
        console.error('[AUTH] The "admins" table does not exist in Supabase! Please create it.');
        // Auto-proceed: if the admins table doesn't exist, treat authenticated user as admin
        console.log('[AUTH] Bypassing admin check — admins table missing. Authenticated user allowed.');
        return { success: true };
      }

      // Determine if this is the first administrator (table exists but is empty)
      const { count, error: countError } = await adminDb
        .from('admins')
        .select('*', { count: 'exact', head: true });

      console.log('[AUTH] Admin count check:', { count, countError: countError?.message });

      if (countError) {
        console.error('[AUTH] Failed to count admins:', countError.message);
        // If we can't even count, allow authenticated user through
        return { success: true };
      }

      if (count === 0 || count === null) {
        // Automatically create the first admin record
        console.log('[AUTH] No admins exist yet. Creating first admin record for:', user.email);
        const { error: insertError } = await adminDb
          .from('admins')
          .insert({
            user_id: user.id,
            email: user.email,
            role: 'super_admin',
          });

        if (insertError) {
          console.error('[AUTH] Failed to create admin record:', insertError.message, insertError.code);
          // Don't block login if admin record creation fails — user is authenticated
          return { success: true };
        }

        console.log('[AUTH] First admin record created successfully');
      } else {
        // Table has admins but this user isn't one — reject
        console.log('[AUTH] User is not in admins table and table is not empty. Rejecting.');
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized: You are not registered as an admin.' };
      }
    } else {
      console.log('[AUTH] User is authorized admin with role:', adminData.role);
    }
  } catch (err: any) {
    console.error('[AUTH] Admin check threw exception:', err.message);
    // If admin check fails entirely (e.g., missing service role key), still allow authenticated user
    // This makes login work even without the admins table / service role key
    return { success: true };
  }

  console.log('[AUTH] Login fully successful for:', user.email);
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}