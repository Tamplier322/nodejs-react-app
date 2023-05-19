import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(
        (result) => {
          setData(result.variable)
        },
        (error) => {

        });
  }, []);

  return (
    <div className="App">
      <h1>Text from server: {data}</h1>
    </div>
  );
}

export default App;
