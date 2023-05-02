// Spotify Web API + Playback SDK
//////////////////////////////////////////////////////////////////
// https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started

const spotifyAccessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const spotifyApiUrl = 'https://api.spotify.com/v1';

if (!spotifyAccessToken) {
  console.log('Please set/refresh your SPOTIFY_ACCESS_TOKEN environment variable and try again.')
}


/**
 * Helper function to make Spotify API calls
 */

const spotifyApiFetch = async (path, options = {}) => {
  if (spotifyAccessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${spotifyAccessToken}`,
    };
  }

  console.log(`Calling ${spotifyApiUrl}/${path}`, options)
  const response = await fetch(`${spotifyApiUrl}/${path}`, options);

  if (response.ok && response.status === 204) {
    // No content
    return {};
  }

  const data = await response.json();
  console.log('Got', data)

  if (response.ok && response.status === 200) {
    return data;
  } else {
    console.error(`Error calling ${path}`, data.message);
  }
};

/**
 * Spotify API POST request
 */
const spotifyApiPost = async (path, body) =>
  spotifyApiFetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

/**
 * Spotify API PUT request
 */
const spotifyApiPut = async (path, body) =>
  spotifyApiFetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    ...(body ? { body: JSON.stringify(body) } : {})
  });

/**
 * Spotify API GET request
 */
const spotifyApiGet = async (path) => spotifyApiFetch(path, {});


/**
 * Spotify API Wrapper
 */

class SpotifyWrapper {

  async find(trackStr) {
    const [artistName, trackName] = trackStr.split(' - ');
    const params = {
      q: `track:${trackName} artist:${artistName}`,
      type: ['track'],
      limit: 1,
    }
    let query = new URLSearchParams(params);

    const res = await spotifyApiGet(`search?${query}`)

    if (res.tracks.total) {
      return res.tracks.items[0]
    }
    return null
  }

  async play(track, position_ms=0) {
    const res = await spotifyApiPut('me/player/play', {
      uris: [track.uri],
      position_ms: position_ms
    })

    return res
  }

  async setVolume(volume) {
    const res = await spotifyApiPut('me/player/volume?volume_percent=' + volume * 100)

    return res
  }

  async getVolume() {
    const res = await spotifyApiGet('me/player')

    return res.device.volume_percent / 100
  }

  async queue(track) {
    const res = await spotifyApiPost('me/player/queue', {
      uri: track.uri
    })

    return res
  }

  async playNext() {
    const res = await spotifyApiPost('me/player/next')

    return res
  }

}



/**
 * Spotify Web Playback SDK
 */

let spotifyPlayer;

window.onSpotifyWebPlaybackSDKReady = () => {

  spotifyPlayer = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(spotifyAccessToken); },
      volume: 0.5
  });

  // Ready
  spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Spofiy SDK Ready with Device ID', device_id);
      player.ready = true
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

  spotifyPlayer.connect()
}