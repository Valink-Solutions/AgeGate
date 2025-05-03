<div class="container mx-auto max-w-4xl p-4">
	<h1 class="mb-6 text-3xl font-bold">AgeGate Component</h1>

	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">Implementation Example</h2>
		<p class="mb-4">
			This page includes the AgeGate component via the layout file. If you're seeing this content,
			you've either:
		</p>
		<ul class="mb-4 list-disc pl-6">
			<li>Successfully verified your age</li>
			<li>Previously verified and have a cookie set</li>
		</ul>

		<div class="rounded-md p-4">
			<p class="mb-4 font-mono text-sm opacity-75">
				Implementation in <code>+layout.svelte</code>:
			</p>
			<pre class="mt-2 overflow-x-auto bg-gray-100 p-2 text-sm">
&lt;script&gt;
    import &#123; AgeGate &#125; from 'agegate';
    import 'agegate/styles.css';
&lt;/script&gt;

&lt;AgeGate
    minimumAge=&#123;19&#125;
    redirectUrl="https://www.google.com"
    cookieDuration=&#123;30&#125;
/&gt;

&lt;slot /&gt;
      </pre>
		</div>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">Configuration Options</h2>

		<table class="min-w-full border-collapse">
			<thead>
				<tr>
					<th class="border border-gray-300 px-4 py-2 text-left">Prop</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Type</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Default</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="border border-gray-300 px-4 py-2"><code>minimumAge</code></td>
					<td class="border border-gray-300 px-4 py-2">number</td>
					<td class="border border-gray-300 px-4 py-2">19</td>
					<td class="border border-gray-300 px-4 py-2"
						>The minimum age required to access the site</td
					>
				</tr>
				<tr>
					<td class="border border-gray-300 px-4 py-2"><code>redirectUrl</code></td>
					<td class="border border-gray-300 px-4 py-2">string</td>
					<td class="border border-gray-300 px-4 py-2">'https://www.google.com'</td>
					<td class="border border-gray-300 px-4 py-2"
						>The URL to redirect to if age verification fails</td
					>
				</tr>
				<tr>
					<td class="border border-gray-300 px-4 py-2"><code>cookieDuration</code></td>
					<td class="border border-gray-300 px-4 py-2">number</td>
					<td class="border border-gray-300 px-4 py-2">30</td>
					<td class="border border-gray-300 px-4 py-2"
						>Number of days to remember the user's verification</td
					>
				</tr>
			</tbody>
		</table>
	</div>
</div>
