document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", document.getElementById("file").files[0]);

    const response = await fetch("/upload/", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    document.getElementById("result").innerHTML = `
        <p>アップロードされたファイル: ${data.filename}</p>
        <p>音声ファイル: ${data.audio_filename}</p>
        <p>感情スコア: ${JSON.stringify(data.emotion_scores)}</p>
    `;
});
