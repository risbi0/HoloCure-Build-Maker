<script>
    import Frame from '$lib/Frame/Frame.svelte';
    import Settings from '$lib/Settings.svelte';
	import Link from '$lib/Link.svelte';
	import SaveImage from '$lib/SaveImage.svelte';
    import Choices from '$lib/Choices/Choices.svelte';

	// Vercel Analytics
	import { inject } from '@vercel/analytics';
	import { dev, browser } from '$app/environment';
	import { page } from '$app/stores';
	import { webVitals } from '$lib/vitals';

	inject({ mode: dev ? 'development' : 'production' });

	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

	$: if (browser && analyticsId) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId
		});
	}

	// generate build from parameter
	import { Buffer } from 'buffer';
	import {
		charSelected, showBuildName, buildName,
		equippedWeapons, weaponAddSymbols, removeWeapon, weaponSlots, collabLimit,
		equippedItems, itemAddSymbols, removeItem,
		equippedStamps, stampAddSymbols, removeStamp, showStamps,
		statPriorityOrder, showPriorityOrder
	} from '$lib/stores';
	import { characters, collabWeapons, weapons, items, stamps, stats } from '$lib/variables';

	export let data;

	if (data['buildStr']) {
		// decode string
		const buildString = Buffer.from(data['buildStr'], 'base64').toString('utf8');

		/*
		c = character
		b = show build name
		n = build name
		l = weapon slot #
		w = weapons
		i = items
		t = show stamps
		s = stamps
		a = stats
		*/

		// separate build attributes
		const matches = buildString.match(/(?<=&|^).+?(?=&|$)/g);
		const keys = ['c', 'b', 'n', 'l', 'w', 'i', 't', 's', 'a'];
		const nonInteger = ['n', 'w', 'i', 's', 'a']; // the rest are boolean
		const build = {};

		// store param in object
		for (let i = 0; i < matches.length; i++) {
			const keyValue = matches[i].split(':');

			// stop loop once abnormal attributes are detected
			if (keyValue.length !== 2 && !keys.includes(keyValue[0])) break;

			const key = keyValue[0];
			// parse integer values
			const value = nonInteger.includes(key) ?  keyValue[1] : parseInt(keyValue[1]);
			build[key] = value;
		}

		// character
		if ('c' in build) charSelected.set(characters[build['c']]);
		// show build name
		if ('b' in build) showBuildName.set(Boolean(build['b']));
		// build name
		if ('n' in build) buildName.set(build['n']);
		// weapon slot #
		if ('l' in build && build['l'] >= 1 && build['l'] <= 6) {
			weaponSlots.set(build['l']);
			equippedWeapons.set(Array(build['l'] - 1).fill(''));
			weaponAddSymbols.set(Array(build['l'] - 1).fill('add'));
		}
		// weapons
		if ('w' in build && build['w'].split(',').every(i => (parseInt(i) >= 0 && parseInt(i) <= weapons.length - 1) || i === '')) {
			const indices = build['w'].split(',');
			// filter first to remove empty elements
			const collabAmount = indices.filter(i => i).map(i => i >= collabWeapons.length - 1 && i <= weapons.length - 1).length;
			// remove elemnts based on weapon slot amount
			indices.splice($weaponSlots - 1);
			// remove collab in rightmost slot if breaking collab limit
			if (collabAmount >= $weaponSlots) indices[indices.length - 1] = '';

			equippedWeapons.set(indices.map(i => weapons[parseInt(i)]).map(i => i ? i : ''));
			weaponAddSymbols.set(indices.map(i => i === '' ? 'add' : ''));
			collabLimit.set($weaponSlots - 2);
			removeWeapon.set(true);
		}
		// items
		if ('i' in build && build['i'].split(',').every(i => (parseInt(i) >= 0 && parseInt(i) <= items.length - 1) || i === '')) {
			const indices = build['i'].split(',');
			equippedItems.set(indices.map(i => items[parseInt(i)]).map(i => i ? i : ''));
			itemAddSymbols.set(indices.map(i => i === '' ? 'add' : ''));
			removeItem.set(true);
		}
		// show stamps
		if ('t' in build) showStamps.set(Boolean(build['t']));
		// stamps
		if ('s' in build && build['s'].split(',').every(i => (parseInt(i) >= 0 && parseInt(i) <= items.length - 1) || i === '')) {
			const indices = build['s'].split(',');
			equippedStamps.set(indices.map(i => stamps[parseInt(i)]).map(i => i ? i : ''));
			stampAddSymbols.set(indices.map(i => i === '' ? 'add' : ''));
			removeStamp.set(true);
		}
		// stat priority
		if ('a' in build && build['a'].split(',').every(i => parseInt(i) >= 0 && parseInt(i) <= stats.length - 1)) {
			statPriorityOrder.set(build['a'].split(',').map(i => stats[parseInt(i)]));
			showPriorityOrder.set(true);
		}
	}
