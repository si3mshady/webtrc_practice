const socket = io()
const peer = new RTCPeerConnection();

const shareButtom = document.getElementById("screen-share")

shareButtom.addEventListener("click", async () => {
    const config = {
        // audio: true,
        video: true,
        // preferCurrentTab: true
    }

    try {
      const videoStream = await navigator.mediaDevices.getDisplayMedia(config)    
// add track to peer connection
    // peer.addTrack(stream.getVideoTracks()[0], stream);
    videoStream.getTracks().forEach(track => {
        peer.addTrack(track, videoStream)
      })
  
      const sdp = await peer.createOffer()
      await peer.setLocalDescription(sdp)

      socket.emit('sdp-offer', peer.localDescription)

    } catch (error) {
        console.log(error)
        alert(error.message)
    }
})

socket.on('sdp-answer', async (remoteSDP) => {
    peer.setRemoteDescription(remoteSDP)
} );

peer.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
        socket.emit('ice-candidate', event.candidate)
    }
} );

socket.on('ice-candidate', async (candidate) => {
    await peer.addIceCandidate(new RTCIceCandidate(candidate))
})