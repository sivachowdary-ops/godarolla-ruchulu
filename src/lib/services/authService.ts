import { verifyAdminSession } from '@/app/actions/admin';

/**
 * Checks if the current request is from an authenticated admin.
 * Throws an error if unauthorized.
 */
export async function checkAuth(): Promise<void> {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    throw new Error('Unauthorized');
  }
}

/**
 * Gets the admin email for logging purposes.
 */
export async function getAdminEmail(): Promise<string> {
  // Normally this would come from the decoded session JWT.
  return process.env.ADMIN_EMAIL || 'admin@godarollaruchulu.com';
}
