const socket = io();
const peer = new RTCPeerConnection();

const video = document.getElementById('client-screen');
peer.addEventListener(
    'track', (track) => {
        video.srcObject = track.streams[0];
    }
)

socket.on(
    'sdp-offer', async(clientSDP) => {
        await peer.setRemoteDescription(clientSDP)

        const sdp = await peer.createAnswer();
        await peer.setLocalDescription(sdp)

        socket.emit('sdp-answer', peer.localDescription)

        }
)

peer.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
        socket.emit('ice-candidate', event.candidate)
    }
})

socket.on('ice-candidate', async(candidate) => {
    await peer.addIceCandidate(new RTCIceCandidate(candidate))
})