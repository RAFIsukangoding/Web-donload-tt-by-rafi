async function tiktok2(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const encodedParams = new URLSearchParams();
            encodedParams.set('url', query);
            encodedParams.set('hd', '1');

            const response = await axios.post('https://tikwm.com/api/', encodedParams, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            const videoData = response.data.data;
            if (!videoData) {
                throw new Error("Data video tidak ditemukan.");
            }

            const result = {
                title: videoData.title,
                hashtags: videoData.title.match(/#[\w]+/g) || [],
                no_watermark: videoData.play,
                music: videoData.music,
                nickname: videoData.author.nickname,
                username: videoData.author.unique_id
            };
            resolve(result);
        } catch (error) {
            console.error("Error:", error);
            reject("Maaf, terjadi kesalahan saat mengunduh video.");
        }
    });
}

async function downloadVideo() {
    const url = document.getElementById('url');
    const loadingOverlay = document.getElementById('loading-overlay');
    const message = document.getElementById('message');
    const videoSection = document.getElementById('video-section');
    const videoElement = document.getElementById('video');
    const hashtagsElement = document.getElementById('hashtags');
    const nicknameElement = document.getElementById('nickname');
    const usernameElement = document.getElementById('username');
    const profileInfo = document.getElementById('profile-info');
    const titleElement = document.getElementById('title');
    const copyHashtagsBtn = document.getElementById('copy-hashtags');
    const downloadVideoBtn = document.getElementById('download-video');
    const downloadAudioBtn = document.getElementById('download-audio');

    message.textContent = "";
    videoSection.style.display = "none";
    profileInfo.style.display = "none";
    loadingOverlay.style.display = "flex";

    try {
        const videoInfo = await tiktok2(url.value);

        nicknameElement.textContent = videoInfo.nickname;
        usernameElement.textContent = "@" + videoInfo.username;
        titleElement.textContent = videoInfo.title;
        videoElement.src = videoInfo.no_watermark;
        hashtagsElement.textContent = videoInfo.hashtags.join(' ');
        profileInfo.style.display = "block";
        videoSection.style.display = "block";
        copyHashtagsBtn.style.display = "inline";
        downloadVideoBtn.style.display = "inline";
        downloadAudioBtn.style.display = "inline";

        copyHashtagsBtn.onclick = () => copyTextToClipboard(videoInfo.hashtags.join(' '));
        downloadVideoBtn.onclick = () => downloadFile(videoInfo.no_watermark, "video.mp4");
        downloadAudioBtn.onclick = () => downloadFile(videoInfo.music, "audio.mp3");
    } catch (error) {
        message.textContent = error;
    } finally {
        loadingOverlay.style.display = "none";
    }
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Hashtags berhasil disalin!");
    });
}

function downloadFile(url, filename) {
    const a =