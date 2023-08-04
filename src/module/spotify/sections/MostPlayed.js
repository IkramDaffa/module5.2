import React from "react";
import { Container } from "reactstrap";

function MostPlayed(props) {
  const sortSongs = props.songs;
  const handleTambahLagu = (params) => {
    props.tambahLagu(params);
  };
  return (
    <Container className="playlist">
      <div className="section">
        <h2>Search songs</h2>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            value={props.searchQuery}
            onChange={(e) => props.setSearchQuery(e.target.value)}
          />
          <button className="btn btn-info" onClick={props.handleSearch}>
            search
          </button>
        </div>

        <div className="songs-list">
          <ul className="songs-list">
            {sortSongs.map((song, index) => (
              <li className="song-item" key={index}>
                <div className="song-info">
                  <img src={song.album.images[2].url} alt="" />
                  <p>{song.name}</p>
                  <p>{song.artists.map((artis) => artis.name).join(", ")}</p>
                  <button
                    className="btn btn-info"
                    onClick={(e) =>
                      handleTambahLagu({
                        id: index,
                        images: song.album.images[2].url,
                        name: song.name,
                        artists: song.artists
                          .map((artis) => artis.name)
                          .join(", "),
                      })
                    }
                  >
                    tambah ke playlist
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

export default MostPlayed;
