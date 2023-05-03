class Chat {
  /**
   * This is a generic chat interface for OpenAI's chatbot API.
   * @param {*} context 
   * @param {*} model
   */
  constructor(context, model='gpt-3.5-turbo') {
    this.model = model;
    this.system = { role: 'system', content: context };
    this.messages = [this.system];
  }

  async ask(msg, params={}) {
    // push question
    this.messages.push({ role: 'user', content: msg });

    // ask chatgpt
    const res = await openAiApiPost('chat/completions', {
      model: this.model,
      messages: this.messages,
      stop: ['\n', '"'],
      ...params
    });

    // push response
    const resMsg = res.choices[0].message;
    if (resMsg) { // maybe need to check for res.choices[0].finish_reason ?
      this.messages.push(resMsg.content);

      return resMsg.content
    }
  }

  clearMessages() {
    this.messages = [this.system];
  }
}

class MusicChat {
  /**
   * This is a chatbot interface for music recommendations.
   */

  async getInitialRecommendation() {
    const songs = [
      "Daft Punk - One More Time",
      "The Chemical Brothers - Block Rockin' Beats",
      "Justice - D.A.N.C.E.",
      "LCD Soundsystem - Dance Yrself Clean",
      "Kraftwerk - The Model",
      "Aphex Twin - Windowlicker",
      "The Prodigy - Breathe",
      "Moby - Porcelain",
      "Fatboy Slim - Right Here, Right Now",
    ];

    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  }

  async getRecommendation(curTrack, property, propertyDecision) {
    // system message
    const context = "Given a track and some potentially arbitrary property, recommend a track that is somewhat similar to the original track but also has more of the given property (either musically or through real-life meaning or lyrics, or anything else). Write your response by just naming the track and artist and no other words.";

    // create chat
    const chat = new Chat(context);

    // craft message
    const msg = `${curTrack}\n${property}`
    const res = await chat.ask(msg);

    return res

    // const songs = [
    //   "Daft Punk - One More Time",
    //   "The Chemical Brothers - Block Rockin' Beats",
    //   "Justice - D.A.N.C.E.",
    //   "LCD Soundsystem - Dance Yrself Clean",
    //   "Kraftwerk - The Model",
    //   "Aphex Twin - Windowlicker",
    //   "The Prodigy - Breathe",
    //   "Moby - Porcelain",
    //   "Fatboy Slim - Right Here, Right Now",
    // ];

    // const randomIndex = Math.floor(Math.random() * songs.length);
    // return songs[randomIndex];
  }

  async getProperties(track) {
    // system message
    const context = "Given a musical track, write 15 one or two-word properties that are not adjectives related to this track: 5 related to its musical specialty, 5 related to its real-life meaning or words, and 5 random words. Write all on one line, separated by commas and no other words. Don't write name categories";

    // create chat
    const chat = new Chat(context);

    // craft message
    const msg = track
    const res = await chat.ask(msg);

    // remove periods and spaces, separate by comma
    let properties = res.toLowerCase().replace(/\./g, '').split(',').map(p => p.trim());

    // shuffle
    for (let i = properties.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [properties[i], properties[j]] = [properties[j], properties[i]];
    }

    return properties
  }
}