</script>

<main id="main-container">
    <h1 id="title">HOLOCURE BUILD MAKER</h1>
    <p id="subtitle">Updated for v0.5</p>
    <Frame/>
</main>
<Settings/>
<SaveImage/>
<Link/>
<Choices/>
<div id="source-code-container">
	<a id="source-code" href="https://github.com/risbi0/HoloCure-Build-Maker" target="_blank" rel="noreferrer">Source Code</a>
</div>

<style lang="scss">
    :global(:root) {
        --font-color: #E5E7EB;
        --bg-color: #27272A;
        --dark-bg-color: #18181B;
    }

	:global(::-webkit-scrollbar) {
		width: 6px;
	}
	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--font-color);
		border-radius: 10px;

		&:hover {
			background-color: white;
		}
	}
	:global(::-webkit-scrollbar-track) {
		background-color: var(--bg-color);
	}

    :global(*) {
        color: var(--font-color);
		/* mozilla scrollbar */
		scrollbar-color: var(--font-color) var(--bg-color) !important;
    	scrollbar-width: thin !important;
    }

    :global(body) {
        background-color: var(--bg-color);
		min-height: 100vh;
		position: relative;
    }

    :global(*, body) {
        font-family: BestTenDOT;
        letter-spacing: 1px;
    }

    :global(select option) {
        /* custom typeface somehow doesn't apply to the dropdown items, so a fallback */
        font-family: Arial, Helvetica, sans-serif;
    }

    :global(input:focus,
    select:focus,
    button:focus) {
        outline: none;
    }

    :global(button) {
		position: relative;
        cursor: pointer;
        border: none;
        width: 130px;
        height: 35px;
        font-size: 14px;
        background-color: var(--dark-bg-color);
        padding-bottom: 5px;

		&:hover {
			background-color: var(--font-color);
			color: var(--dark-bg-color);
		}
    }

    :global(input:focus, select:focus, button:focus) {
        outline: none;
    }

    :global(.hidden) {
        display: none !important;
    }

    #main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #title {
        font-size: 48px;
        margin-top: 50px;
        margin-bottom: 30px;
        letter-spacing: 3px;
    }
    #subtitle {
        margin-bottom: 50px;
    }

    :global(.img) {
        position: relative;
        background-size: auto 100%;
        background-position: center;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
    }

    :global(.weapon) {
        border: 3px solid #4779F4;
    }

    :global(.item) {
        border: 3px solid #9FFF87;
    }

    :global(.stamp) {
        border: 3px solid #FFF38C;
    }

    :global(#save-image-container, #generate-link-container) {
        display: flex;
        justify-content: center;
        width: 100%;
		padding-bottom: 20px;
    }
    :global(#save-image, #generate-link) {
        font-size: 16px;
        width: 175px;
        height: 40px;
    }

	#source-code-container {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}
	#source-code {
		text-decoration: none;
		font-size: 12px;
		padding-bottom: 5px;

		&:hover {
			border-bottom: 2px dashed var(--font-color);
		}
	}
</style>