<script>
    import {
        displayChoices,
        displayWeaponChoices,
        collabLimit,
        clickedSlotIndex,
        weaponAddSymbols,
        equippedWeapons,
        removeWeapon,
        resetWeaponSlots
    } from '../../stores';

	import { basicWeapons, collabWeapons } from '../../variables';

    export let display;

    const collabForumlas = {
        'absolute-wall': ['bounce-ball', 'cutting-board'],
        'bl-fujoshi': ['bl-book', 'sui-axe'],
        'bone-bros': ['cutting-board', 'ens-curse'],
        'breathe-in-asacoco': ['holo-bomb', 'plug-in-asacoco'],
        'broken-dreams': ['chama-cooking', 'ceos-tears'],
        'dragon-fire': ['fan-beam', 'plug-in-asacoco'],
        'eldritch-horror': ['chama-cooking', 'ens-curse'],
        'elite-cooking': ['chama-cooking', 'lava-bucket'],
        'flattening-board': ['cutting-board', 'holo-bomb'],
        'frozen-sea': ['bl-book', 'wamy-water'],
        'im-die-ty-4eva': ['holo-bomb', 'x-potato'],
        'idol-concert': ['glowstick', 'idol-song'],
        'light-beam': ['fan-beam', 'glowstick'],
        'micomet': ['lava-bucket', 'sui-axe'],
        'mikorone': ['lava-bucket', 'x-potato'],
        'rap-dog': ['idol-song', 'x-potato'],
        'ring-of-fitness': ['bounce-ball', 'ceos-tears'],
        'snow-sake': ['glowstick', 'wamy-water'],
        'stream-of-tears': ['ceos-tears', 'fan-beam']
    };
    // initialize weapon displays
    let availableBasicWeapons = basicWeapons.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
    let availableCollabWeapons = collabWeapons.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
    let unavailableWeapons, remainingCollabs = [], oldWeaponSlotValue;

    // process for hiding/unhiding basic weapons and collabs:
    // basic weapon selected -> hide/unhide selected, all related collabs
    // collabs selected -> hide/unhide selected, respective component weapons, all collabs related to component weapons
    function getUnavailableWeapons(weapon) {
        for (const collabWeapon in collabForumlas) {
            // basic weapons
            if (basicWeapons.includes(weapon) && collabForumlas[collabWeapon].includes(weapon)) {
                unavailableWeapons.add(collabWeapon);
            }
            // collabs
            else if (collabWeapons.includes(weapon) && collabWeapon === weapon) {
                [...collabForumlas[collabWeapon]].forEach((weap) => {
                    unavailableWeapons.add(weap);
                });
                // ban collabs relating to basic weapons used for the initial collab
                collabForumlas[collabWeapon].forEach(formula => getUnavailableWeapons(formula));
            }
        }
    }

    function reinitialize() {
        availableBasicWeapons = basicWeapons.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
		availableCollabWeapons = collabWeapons.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
        unavailableWeapons = new Set();

        // hide all collabs
        if ($collabLimit === 0) {
            collabWeapons.forEach(collabWeapon => availableCollabWeapons[collabWeapon] = false);
        }

        // reenable collabs on 2 weapon slots available (excluding default weapon) and coming from less slots
        if (oldWeaponSlotValue === 2 && $equippedWeapons.length === 2) {
            collabWeapons.forEach(collabWeapon => availableCollabWeapons[collabWeapon] = true);
        }

        oldWeaponSlotValue = $equippedWeapons.length;
    }

    function manageWeaponChoices() {
        reinitialize();

        // identify unavailable weapons based on equipped weapons
        $equippedWeapons.filter(str => str !== '').forEach((weapon) => {
            unavailableWeapons.add(weapon);
            getUnavailableWeapons(weapon);
        });

        // hide all remaining collabs on collab limit
        if ($equippedWeapons.filter(weapon => collabWeapons.includes(weapon)).length === $collabLimit) {
            remainingCollabs = [];
            for (const collab in collabForumlas) {
                if (!unavailableWeapons.has(collab)) {
                    remainingCollabs.push(collab);
                }
            }
            remainingCollabs.forEach(collab => unavailableWeapons.add(collab));
        }

        // assign availability
        [...Object.keys(availableBasicWeapons)].forEach((weapon) => {
            if (unavailableWeapons.has(weapon)) {
                availableBasicWeapons[weapon] = false;
            }
        });
        [...Object.keys(availableCollabWeapons)].forEach((weapon) => {
            if (unavailableWeapons.has(weapon)) {
				availableCollabWeapons[weapon] = false;
            }
        });
    }

    function clickHandler(weapon) {
        // remove add symbol
        weaponAddSymbols.update((arr) => {
            arr[$clickedSlotIndex] = '';
            return arr;
        });

        // add selected weapon to equipped weapons
        equippedWeapons.update((arr) => {
            arr[$clickedSlotIndex] = weapon;
            return arr;
        });

        manageWeaponChoices();

        // hide menu
        displayChoices.set(false);
        displayWeaponChoices.set(false);
    }

    $: if ($removeWeapon) {
        // remove weapon in equipped weapons
		if ($clickedSlotIndex !== null) {
			equippedWeapons.update((arr) => {
				arr[$clickedSlotIndex] = '';
				return arr;
			});
		}

        manageWeaponChoices();

        // set boolean back to false
        removeWeapon.set(false);
    }

    $: if ($resetWeaponSlots) {
        reinitialize();
        resetWeaponSlots.set(false);
    }
