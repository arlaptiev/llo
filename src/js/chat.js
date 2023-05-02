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
    const res = await openAiApiPost({
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

  async getRecommendation(curTrack, property) {
    // system message
    const context = "music";

    // create chat
    const chat = new Chat(context);

    // craft message
    const msg = '' // TODO
    const res = await chat.ask(msg);

    return res
  }
}