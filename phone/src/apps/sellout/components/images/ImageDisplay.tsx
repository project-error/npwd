import React from 'react'

export const ImageDisplay = ({ imgURL }) => {
  return <img src={imgURL} alt="Image" style={{height: 200, width: 350, margin: "auto"}}/>
}
