import { renderToString } from 'react-dom/server';
import React from 'react';
import { CountdownSection } from './src/sections/CountdownSection/index.tsx';

try {
  const html = renderToString(React.createElement(CountdownSection));
  console.log("Render successful. Length:", html.length);
} catch (e) {
  console.error("Render failed:", e);
}
