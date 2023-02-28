<script>
	import { onMount } from 'svelte';

    import Frame from './Frame/Frame.svelte';
    import Settings from './Settings.svelte';
    import Choices from './Choices/Choices.svelte';

	import {
		charSelected, showBuildName, buildName,
		equippedWeapons, weaponAddSymbols, removeWeapon, weaponSlots, collabLimit,
		equippedItems, itemAddSymbols, removeItem,
		equippedStamps, stampAddSymbols, removeStamp, showStamps,
		statPriorityOrder, showPriorityOrder
	} from '../stores';

	import { characters, collabWeapons, weapons, items, stamps, stats } from '../variables';

	import { Buffer } from 'buffer';
    import html2canvas from 'html2canvas';
    import FileSaver from 'file-saver';

	// generate build from parameter
	onMount(() => {
		// get parameter
		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams, prop) => searchParams.get(prop)
		});

		if (!params.build) return;

		// get actual build string from the Redis database
		let buildStr;
		fetch(`https://hcbm-api.onrender.com/get?id=${params.build}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (!data) throw 'Data unavailable';

				buildStr = data['id'];

				const param = Buffer.from(buildStr, 'base64').toString('utf8');

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
				const matches = param.match(/(?<=&|^).+?(?=&|$)/g);
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
			})
			.catch((err) => {
				console.error(err);
			});
	})

    function saveImage() {
        html2canvas(document.querySelector('#build-container'), { backgroundColor: '#27272A' })
        .then((canvas) => {
            const bldName = document.querySelector('#build-name');
            const fileName = bldName !== null ? bldName.textContent : 'Build Name';
            canvas.toBlob(blob => FileSaver.saveAs(blob, `${fileName}.png`));
        });
    }

	function generateId() {
		let id = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < 8; i++) {
			id += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return id;
	}

	let link, copySuccess = false, oldEncoded;
	// save attributes of the build in one long string which will be parsed on load
	function generateLink() {
		/*
		name = array index
		any boolean = binary
		build name, weapon slots = as is
		all gears, stat priority = array index (convert to empty string if empty slot) -> comma-delimited string
		*/
		const c = characters.indexOf($charSelected);
		const b = +$showBuildName;
		const n = $buildName;
		const l = $weaponSlots
		const w = $equippedWeapons.map(weapon => weapons.indexOf(weapon)).map(i => i !== -1 ? i : '').join(',');
		const i = $equippedItems.map(item => items.indexOf(item)).map(i => i !== -1 ? i : '').join(',');
		const t = +$showStamps;
		const s = $equippedStamps.map(stamp => stamps.indexOf(stamp)).map(i => i !== -1 ? i : '').join(',');
		const a = $statPriorityOrder.map(stat => stats.indexOf(stat)).join(',');

		// place all with its respective key and encode to base64
		const finalEncoded = Buffer.from(`c:${c}&b:${b}&n:${n}&l:${l}&w:${w}&i:${i}&t:${t}&s:${s}&a:${a}`).toString('base64');

		// generate random 8-length alphanumeric string as the key for the Redis database
		// and to shorten the generated link
		const id = generateId();

		// prevent storing link of the same build consecutively
		if (finalEncoded !== oldEncoded) {
			// store link in database
			fetch(`https://hcbm-api.onrender.com/set?${id}=${finalEncoded}`)
				.then((response) => {
					if (!response) throw 'Error in saving ID';
					link = `https://${window.location.host}${window.location.pathname}?build=${id}`;
					copySuccess = false;
				})
				.catch((error) => {
					console.log(error);
				});
			oldEncoded = finalEncoded;
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(link).then(() => copySuccess = true);
	}
</script>

<main id="main-container">
    <h1 id="title">HOLOCURE BUILD MAKER</h1>
    <p id="subtitle">Updated for v0.5</p>
    <Frame/>
</main>
<Settings/>
<Choices/>
<div id="save-image-container">
    <button id="save-image" on:click={saveImage}>Save Image</button>
</div>
{#if link}
	<div id="generated-link">
		<p>{link}</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div>
			{#if copySuccess}
				<p>COPIED!</p>
			{/if}
			<span class="material-symbols-outlined" on:click={copyToClipboard}>content_copy</span>
		</div>
	</div>
{/if}
<div id="generate-link-container">
    <button id="generate-link" on:click={generateLink}>Generate Link</button>
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

    #save-image-container, #generate-link-container {
        display: flex;
        justify-content: center;
        width: 100%;
		margin: 20px auto;
    }
    #save-image, #generate-link {
        font-size: 16px;
        width: 175px;
        height: 40px;
    }
	#generated-link {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: var(--dark-bg-color);
		margin: 20px auto;
		padding: 5px 10px 10px 10px;
		width: max-content;
		line-height: 30px;

		div {
			display: flex;
			align-items: center;
			height: 35px;
			margin-left: 10px;

			p {
				padding-bottom: 5px;
				margin-right: 2px;
			}
		}

		.material-symbols-outlined {
			font-weight: bold;

			&:hover {
				cursor: pointer;
				color: white;
			}
		}
	}
</style>