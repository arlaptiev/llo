class Player {
  /**
   * This is a player class that mixes spotify tracks with radio noise.
   * Volume measured from 0 to 1.
   */
  constructor() {
    this.NOISE_MAXVOLUME = 0.1;
    this.RAMP_TIME = 2000;

    this.ready = false; // would otherwise be changed from SpotifyPlayer SDK
    this.track = null;

    this.noiseGain = this.createNoise();
    this.spotify = new SpotifyWrapper();

    this.rampDown(); // TODO maybe smooth out the track out after presentation
  }


  createNoise() {
    /**
     * Create noise and connect to gain node.
     */
    const noise = new Tone.Noise("pink").start();

    const radioFilter = new Tone.BiquadFilter({
      type: "lowpass",
      Q: 10,
      frequency: 8000,
    });

    const gainNode = new Tone.Gain(0.5).toDestination(); // Adjust volume here

    noise.connect(radioFilter);
    radioFilter.connect(gainNode);

    Tone.Transport.start();
    return gainNode
  }


  async start(trackStr) {
    /**
     * Start playing a track in the START controller state.
     */
    // find track
    const track = await this.spotify.find(trackStr);
    if (track) {
      // start track
      this.spotify.play(track);
      // update
      this.track = track;
      // ramp volume
      await this.rampUp()
    }
    return track
  }


  async transitionTrack(trackStr) {
    /**
     * Transition to a new track in the FLOW controller state.
     */

    // find track
    const track = await this.spotify.find(trackStr);
    if (track) {
      // decrease volume
      await this.rampDown();
      // start track
      await this.spotify.play(track);
      // update
      this.track = track;
      // ramp volume
      await this.rampUp()
    }
    return track
  }


  playNext() {
    /**
     * Play the next track in the queue.
     */
    this.spotify.playNext();
  }


  async queue(trackStr) {
    /**
     * Queue a track.
     */
    // find track
    const track = await this.spotify.find(trackStr);
    if (track) {
      // queue track
      this.spotify.queue(track);
    }
    return track
  }


  async rampUp(trackRampTime=this.RAMP_TIME, noiseRampTime=this.RAMP_TIME + 1000) {
    /**
     * Ramp up the track volume, and kill noise volume.
     */
    // gradual noise ramp
    this.noiseGain.gain.rampTo(0, noiseRampTime/1000);

    // gradual track ramp
    await this.rampVolume(1, 0, trackRampTime);
  }

  async rampDown(trackRampTime=this.RAMP_TIME, noiseRampTime=this.RAMP_TIME - 1000) {
    /**
     * Kill the track volume, and ramp up noise volume.
     */ 
    // gradual noise ramp
    this.noiseGain.gain.rampTo(this.NOISE_MAXVOLUME, noiseRampTime/1000);

    // gradual track ramp
    await this.rampVolume(0, 1, trackRampTime);
  }


  async setVolume(volume, rampTime=2000) {
    // get current track volume
    const curVolume = await this.spotify.getVolume() / 100;

    // gradual noise ramp
    this.noiseGain.gain.rampTo((1 - volume) * this.NOISE_MAXVOLUME, rampTime/1000);

    // gradual track ramp
    this.rampVolume(curVolume, volume, rampTime);
  }


  async rampVolume(targetVolume, curVolume, rampTime) {
    /**
     * Ramp track's volume from curVolume to targetVolume over rampTime.
     */
    if (rampTime === 0) return targetVolume;
    const step = (targetVolume - curVolume) / (rampTime / 100);
    while (Math.sign(targetVolume - curVolume) === Math.sign(step)) {
      curVolume += step;
      if (curVolume < 0) curVolume = 0;
      if (curVolume > 1) curVolume = 1;
      this.spotify.setVolume(curVolume);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return targetVolume;
  }
}
