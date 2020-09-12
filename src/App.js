import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

//components
import RecordButton from "./components/RecordButton";
import Header from "./components/Header";

function App() {
  const [speechRecognition, setSpeechRecognition] = useState();
  const [tracks, setTracks] = useState([]);

  useEffect(()=>{
    if ('speechSynthesis' in window) {
      // new speech recognition object
      const recognitionConstructor =  window.webkitSpeechRecognition;
      const recognition = new recognitionConstructor();
      setSpeechRecognition(recognition);

      // Recognition start event handler
      recognition.onstart = () => { 
        console.log("it started");
      }

      recognition.onresult = function(event) {
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
      <RecordButton startSpeechRecognition={startSpeechRecognition}/>
      {tracks.map(track=>{
        track = track.track;
        return (
          <div>
          <p>{track.track_name}</p>
          <p>{track.artist_name}</p>
          <a href={track.track_share_url}>See Lyrics</a>
          </div>
        )
      })}
    </div>
  );
}

export default App;
