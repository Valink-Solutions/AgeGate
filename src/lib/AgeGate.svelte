<!-- AgeGate.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { DatePicker } from 'bits-ui';
	import {
		CalendarDate,
		today,
		getLocalTimeZone,
		type DateValue,
		parseDate
	} from '@internationalized/date';

	// Browser check for SvelteKit compatibility
	let browser = typeof window !== 'undefined';

	// Configuration options (with defaults that can be overridden)
	let { minimumAge = 19, redirectUrl = 'https://www.google.com', cookieDuration = 30 } = $props();

	// State variables
	let showVerification = $state(true);
	// Default to 10 years ago
	const defaultDate = today(getLocalTimeZone()).subtract({ years: minimumAge });
	let birthDate = $state<CalendarDate | undefined>(defaultDate);
	let rememberChoice = $state(false);
	let formError = $state('');

	// Check for existing verification on mount
	onMount(() => {
		if (browser) {
			// Prevent right-click
			document.addEventListener('contextmenu', handleRightClick);

			// Check for existing verification cookie
			const verified = getCookie('age-verified');
			if (verified) {
				showVerification = false;
			}

			// Handle browser back button
			window.onpopstate = () => {
				if (showVerification) {
					redirect();
				}
			};
		}
	});

	// Handle verification submission
	function verifyAge() {
		// Clear previous errors
		formError = '';

		// Validate inputs
		if (!birthDate) {
			formError = 'Please select your date of birth';
			return;
		}

		// Get current date
		const currentDate = today(getLocalTimeZone());

		// Check that birthDate is a CalendarDate
		if (!(birthDate instanceof CalendarDate)) {
			formError = 'Invalid date format';
			return;
		}

		// Calculate age - both values are CalendarDate objects with year, month, day properties
		let age = currentDate.year - birthDate.year;

		// Adjust age if birthday hasn't occurred yet this year
		if (
			currentDate.month < birthDate.month ||
			(currentDate.month === birthDate.month && currentDate.day < birthDate.day)
		) {
			age--;
		}

		// Verify age
		if (age < minimumAge) {
			redirect();
			return;
		}

		// Success - set cookie if chosen
		if (rememberChoice && browser) {
			setAgeCookie(cookieDuration);
		}

		// Hide verification screen
		showVerification = false;
	}

	// Handle decline or cancel
	function decline() {
		redirect();
	}

	// Handle potential bypass with right-click
	function handleRightClick(e: MouseEvent) {
		if (showVerification) {
			e.preventDefault();
			redirect();
			return false;
		}
	}

	// Redirect to specified URL
	function redirect() {
		if (browser) {
			window.location.href = redirectUrl;
		}
	}

	// Cookie management functions
	function setAgeCookie(days: number) {
		const expires = new Date();
		expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `age-verified=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
	}

	function getCookie(name: string): string | null {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';')[0] || null;
		return null;
	}

	// Function to determine if a date is outside the valid range
	function isDateUnavailable(date: DateValue) {
		// Limit selection to 100+ years in the past (to prevent unrealistic ages)
		// and don't allow future dates
		const currentDate = today(getLocalTimeZone());
		const minDate = currentDate.subtract({ years: 110 });

		return date.compare(minDate) < 0 || date.compare(currentDate) > 0;
	}
</script>

{#if showVerification}
	<div class="agegate-overlay">
		<div class="agegate-card">
			<div class="agegate-header">
				<h2>Age Verification Required</h2>
			</div>

			<div class="agegate-body">
				<p class="agegate-mb-4">You must be {minimumAge} years or older to access this website.</p>
				<p class="agegate-mb-4">Please select your date of birth:</p>

				{#if formError}
					<div class="agegate-alert agegate-alert-error agegate-mb-4">
						<span>{formError}</span>
					</div>
				{/if}

				<div class="agegate-mb-4">
					<DatePicker.Root
						bind:value={birthDate}
						weekStartsOn={1}
						weekdayFormat="short"
						closeOnDateSelect={true}
						{isDateUnavailable}
						fixedWeeks={true}
					>
						<div class="flex w-full flex-col gap-1.5">
							<DatePicker.Label class="agegate-label">Date of Birth</DatePicker.Label>
							<DatePicker.Input class="agegate-input relative flex items-center px-2 py-3">
								{#snippet children({ segments })}
									{#each segments as { part, value }}
										<div class="inline-block select-none">
											{#if part === 'literal'}
												<DatePicker.Segment {part} class="p-1 text-gray-500">
													{value}
												</DatePicker.Segment>
											{:else}
												<DatePicker.Segment {part} class="px-1 py-1">
													{value}
												</DatePicker.Segment>
											{/if}
										</div>
									{/each}
									<DatePicker.Trigger class="agegate-trigger">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											class="size-6"
										>
											<path
												fill="currentColor"
												d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V3q0-.425.288-.712T7 2t.713.288T8 3v1h8V3q0-.425.288-.712T17 2t.713.288T18 3v1h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5z"
											/>
										</svg>
									</DatePicker.Trigger>
								{/snippet}
							</DatePicker.Input>

							<DatePicker.Content
								sideOffset={6}
								class="z-50 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800"
							>
								<DatePicker.Calendar
									class="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
								>
									{#snippet children({ months, weekdays })}
										<DatePicker.Header class="mb-4 flex items-center justify-between">
											<DatePicker.PrevButton
												class="inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												<span>←</span>
											</DatePicker.PrevButton>
											<DatePicker.Heading class="text-base font-medium" />
											<DatePicker.NextButton
												class="inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												<span>→</span>
											</DatePicker.NextButton>
										</DatePicker.Header>

										<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
											{#each months as month}
												<DatePicker.Grid class="w-full border-collapse space-y-1 select-none">
													<DatePicker.GridHead>
														<DatePicker.GridRow class="mb-1 flex w-full justify-between">
															{#each weekdays as day}
																<DatePicker.HeadCell
																	class="text-muted-foreground w-10 rounded-md text-xs font-normal!"
																>
																	<div>{day.slice(0, 2)}</div>
																</DatePicker.HeadCell>
															{/each}
														</DatePicker.GridRow>
													</DatePicker.GridHead>
													<DatePicker.GridBody>
														{#each month.weeks as weekDates}
															<DatePicker.GridRow class="flex w-full">
																{#each weekDates as date}
																	<DatePicker.Cell
																		{date}
																		month={month.value}
																		class="relative size-10 p-0! text-center text-sm"
																	>
																		<DatePicker.Day
																			class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground group relative inline-flex size-10 items-center justify-center border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap transition-all data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through"
																		>
																			<div
																				class="bg-foreground group-data-selected:bg-background absolute top-[5px] hidden size-1 rounded-full transition-all group-data-today:block"
																			></div>
																			{date.day}
																		</DatePicker.Day>
																	</DatePicker.Cell>
																{/each}
															</DatePicker.GridRow>
														{/each}
													</DatePicker.GridBody>
												</DatePicker.Grid>
											{/each}
										</div>
									{/snippet}
								</DatePicker.Calendar>
							</DatePicker.Content>
						</div>
					</DatePicker.Root>
				</div>

				<div class="agegate-mb-4">
					<label class="agegate-checkbox">
						<input type="checkbox" bind:checked={rememberChoice} />
						<span>Remember me for {cookieDuration} days</span>
					</label>
				</div>
			</div>

			<div class="agegate-footer">
				<button class="agegate-btn agegate-btn-primary" onclick={verifyAge}> Verify </button>
				<button class="agegate-btn agegate-btn-secondary" onclick={decline}> Decline </button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Base components for AgeGate */
	.agegate-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(250, 250, 250, 0.98);
		padding: 1rem;
	}

	.agegate-card {
		width: 100%;
		max-width: 450px;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.agegate-header {
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid #eee;
		background-color: #fafafa;
	}

	.agegate-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}

	.agegate-body {
		padding: 1.5rem;
	}

	.agegate-footer {
		padding: 1.25rem 1.5rem;
		border-top: 1px solid #eee;
		background-color: #fafafa;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	/* Form elements */
	/* .agegate-input {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		line-height: 1.5;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: white;
	}

	.agegate-input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.agegate-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
	} */

	.agegate-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.agegate-checkbox input[type='checkbox'] {
		width: 1rem;
		height: 1rem;
		border: 1px solid #ddd;
		border-radius: 3px;
	}

	/* Buttons */
	.agegate-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25rem;
		border: 1px solid transparent;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.agegate-btn-primary {
		background-color: #4f46e5;
		color: white;
	}

	.agegate-btn-primary:hover {
		background-color: #4338ca;
	}

	.agegate-btn-secondary {
		background-color: white;
		border-color: #ddd;
		color: #374151;
	}

	.agegate-btn-secondary:hover {
		background-color: #f9fafb;
		border-color: #c4c4c4;
	}

	/* Alert message */
	.agegate-alert {
		padding: 0.75rem 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.agegate-alert-error {
		background-color: #fee2e2;
		border: 1px solid #fecaca;
		color: #b91c1c;
	}

	/* Utilities */
	/* .agegate-flex {
		display: flex;
	}

	.agegate-flex-wrap {
		flex-wrap: wrap;
	}

	.agegate-gap-2 {
		gap: 0.5rem;
	}

	.agegate-gap-4 {
		gap: 1rem;
	} */

	.agegate-mb-4 {
		margin-bottom: 1rem;
	}

	/* .agegate-mb-2 {
		margin-bottom: 0.5rem;
	} */

	/* Input type number styles */
	/* input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	} */

	/* Date picker specific styles */
	/* .agegate-date-picker {
		width: 100%;
	}

	.agegate-input-wrapper {
		position: relative;
	}

	.agegate-segment-wrapper {
		display: inline-block;
	}

	.agegate-segment {
		padding: 0.25rem;
		display: inline-flex;
		min-width: 1.5rem;
		justify-content: center;
	}

	.agegate-segment-literal {
		color: #6b7280;
	}

	.agegate-input {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0.5rem 2.5rem 0.5rem 0.75rem;
	}

	.agegate-trigger {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #6b7280;
	}

	.agegate-trigger:hover {
		color: #374151;
	} */

	/* Responsive adjustments */
	@media (max-width: 640px) {
		/* .agegate-date-inputs {
			flex-direction: column;
		}

		.agegate-date-input {
			width: 100%;
		} */
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.agegate-overlay {
			background-color: rgba(20, 20, 20, 0.98);
		}

		.agegate-card {
			background-color: #1f2937;
		}

		.agegate-header,
		.agegate-footer {
			background-color: #111827;
			border-color: #374151;
		}

		.agegate-header h2 {
			color: #f9fafb;
		}

		/* .agegate-input {
			background-color: #374151;
			border-color: #4b5563;
			color: #f9fafb;
		}

		.agegate-input:focus {
			border-color: #818cf8;
			box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
		}

		.agegate-label,
		.agegate-body {
			color: #f9fafb;
		} */

		.agegate-btn-secondary {
			background-color: #374151;
			border-color: #4b5563;
			color: #f9fafb;
		}

		.agegate-btn-secondary:hover {
			background-color: #4b5563;
		}

		.agegate-alert-error {
			background-color: rgba(185, 28, 28, 0.2);
			border-color: #b91c1c;
			color: #fca5a5;
		}

		/* .agegate-calendar-content {
			background-color: #1f2937;
		}

		.agegate-calendar-nav-btn:hover {
			background-color: #374151;
		}

		.agegate-calendar-cell:hover {
			background-color: #374151;
		}

		.agegate-calendar-cell[data-selected='true'] {
			background-color: #6366f1;
		}

		.agegate-calendar-cell[data-selected='true']:hover {
			background-color: #4f46e5;
		} */
	}
</style>
