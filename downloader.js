//1. open new tab
var w = window.open(window.location.href, '', 'width=640,height=405');

//2. remove watermark
//6793: e.watermark = ""

//3. start recording
async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {mediaSource: "screen"}
    });
}

function createRecorder(stream, mimeType) {
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
    };
    mediaRecorder.start(200);
    return mediaRecorder;
}

function saveFile(recordedChunks) {

    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `result.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}

const canvas = document.querySelector('#jj-player');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = 'auto';
document.body.style.overflow = 'hidden';
document.querySelector('#large-play-button').click();
var checkModal = setInterval(async () => {
    const modal = document.querySelector('[role=presentation]');
    if (modal) {
        console.log('Found modal');
        clearInterval(checkModal);
        modal.style.display = 'none';
        document.querySelector('#large-play-button').click();
        document.querySelector('#progress-bar-mouse-hitarea').click();
        let stream = await recordScreen();
        document.querySelector('#large-play-button').click();
        let mimeType = 'video/webm';
        let mediaRecorder = createRecorder(stream, mimeType);

        let lastTime;
        let videoEnded = setInterval(() => {
            newTime = document.querySelector('#progress-bar-indicator-text').textContent;
            if (lastTime === newTime) {
                console.log('Video ended');
                mediaRecorder.stop();
                clearInterval(videoEnded);
            } else {
                lastTime = newTime;
            }
        }, 1000);
    }
}, 2000);
