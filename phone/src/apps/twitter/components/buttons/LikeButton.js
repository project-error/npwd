import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

import Nui from "../../../../os/nui-events/utils/Nui";

function LikeButton({ tweetId, isLiked }) {
  const [liked, setLiked] = useState(isLiked);

  const handleClick = () => {
    Nui.send("phone:toggleLike", tweetId);
    setLiked(!liked);
  };

  return (
    <Button onClick={handleClick}>
      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </Button>
  );
}

export default LikeButton;
