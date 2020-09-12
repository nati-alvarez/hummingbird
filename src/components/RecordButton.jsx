import React from "react";
import { AiFillAudio } from "react-icons/ai";

const RecordButton = ({startSpeechRecognition}) => {
    return (
        <button className="record-button" onClick={startSpeechRecognition}>
            <AiFillAudio className="mic-icon" fontSize="3rem">
            </AiFillAudio>
            <svg  width="0" height="0">
            <defs>
                <linearGradient id="gradient">
                <stop offset="25%" stopColor="#5c99fa" />
                <stop offset="50%" stopColor="#fcfc6f" />
                <stop offset="85%" stopColor="#fc6fe0" />
                </linearGradient>
            </defs>
            </svg>
        </button>
    )
}

export default RecordButton;