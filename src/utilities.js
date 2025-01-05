//features

export function displayDialog(text, onDisplayEnd) {

    const dialog = document.getElementById("textbox-container");
    const dialogText = document.getElementById("dialog");
    dialog.style.display = "block"; //p tag visible

    //text scrolling - setinterval function, ref to interval so we can clear it once finished
    let i = 0;
    let currentText = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            currentText += text[i];
            dialogText.innerHTML = currentText;  //okay because not accepting user input & suitable to use links
            i++;
            return
        };
            clearInterval(interval); //when consition is no longer true
    }, 5);

    //close button
    const closeButton = document.getElementById("close");
    function closeDialog() {
        onDisplayEnd();
        dialog.style.display = "none";
        dialogText.innerHTML = "";
        clearInterval(interval);
        closeButton.removeEventListener("click", closeDialog); //remove function within the function
    };
    closeButton.addEventListener("click", closeDialog);
};

export function setCameraScale(k) {
    const resizeFactor = k.width() / k.height(); 
    if (resizeFactor > 1) {
        k.setCameraScale(k.vec2(1));
        return;
        };
    k.setCameraScale(k.vec2(1.5));
}