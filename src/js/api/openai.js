const openAIAccessToken = process.env.OPENAI_API_KEY;

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
  
      response = await fetch(`${openAIApiUrl}/${path}`, options);
      data = await response.json();
    }
  
    if (response.ok && response.status === 200) {
      return data;
    } else {
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