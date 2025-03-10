document.addEventListener("DOMContentLoaded", function() {
    let currentProgress = 0; // **進捗を保持する変数**

    document.getElementById("uploadForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const file = document.getElementById("file").files[0];
        if (!file) {
            alert("ファイルを選択してください！");
            return;
        }

        // **アップロードボタンとファイル選択を無効化（アップロード処理が開始されたら）**
        const uploadButton = document.querySelector(".upload-btn"); // class名で取得
        const fileInput = document.getElementById("file");
        uploadButton.disabled = true;
        fileInput.disabled = true;

        const formData = new FormData();
        formData.append("file", file);

        // **プログレスバーを表示**
        const progressContainer = document.getElementById("progress-container");
        const progressText = document.getElementById("progress-text");
        progressContainer.style.display = "block"; 

        try {
            // **アップロード処理開始**
            const uploadPromise = fetch("/upload/", { method: "POST", body: formData });
        
            // **99% までを 2 秒で進める**
            await animateProgress(99, 2000);
        
            // **fetch() の完了予測時間（例：3秒）を考慮して 99 → スコア表示**
            const scoreFetchTime = 3000; // **スコア取得までの予想時間**
            const scorePromise = uploadPromise.then(res => res.json());
        
            // **99% から感情スコア取得処理を開始**
            await Promise.all([
                scorePromise,
                animateProgress(99, scoreFetchTime) // 99% まで動かし、スコア取得中に停止
            ]);
        
            // **スコアデータを取得**
            const data = await scorePromise;
        
            // **「完了！」を固定表示**
            progressText.textContent = "完了！";
        
            // **感情スコアを5段階評価で表示するレーダーチャートの準備**
            const emotionMap = {
                "joyful": "楽しい",
                "happy": "嬉しい",
                "fear": "怖い",
                "sad": "悲しい",
                "surprise": "驚き",
            };
        
            // スコアを0~5に変換
            const scores = Object.values(data.emotion_scores).map(score => score * 5);
        
            // ラベルを日本語に変換
            const labels = Object.keys(data.emotion_scores).map(emotion => emotionMap[emotion]);
        
            // レーダーチャート用のデータ
            const chartData = {
                labels: labels,
                datasets: [{
                    label: "感情スコア",
                    data: scores, // 変換後のスコア
                    fill: true,
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                    borderColor: "rgba(0, 123, 255, 1)",
                    borderWidth: 1
                }]
            };
        
            // レーダーチャートの設定
            const config = {
                type: 'radar',
                data: chartData,
                options: {
                    scales: {
                        r: {
                            min: 0,
                            max: 5, // 5段階評価なので最大5に設定
                            ticks: {
                                stepSize: 1
                            },
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ": " + tooltipItem.raw.toFixed(2); // 2桁の小数点表示
                                }
                            }
                        }
                    }
                }
            };
        
            // 最初は非表示にしているキャンバスを表示
            document.getElementById("emotionRadarChart").style.display = "block";
        
            // レーダーチャートの描画
            const ctx = document.getElementById('emotionRadarChart').getContext('2d');
            new Chart(ctx, config);
        
        } catch (error) {
            alert("アップロードに失敗しました");
            progressContainer.style.display = "none"; 
        } finally {
            // **アップロードが終了した後にボタンを再有効化**
            uploadButton.disabled = false;
            fileInput.disabled = false;
        }
        
    });

    // **進捗アニメーション**
    function animateProgress(target, duration) {
        return new Promise(resolve => {
            let startTime = performance.now();
            let initialProgress = currentProgress;
            
            function step(currentTime) {
                let elapsedTime = currentTime - startTime;
                let progress = Math.min(1, elapsedTime / duration);
                
                // **スムーズな進行**
                let easedProgress = easeOutQuad(progress);
                let newValue = Math.floor(initialProgress + (target - initialProgress) * easedProgress);

                // **99% で停止する**
                if (newValue >= 99) {
                    newValue = 99;
                }

                updateProgress(newValue);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    currentProgress = target;
                    resolve();
                }
            }

            requestAnimationFrame(step);
        });
    }

    // **イージング関数（スムーズに99%へ移行）**
    function easeOutQuad(t) {
        return t * (2 - t);
    }

    // **プログレスバーの更新**
    function updateProgress(value) {
        const progressCircle = document.getElementById("progress-circle");
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        const offset = circumference * (1 - value / 100);
        progressCircle.style.strokeDashoffset = offset;

        document.getElementById("progress-text").textContent = `${value}%`;
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
