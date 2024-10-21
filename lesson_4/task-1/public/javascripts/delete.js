"use strict";

async function deleteMovie(id) {
    console.log(id);
    try {
        let res = await fetch("/movie/delete", {
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
