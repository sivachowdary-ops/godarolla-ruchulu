'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: 'Invalid credentials' };
  }

  // After a successful login, we also should check if this user is actually an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // Check if user is in admins table
    const { getAdminSupabase } = await import('@/lib/supabase');
    const adminDb = getAdminSupabase();
    const { data: adminData, error: adminError } = await adminDb
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single();

    console.log("Reached login action");
    console.log("User", user);
    console.log("Admin query", adminData);
    console.log("Admin error", adminError);

    if (adminError || !adminData) {
      // Determine if this is the first administrator
      const { count, error: countError } = await adminDb
        .from('admins')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        // Automatically create the first admin record
        const { error: insertError } = await adminDb
          .from('admins')
          .insert({
            user_id: user.id,
            email: user.email,
            role: 'super_admin',
          });
      } else {
        // Not an admin, sign out and reject
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized: Insufficient privileges' };
      }
    }
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}