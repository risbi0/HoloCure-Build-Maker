<script>
    import WeaponsChoices from './WeaponChoices.svelte';
    import ItemsChoices from './ItemChoices.svelte';
    import StampChoices from './StampChoices.svelte';
    import StatChoices from './StatChoices.svelte';
    import {
        displayChoices,
        displayWeaponChoices,
        displayItemChoices,
        displayStampChoices,
        displayStatChoices
    } from '$lib/stores';

    function hide() {
        displayChoices.set(false);
        displayWeaponChoices.set(false);
        displayItemChoices.set(false);
        displayStampChoices.set(false);
        displayStatChoices.set(false);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="choices-bg" class={$displayChoices ? '' : 'hidden'} on:click={hide}>
    <div id="choices-container" on:click={(e) => e.stopPropagation()}>
        <WeaponsChoices display={$displayWeaponChoices ? '' : 'hidden'}/>
        <ItemsChoices display={$displayItemChoices ? '' : 'hidden'}/>
        <StampChoices display={$displayStampChoices ? '' : 'hidden'}/>
        <StatChoices display={$displayStatChoices ? '' : 'hidden'}/>
    </div>
</div>

<style lang="scss">
    #choices-bg {
        position: fixed;
        top: 0;
        background-color: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
		z-index: 1;
    }

    #choices-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
		border: 3px solid var(--font-color);
        background-color: #171717;
        padding: 10px;
    }

    :global(#basic-choices, #collab-choices, #item-choices, #stamp-choices) {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        width: 530px;
    }

    :global(.choice) {
        cursor: pointer;
        margin: 5px;
        padding: 5px;
    }
</style>