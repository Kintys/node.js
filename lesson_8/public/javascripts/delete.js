"use strict";

function initDeleteCar() {
    const deleteButton = document.querySelector("button[data-delete]");
    const id = deleteButton?.getAttribute("data-delete");

    deleteButton?.addEventListener("click", () => {
        if (id) deleteMovie(id);
    });
}

async function deleteMovie(id) {
    try {
        let res = await fetch("/cars/delete", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            window.location.reload();
        } else {
            console.log("delete failed");
        }
    } catch (err) {
        console.log("Error", err);
    }
}

window.addEventListener("load", () => {
    initDeleteCar();
});
