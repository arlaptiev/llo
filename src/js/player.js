class Player {
  /**
   * This is a player class that mixes spotify tracks with radio noise.
   */
  constructor() {
    this.noiseMaxVolume = 0.1;

    this.noise = new Tone.Noise('pink');
    this.noiseGain = new Tone.Gain(this.noiseVolume);
    this.noise.connect(this.noiseGain);
    this.noiseGain.toDestination();
    this.noise.start();

    this.spotify = new SpotifyWrapper();
    this.spotify.setVolume(0);

    this.ready = false; // changed from SpotifyPlayer SDK
  }


  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async setVolume(volume, rampTime=2000) {
    // get current track volume
    const curVolume = await this.spotify.getVolume();

    // gradual noise ramp
    this.noiseGain.gain.rampTo((1 - volume) * this.noiseMaxVolume, rampTime);

    // gradual track ramp
    for(let i = 0; i < rampTime / 100; i++) {
      this.spotify.setVolume(curVolume + (volume - curVolume) * i / (rampTime / 100));
      await this.timeout(100);
    }
  }


  async startTrack(trackStr) {
    // find track
    const track = await this.spotify.find(trackStr);

    if (track) {
      // start track
      this.spotify.play(track);
    }

    return track
  }


  async transitionTrack(trackStr) {
    // find track
    const track = await this.spotify.find(trackStr);

    if (track) {
      // decrease volume
      await this.setVolume(0);

      // start track
      await this.spotify.play(track);

      // ramp volume
      await this.setVolume(1);
    }

    return track
  }


  playNext() {
    this.spotify.playNext();
  }


  async queue(trackStr) {
    // find track
    const track = await this.spotify.find(trackStr);

    if (track) {
      // queue track
      this.spotify.queue(track);
    }

    return track
  }
}
