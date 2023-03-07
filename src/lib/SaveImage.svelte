<script>
	import html2canvas from 'html2canvas';
    import FileSaver from 'file-saver';

    function saveImage() {
        html2canvas(document.querySelector('#build-container'), { backgroundColor: '#27272A' })
        .then((canvas) => {
            const bldName = document.querySelector('#build-name');
            const fileName = bldName !== null ? bldName.textContent : 'Build Name';
            canvas.toBlob(blob => FileSaver.saveAs(blob, `${fileName}.png`));
        });
    }
</script>

<div id="save-image-container">
    <button id="save-image" on:click={saveImage}>Save Image</button>
</div>