// Export the AgeGate component as the main export
export { default as AgeGate } from './AgeGate.svelte';

// Export types
export type AgeGateProps = {
	minimumAge?: number;
	redirectUrl?: string;
	cookieDuration?: number;
};
