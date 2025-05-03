<script lang="ts">
	import AgeGate from '$lib/AgeGate.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<AgeGate />

{@render children()}
