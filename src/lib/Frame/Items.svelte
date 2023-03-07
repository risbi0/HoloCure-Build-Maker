<script>
    import {
        displayChoices,
        displayItemChoices,
        equippedItems,
        itemAddSymbols,
        clickedSlotIndex,
        removeItem
    } from "../../stores";

    const displayRemoveBtn = Array(6).fill('hidden');

    function showItemChoices(index) {
        // show menu
        displayChoices.set(true);
        displayItemChoices.set(true);
        // save clicked slot
        clickedSlotIndex.set(index);
    }

    function removeGear(index) {
        // add back add symbol
        itemAddSymbols.update((arr) => {
            arr[index] = 'add';
            return arr;
        });
        // save clicked slot
        clickedSlotIndex.set(index);
        // set boolean to true for the if-block in ItemChoices to execute
        removeItem.set(true);
    }
</script>

<div id="items-container">
    {#each $equippedItems as equippedItem, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="item slot"
            on:click={() => showItemChoices(index)}
            on:mouseenter={() => {if ($equippedItems[index] !== '') displayRemoveBtn[index] = ''}}
            on:mouseleave={() => displayRemoveBtn[index] = 'hidden'}
        >
            <div class="img {equippedItem}">
                <span class="add material-symbols-outlined">{$itemAddSymbols[index]}</span>
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