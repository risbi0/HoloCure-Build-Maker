<script>
    import { showBuildName } from "../../stores";

    const buildNameCharLimit = 24;
    let text = 'Build Name', html;

    function keypressHandler(e) {
        // disable input on reaching char limit and enter key
        if (e.target.innerText.length >= buildNameCharLimit || e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    function keyupHandler(e) {
        // since enter key was already disabled, detecting an enter key
        // from a keyup event would likely mean the input is coming from an IME
        // this forces to cut the input when reaching the char limit
        // since the length isn't updated when using an IME (keypress handler won't work)
        if (e.keyCode === 13 && e.target.innerText.length >= buildNameCharLimit) {
            text = html.substring(0, 24);
        }
    }

    function focusHandler(e) {
        // remove placeholder
        if (e.target.innerText === 'Build Name') {
            text = '';
        }
    }

    function blurHandler(e) {
        // insert placeholder when leaving empty text
        if (!e.target.innerText || e.target.innerText === '\n') {
            text = 'Build Name';
        }
        // other than the enter key that enters the input from an IME,
        // the user can also unfocus the editable, this captures it
        if (e.target.innerText.length >= buildNameCharLimit) {
            text = html.substring(0, 24);
        }
    }
</script>

{#if $showBuildName}
    <div
        id="build-name"
        onpaste="return false;"
        contenteditable="true"
        bind:textContent={text}
        bind:innerHTML={html}
        on:keypress={keypressHandler}
        on:keyup={keyupHandler}
        on:focus={focusHandler}
        on:blur={blurHandler}
    >
    </div>
{/if}

<style lang="scss">
    #build-name {
        outline: none;
        width: 390px;
        margin-bottom: 15px;
        margin-left: 5px;
        font-size: 30px;
        word-wrap: break-word;

        &:hover {
            font-weight: bold;
            color: white;
        }
    }
</style>