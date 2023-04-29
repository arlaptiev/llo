// GPT Connection via OpenAI NodeJS
//////////////////////////////////////////////////////////////////
//https://useems.github.io/openai-nodejs/index.html
const OpenAI = require('openai-nodejs');

if (!process.env.OPENAI_API_KEY) {
    console.log('Please set your OPENAI_API_KEY environment variable and try again.')
}

const client = new OpenAI(process.env.OPENAI_API_KEY);


// Get a color when app is first loaded
let prompt = "the hex code for color 'bright pink' is";
let startColor;

client.complete(prompt, { stop: ['\n', '"'], temperature: 0 })
    .then(completion => {
        console.log(`Result: ${prompt}${completion.choices[0].text}`);

        // Grab string from the array
        startColor = completion.choices[0].text;

        // Remove spaces from the string
        startColor = trim(startColor);

        // Remove single quotes from the string
        startColor = startColor.replace(/'/g, '');

        //remove period from the string
        startColor = startColor.replace(/\./g, '');

        // update background color
        c = color(startColor);

    })
    .catch(console.error);