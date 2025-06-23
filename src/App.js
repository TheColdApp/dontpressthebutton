import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [pressCount, setPressCount] = useState(0);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [buttonMoving, setButtonMoving] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [uiBroken, setUiBroken] = useState(false);
  const [finalStage, setFinalStage] = useState(false);
  const buttonRef = useRef(null);

  // Move button randomly after certain press count
  useEffect(() => {
    if (pressCount >= 10 && pressCount < 25) {
      setButtonMoving(true);
    }
    if (pressCount >= 25) {
      setUiBroken(true);
      setButtonMoving(false);
    }
    if (pressCount >= 30) {
      setFinalStage(true);
      setUiBroken(false);
      setButtonMoving(false);
    }
  }, [pressCount]);

  // If button should move, randomize position every second
  useEffect(() => {
    if (!buttonMoving) return;

    const interval = setInterval(() => {
      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 150;
      setButtonPos({
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      });
    }, 800);

    return () => clearInterval(interval);
  }, [buttonMoving]);

  // Glitch effect toggles on certain press counts
  useEffect(() => {
    if (pressCount >= 12 && pressCount < 20) {
      setGlitch(true);
    } else {
      setGlitch(false);
    }
  }, [pressCount]);

  // Play ambient scream at press 15
  useEffect(() => {
    if (pressCount === 15) {
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/human_voices/scream_female_short.ogg"
      );
      audio.volume = 0.4;
      audio.play();
    }
  }, [pressCount]);

  // Text messages for different stages
  const messages = {
    0: "Whatever you do… don't press it.",
    1: "You were warned.",
    3: "Stop. Seriously.",
    5: "The button’s watching you.",
    7: "It's alive.",
    10: "Try to catch me.",
    12: "System glitch detected.",
    15: "Aaaaaahhhhh!!!",
    18: "I see you.",
    20: "Wingdings takeover.",
    25: "The UI is breaking.",
    30: "You became the button.",
  };

  // Random font families for chaos stage
  const chaoticFonts = [
    "'Comic Sans MS', cursive, sans-serif",
    "'Papyrus', fantasy",
    "'Courier New', monospace",
    "'Wingdings'",
    "'Impact', Charcoal, sans-serif",
  ];

  // Choose random font from chaoticFonts on glitch stage
  const randomFont =
    glitch || uiBroken
      ? chaoticFonts[Math.floor(Math.random() * chaoticFonts.length)]
      : "'IBM Plex Mono', monospace";

  // Cursor style changes on later presses
  const cursorStyle =
    pressCount >= 20 ? "url('https://cdn-icons-png.flaticon.com/512/888/888879.png'), auto" : "pointer";

  // Button styles change over presses
  const buttonStyles = {
    position: pressCount >= 10 ? "fixed" : "relative",
    left: pressCount >= 10 ? buttonPos.x : "auto",
    top: pressCount >= 10 ? buttonPos.y : "auto",
    width: 150,
    height: 150,
    borderRadius: "50%",
    backgroundColor:
      pressCount >= 25
        ? "black"
        : pressCount >= 18
        ? "#8B0000"
        : pressCount >= 10
        ? "#ff1a1a"
        : "#ff3333",
    boxShadow:
      pressCount >= 12
        ? "0 0 30px 10px #ff1a1a, 0 0 60px 20px #ff6666"
        : "0 0 15px 5px #ff4d4d",
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    border: "none",
    outline: "none",
    cursor: cursorStyle,
    userSelect: "none",
    transition: "all 0.3s ease",
    filter: glitch ? "url('#glitch-filter')" : "none",
    animation:
      pressCount === 5
        ? "pulse 1.5s infinite"
        : pressCount === 18
        ? "shake 0.5s infinite"
        : "none",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  // UI container styles for broken state
  const containerStyle = {
    filter: uiBroken ? "blur(4px) saturate(3)" : "none",
    fontFamily: randomFont,
    transition: "all 0.5s ease",
    height: "100vh",
    backgroundColor: finalStage ? "white" : "#0d0d0d",
    color: finalStage ? "#000" : "#ff4d4d",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
  };

  // Final stage text with flicker animation
  const finalText = (
    <h1
      style={{
        fontSize: 48,
        color: "black",
        animation: "flicker 2s infinite",
        maxWidth: "80vw",
        textAlign: "center",
      }}
    >
      Now <span style={{ color: "#ff1a1a" }}>YOU</span> are the button.
      <br />
      Click anywhere… forever.
    </h1>
  );

  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id="glitch-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 20 -10"
          />
          <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div style={containerStyle}>
        {!finalStage && (
          <>
            <h2 style={{ marginBottom: 40, fontSize: 24, maxWidth: "90vw", textAlign: "center" }}>
              {messages[pressCount] || "..."}
            </h2>
            <button
              ref={buttonRef}
              style={buttonStyles}
              onClick={() => setPressCount((c) => Math.min(c + 1, 31))}
              onMouseEnter={() => {
                if (pressCount >= 10 && pressCount < 25) {
                  // Jump button on hover randomly
                  const maxX = window.innerWidth - 150;
                  const maxY = window.innerHeight - 150;
                  setButtonPos({
                    x: Math.floor(Math.random() * maxX),
                    y: Math.floor(Math.random() * maxY),
                  });
                }
              }}
            >
              {pressCount < 25 ? "DO NOT PRESS" : "THE BUTTON"}
            </button>
          </>
        )}
        {finalStage && finalText}
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px 5px #ff4d4d; }
          50% { transform: scale(1.1); box-shadow: 0 0 25px 10px #ff1a1a; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 2px) rotate(-5deg); }
          40% { transform: translate(2px, -2px) rotate(5deg); }
          60% { transform: translate(-2px, 2px) rotate(-5deg); }
          80% { transform: translate(2px, -2px) rotate(5deg); }
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
