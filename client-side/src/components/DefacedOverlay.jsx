import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaSkull, 
  FaExclamationTriangle, 
  FaWifi, 
  FaEye, 
  FaBolt, 
  FaShieldAlt,
  FaTerminal 
} from "react-icons/fa";
import { 
  GiElectric,
  GiCyberEye 
} from "react-icons/gi";
import { 
  MdSecurity,
  MdWarning 
} from "react-icons/md";

/**
 * Hacked-style protest overlay with glitch effects.
 * Place <DefacedOverlay /> near the top of your App so it covers everything.
 */
const DefacedOverlay = ({ initiallyOpen = true }) => {
  const [isVisible, setIsVisible] = useState(initiallyOpen);
  const [glitchText, setGlitchText] = useState("STOP CORRUPTION");
  const [isConnected, setIsConnected] = useState(true);
  const [hackProgress, setHackProgress] = useState(0);

  const glitchVariants = [
    "STOP CORRUPTION",
    "ST0P C0RRUPT10N", 
    "S†ØP ÇØ®®UP†IØN",
    "5T0P C0RRuP710N",
    "STOP CORRUPTION"
  ];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(glitchVariants[Math.floor(Math.random() * glitchVariants.length)]);
    }, 800);

    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : !prev);
    }, 2000);

    const progressInterval = setInterval(() => {
      setHackProgress(prev => prev >= 100 ? 0 : prev + Math.random() * 15);
    }, 300);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(connectionInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System compromised"
      className={`fixed inset-0 z-[99999] flex items-center justify-center font-mono overflow-hidden pointer-events-auto ${initiallyOpen ? 'block' : 'hidden'}`}
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(0,255,0,0.02), rgba(0,0,0,0.98))",
      }}
    >
      {/* Matrix-style background rain */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,255,0,0.03) 2px,
              rgba(0,255,0,0.03) 4px
            )
          `,
          animation: "matrix-rain 0.5s linear infinite",
        }} 
      />

      <motion.div
        initial={{ scale: 0, rotateX: -90 }}
        animate={{ scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", damping: 15 }}
        className="w-full max-w-5xl max-h-[95vh] overflow-auto p-6 text-center text-green-400 relative"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(0,0,0,0.95), 
              rgba(0,20,0,0.9), 
              rgba(0,0,0,0.95)
            )
          `,
          border: "2px solid #00ff00",
          boxShadow: `
            0 0 50px rgba(0,255,0,0.3),
            inset 0 0 50px rgba(0,255,0,0.05),
            0 0 0 1px rgba(255,0,0,0.2)
          `,
        }}
      >
        {/* Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,255,0,0.1) 2px,
                rgba(0,255,0,0.1) 3px
              )
            `,
            animation: "scanlines 2s linear infinite",
          }} 
        />

        {/* System Header */}
        <motion.div 
          className="flex justify-between items-center mb-5 p-2 bg-black/80 border border-green-400 text-xs"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <FaTerminal className="w-3.5 h-3.5" />
            <span>SYSTEM_OVERRIDE.exe</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-1"
              animate={{ color: isConnected ? "#00ff00" : "#ff0000" }}
            >
              <FaWifi className={`w-3.5 h-3.5 ${!isConnected ? 'opacity-30' : ''}`} />
              <span>{isConnected ? "CONNECTED" : "SIGNAL_LOST"}</span>
            </motion.div>
            <GiCyberEye className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6 items-center relative">
          
          {/* Warning Icons */}
          <motion.div 
            className="flex gap-5 mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaSkull className="w-8 h-8 text-red-500" />
            <MdWarning className="w-8 h-8 text-yellow-400" />
            <MdSecurity className="w-8 h-8 text-red-500" />
          </motion.div>

          {/* Main Glitch Title */}
          <motion.div className="relative overflow-hidden">
            <motion.h1
              className="text-6xl lg:text-7xl font-black text-red-500 tracking-wider leading-none font-mono"
              style={{
                textShadow: `
                  2px 2px 0px #00ff00,
                  -2px -2px 0px #0000ff,
                  0 0 20px rgba(255,0,0,0.5)
                `,
                filter: "contrast(1.2)",
              }}
              animate={{
                x: [0, -2, 2, 0],
                textShadow: [
                  "2px 2px 0px #00ff00, -2px -2px 0px #0000ff, 0 0 20px rgba(255,0,0,0.5)",
                  "4px 0px 0px #00ff00, -4px 0px 0px #0000ff, 0 0 30px rgba(255,0,0,0.8)",
                  "2px 2px 0px #00ff00, -2px -2px 0px #0000ff, 0 0 20px rgba(255,0,0,0.5)"
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
            >
              ⚡ {glitchText} ⚡
            </motion.h1>
          </motion.div>

          {/* System Compromised Message */}
          <motion.div 
            className="bg-red-500/10 border border-red-500 px-5 py-3 flex items-center gap-3"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FaBolt className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-xl tracking-wide uppercase">
              SYSTEM COMPROMISED - PANININDIGAN NG BAYAN
            </span>
            <GiElectric className="w-5 h-5 text-yellow-400" />
          </motion.div>

          {/* Hack Progress Bar */}
          <div className="w-full max-w-2xl bg-black/80 border border-green-400 p-2">
            <div className="flex justify-between mb-1 text-xs text-green-400">
              <span>INFILTRATION_PROGRESS</span>
              <span>{Math.floor(hackProgress)}%</span>
            </div>
            <div className="w-full h-3 bg-green-400/20 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-green-400"
                style={{
                  width: `${hackProgress}%`,
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(0,255,0,0.5)",
                    "0 0 20px rgba(0,255,0,0.8)",
                    "0 0 10px rgba(0,255,0,0.5)"
                  ]
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Code Matrix Effect */}
          <motion.div
            className="w-full bg-black/90 border border-green-400 p-4 text-left text-xs leading-tight max-h-32 overflow-hidden text-green-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div>
              [ACCESSING GOVERNMENT_DATABASE...]<br/>
              [CORRUPTION_FILES.zip] → EXTRACTING...<br/>
              [TRANSPARENCY_PROTOCOL] → INITIATED<br/>
              [JUSTICE_ALGORITHM] → EXECUTING...<br/>
              [PUBLIC_AWARENESS] → BROADCASTING<br/>
              <span className="text-red-400">
                [WARNING] ACCOUNTABILITY_REQUIRED<br/>
                [ALERT] PANAGUTAN_MOVEMENT_ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Philippines Flag Colors */}
          <motion.div
            className="flex gap-3 items-center py-3"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div 
              className="w-15 h-10 border-2 border-green-400"
              style={{ 
                background: "#00247D",
                boxShadow: "0 0 10px rgba(0,36,125,0.5)"
              }} 
            />
            <div 
              className="w-15 h-10 border-2 border-green-400"
              style={{ 
                background: "#CE1126",
                boxShadow: "0 0 10px rgba(206,17,38,0.5)"
              }} 
            />
            <div 
              className="w-15 h-10 border-2 border-green-400"
              style={{ 
                background: "#FFD700",
                boxShadow: "0 0 10px rgba(255,215,0,0.5)"
              }} 
            />
          </motion.div>

          {/* Footer Message */}
          <motion.p
            className="text-white text-sm max-w-3xl leading-relaxed p-4 bg-black/60 border border-dashed border-green-400 m-0"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            &gt; SYSTEM INFILTRATED FOR ANTI-CORRUPTION AWARENESS<br/>
            &gt; SHARE RESPONSIBLY • REPORT INCIDENTS • DEMAND TRANSPARENCY<br/>
            &gt; THE PEOPLE HAVE THE POWER - PANAGUTAN!
          </motion.p>

          {/* PSITS Dev Credit */}
          <motion.div
            className="mt-4 text-green-400 text-xs font-mono border border-green-400/30 bg-black/40 px-3 py-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="flex items-center justify-center gap-2">
              <FaTerminal className="w-3 h-3" />
              <span>DEVELOPED BY PSITS DEV TEAM</span>
              <GiCyberEye className="w-3 h-3" />
            </div>
            <div className="text-center mt-1 text-green-400/70">
              &gt; ./psits_cyber_division.exe
            </div>
          </motion.div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes matrix-rain {
            0% { transform: translateY(0); }
            100% { transform: translateY(20px); }
          }

          @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(10px); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default DefacedOverlay;