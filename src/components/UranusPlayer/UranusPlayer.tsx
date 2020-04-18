import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import React, { FC, useEffect } from "react";
import "./uranusPlayer.css";

export const UranusPlayer: FC = (props) => {
  useEffect(() => {
    const ap = new APlayer({
      container: document.getElementById('uranus-player'),
      mini: false,
      autoplay: false,
      theme: '#FADFA3',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: false,
      listMaxHeight: 90,
      // lrcType: 3,
      audio: [
        {
          name: 'name1',
          artist: 'artist1',
          url: 'https://shawnzeng.com/wp-content/uploads/2019/05/020e_5353_035c_5d6082e306d9614fa67846aed0ef4b13-online-audio-converter.com_.mp3',
          cover: 'cover1.jpg',
          // lrc: 'lrc1.lrc',
          theme: '#ebd0c2'
        },
        {
          name: 'name2',
          artist: 'artist2',
          url: 'https://shawnzeng.com/wp-content/uploads/2019/05/020e_5353_035c_5d6082e306d9614fa67846aed0ef4b13-online-audio-converter.com_.mp3',
          cover: 'cover2.jpg',
          // lrc: 'lrc2.lrc',
          theme: '#46718b'
        }
      ]
    });

    return () => {
      ap.destroy();
    };
  }, []);

  return (
    <div id="uranus-player" className="uranus-card" />
  );
};