<script>
    import {
        displayChoices,
        displayWeaponChoices,
        equippedWeapons,
        weaponAddSymbols,
        clickedSlotIndex,
        removeWeapon
    } from '../../stores';

    export let charName;

    const displayRemoveBtn = Array(5).fill('hidden');

    function showWeaponChoices(index) {
        // show menu
        displayChoices.set(true);
        displayWeaponChoices.set(true);
        // save clicked slot
        clickedSlotIndex.set(index);
    }

    function removeGear(index) {
        // add back add symbol
        weaponAddSymbols.update((arr) => {
            arr[index] = 'add';
            return arr;
        });
        // save clicked slot
        clickedSlotIndex.set(index);
        // set boolean to true for the if-block in WeaponChoices to execute
        removeWeapon.set(true);
    }
</script>

<div id="weapons-container">
    <div id="default-weap">
        <div class="img" style="background-image: url('/HoloCure-Build-Maker/img/character/{charName}/weapon.png')"></div>
    </div>
    {#each $equippedWeapons as equippedWeapon, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="weapon slot"
            on:click={() => showWeaponChoices(index)}
            on:mouseenter={() => {if ($equippedWeapons[index] !== '') displayRemoveBtn[index] = ''}}
            on:mouseleave={() => displayRemoveBtn[index] = 'hidden'}
        >
            <div class="img {equippedWeapon}">
                <span class="add material-symbols-outlined">{$weaponAddSymbols[index]}</span>
            </div>
            <span
                class="remove material-symbols-outlined {displayRemoveBtn[index]}"
                on:click|stopPropagation={() => removeGear(index)}
            >
                cancel
            </span>
        </div>
    {/each}
</div>

<style lang="scss">
    #default-weap {
        border: 3px solid #4779F4;
        margin: 5px;
        padding: 5px;
    }
</style>