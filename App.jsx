import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, Check, ChevronLeft, Plane, ShoppingCart, Smartphone, 
  Briefcase, TrendingUp, Bell, Users, CreditCard, Activity, 
  Star, Wallet, Home, BarChart, Zap, Headphones, Shield, Bot
} from 'lucide-react';

// --- STYLES PERSONNALISÉS (Animations & Safe Areas) ---
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1.5deg); }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-message {
    animation: slideUpFade 0.4s ease-out forwards;
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
  }
  .typing-dot {
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }

  /* Gestion des zones sûres pour les encoches de téléphone (Notch) */
  .pt-safe {
    padding-top: max(1.5rem, env(safe-area-inset-top));
  }
  .pb-safe {
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  }
`;

// --- DATA ---
const questions = [
  { id: 1, category: "Voyage", title: "Voyagez-vous régulièrement à l'étranger ?", description: "Impact : Frais de change, assurances voyage.", Icon: Plane, color: "text-blue-500" },
  { id: 2, category: "Achats", title: "Est-ce que la majorité de vos achats sont sur Internet ?", description: "Impact : Carte virtuelle, protection achats.", Icon: ShoppingCart, color: "text-purple-500" },
  { id: 3, category: "Paiement", title: "Paiement via téléphone ou montre ? (Apple Pay, Android Pay...", description: "Impact : Priorité au digital-first.", Icon: Smartphone, color: "text-emerald-500" },
  { id: 4, category: "Pro", title: "Travaillez-vous à votre compte ?", description: "Impact : Gestion pro/perso séparée.", Icon: Briefcase, color: "text-amber-600" },
  { id: 5, category: "Budget", title: "Besoin de plafonds de paiement élevés ?", description: "Impact : Type de carte, limites dynamiques.", Icon: TrendingUp, color: "text-red-500" },
  { id: 6, category: "Sécurité", title: "Alerté(e) à chaque dépense ?", description: "Impact : Notifications push instantanées.", Icon: Bell, color: "text-yellow-500" },
  { id: 7, category: "Partage", title: "Frais partagés avec des proches ?", description: "Impact : Module « Partage de note ».", Icon: Users, color: "text-indigo-500" },
  { id: 8, category: "Crédit", title: "Utilisez-vous le paiement en plusieurs fois ?", description: "Impact : Crédit à la consommation/Split.", Icon: CreditCard, color: "text-pink-500" },
  { id: 9, category: "Suivi", title: "Surveillez-vous votre budget au quotidien ?", description: "Impact : Dashboard IA et analyses.", Icon: Activity, color: "text-blue-400" },
  { id: 10, category: "Préférences", title: "Aimes-tu alan le goat ?", description: "Une question de goût, mais la réponse est souvent évidente.", Icon: Star, color: "text-yellow-400" },
  { id: 11, category: "Épargne", title: "Épargnez-vous de manière systématique ?", description: "Impact : Arrondis automatiques.", Icon: Wallet, color: "text-emerald-600" },
  { id: 12, category: "Projets", title: "Achat important dans les 12 mois ?", description: "Impact : Capacité d'emprunt.", Icon: Home, color: "text-orange-500" },
  { id: 13, category: "Investissement", title: "Investissez-vous déjà (Bourse, Crypto...) ?", description: "Impact : Onglet investissement intégré.", Icon: BarChart, color: "text-indigo-600" },
  { id: 14, category: "IA", title: "Une IA pour ajuster vos plafonds ?", description: "Impact : Automatisation selon vos habitudes.", Icon: Zap, color: "text-yellow-500" },
  { id: 15, category: "Support", title: "Avez-vous vraiment besoins d'un conseillez quotidient?", description: "Impact : Self-care vs Support Premium.", Icon: Headphones, color: "text-slate-600" },
  { id: 16, category: "Design", title: "Une carte physique au design exclusif ?", description: "Impact : Hardware (ex: Carte Métal).", Icon: Shield, color: "text-slate-800" }
];

const themes = [
  { gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)', shadow: 'shadow-indigo-500/40' },
  { gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', shadow: 'shadow-emerald-500/40' },
  { gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', shadow: 'shadow-blue-500/40' },
  { gradient: 'linear-gradient(135deg, #701a75 0%, #d946ef 100%)', shadow: 'shadow-fuchsia-500/40' }
];

// --- SCRIPT DYNAMIQUE DU CHATBOT ---
const generateChatScript = (answers) => {
  const answeredYes = (index) => answers[index] === 'right';

  const script = [
    {
      bot: "Hello ! J'ai bien analysé tes réponses (et tes swipes très fluides). ✨",
      delay: 1500,
      options: null
    },
    {
      bot: "Je suis l'Assistant IA florieniniento (Je suis Portuguais). Je vais te poser quelques petites questions pour affiner tes garanties et finaliser ta SmartCard.",
      delay: 2000,
      options: ["C'est parti ! 🚀"]
    }
  ];

  if (answeredYes(0)) {
    script.push({
      bot: "Tu m'as dis que tu aimes voyager. Tu voyages beaucoups ?",
      delay: 1500,
      options: [
        "Ca va 🌍 (plus de 5 fois /an)", 
        "Pas vraiment 💻 (moins de 2 fois /an)", 
        "Énormément 💼 (plus de 10 fois /an)"
      ]
    });
  }

  script.push({
    bot: "Comment souhaitez-vous piloter votre compte au quotidien ?",
    delay: 1500,
    options: [
      "Je préfère tous gérer ♟️", 
      "Moi et l'IA on collabore ensemble 🏖️", 
      "L'IA doit tout faire 🛡️"
    ]
  });

  if (answeredYes(13)) {
    script.push({
      bot: "Jusqu'où l'IA peut-elle vous aider à optimiser votre carte ?",
      delay: 1500,
      options: [
        "Assistant (Elle suggère, je valide) 🤖", 
        "Copilote (Elle gère seule) ✈️", 
        "Observateur (Elle analyse) 👁️"
      ]
    });
  }

  script.push({
    bot: "À quel moment notre technologie doit-elle être la plus réactive ?",
    delay: 1500,
    options: [
      "Fin de mois (Ajustement) 📉", 
      "En voyage (Sécurité) ✈️", 
      "Achat important (Plafond) 🛍️", 
      "Organisation (Projets) 📅"
    ]
  });

  script.push({
    bot: "Quelle relation attendez-vous de votre banque ?",
    delay: 1500,
    options: [
      "100% Digitale (Autonomie) 📱", 
      "Hybride (IA + Expert) 🤝", 
      "Premium (Conseiller dédié) 💎"
    ]
  });

  if (answeredYes(11)) {
    script.push({
      bot: "Pour mieux vous accompagner, quel est votre prochain grand projet ?",
      delay: 1500,
      options: [
        "Immobilier 🏠", 
        "Voyage exceptionnel 🌴", 
        "Investissement 📈", 
        "Achat plaisir 🎁"
      ]
    });
  }

  return script;
};

// --- LOGIQUE DU PROFIL TITULAIRE ---
const determineProfile = (answers) => {
  const isYes = (index) => answers[index] === 'right';

  // 1. L’Explorateur : Voyage (0) = OUI + Mobile Pay (2) = OUI
  if (isYes(0) && isYes(2)) return "L'EXPLORATEUR";
  
  // 2. Le Pilote : Freelance/Pro (3) = OUI + Plafonds élevés (4) = OUI
  if (isYes(3) && isYes(4)) return "LE PILOTE";
  
  // 3. Le Stratège : Épargne (10) = OUI + Investissement (12) = OUI
  if (isYes(10) && isYes(12)) return "LE STRATÈGE";
  
  // 4. Le Gardien : Achats Web (1) = OUI + Sécurité (5) = OUI
  if (isYes(1) && isYes(5)) return "LE GARDIEN";
  
  // 5. Le Serein : IA (13) = OUI
  if (isYes(13)) return "LE SEREIN";

  // Profil par défaut si aucune combinaison spécifique n'est trouvée
  return "LE SWAGMAN";
};

// --- COMPONENTS ---

const SwipeCard = ({ card, onSwipe }) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveX, setLeaveX] = useState(0);
  const [startY, setStartY] = useState(0);
  const startXRef = useRef(0);

  const threshold = 100;

  const handlePointerDown = (e) => {
    if (isLeaving) return;
    setIsDragging(true);
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
    setStartY(e.clientY || (e.touches && e.touches[0].clientY));
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isLeaving) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    if (Math.abs(currentY - startY) > Math.abs(currentX - startXRef.current)) return;
    setDragOffset(currentX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging || isLeaving) return;
    setIsDragging(false);
    if (dragOffset > threshold) triggerLeave('right');
    else if (dragOffset < -threshold) triggerLeave('left');
    else setDragOffset(0);
  };

  const triggerLeave = (direction) => {
    if (isLeaving) return;
    setIsLeaving(true);
    setLeaveX(direction === 'right' ? 400 : -400);
    setTimeout(() => onSwipe(direction), 300);
  };

  const transform = `translateX(${dragOffset + leaveX}px) rotate(${(dragOffset + leaveX) * 0.05}deg)`;
  const transition = isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
  const yesOpacity = Math.min(Math.max(dragOffset / threshold, 0), 1);
  const noOpacity = Math.min(Math.max(-dragOffset / threshold, 0), 1);
  
  const { Icon, color } = card;

  return (
    <div className="flex-1 relative flex flex-col pt-4 pb-safe select-none">
      <div className="flex-1 relative flex items-center justify-center px-6 z-20">
        <div 
          className="w-full h-full max-h-[450px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col p-8 cursor-grab active:cursor-grabbing relative overflow-hidden border border-gray-100"
          style={{ transform, transition, touchAction: 'none' }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className="absolute inset-0 z-0 pointer-events-none transition-opacity flex justify-between px-6 items-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center -ml-8" style={{ opacity: noOpacity, transform: `scale(${0.5 + noOpacity * 0.5})` }}>
              <X className="w-8 h-8 text-red-500" />
            </div>
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center -mr-8" style={{ opacity: yesOpacity, transform: `scale(${0.5 + yesOpacity * 0.5})` }}>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100">
              <Icon className={`w-12 h-12 ${color}`} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4 leading-tight">{card.title}</h2>
            <p className="text-gray-500 text-center text-sm leading-relaxed">{card.description}</p>
          </div>
        </div>
      </div>

      <div className="pt-8 px-10 pb-6 flex justify-between items-center z-10">
        <button onClick={() => triggerLeave('left')} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border border-gray-100 active:scale-95">
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
        <button onClick={() => triggerLeave('right')} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors border border-gray-100 active:scale-95">
          <Check className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

// --- CHATBOT SCREEN ---
const ChatScreen = ({ answers, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);
  
  const chatScript = useMemo(() => generateChatScript(answers), [answers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let timeout;
    if (step < chatScript.length) {
      const currentInteraction = chatScript[step];
      
      setIsTyping(true);
      
      timeout = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text: currentInteraction.bot }]);
        
        if (!currentInteraction.options) {
          setStep(prev => prev + 1);
        }
      }, currentInteraction.delay);
    } else if (step === chatScript.length) {
      setIsTyping(true);
      timeout = setTimeout(() => {
        setIsTyping(false);
        onComplete();
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [step, chatScript, onComplete]);

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { sender: 'user', text: option }]);
    setStep(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="pt-safe pb-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm z-10 flex flex-col items-center">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center mb-2 shadow-md">
          <Bot className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 leading-none">Assistant IA</h2>
        <p className="text-[11px] font-medium text-emerald-500 uppercase tracking-widest mt-1">En ligne</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-safe">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
          >
            <div className={`px-5 py-3.5 max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-message">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
            </div>
          </div>
        )}

        {!isTyping && step < chatScript.length && chatScript[step].options && (
          <div className="flex flex-wrap gap-2 justify-end mt-2 animate-message">
            {chatScript[step].options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="bg-white text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// --- END SCREEN ---
const EndScreen = ({ answers, onReset }) => {
  const theme = useMemo(() => themes[Math.floor(Math.random() * themes.length)], []);
  const profileName = useMemo(() => determineProfile(answers), [answers]);

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 pt-safe pb-safe z-50">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-800 text-center mb-8 tracking-tight leading-tight">
          Ma carte<br />Mon expérience
        </h1>

        <div 
          className={`w-full aspect-[1.586/1] rounded-2xl shadow-2xl p-5 relative text-white border border-white/20 animate-float flex flex-col justify-between ${theme.shadow}`}
          style={{ background: theme.gradient }}
        >
          <div className="flex justify-between items-start">
            <div className="w-11 h-8 bg-yellow-400/90 rounded-md shadow-sm border border-yellow-300/50"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">PREMIUM 10€</span>
              <span className="text-[9px] text-white/80 mt-1.5 font-medium">+ Add-ons personnalisés</span>
            </div>
          </div>
          
          <div className="mt-auto mb-4 text-[15px] sm:text-lg font-mono tracking-[0.15em] opacity-90 drop-shadow-md whitespace-nowrap">
            4521 8892 0034 1001
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase opacity-75 font-medium tracking-wider">Titulaire</span>
              <span className="text-sm font-bold tracking-widest mt-0.5">{profileName}</span>
            </div>
            <div className="flex -space-x-3">
              <div className="w-8 h-8 bg-white/30 rounded-full backdrop-blur-md mix-blend-overlay"></div>
              <div className="w-8 h-8 bg-white/30 rounded-full backdrop-blur-md mix-blend-overlay"></div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-slate-500 font-medium mt-10 mb-8 leading-relaxed px-4">
          Votre "SmartCard" est prête.<br />Conçue par l'IA, validée par vous.
        </p>

        <div className="flex flex-col w-full gap-3 mt-auto mb-4">
          <button className="bg-gray-900 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all flex flex-col items-center w-full active:scale-[0.98]">
            <span className="text-base">Souscrire pour 12€ / mois</span>
            <span className="text-[10px] font-normal opacity-80 mt-0.5">(10€ Socle + 2€ Extras)</span>
          </button>
          <button 
            onClick={onReset} 
            className="text-slate-600 font-semibold py-3.5 px-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all w-full active:scale-[0.98]"
          >
            Refaire l'expérience
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [phase, setPhase] = useState('swipe'); // 'swipe' | 'chat' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleSwipe = (direction) => {
    const newAnswers = [...answers, direction];
    setAnswers(newAnswers);
    
    if (currentIndex + 1 >= questions.length) {
      setPhase('chat');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setAnswers(prev => prev.slice(0, -1));
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setPhase('swipe');
    setCurrentIndex(0);
    setAnswers([]);
  };

  const progressPercent = Math.min((currentIndex / questions.length) * 100, 100);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Conteneur principal qui s'adapte à tout l'écran */}
      <div className="bg-gray-200 min-h-screen font-sans flex justify-center">
        
        {/* L'application prend tout l'écran sur mobile, mais est contrainte et centrée sur un grand écran de PC */}
        <div className="w-full max-w-md h-[100dvh] bg-gray-50 flex flex-col relative overflow-hidden sm:shadow-2xl sm:border-x border-gray-200">
          
          {phase === 'swipe' && questions[currentIndex] && (
            <>
              {/* Le header utilise "pt-safe" pour ne pas être caché sous l'encoche des téléphones */}
              <div className="pt-safe pb-2 px-6 relative z-30">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <button 
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className={`p-1.5 rounded-full transition-colors ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-900 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="w-9"></div> 
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {questions[currentIndex]?.category}
                  </p>
                </div>
              </div>

              <SwipeCard 
                key={questions[currentIndex].id}
                card={questions[currentIndex]} 
                onSwipe={handleSwipe}
              />
            </>
          )}

          {phase === 'chat' && (
            <ChatScreen answers={answers} onComplete={() => setPhase('result')} />
          )}

          {phase === 'result' && (
            <EndScreen answers={answers} onReset={handleReset} />
          )}

        </div>
      </div>
    </>
  );
}
