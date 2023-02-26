<script>
    import Frame from './Frame/Frame.svelte';
    import Settings from './Settings/Settings.svelte';
    import Choices from './Choices/Choices.svelte';

    import html2canvas from 'html2canvas';
    import FileSaver from 'file-saver';

    function saveImage() {
        html2canvas(document.querySelector('#build-container'), { backgroundColor: '#27272A' })
        .then((canvas) => {
            const buildName = document.querySelector('#build-name');
            const fileName = buildName !== null ? buildName.textContent : 'Build Name';
            canvas.toBlob(blob => FileSaver.saveAs(blob, `${fileName}.png`));
        });
    }
</script>

<main id="main-container" style="padding-top: 10px;">
    <h1 id="title">HOLOCURE BUILD MAKER</h1>
    <p id="subtitle">Updated for v0.5</p>
    <Frame/>
</main>
<Settings/>
<Choices/>
<div id="save-image-container">
    <button id="save-image" on:click={saveImage}>Save Image</button>
</div>

<style lang="scss">
    :global(:root) {
        --font-color: #E5E7EB;
        --bg-color: #27272A;
        --dark-bg-color: #18181B;
    }

    :global(*) {
        color: var(--font-color);
    }

    :global(body) {
        background-color: var(--bg-color);
    }

    :global(*, body) {
        font-family: BestTenDOT;
        letter-spacing: 1px;
    }

    :global(select option) {
        /* custom typeface somehow doesn't apply to the dropdown items, so a fallback */
        font-family: Arial, Helvetica, sans-serif;
    }

    :global(input:focus,
    select:focus,
    button:focus) {
        outline: none;
    }

    :global(button) {
        cursor: pointer;
        border: none;
        width: 130px;
        height: 35px;
        font-size: 14px;
        background-color: var(--dark-bg-color);
        padding-bottom: 5px;

    }
    :global(button:hover) {
        color: white;
        font-weight: 600;
    }

    :global(input:focus, select:focus, button:focus) {
        outline: none;
    }

    :global(.hidden) {
        display: none !important;
    }

    #main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #title {
        font-size: 48px;
        margin-top: 50px;
        margin-bottom: 30px;
        letter-spacing: 3px;
    }
    #subtitle {
        margin-bottom: 50px;
    }

    :global(.img) {
        position: relative;
        background-size: auto 100%;
        background-position: center;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
    }

    :global(.slot) {
        position: relative;
    }

    :global(.weapon) {
        border: 3px solid #4779F4;
    }

    :global(.item) {
        border: 3px solid #9FFF87;
    }

    :global(.stamp) {
        border: 3px solid #FFF38C;
    }

    #save-image-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    #save-image {
        font-size: 16px;
        width: 175px;
        height: 40px;
    }
</style>