/* Stripe payment links + checkout helper — shared by App.jsx and Landing.jsx. */
export const STRIPE_LINKS = {
  solo:     "https://buy.stripe.com/dRmbJ0cabbUSdIIanq1sQ02",
  team:     "https://buy.stripe.com/14A6oGeij7EC200dzC1sQ01",
  business: "https://buy.stripe.com/6oU7sKeij5wuaww7be1sQ03",
};

/* Open a Stripe checkout link in a new tab, with a popup-blocker fallback. */
export function openCheckout(url) {
  if (!url || url.includes("REPLACE")) {
    console.warn("Stripe payment link not configured:", url);
    return;
  }
  const win = window.open(url, "_blank");
  if (win) win.opener = null;          // sever access back to this page
  else window.location.href = url;     // popup blocked → navigate directly
}
