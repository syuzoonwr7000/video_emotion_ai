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

document.addEventListener("DOMContentLoaded", function () {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file");

    // ドラッグオーバー時のスタイル変更
    dropzone.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropzone.style.backgroundColor = "#e3f2fd";
    });

    // ドラッグリーブ時に元の色へ戻す
    dropzone.addEventListener("dragleave", function () {
        dropzone.style.backgroundColor = "#f9f9f9";
    });

    // ファイルをドロップ
    dropzone.addEventListener("drop", function (event) {
        event.preventDefault();
        dropzone.style.backgroundColor = "#f9f9f9";

        if (event.dataTransfer.files.length > 0) {
            fileInput.files = event.dataTransfer.files;
        }
    });
});
