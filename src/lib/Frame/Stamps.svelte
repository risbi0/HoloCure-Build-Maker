<script>
    import {
        displayChoices,
        displayStampChoices,
        equippedStamps,
        stampAddSymbols,
        clickedSlotIndex,
        removeStamp,
        showStamps
    } from '$lib/stores';

    const displayRemoveBtn = Array(3).fill('hidden');

    function showStampChoices(index) {
        // show menu
        displayChoices.set(true);
        displayStampChoices.set(true);
        // save clicked slot
        clickedSlotIndex.set(index);
    }

    function removeGear(index) {
        // add back add symbol
        stampAddSymbols.update((arr) => {
            arr[index] = 'add';
            return arr;
        });
        // save clicked slot
        clickedSlotIndex.set(index);
        // set boolean to true for the if-block in ItemChoices to execute
        removeStamp.set(true);
    }
</script>

{#if $showStamps}
    <div id="stamps-container">
        {#each $equippedStamps as equippedStamp, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="stamp slot"
                on:click={() => showStampChoices(index)}
                on:mouseenter={() => {if ($equippedStamps[index] !== '') displayRemoveBtn[index] = ''}}
                on:mouseleave={() => displayRemoveBtn[index] = 'hidden'}
            >
                <div class="img {equippedStamp}">
                    <span class="add material-symbols-outlined">{$stampAddSymbols[index]}</span>
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
{/if}