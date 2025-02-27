document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", document.getElementById("file").files[0]);

    // APIにPOSTリクエスト
    const response = await fetch("/upload/", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const data = await response.json();
        console.log("File uploaded:", data);
    } else {
        console.error("Failed to upload file");
    }
});
