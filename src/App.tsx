import React, { useState, useEffect, useRef } from 'react';
import { Settings, Power, Zap, MapPin, DollarSign, Clock, Info, Smartphone, XCircle, MoveRight, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings, SupportedApp } from './types';
import { SelectiveAcceptanceEngine } from './lib/logicEngine';

const INITIAL_SETTINGS: AppSettings = {
  minFare: 100.0,
  maxFare: 1000.0,
  maxDistance: 3.5,
  autoAcceptEnabled: true,
  timeDurationMs: 10,
  swipeDurationMs: 30,
  activeApps: {
    'Ola': true,
    'Uber': true,
    'Rapido': true,
    'Namma Yatri': true,
  }
};

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [showSettings, setShowSettings] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mockOrder, setMockOrder] = useState<{visible: boolean, status: 'pending' | 'accepted'}>({visible: false, status: 'pending'});
  
  const engineRef = useRef(new SelectiveAcceptanceEngine(settings));

  // Update engine when settings change
  useEffect(() => {
    engineRef.current.updateSettings(settings);
  }, [settings]);

  // Simulate background auto-accepting without popping up the app
  useEffect(() => {
    if (mockOrder.visible && mockOrder.status === 'pending' && settings.autoAcceptEnabled) {
      const timer = setTimeout(() => {
        setMockOrder({visible: true, status: 'accepted'});
        setTimeout(() => {
          setMockOrder({visible: false, status: 'pending'});
        }, 2000);
      }, 800); // 800ms delay so user can see the card before it gets auto-clicked
      return () => clearTimeout(timer);
    }
  }, [mockOrder.visible, mockOrder.status, settings.autoAcceptEnabled]);

  const toggleGlobal = () => {
    const willEnable = !settings.autoAcceptEnabled;
    setSettings(prev => ({ ...prev, autoAcceptEnabled: willEnable }));
    
    // Automatically pop the floating logo on the screen when turned ON
    if (willEnable) {
      setTimeout(() => {
        setIsMinimized(true);
      }, 400); // 400ms delay so the driver sees the switch turn green before it minimizes
    }
  };

  return (
    <>
      {/* Floating Background Widget */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            drag
            dragConstraints={{ 
              left: -(typeof window !== 'undefined' ? window.innerWidth - 80 : 1000), 
              right: 0, 
              top: -(typeof window !== 'undefined' ? window.innerHeight - 80 : 1000), 
              bottom: 0 
            }}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              // Small delay to prevent the onClick from firing immediately after drag ends
              setTimeout(() => setIsDragging(false), 150);
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed z-50 cursor-move touch-none"
            style={{ bottom: 32, right: 32 }}
            onClick={() => {
              if (!isDragging) {
                setIsMinimized(false);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Drag to move, Tap to open"
          >
            <div className="relative p-4 bg-white rounded-full shadow-2xl border-4 border-neutral-200 flex items-center justify-center">
              <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400" />
              {settings.autoAcceptEnabled && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Android Home Screen Background */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahendra_Singh_Dhoni_January_2016_%28cropped%29.jpg")' }}
          >
            {/* Mock Status Bar */}
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/40 to-transparent flex justify-between items-center px-5 text-white/90 text-xs font-medium tracking-wide">
              <span>12:30</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/80"></div>
                <div className="w-4 h-3 rounded-sm bg-white/80"></div>
              </div>
            </div>
            
            {/* Mock App Icons to make it look like a real phone */}
            <div className="absolute inset-x-0 bottom-12 flex justify-center gap-6 px-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-white text-xs font-bold">Ola</div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-white text-xs font-bold">Uber</div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-white text-xs font-bold">Rapido</div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-white text-xs font-bold text-center leading-tight">Namma<br/>Yatri</div>
            </div>

            {/* Simulate Ride Button */}
            <button 
              onClick={() => setMockOrder({visible: true, status: 'pending'})}
              className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/20 font-medium shadow-2xl transition-colors z-10"
            >
              Simulate Incoming Ride
            </button>

            {/* Mock Ride Request Card */}
            <AnimatePresence>
              {mockOrder.visible && (
                <motion.div
                  initial={{ y: -50, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.95 }}
                  className="absolute top-40 inset-x-6 bg-white rounded-2xl shadow-2xl overflow-hidden z-40 border border-neutral-200"
                >
                  <div className="p-4 bg-black text-white flex justify-between items-center">
                    <span className="font-bold text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Uber Request
                    </span>
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">₹250.00</span>
                  </div>
                  <div className="p-5 space-y-3 bg-neutral-50">
                    <div className="flex items-center gap-3 text-neutral-700 font-medium">
                      <MapPin className="w-5 h-5 text-blue-500" /> 2.5 km away
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700 font-medium">
                      <Clock className="w-5 h-5 text-amber-500" /> 5 min pickup
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-neutral-100">
                    <button 
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                        mockOrder.status === 'accepted' 
                          ? 'bg-emerald-500 text-white scale-[0.98]' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {mockOrder.status === 'accepted' ? (
                        <>
                          <Zap className="w-5 h-5 fill-white" />
                          Auto-Accepted in 10ms!
                        </>
                      ) : (
                        'Accept Ride'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 ${isMinimized ? 'hidden' : ''}`}>
        {/* Header */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Instant Accepter</h1>
            <p className="text-xs text-neutral-400">Background Automation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
            title="Run in Background"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
            title="Architecture Info"
          >
            <Info className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Global Toggle Card */}
        <div className={`p-6 rounded-2xl border transition-colors duration-300 flex items-center justify-between ${
          settings.autoAcceptEnabled 
            ? 'bg-emerald-950/30 border-emerald-500/30' 
            : 'bg-neutral-900/50 border-neutral-800'
        }`}>
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Power className={`w-5 h-5 ${settings.autoAcceptEnabled ? 'text-emerald-400' : 'text-neutral-500'}`} />
              Simulation On/Off Switch
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              {settings.autoAcceptEnabled 
                ? 'Simulation is active. Actively intercepting and filtering incoming orders.' 
                : 'Simulation is paused. Orders will not be auto-accepted.'}
            </p>
          </div>
          
          <button 
            onClick={toggleGlobal}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
              settings.autoAcceptEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
            }`}
          >
            <span className="sr-only">Toggle simulation</span>
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                settings.autoAcceptEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Settings Panel (Collapsible) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
                <h3 className="text-lg font-medium flex items-center gap-2 border-b border-neutral-800 pb-4">
                  <Settings className="w-5 h-5 text-neutral-400" />
                  Filtering Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Supported Apps */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        Supported Apps
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(Object.keys(settings.activeApps || INITIAL_SETTINGS.activeApps) as SupportedApp[]).map((appName) => {
                        const isActive = settings.activeApps ? settings.activeApps[appName] : true;
                        return (
                        <button
                          key={appName}
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            activeApps: { ...(prev.activeApps || INITIAL_SETTINGS.activeApps), [appName]: !isActive }
                          }))}
                          className={`p-3 rounded-xl border text-sm font-medium transition-colors flex flex-col items-center gap-2 ${
                            isActive
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                              : 'bg-neutral-800/50 border-neutral-700 text-neutral-500 hover:bg-neutral-800'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                          {appName}
                        </button>
                      )})}
                    </div>
                  </div>

                  {/* Minimum Fare */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Minimum Fare
                      </span>
                      <span className="text-emerald-400 font-mono">₹{settings.minFare.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="20" max="500" step="10"
                      value={settings.minFare}
                      onChange={(e) => setSettings({...settings, minFare: Math.min(parseFloat(e.target.value), settings.maxFare)})}
                      className="w-full accent-emerald-500"
                    />
                    <p className="text-xs text-neutral-500">Reject orders below this amount.</p>
                  </div>

                  {/* Maximum Fare */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        Maximum Fare
                      </span>
                      <span className="text-emerald-400 font-mono">₹{settings.maxFare.toFixed(2)}</span>
                    </label>
                    <input 
                      type="range" 
                      min="50" max="2000" step="10"
                      value={settings.maxFare}
                      onChange={(e) => setSettings({...settings, maxFare: Math.max(parseFloat(e.target.value), settings.minFare)})}
                      className="w-full accent-emerald-500"
                    />
                    <p className="text-xs text-neutral-500">Reject orders above this amount.</p>
                  </div>

                  {/* Maximum Distance */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Max Pickup Distance
                      </span>
                      <span className="text-blue-400 font-mono">{settings.maxDistance.toFixed(1)} km</span>
                    </label>
                    <input 
                      type="range" 
                      min="0.5" max="15" step="0.5"
                      value={settings.maxDistance}
                      onChange={(e) => setSettings({...settings, maxDistance: parseFloat(e.target.value)})}
                      className="w-full accent-blue-500"
                    />
                    <p className="text-xs text-neutral-500">Only accept if pickup is within this radius.</p>
                  </div>

                  {/* Time Duration */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Time Duration
                      </span>
                      <span className="text-amber-400 font-mono">{settings.timeDurationMs} ms</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" max="10" step="1"
                      value={settings.timeDurationMs}
                      disabled
                      className="w-full accent-amber-500 opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-500">Constant delay before action starts.</p>
                  </div>

                  {/* Swipe Duration */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-sm font-medium text-neutral-300">
                      <span className="flex items-center gap-2">
                        <MoveRight className="w-4 h-4 text-amber-400" />
                        Swipe Duration
                      </span>
                      <span className="text-amber-400 font-mono">{settings.swipeDurationMs} ms</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" max="50" step="1"
                      value={settings.swipeDurationMs}
                      onChange={(e) => setSettings({...settings, swipeDurationMs: parseInt(e.target.value)})}
                      className="w-full accent-amber-500"
                    />
                    <p className="text-xs text-neutral-500">Speed of the accept swipe gesture (10-50ms).</p>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Architecture Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Mobile Architecture Guide</h2>
                <button onClick={() => setShowInfo(false)} className="text-neutral-500 hover:text-neutral-300">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-neutral-300 max-h-[60vh] overflow-y-auto pr-2">
                <p>This web dashboard is a prototype of the <strong>Instant Accepter</strong> mobile application. To build the actual mobile app (e.g., in React Native or Flutter), you will need the following architecture:</p>
                
                <div className="space-y-2">
                  <h3 className="text-emerald-400 font-medium">1. Android Accessibility Services</h3>
                  <p className="text-neutral-400">To intercept notifications and overlay other apps (Ola, Uber, Rapido, Namma Yatri), you must create a native Android module that extends <code>AccessibilityService</code>. This service will listen to <code>AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED</code> or <code>TYPE_WINDOW_CONTENT_CHANGED</code> to read incoming order details (Fare, Distance) directly from the screen's View hierarchy.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-amber-400 font-medium">2. Fully Automated (No Target Placing)</h3>
                  <p className="text-neutral-400">Unlike standard auto-clickers, <strong>drivers do not need to manually place target crosshairs</strong> on the screen. Once an order matches the fixed Min/Max fare, the Accessibility Service automatically finds the "Accept" button in the app's view hierarchy and instantly executes the swipe/tap within the 10ms Time Duration.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-blue-400 font-medium">3. State Management & Battery</h3>
                  <p className="text-neutral-400">Use a state manager like <strong>Redux</strong> (React Native) or <strong>Riverpod</strong> (Flutter) to sync the settings from this UI to the native background service. To optimise battery, ensure the Accessibility Service only parses the screen when the specific target app (e.g., Uber/Ola) is in the foreground.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-red-400 font-medium">4. Important Disclaimer</h3>
                  <p className="text-neutral-400">Using Accessibility Services to automate interactions with third-party apps often violates their Terms of Service and can result in account bans. Proceed with caution and ensure compliance with local regulations.</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-800 text-right">
                <button 
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
