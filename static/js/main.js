document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", document.getElementById("file").files[0]);

    const response = await fetch("/upload/", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    let emotionHtml = "<h2>感情スコア</h2><ul>";
    for (const [emotion, score] of Object.entries(data.emotion_scores)) {
        emotionHtml += `<li>${emotion}: ${score}</li>`;
    }
    emotionHtml += "</ul>";

    document.getElementById("result").innerHTML = `
        <p>アップロードされたファイル: ${data.filename}</p>
        <p>音声ファイル: ${data.audio_filename}</p>
        ${emotionHtml}
    `;
});
