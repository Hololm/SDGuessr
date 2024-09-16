# SDGuessr
Created for the ASU AI Spark Challenge Hackathon.
The objective of the AI Spark Challenge is to create a unique and safe solution to the mining industry of Arizona using the assistance of AI.

SDGuessr allows for users to get real-time information about UN Sustainable Development Goals (SDG) that are being violated. People can place a pin on the map and record what they have seen or they can read other people's pins placed on the interactive map. The product creates a safe solution to raise awareness for both communities and corporations.

## Tech Stack
- React, NextJS, TypeScript
- [shadcn](https://ui.shadcn.com/docs/installation/next), TailwindCSS
- Python, Flask, OpenAI API

## Getting Started

Grab an API key from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) in order to use Google Maps API and insert it into ``src/components/GoogleMap.tsx``.
Create an assistant through [OpenAI Playground](https://platform.openai.com/playground/) and set the API key and assistant key in ``backend/main.py``

## Project Setup

First, in the ``SDGuessr/sdguessr/`` directory, run:

```bash
npm install
```
Second, in the ``sdguessr/backend/`` directory, run:

```bash
pip install
```

Then, see results with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
