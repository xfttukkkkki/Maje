document.addEventListener("DOMContentLoaded", () => {
    const videoUrlInput = document.getElementById("videoUrl");
    const addBtn = document.getElementById("addBtn");
    const videoList = document.getElementById("videoList");
    const exitBtn = document.getElementById("exitBtn");
    const themeToggle = document.getElementById("themeToggle");

    loadVideos();

    addBtn.addEventListener("click", async () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            const videoId = extractVideoID(url);
            if (videoId) {
                const videoData = await fetchVideoDetails(videoId);
                saveVideo(videoData);
                videoUrlInput.value = "";
            } else {
                alert("Invalid YouTube URL!");
            }
        }
    });

    exitBtn.addEventListener("click", () => {
        alert("Exiting App...");
    });

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });

    function extractVideoID(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*v\/))([\w-]+)/);
        return match ? match[1] : null;
    }

    async function fetchVideoDetails(videoId) {
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        return {
            id: videoId,
            title: data.title || "Unknown Title",
            author: data.author_name || "Unknown Channel"
        };
    }

    function saveVideo(video) {
        let videos = JSON.parse(localStorage.getItem("videos")) || [];
        videos.push(video);
        localStorage.setItem("videos", JSON.stringify(videos));
        displayVideos();
    }

    function loadVideos() {
        displayVideos();
    }

    function displayVideos() {
        videoList.innerHTML = "";
        const videos = JSON.parse(localStorage.getItem("videos")) || [];
        videos.forEach(video => {
            const videoDiv = document.createElement("div");
            videoDiv.classList.add("video-item");
            videoDiv.innerHTML = `
                <img src="https://img.youtube.com/vi/${video.id}/0.jpg" alt="Thumbnail" onclick="openVideo('${video.id}')">
                <div class="video-details">
                    <h4 onclick="openVideo('${video.id}')">${video.title}</h4>
                    <p>${video.author}</p>
                </div>
                <button class="delete-btn" onclick="deleteVideo('${video.id}')">🗑️</button>
            `;
            videoList.appendChild(videoDiv);
        });

        new Sortable(videoList, {
            animation: 150,
        });
    }

    window.deleteVideo = (videoId) => {
        let videos = JSON.parse(localStorage.getItem("videos")) || [];
        videos = videos.filter(video => video.id !== videoId);
        localStorage.setItem("videos", JSON.stringify(videos));
        displayVideos();
    };

    window.openVideo = (videoId) => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    };
});