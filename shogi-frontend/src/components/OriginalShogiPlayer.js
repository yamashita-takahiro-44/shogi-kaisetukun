import React, { useEffect, useRef } from 'react';

const OriginalShogiPlayer = () => {
  const spRef = useRef(null);

  useEffect(() => {
    if (spRef.current) {
      spRef.current.addEventListener("ev_play_mode_move", e => {
        alert(e.detail[0].last_move_info.to_kif);
      });
    }
  }, []);

  return (
    <shogi-player-wc
      ref={spRef}
      sp_mode="play"
      sp_body="position startpos"
      sp_controller="true"
    ></shogi-player-wc>
  );
};

export default OriginalShogiPlayer;
