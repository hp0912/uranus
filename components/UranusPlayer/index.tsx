import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import React, { FC, useEffect } from 'react';
import './uranusPlayer.css';

const audio01 = '../../assets/audio/孤星独吟.mp3';
const audio02 = '../../assets/audio/落入凡尘.mp3';

const audio01Cover = '../../assets/images/audio01-theme.png';
const audio02Cover = '../../assets/images/audio02-theme.png';

export const UranusPlayer: FC = () => {
  useEffect(() => {
    const ap = new APlayer({
      container: document.getElementById('uranus-player'),
      mini: false,
      fixed: true,
      autoplay: false,
      theme: '#FADFA3',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: true,
      listMaxHeight: 90,
      // lrcType: 3,
      audio: [
        {
          name: '孤星独吟',
          artist: '李昊天',
          url: audio01,
          cover: audio01Cover,
          // lrc: 'lrc1.lrc',
          theme: '#ebd0c2'
        },
        {
          name: '落入凡尘',
          artist: '麦振鸿',
          url: audio02,
          cover: audio02Cover,
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