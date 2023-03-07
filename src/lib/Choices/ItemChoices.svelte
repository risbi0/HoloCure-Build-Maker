<script>
    import {
        displayChoices,
        displayItemChoices,
        equippedItems,
        itemAddSymbols,
        clickedSlotIndex,
        removeItem,
        resetItemSlots
    } from '$lib/stores';

	import { items } from '$lib/variables';

    export let display;

    // initialize item displays
    let availableItems = items.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});

    // show previous equipped item when replacing
    function showPrevious() {
        if ($equippedItems[$clickedSlotIndex]) {
            availableItems[$equippedItems[$clickedSlotIndex]] = true;
        }
    }

    function clickHandler(item) {
        showPrevious();

        // remove add symbol
        itemAddSymbols.update((arr) => {
            arr[$clickedSlotIndex] = '';
            return arr;
        });

        // add selected item to equipped items
        equippedItems.update((arr) => {
            arr[$clickedSlotIndex] = item;
            return arr;
        });

        // hide selected item
        availableItems[item] = false;

        // hide menu
        displayChoices.set(false);
        displayItemChoices.set(false);
    }

	function update() {
		$equippedItems.forEach((item) => {
			availableItems[item] = false;
		});
	}

    $: if ($removeItem) {
		if ($clickedSlotIndex !== null) {
			showPrevious();

			// remove item in equipped items
			equippedItems.update((arr) => {
				arr[$clickedSlotIndex] = '';
				return arr;
			});
		} else {
			// update available items from shared build
			update();
		}

        // set boolean back to false
        removeItem.set(false);
    }

    $: if ($resetItemSlots) {
        availableItems = items.reduce((accumulator, currValue) => (accumulator[currValue] = true, accumulator), {});
        resetItemSlots.set(false);
    }
</script>

<div id="item-choices" class="{display}">
    {#each Object.entries(availableItems) as [item, available]}
        {#if available}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="item choice" on:click={() => clickHandler(item)}>
                <div class="img {item}"></div>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
	.item:hover {
		background-color: #3F9744;
	}

    :global(.blacksmiths-gear) { background-image: url("/img/item/Blacksmith's_Gear_Icon.png"); }
    :global(.body-pillow) { background-image: url("/img/item/Body_Pillow_Icon.png"); }
    :global(.breastplate) { background-image: url("/img/item/Breastplate_Icon.png"); }
    :global(.chickens-feather) { background-image: url("/img/item/Chicken's_Feather_Icon.png"); }
    :global(.credit-card) { background-image: url("/img/item/Credit_Card_Icon.png"); }
    :global(.devil-hat) { background-image: url("/img/item/Devil_Hat_Icon.png"); }
    :global(.energy-drink) { background-image: url("/img/item/Energy_Drink_Icon.png"); }
    :global(.face-mask) { background-image: url("/img/item/Face_Mask_Icon.png"); }
    :global(.full-meal) { background-image: url("/img/item/Full_Meal_Icon.png"); }
    :global(.gorillas-paw) { background-image: url("/img/item/Gorilla's_Paw_Icon.png"); }
    :global(.gws-pill) { background-image: url("/img/item/GWS_Pill_Icon.png"); }
    :global(.halu) { background-image: url("/img/item/Halu_Icon.png"); }
    :global(.headphones) { background-image: url("/img/item/Headphones_Icon.png"); }
    :global(.hope-sode) { background-image: url("/img/item/Hope_Soda_Icon.png"); }
    :global(.idol-costume) { background-image: url("/img/item/Idol_Costume_Icon.png"); }
    :global(.injection-type-asacoco) { background-image: url("/img/item/Injection_Type_Asacoco_Icon.png"); }
    :global(.just-bandage) { background-image: url("/img/item/Just_Bandage_Icon.png"); }
    :global(.milk) { background-image: url("/img/item/Knightly_Milk_Icon.png"); }
    :global(.shackles) { background-image: url("/img/item/Kusogaki_Shackles_Icon.png"); }
    :global(.limiter) { background-image: url("/img/item/Limiter_Icon.png"); }
    :global(.membership) { background-image: url("/img/item/Membership_Icon.png"); }
    :global(.horn) { background-image: url("/img/item/Nurse's_Horn_Icon.png"); }
    :global(.ppp) { background-image: url("/img/item/Piki_Piki_Piman_Icon.png"); }
    :global(.plushie) { background-image: url("/img/item/Plushie_Icon.png"); }
    :global(.sake) { background-image: url("/img/item/Sake_Icon.png"); }
    :global(.piggy-bank) { background-image: url("/img/item/Stolen_Piggy_Bank_Icon.png"); }
    :global(.glasses) { background-image: url("/img/item/Study_Glasses_Icon.png"); }
    :global(.sc-time) { background-image: url("/img/item/Super_Chatto_Time!_Icon.png"); }
    :global(.uber-sheep) { background-image: url("/img/item/Uber_Sheep_Icon.png"); }
</style>