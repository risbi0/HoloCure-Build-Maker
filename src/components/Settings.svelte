<script>
    import {
        charSelected, collabLimit, weaponSlots,
        equippedWeapons, weaponAddSymbols, resetWeaponSlots,
        equippedItems, itemAddSymbols, resetItemSlots,
        equippedStamps, stampAddSymbols, resetStampSlots,
        displayChoices, displayStatChoices,
        showBuildName, showStamps,
    } from '../stores';

    import { characters } from '../variables';

    function weaponSlotAmount(num) {
        if (($weaponSlots > 1 && num === -1) || ($weaponSlots < 6 && num === 1)) {
            $weaponSlots += num;

            // reinitialize stores
            equippedWeapons.set(Array($weaponSlots - 1).fill(''));
            weaponAddSymbols.set(Array($weaponSlots - 1).fill('add'));

            // set new collab limit
            const newCollabLimit = $weaponSlots - 1 > 1 ? $weaponSlots - 2 : 0;
            collabLimit.set(newCollabLimit);

            // reset weapon slots in WeaponChoices
            resetWeaponSlots.set(true);
        }
    }

    function showStatChoices() {
        // show menu
        displayChoices.set(true);
        displayStatChoices.set(true);
    }


    function clearWeapons() {
        weaponAddSymbols.set(Array($weaponSlots - 1).fill('add'));
        equippedWeapons.set(Array($weaponSlots - 1).fill(''));
        resetWeaponSlots.set(true);
    }

    function clearItems() {
        itemAddSymbols.set(Array(6).fill('add'));
        equippedItems.set(Array(6).fill(''));
        resetItemSlots.set(true);
    }

    function clearStamps() {
        stampAddSymbols.set(Array(3).fill('add'));
        equippedStamps.set(Array(3).fill(''));
        resetStampSlots.set(true);
    }
</script>

<div id="settings">
	<div id="char-select-container">
		<select
			id="char-select"
			bind:value={$charSelected}
			on:change={(e) => charSelected.set(e.target.value)}
		>
			{#each characters as character}
				<option value="{character}">{character}</option>
			{/each}
		</select>
	</div>
	<div id="more-settings">
		<div id="left-container">
			<div id="input-number">
				<p for="weapon-slots">Weapon Slot #</p>
				<div id="weapon-slots">
					<button class="minus" on:click={() => weaponSlotAmount(-1)}></button>
					<div>{$weaponSlots}</div>
					<button class="plus" on:click={() => weaponSlotAmount(1)}></button>
				</div>
			</div>
			<div id="show-stamps-container">
				<p>Show Stamps</p>
				<label class="switch">
					<input
						type="checkbox"
						bind:checked={$showStamps}
						on:change={(e) => showStamps.set(e.target.checked)}
					>
					<span class="slider"></span>
				</label>
			</div>
			<button id="add-stat-prio" on:click={showStatChoices}>Stat Priority</button>
		</div>
		<div id="right-container">
			<div id="show-build-name-container">
				<p>Show Build Name</p>
				<label class="switch">
					<input
						type="checkbox"
						bind:checked={$showBuildName}
						on:change={(e) => showBuildName.set(e.target.checked)}
					>
					<span class="slider"></span>
				</label>
			</div>
			<div id="clear-btn-container">
				<button on:click={() => clearWeapons()}>Clear Weapons</button>
				<button on:click={() => clearItems()}>Clear Items</button>
				<button on:click={() => clearStamps()}>Clear Stamps</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
    #settings {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 500px;
        margin: 40px auto;
    }

	#more-settings {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
	}

    #char-select-container {
        position: relative;
        display: flex;
        width: 200px;
        height: 45px;
        overflow: hidden;
		margin-bottom: 20px;

        &::after {
            content: '\25BC';
            position: absolute;
            top: 0;
            right: 0;
            padding: 15px;
            color: var(--font-color);
            background-color: var(--dark-bg-color);
            pointer-events: none;
        }

        &:hover::after {
			background-color: var(--font-color);
            color: var(--dark-bg-color);
        }
    }

    #char-select {
        border: none;
        flex: 1;
        padding-left: 12px;
        padding-bottom: 5px;
        font-size: 16px;
        background-color: var(--dark-bg-color);
        background-image: none;
        cursor: pointer;

		&:hover {
			background-color: var(--font-color);
			color: var(--dark-bg-color);

			option {
				background-color: var(--dark-bg-color);
				color: var(--font-color);
			}
		}
    }

	select::-webkit-scrollbar-track {
		background-color: var(--dark-bg-color);
	}

    #left-container, #right-container {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
    }

    #input-number {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--dark-bg-color);
        padding: 15px;
		margin: 10px auto;

        div {
            border: 2px solid var(--font-color);
            display: inline-flex;
        }

        p {
            font-size: 14px;
            margin-bottom: 10px;
        }

        button {
            width: 30px;
            height: 30px;
            margin: auto;
        }
    }

    .minus:after { content: '\2212'; }
    .plus:after { content: '\002B'; }
    .minus:after, .plus:after {
		font-size: 16px;
		margin-left: 2px;
    }

    #weapon-slots {
        div {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--dark-bg-color);
            border: 1px solid var(--font-color);
            border-width: 0 2px;
            font-size: 16px;
            text-align: center;
            width: 50px;
            padding-bottom: 5px;
        }
    }

	#add-stat-prio {
		margin: 10px auto;
	}

    #show-build-name-container, #show-stamps-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 65px;
		background-color: var(--dark-bg-color);
		padding: 15px;
		margin: 20px auto;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 36px;

        input {
            opacity: 0;
            width: 0;
            height: 0;
        }
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: red;
        border: 2px solid var(--font-color);

        &:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 4px;
            bottom: 4px;
            background-color: var(--font-color);
        }
    }

    input:checked {
        + .slider {
            background-color: green;
        }

        + .slider:before {
            transform: translateX(24px);
        }
    }

    #clear-btn-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 130px;
		margin: 5px auto;
    }
</style>