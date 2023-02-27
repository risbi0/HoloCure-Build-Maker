<script>
    import {
        displayChoices,
        displayStatChoices,
        statPriorityOrder,
        showPriorityOrder
    } from "../../stores";

	import { stats } from "../../variables";

    export let display;

    let statPriorityDisplay = Array(stats.length).fill(''), currentOrder = 1, statPriorityList = [];

    function manageOrder(index) {
        // unordered stat, assign order
        if (statPriorityDisplay[index] === '') {
            statPriorityDisplay[index] = currentOrder;
            currentOrder += 1;
        } else {
            // ordered stat selected, remove order
            const removedOrder = statPriorityDisplay[index];
            statPriorityDisplay[index] = '';
            currentOrder -= 1;

            // rearrange existing orders
            for (let i = 0; i < statPriorityDisplay.length; i++) {
                if (statPriorityDisplay[i] > removedOrder) {
                    statPriorityDisplay[i] -= 1;
                }
            }
        }
    }

    function clickHandler(confirm) {
        // assign array for display
        statPriorityList = [];

		if (confirm) {
			statPriorityDisplay.forEach((order, index) => statPriorityList[order - 1] = stats[index]);
		} else {
			// reset variables
			statPriorityDisplay = Array(stats.length).fill('');
			currentOrder = 1;
		}

		statPriorityOrder.set(statPriorityList);

		if (statPriorityList.length !== 0) {
			// display in frame
			showPriorityOrder.set(true);
		} else {
			showPriorityOrder.set(false);
		}

        // hide menu
        displayChoices.set(false);
        displayStatChoices.set(false);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="stats-choices" class="{display}">
    <p>Select stats in order of most prioritized to least prioritized.</p>
    <p>Not required to select all stats.</p>
    <div>
        {#each stats as stat, index}
            <div class="stat {stat}" on:click={() => manageOrder(index)}>
                <div class="order">{statPriorityDisplay[index]}</div>
            </div>
        {/each}
    </div>
    <div id="options-container">
        <p id="confirm" on:click={() => clickHandler(true)}>Confirm</p>
        <p id="clear" on:click={() => clickHandler(false)}>Clear</p>
    </div>
</div>

<style lang="scss">
    #stats-choices {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
		text-align: center;

        > p {
			line-height: 20px;
		}

        > p:nth-child(2) {
            margin-top: 10px;
            margin-bottom: 30px;
        }

        div:hover {
            cursor: pointer;
        }

        .order {
            position: absolute;
            top: -15px;
            font-size: 10px;
        }
    }

    #options-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 150px;

        #confirm, #clear {
            cursor: pointer;
        }

        p {
            padding-top: 20px;
            padding-bottom: 10px;

			&:hover {
				padding-bottom: 7px;
				border-bottom: 3px solid var(--font-color);
			}
        }
    }

    :global(.stat) {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-size: auto 100%;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        width: 24px;
        height: 24px;
        margin: auto 5px;
    }

    :global(.atk-up) { background-image: url("/img/stat/ATK_Up_Icon.png"); }
    :global(.crt-up) { background-image: url("/img/stat/Crit_Up_Icon.png"); }
    :global(.haste-up) { background-image: url("/img/stat/Haste_Up_Icon.png"); }
    :global(.hp-up) { background-image: url("/img/stat/Max_HP_Up_Icon.png"); }
    :global(.pick-up) { background-image: url("/img/stat/Pick_Up_Range_Icon.png"); }
    :global(.spd-up) { background-image: url("/img/stat/SPD_Up_Icon.png"); }
</style>