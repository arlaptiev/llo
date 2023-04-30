class Player {
  constructor() {
    this.noiseVolume = 0.1;
    this.trackVolume = 0.5;
    this.ready = false

    this.noise = new Tone.Noise('pink');
    this.noiseGain = new Tone.Gain(this.noiseVolume);
    this.noise.connect(this.noiseGain);
    this.noiseGain.toDestination();
    this.noise.start();

    // spotifyPlayer.setVolume(0)
  }

  setVolume(volume) {
    spotifyPlayer.setVolume(volume * this.trackVolume)
    this.noiseGain.gain.rampTo((1 - volume) * this.noiseVolume, 0.1);
  }

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

  async play(trackStr) {
    // find track
    const track = await this.find(trackStr);

    // play track
    if (track) {
      spotifyPlayer.pause();
    }

    return track
  }

  playNext() {

  }

  queue(trackStr) {

  }
}
