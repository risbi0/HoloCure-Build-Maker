<script>
	import { Buffer } from 'buffer';

	import {
		charSelected, showBuildName, buildName,
		equippedWeapons, weaponSlots,
		equippedItems,
		equippedStamps, showStamps,
		statPriorityOrder
	} from '$lib/stores';

	import { characters, weapons, items, stamps, stats } from '$lib/variables';

	function generateId() {
		let id = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < 8; i++) {
			id += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return id;
	}

	let message, copySuccess = false, oldEncoded;
	// save attributes of the build in one long string which will be parsed on load
	function generateLink() {
		message = 'Generating link. Please wait...'
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
			fetch('/api/set-id', { method: 'POST', body: JSON.stringify({redisKey: id, redisValue: finalEncoded})})
				.then(() => {
					message = `${window.location.protocol}//${window.location.host}${window.location.pathname}?build=${id}`;
					copySuccess = false;
					oldEncoded = finalEncoded;
				})
				.catch((error) => {
					message = 'Error. Please try again.';
					console.error(error);
				});
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(message).then(() => copySuccess = true);
	}
</script>

{#if message}
	<div id="generated-link">
		<p>{message}</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div>
			{#if copySuccess}
				<p>COPIED!</p>
			{:else if !copySuccess && message.includes('build')}
				<span class="material-symbols-outlined" on:click={copyToClipboard}>content_copy</span>
			{/if}
		</div>
	</div>
{/if}
<div id="generate-link-container">
	<button id="generate-link" on:click={generateLink}>Generate Link</button>
</div>

<style lang="scss">
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