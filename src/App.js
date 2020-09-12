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
  const [loadingTracks, setLoadingTracks] = useState();
  const [tracks, setTracks] = useState([]);

  useEffect(()=>{
    if ('speechSynthesis' in window) {
      // new speech recognition object
      const recognitionConstructor =  window.webkitSpeechRecognition;
      const recognition = new recognitionConstructor();
      setSpeechRecognition(recognition);

      // Recognition start event handler
      recognition.onstart = () => { 
        setTracks([]);
        setError(null);
        setRecording(true);
      }

      recognition.onerror = () => {
        setRecording(false);
        setError("Sorry, we could understand. Please try again.");
      }

      recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;

        setRecording(false);
        setLoadingTracks(true);
        
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?quorum_factor=1&apikey=80def77c0dbd57d9192eecb88c6b4caf&q_lyrics=${transcript}`).then(res=>{
          setLoadingTracks(false);
          setTracks(res.data.message.body.track_list);
        }).catch(err=>{
          setLoadingTracks(false);
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
        {loadingTracks && <p>Looking for songs...</p>}
        {tracks.map(track=>{
          track = track.track;
          return (
            <Song key={track.track_id} track={track}/>
          )
        })}
      </section>
    </div>
  );
}

export default App;
