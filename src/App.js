import React, { useState, useRef } from 'react';
import './App.scss';
import JsonTree from './JsonTree/JsonTree'

function App() {

  const inputElement = useRef(null);
  const [url, setUrl] = useState('');

  return (
    <div className="App">
      <input placeholder="Type JSON URL here" ref={inputElement}/>
      <button onClick={() => {setUrl(inputElement.current.value)}}>Retrieve JSON</button>
      <JsonTree url={url} />
    </div>
  );
}

export default App;
