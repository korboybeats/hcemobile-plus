/* HCEMobile fork — API base for online play (Cloudflare Worker relay).
 * Installed home-screen PWAs read this file, so the URL sticks without ?api=.
 * Override per-session with ?api=https://...
 */
window.HCE_API_BASE = "https://hcemobile-api-relay.korboybeats.workers.dev";
