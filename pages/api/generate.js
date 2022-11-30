import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = "Generate a spreadsheet showing the top 10 gifts for a ";
const basePromptPrefix2 = " year old. They do not like ";
const basePromptPrefix3 = ". They like "
const spreadSheetFormat = ".\n|name|price|url|sample product review|";

const generateAction = async (req, res) => {
    
    const prompt = `${basePromptPrefix}${req.body.ageInput}${basePromptPrefix2}${req.body.userDislikes}${basePromptPrefix3}${req.body.userLikes}${spreadSheetFormat}`;
    console.log(`API: ${prompt}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({output:basePromptOutput });
};

export default generateAction;