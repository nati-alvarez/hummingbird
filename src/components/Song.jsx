import React from "react";

const Song = ({track}) => {
    return (
        <div className="song">
            <h3>{track.track_name}</h3>
            <p>Artist: {track.artist_name}</p>
            <p>Album: {track.album_name}</p>
            <a href={track.track_share_url}>See Lyrics</a>
        </div>
    )
}

export default Song;