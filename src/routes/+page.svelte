<script>
    import Frame from '../components/Frame/Frame.svelte';
    import Settings from '../components/Settings.svelte';
	import Link from '../components/Link.svelte';
	import SaveImage from '../components/SaveImage.svelte';
    import Choices from '../components/Choices/Choices.svelte';
</script>

<main id="main-container">
    <h1 id="title">HOLOCURE BUILD MAKER</h1>
    <p id="subtitle">Updated for v0.5</p>
    <Frame/>
</main>
<Settings/>
<SaveImage/>
<Link/>
<Choices/>

<style lang="scss">
    :global(:root) {
        --font-color: #E5E7EB;
        --bg-color: #27272A;
        --dark-bg-color: #18181B;
    }

	:global(::-webkit-scrollbar) {
		width: 6px;
	}
	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--font-color);
		border-radius: 10px;

		&:hover {
			background-color: white;
		}
	}
	:global(::-webkit-scrollbar-track) {
		background-color: var(--bg-color);
	}

    :global(*) {
        color: var(--font-color);
		/* mozilla scrollbar */
		scrollbar-color: var(--font-color) var(--bg-color) !important;
    	scrollbar-width: thin !important;
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
		position: relative;
        cursor: pointer;
        border: none;
        width: 130px;
        height: 35px;
        font-size: 14px;
        background-color: var(--dark-bg-color);
        padding-bottom: 5px;

		&:hover {
			background-color: var(--font-color);
			color: var(--dark-bg-color);
		}
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

    :global(.weapon) {
        border: 3px solid #4779F4;
    }

    :global(.item) {
        border: 3px solid #9FFF87;
    }

    :global(.stamp) {
        border: 3px solid #FFF38C;
    }

    :global(#save-image-container, #generate-link-container) {
        display: flex;
        justify-content: center;
        width: 100%;
		margin: 20px auto;
    }
    :global(#save-image, #generate-link) {
        font-size: 16px;
        width: 175px;
        height: 40px;
    }
</style>