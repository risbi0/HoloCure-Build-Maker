<script>
    import { statPriorityOrder, showPriorityOrder } from "../../stores";
</script>

{#if $showPriorityOrder}
    <div id="stat-priority">
        {#each $statPriorityOrder as order, index}
            <span class="stat {order}"></span>
            {index !== $statPriorityOrder.length - 1 ? '>' : ''}
        {/each}
    </div>
{/if}

<style lang="scss">
    #stat-priority {
        display: flex;
        justify-content: space-evenly;
        margin-top: 10px;
    }
</style>