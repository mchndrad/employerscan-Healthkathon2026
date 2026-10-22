/**
 * TEMPORARY LOGOUT PAGE
 * URL: /logout
 *
 * NOTE: Ini sementara buat test. Nanti Day 4 dibikin proper
 *       logout button di navbar/sidebar.
 *
 * Server Component yang auto-trigger logout saat di-akses.
 */

import { logoutAction } from '@/app/(auth)/login/actions';

export default async function LogoutPage() {
  // Trigger logout saat page di-akses
  // Server component bisa langsung call server action
  await logoutAction();

  // Note: redirect di dalam logoutAction akan throw,
  // jadi code di bawah ini sebenarnya gak akan ke-execute
  return <div>Logging out...</div>;
}
