import React from "react";
import { Container } from "reactstrap";

function Playlist(props) {
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.parentElement.parentElement.style.display = "none";
  };
  const handleRemovePlaylist = (params, edit) => {
    const result = props.songs.filter((song) => song.id != params);
    props.setPlayList(result);
    if (edit) props.setPlayList([...result, edit]);
  };
  const handleEdit = (e, params) => {
    e.stopPropagation();
    let name = prompt("masukkan judul lagu");
    let artists = prompt("masukkan nama artist");
    const result = props.songs.find((song) => song.id == params);
    const edit = { ...result, name, artists };
    handleRemovePlaylist(params, edit);
  };

  return (
    <Container className="playlist d-flex flex-column">
      <h1>Simplified Spotify</h1>
      <div className="section">
        <h2>Playlist</h2>
        <div className="songs-list">
          <ul className="songs-list">
            {props.songs.map((song, index) => (
              <li
                className="song-item"
                key={index}
                onClick={() => alert(song.title)}
              >
                <div className="song-info">
                  <img src={song.images} alt="" />
                  <p>{song.name}</p>
                  <p>{song.artists}</p>
                  <button
                    className="btn btn-danger mb-3"
                    onClick={handleRemove}
                  >
                    remove with change style display
                  </button>
                  <button
                    className="btn btn-info mb-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePlaylist(song.id);
                    }}
                  >
                    remove with removing from list
                  </button>
                  <button
                    className="btn btn-warning mb-3"
                    onClick={(e) => handleEdit(e, song.id)}
                  >
                    edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

export default Playlist;
