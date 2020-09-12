import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

//components
import RecordButton from "./components/RecordButton";
import Header from "./components/Header";
import IsRecording from './components/IsRecording';
import Song from "./components/Song";

function App() {
  const [speechRecognition, setSpeechRecognition] = useState();
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(()=>{
    if ('speechSynthesis' in window) {
      // new speech recognition object
      const recognitionConstructor =  window.webkitSpeechRecognition;
      const recognition = new recognitionConstructor();
      setSpeechRecognition(recognition);

      // Recognition start event handler
      recognition.onstart = () => { 
        setError(null);
        setRecording(true);
      }

      recognition.onerror = () => {
        setRecording(false);
        setError("Sorry, we could understand. Please try again.");
      }

      recognition.onresult = function(event) {
        setRecording(false);
        var transcript = event.results[0][0].transcript;
        console.log(transcript);
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?quorum_factor=1&apikey=80def77c0dbd57d9192eecb88c6b4caf&q_lyrics=${transcript}`).then(res=>{
        setTracks(res.data.message.body.track_list);
        }).catch(err=>{
          console.log(err);
        })
      };

    } else {
        console.log('Speech recognition not supported');
    }
  }, [])

  const startSpeechRecognition = () =>{
    speechRecognition.start();
  }

  return (
    <div className="App">
      <Header/>
      {recording? <IsRecording/>: <RecordButton startSpeechRecognition={startSpeechRecognition}/>}
      {error && <p className="error">{error}</p>}
      <section className="songs">
        {tracks.map(track=>{
          track = track.track;
          return (
            <Song track={track}/>
          )
        })}
      </section>
    </div>
  );
}

export default App;
