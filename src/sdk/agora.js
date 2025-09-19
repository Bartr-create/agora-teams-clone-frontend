import AgoraRTC from "agora-rtc-sdk-ng";

export function createClient() {
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
}

export async function joinAndPublish(client, appId, channel) {
  // token=null (App-ID-only join)
  const uid = await client.join(appId, channel, null, null);
  const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
  await client.publish([mic, cam]);
  return { uid, micTrack: mic, camTrack: cam };
}

export async function startScreenShare(client) {
  // 1080p_1 is a good default; tweak as needed
  const [screenTrack] = await AgoraRTC.createScreenVideoTrack(
    { encoderConfig: "1080p_1", optimizationMode: "detail" },  // detail vs motion
    "disable" // disable system audio; set to "enable" to capture tab audio in supported browsers
  );
  await client.publish([screenTrack]);
  return screenTrack;
}

export async function stopTrack(client, track) {
  if (!track) return;
  await client.unpublish([track]);
  track.stop();
  track.close();
}
