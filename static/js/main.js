document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const uploadBtn = document.querySelector(".upload-btn");
    uploadBtn.disabled = true; // 二重送信防止のためボタンを無効化
    uploadBtn.textContent = "アップロード中...";

    const fileInput = document.getElementById("file");
    if (!fileInput.files.length) {
        alert("ファイルを選択してください！");
        uploadBtn.disabled = false;
        uploadBtn.textContent = "アップロード";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/upload/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log("アップロード成功:", data);

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

    } catch (error) {
        console.error("アップロード失敗:", error);
        alert("アップロードに失敗しました。もう一度試してください。");
    } finally {
        uploadBtn.disabled = false; // ボタンを再度有効化
        uploadBtn.textContent = "アップロード";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file");
    const thumbnailContainer = document.getElementById("thumbnail-container");

    // **サムネイルを生成**
    function generateThumbnail(file) {
        if (!file.type.startsWith("video/")) {
            alert("動画ファイルを選択してください！");
            return;
        }

        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.autoplay = false;
        video.playsInline = true;
        video.style.display = "none"; // 画面には表示しない
        document.body.appendChild(video); // 一時的にDOMに追加（ブラウザの制約を回避）

        // **動画のメタデータを読み込んだら、1秒目にシーク**
        video.addEventListener("loadedmetadata", function () {
            console.log("メタデータ読み込み完了");
            video.currentTime = Math.min(1, video.duration / 2); // 動画の1秒目 or 半分の位置
        });

        // **動画がシーク完了したらサムネイルを作成**
        video.addEventListener("seeked", function () {
            console.log("seeked イベント発火");
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                canvas.width = 200;
                canvas.height = 120;
                const ctx = canvas.getContext("2d");

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                thumbnailContainer.innerHTML = ""; // 既存のサムネイルを削除
                thumbnailContainer.appendChild(canvas);

                // **後始末**
                URL.revokeObjectURL(video.src);
                document.body.removeChild(video);
            }, 300); // 300ms 待って確実に描画
        });

        // **エラーハンドリング**
        video.addEventListener("error", function () {
            alert("動画の読み込みに失敗しました");
            URL.revokeObjectURL(video.src);
            document.body.removeChild(video);
        });

        video.load(); // **明示的にロード**
    }

    // **ドラッグ＆ドロップ対応**
    dropzone.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropzone.style.backgroundColor = "#e3f2fd";
    });

    dropzone.addEventListener("dragleave", function () {
        dropzone.style.backgroundColor = "#f9f9f9";
    });

    dropzone.addEventListener("drop", function (event) {
        event.preventDefault();
        dropzone.style.backgroundColor = "#f9f9f9";

        if (event.dataTransfer.files.length > 0) {
            fileInput.files = event.dataTransfer.files;
            generateThumbnail(event.dataTransfer.files[0]); // サムネイル生成
        }
    });

    // **ファイル選択時にサムネイル表示**
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            generateThumbnail(fileInput.files[0]); // サムネイル生成
        }
    });
});
