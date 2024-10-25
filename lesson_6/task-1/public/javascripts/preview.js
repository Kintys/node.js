"use strict";
function getPreViewImg() {
    const carImg = document.getElementById("carImg");
    const preViewBox = document.getElementById("imgPreview");

    carImg.addEventListener("change", (event) => {
        handleFileSelect(event, preViewBox);
    });

    function handleFileSelect(event, imgSelector) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgSelector.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

window.addEventListener("load", function () {
    getPreViewImg();
});
