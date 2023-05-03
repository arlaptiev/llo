const openAIAccessToken = process.env.OPENAI_API_KEY;
const openAIApiUrl = 'https://api.openai.com/v1';

if (!openAIAccessToken) {
    console.log('Please set your OPENAI_API_KEY environment variable and try again.')
}

/**
 * Helper function to make OpenAI API calls
 */
const openAiApiFetch = async (path, options = {}) => {

    let data = {}
    let response = { status: 0 }

    if (openAIAccessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${openAIAccessToken}`,
        };
  
        console.log(`Calling ${spotifyApiUrl}/${path}`, options)
        response = await fetch(`${openAIApiUrl}/${path}`, options);
        data = await response.json();
        console.log('Got', data)
    }
  
    if (response.ok && response.status === 200) {
      return data;
    } else {
      error = `[OPENAI] ${response.status}: ${data.message}`
      console.error(`Error calling ${path}`, data.message);
    }
  };
  
  /**
   * OpenAPI API POST request
   */
  const openAiApiPost = async (path, body) =>
    openAiApiFetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
  
  /**
   * OpenAI API GET request
   */
  const openAiApiGet = async (path) => openAiApiFetch(path, {});