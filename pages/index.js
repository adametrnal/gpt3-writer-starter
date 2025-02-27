import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userDislikes, setUserDislikes] = useState('dolls and hot sauce');
  const [userLikes, setUserLikes] = useState('photography, nature, stuffed animals and warm sweaters');
  const [ageInput, setAgeInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [productsList, setProductsList] = useState([]);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userDislikes, userLikes, ageInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)
    const outputArr = output.text.split("\n");
    let productArr = []

    for(let i=2; i < outputArr.length; i++){
      let lineItem = outputArr[i].split("|");
      let giftItem = {name:lineItem[1], price:lineItem[2], review:lineItem[3]};
      productArr.push(giftItem);
      
    }
    setProductsList(productArr);
    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  const onUserChangedDislikes = (event) => {
    console.log(event.target.value);
    setUserDislikes(event.target.value);
  };

  const onUserChangedLikes = (event) => {
    console.log(event.target.value);
    setUserLikes(event.target.value);
  };

  const onAgeInputChange = (event) => {
    console.log(event.target.value);
    setAgeInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>AI Powered Holiday Gift List Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Struggling to find the perfect gift for a loved one, friend or co-worker? Use the power of GPT-3 scour the internet and find the perfect gifts!</h2>
          </div>
        </div>
        <div className="prompt-container">
          <label htmlFor="ageInput">Age</label> 
          <input 
            name="ageInput"
            type="number"
            label="age"
            value={ageInput}
            onChange={onAgeInputChange}
            placeholder="age"
            className="number-box"
          />
          <label htmlFor="likeInput">Likes</label> 
          <textarea 
            name="likeInput"
            value={userLikes}
            onChange={onUserChangedLikes}
            className="prompt-box"
          />
          <label htmlFor="dislikeInput">Dislikes</label>
          <textarea 
            name="dislikeInput"
            value={userDislikes}
            onChange={onUserChangedDislikes}
            className="prompt-box"
          />
          <div className="prompt-buttons">
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <ol className="item-list">
                {productsList.map((item, index) => (
                  <li key={index} >
                    <div className="itemTitle">{item.name}</div>
                    <div className="itemPrice">{item.price}</div>
                    <div className="itemReview">{item.review}</div>               
                  </li>
                ))}
                </ol>
            </div>
          </div>  
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
