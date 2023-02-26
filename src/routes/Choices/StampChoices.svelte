<script>
    import {
        displayChoices,
        displayStampChoices,
        equippedStamps,
        stampAddSymbols,
        clickedSlotIndex,
        removeStamp,
        resetStampSlots
    } from "../../stores";

    export let display;

    const stamps = [
        'atk', 'bomb', 'crit', 'greed', 'haste', 'knockback', 'life-steal', 'projectile',
        'reverse', 'rgb', 'size', 'slow', 'solo', 'stun', 'trumpet', 'weaken'
    ];

    // initialize stamp displays
    let availableStamps = stamps.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});

    // show previous equipped stamp when replacing
    function showPrevious() {
        if ($equippedStamps[$clickedSlotIndex]) {
            availableStamps[$equippedStamps[$clickedSlotIndex]] = true;
        }
    }

    function clickHandler(stamp) {
        showPrevious();

        // remove add symbol
        stampAddSymbols.update((arr) => {
            arr[$clickedSlotIndex] = '';
            return arr;
        });

        // add selected stamp to equipped stamps
        equippedStamps.update((arr) => {
            arr[$clickedSlotIndex] = stamp;
            return arr;
        });

        // hide selected item
        availableStamps[stamp] = false;

        // hide menu
        displayChoices.set(false);
        displayStampChoices.set(false);
    }

    $: if ($removeStamp) {
        showPrevious();

        // remove item in equipped items
        equippedStamps.update((arr) => {
            arr[$clickedSlotIndex] = '';
            return arr;
        });

        // set boolean back to false
        removeStamp.set(false);
    }

    $: if ($resetStampSlots) {
        availableStamps = stamps.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
        resetStampSlots.set(false);
    }
</script>

<div id="stamp-choices" class="{display}">
    {#each Object.entries(availableStamps) as [stamp, available]}
        {#if available}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="stamp choice" on:click={() => clickHandler(stamp)}>
                <div class="img {stamp}"></div>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
	.stamp:hover {
		background-color: #C2B971;
	}

    :global(.atk) { background-image: url("/img/stamp/ATK_Up_Stamp_Icon.png"); }
    :global(.bomb) { background-image: url("/img/stamp/Bomb_Stamp_Icon.png"); }
    :global(.crit) { background-image: url("/img/stamp/Crit_Up_Stamp_Icon.png"); }
    :global(.greed) { background-image: url("/img/stamp/Greed_Stamp_Icon.png"); }
    :global(.haste) { background-image: url("/img/stamp/Haste_Up_Stamp_Icon.png"); }
    :global(.knockback) { background-image: url("/img/stamp/Knockback_Stamp_Icon.png"); }
    :global(.life-steal) { background-image: url("/img/stamp/Life_Steal_Stamp_Icon.png"); }
    :global(.projectile) { background-image: url("/img/stamp/Projectile_Up_Stamp_Icon.png"); }
    :global(.reverse) { background-image: url("/img/stamp/Reverse_Stamp_Icon.png"); }
    :global(.rgb) { background-image: url("/img/stamp/RGB_Stamp_Icon.png"); }
    :global(.size) { background-image: url("/img/stamp/Size_Up_Stamp_Icon.png"); }
    :global(.slow) { background-image: url("/img/stamp/Slow_Stamp_Icon.png"); }
    :global(.solo) { background-image: url("/img/stamp/Solo_Stamp_Icon.png"); }
    :global(.stun) { background-image: url("/img/stamp/Stun_Stamp_Icon.png"); }
    :global(.trumpet) { background-image: url("/img/stamp/Trumpet_Stamp_Icon.png"); }
    :global(.weaken) { background-image: url("/img/stamp/Weaken_Stamp_Icon.png"); }
</style>