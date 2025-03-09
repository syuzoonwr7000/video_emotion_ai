document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("file");
    if (!fileInput.files.length) {
        alert("ファイルを選択してください！");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const progressCircle = document.getElementById("progress-circle");
    const progressText = document.getElementById("progress-text");

    // **XMLHttpRequestでアップロード進捗を監視**
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload/", true);

    xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            const offset = 251.2 - (251.2 * percent) / 100;
            
            const progressContainer = document.getElementById("progress-container");
            progressCircle.style.strokeDashoffset = offset; // **円バーの進捗を更新**
            progressText.textContent = `${percent}%`; // **数値を更新**

            // **アップロード開始時に円形プログレスバーを表示**
            progressContainer.style.display = "block";
        }
    });

    xhr.onload = function () {
        if (xhr.status === 200) {
            progressText.textContent = "完了！";
            const response = JSON.parse(xhr.responseText);
            
            let emotionHtml = "<h2>感情スコア</h2><ul>";
            for (const [emotion, score] of Object.entries(response.emotion_scores)) {
                emotionHtml += `<li>${emotion}: ${score}</li>`;
            }
            emotionHtml += "</ul>";

            document.getElementById("result").innerHTML = emotionHtml;
        } else {
            alert("アップロードに失敗しました");
        }
    };

    xhr.onerror = function () {
        alert("通信エラーが発生しました");
    };

    xhr.send(formData);
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
            video.currentTime = Math.min(1, video.duration / 2); // 動画の1秒目 or 半分の位置
        });

        // **動画がシーク完了したらサムネイルを作成**
        video.addEventListener("seeked", function () {
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                const aspectRatio = video.videoWidth / video.videoHeight;
    
                // **最大幅 200px に制限しつつ、アスペクト比を保持**
                if (aspectRatio > 1) {
                    canvas.width = 200;
                    canvas.height = 200 / aspectRatio;
                } else {
                    canvas.width = 200 * aspectRatio;
                    canvas.height = 200;
                }
    
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                // **既存のサムネイルを削除し、新しいサムネイルを追加**
                const thumbnailContainer = document.getElementById("thumbnail-container");
                thumbnailContainer.innerHTML = "";
                thumbnailContainer.appendChild(canvas);
    
                // **ファイル名を表示**
                document.getElementById("file-name").textContent = file.name;
    
                // **後始末**
                URL.revokeObjectURL(video.src);
                document.body.removeChild(video);
            }, 300);
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
