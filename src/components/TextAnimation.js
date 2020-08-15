import React from 'react';
import { Wave } from 'react-animated-text';

const style = {
  display: 'inline-block',
  width: '80%',
  fontSize: '1.5rem',
  color: 'skyblue'
}

export const TextAnimation = () => (
  <div style={style}>
    <Wave text="Enter Your Name Here" effect="stretch" effectChange={2.0} />
  </div>
)

