var dropzone = document.getElementById("dropzone");
var imgSrc = "";

dropzone.ondrop = function (e) {
    e.preventDefault();
    this.className = 'dropzone';

    if (e.dataTransfer.files.length == 1) {
        document.getElementById("upload").innerText = e.dataTransfer.files[0].name;

        const dT = new DataTransfer();
        dT.items.add(e.dataTransfer.files[0]);
        document.getElementById("fileinput").files = dT.files;

        const reader = new FileReader();
        reader.addEventListener("load", function () {
            document.getElementById("dropzone").style.display = "none";
            document.getElementById("previewimage").style.display = "block";
            document.getElementById("gonext").style.display = "block";
            document.getElementById("previewimage").setAttribute( "src", this.result );
            imgSrc = this.result;
        });
        reader.readAsDataURL(e.dataTransfer.files[0]);

    } else {
        console.log('You can upload only one image.');
        alert('You can upload only one image.');
    }
};

dropzone.ondragover = function () {
    this.className = 'dropzone dragover'
    return false;
};

dropzone.ondragleave = function () {
    this.className = 'dropzone'
    return false;
};


document.getElementById("drawToCanvas").addEventListener("click", function () {
    document.getElementById("uploadSection").style.display = "none"
    document.getElementById("canvasSection").style.display = "block"

    var canvasArea = document.getElementById('canvasArea')
    const cropper = new Cropper(canvasArea, imgSrc)
});