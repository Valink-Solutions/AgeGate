import type { SvelteComponent } from 'svelte';

export interface AgeGateProps {
	/**
	 * The minimum age required to access the site
	 * @default 19
	 */
	minimumAge?: number;

	/**
	 * The URL to redirect to if age verification fails
	 * @default 'https://www.google.com'
	 */
	redirectUrl?: string;

	/**
	 * Number of days to remember the user's verification (if they choose to remember)
	 * @default 30
	 */
	cookieDuration?: number;
}

export default class AgeGate extends SvelteComponent<AgeGateProps> {}
