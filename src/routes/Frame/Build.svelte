<script>
    import BuildName from './BuildName.svelte';
    import Weapons from './Weapons.svelte';
    import Items from './Items.svelte';
    import Stamps from './Stamps.svelte';
    import StatPriority from './StatPriority.svelte';

    export let charName;
</script>

<div id="equipment-container">
    <BuildName/>
    <Weapons {charName}/>
    <Items/>
    <Stamps/>
    <StatPriority/>
</div>

<style lang="scss">
    #equipment-container {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        margin-left: 10px;
    }

    :global(.slot) {
        cursor: pointer;
        margin: 5px;
        padding: 5px;
    }

    :global(#weapons-container, #items-container, #stamps-container) {
        display: flex;
        flex-direction: row;
    }

    :global(.add.material-symbols-outlined) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 50px;
        color: #D1D5DB;

        &:hover {
            color: white;
        }
    }

    :global(.remove.material-symbols-outlined) {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 20px;
        height: 20px;
        font-size: 20px;
        color: #DC2626;

        &:hover {
            color: #EF4444;
        }
    }
</style>