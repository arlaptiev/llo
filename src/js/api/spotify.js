// Spotify Web Playback SDK
//////////////////////////////////////////////////////////////////
// https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started

let spotifyPlayer; 

window.onSpotifyWebPlaybackSDKReady = () => {
  const spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!spotifyAccessToken) {
    console.log('Please set/refresh your SPOTIFY_ACCESS_TOKEN environment variable and try again.')
  }
  spotifyPlayer = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(spotifyAccessToken); },
      volume: 0.5
  });

  // Ready
  spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Spofiy SDK Ready with Device ID', device_id);
  });

  // Not Ready
  spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Spofiy SDK: Device ID has gone offline', device_id);
  });

  spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error(message);
  });

  spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error(message);
  });

  spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error(message);
  });

  document.getElementById('togglePlay').onclick = function() {
    spotifyPlayer.togglePlay();
  };

  spotifyPlayer.connect();
}