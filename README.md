# AgeGate

A customizable age verification component for SvelteKit and Astro projects. Built with Svelte 5.

## Installation

```bash
npm install agegate
# or
pnpm add agegate
# or
yarn add agegate
```

## Usage

### 1. Import the component and styles in your layout file

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { AgeGate } from 'agegate';
	import 'agegate/styles.css';

	// Your layout code
</script>

<!-- Add the AgeGate component at the top of your layout -->
<AgeGate minimumAge={21} redirectUrl="https://www.example.com" cookieDuration={30} />

<!-- Your layout content -->
<slot />
```

### 2. Configuration options

The AgeGate component accepts the following props:

| Prop             | Type   | Default                  | Description                                                                     |
| ---------------- | ------ | ------------------------ | ------------------------------------------------------------------------------- |
| `minimumAge`     | number | 19                       | The minimum age required to access the site                                     |
| `redirectUrl`    | string | 'https://www.google.com' | The URL to redirect to if age verification fails                                |
| `cookieDuration` | number | 30                       | Number of days to remember the user's verification (if they choose to remember) |

## Features

- 🔒 Age verification with date picker
- 🍪 Cookie-based remembering of verification
- 🌓 Dark mode support
- 📱 Responsive design
- 🔧 Customizable properties
- ⚡ Built with Svelte 5 runes
- 🧩 Easy integration with SvelteKit and Astro projects

## Requirements

- Svelte 5.0.0 or higher
- SvelteKit 2.0.0 or higher (for SvelteKit projects)

## Dependencies

This component uses:

- [bits-ui](https://www.bits-ui.com/) for the date picker
- [@internationalized/date](https://www.npmjs.com/package/@internationalized/date) for date manipulation

## Developing

Once you've cloned the repository and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## License

MIT