</script>

<div id="weapon-choices" class="{display}">
	<div id="basic-choices">
		{#each Object.entries(availableBasicWeapons) as [basicWeapon, available]}
			{#if available}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="weapon choice" on:click={() => clickHandler(basicWeapon)}>
					<div class="img {basicWeapon}"></div>
				</div>
			{/if}
		{/each}
	</div>
	<div id="collab-choices">
		{#each Object.entries(availableCollabWeapons) as [collabWeapon, available]}
			{#if available}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="weapon choice" on:click={() => clickHandler(collabWeapon)}>
					<div class="img {collabWeapon}"></div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	.weapon:hover {
		background-color: #1B41A0;
	}

    :global(.bl-book) { background-image: url("/img/weapon/basic/BL_Book_Icon.png"); }
    :global(.bounce-ball) { background-image: url("/img/weapon/basic/Bounce_Ball_Icon.png"); }
    :global(.ceos-tears) { background-image: url("/img/weapon/basic/CEO's_Tears_Icon.png"); }
    :global(.cutting-board) { background-image: url("/img/weapon/basic/Cutting_Board_Icon.png"); }
    :global(.lava-bucket) { background-image: url("/img/weapon/basic/Elite_Lava_Bucket_Icon.png"); }
    :global(.ens-curse) { background-image: url("/img/weapon/basic/EN's_Curse_Icon.png"); }
    :global(.fan-beam) { background-image: url("/img/weapon/basic/Fan_Beam_Icon.png"); }
    :global(.glowstick) { background-image: url("/img/weapon/basic/Glowstick_Icon.png"); }
    :global(.holo-bomb) { background-image: url("/img/weapon/basic/Holo_Bomb_Icon.png"); }
    :global(.idol-song) { background-image: url("/img/weapon/basic/Idol_Song_Icon.png"); }
    :global(.plug-in-asacoco) { background-image: url("/img/weapon/basic/Plug_Type_Asacoco_Icon.png"); }
    :global(.sui-axe) { background-image: url("/img/weapon/basic/Psycho_Axe_Icon.png"); }
    :global(.chama-cooking) { background-image: url("/img/weapon/basic/Spider_Cooking_Icon.png"); }
    :global(.wamy-water) { background-image: url("/img/weapon/basic/Wamy_Water_Icon.png"); }
    :global(.x-potato) { background-image: url("/img/weapon/basic/X-Potato_Icon.png"); }
    :global(.absolute-wall) { background-image: url("/img/weapon/collab/Absolute_Wall_Icon.png"); }
    :global(.bl-fujoshi) { background-image: url("/img/weapon/collab/BL_Fujoshi_Icon.png"); }
    :global(.bone-bros) { background-image: url("/img/weapon/collab/Bone_Bros._Icon.png"); }
    :global(.breathe-in-asacoco) { background-image: url("/img/weapon/collab/Breathe-In_Type_Asacoco_Icon.png"); }
    :global(.broken-dreams) { background-image: url("/img/weapon/collab/Broken_Dreams_Icon.png"); }
    :global(.dragon-fire) { background-image: url("/img/weapon/collab/Dragon_Fire_Icon.png"); }
    :global(.eldritch-horror) { background-image: url("/img/weapon/collab/Eldritch_Horror_Icon.png"); }
    :global(.elite-cooking) { background-image: url("/img/weapon/collab/Elite_Cooking_Icon.png"); }
    :global(.flattening-board) { background-image: url("/img/weapon/collab/Flattening_Board_Icon.png"); }
    :global(.frozen-sea) { background-image: url("/img/weapon/collab/Frozen_Sea_Icon.png"); }
    :global(.im-die-ty-4eva) { background-image: url("/img/weapon/collab/I'm_Die,_Thank_You_Forever_Icon.png"); }
    :global(.idol-concert) { background-image: url("/img/weapon/collab/Idol_Concert_Icon.png"); }
    :global(.light-beam) { background-image: url("/img/weapon/collab/Light_Beam_Icon.png"); }
    :global(.micomet) { background-image: url("/img/weapon/collab/MiComet_Icon.png"); }
    :global(.mikorone) { background-image: url("/img/weapon/collab/MiKorone_Icon.png"); }
    :global(.rap-dog) { background-image: url("/img/weapon/collab/Rap_Dog_Icon.png"); }
    :global(.ring-of-fitness) { background-image: url("/img/weapon/collab/Ring_Of_Fitness_Icon.png"); }
    :global(.snow-sake) { background-image: url("/img/weapon/collab/Snow_Flower_Sake_Icon.png"); }
    :global(.stream-of-tears) { background-image: url("/img/weapon/collab/Stream_of_Tears_Icon.png"); }
</style>