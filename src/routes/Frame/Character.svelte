<script>
    export let charName;
</script>

<div id="character-container">
    <div id="character">
        <div id="img" style="background-image: url('/HoloCure-Build-Maker/img/character/{charName}/portrait.png');"></div>
    </div>
</div>

<style lang="scss">
    #character-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 200px;
    }

    #character {
        height: 100%;
    }

    #img {
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: center;
        height: 100%;
    }
</style>