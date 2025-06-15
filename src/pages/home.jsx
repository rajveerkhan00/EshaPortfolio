import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define all animation keyframes and styles outside the component
const globalStyles = `
  /* Animation Keyframes */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flipInX {
    from { opacity: 0; transform: perspective(400px) rotateX(90deg); }
    to { opacity: 1; transform: perspective(400px) rotateX(0); }
  }
  @keyframes flipInY {
    from { opacity: 0; transform: perspective(400px) rotateY(90deg); }
    to { opacity: 1; transform: perspective(400px) rotateY(0); }
  }
  @keyframes lightSpeedIn {
    from { opacity: 0; transform: translateX(100%) skewX(-30deg); }
    60% { opacity: 1; transform: skewX(20deg); }
    80% { transform: skewX(-5deg); }
    to { transform: translateX(0); }
  }
  @keyframes rotateIn {
    from { opacity: 0; transform: rotate(-200deg); }
    to { opacity: 1; transform: rotate(0); }
  }
  @keyframes jackInTheBox {
    from { opacity: 0; transform: scale(0.1) rotate(30deg); transform-origin: center bottom; }
    50% { transform: rotate(-10deg); }
    70% { transform: rotate(3deg); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes rollIn {
    from { opacity: 0; transform: translateX(-100%) rotate(-120deg); }
    to { opacity: 1; transform: translateX(0) rotate(0); }
  }
  @keyframes rubberBand {
    from { transform: scale(1); }
    30% { transform: scaleX(1.25) scaleY(0.75); }
    40% { transform: scaleX(0.75) scaleY(1.25); }
    60% { transform: scaleX(1.15) scaleY(0.85); }
    to { transform: scale(1); }
  }

  /* Animation Classes */
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  .animate-slideUp {
    animation: slideUp 0.6s ease-out forwards;
  }
  .animate-bounceIn {
    animation: bounceIn 0.8s ease-out forwards;
  }
  .animate-zoomIn {
    animation: zoomIn 0.6s ease-out forwards;
  }
  .animate-fadeInLeft {
    animation: fadeInLeft 0.6s ease-out forwards;
  }
  .animate-fadeInRight {
    animation: fadeInRight 0.6s ease-out forwards;
  }
  .animate-flipInX {
    animation: flipInX 0.8s ease-out forwards;
    backface-visibility: visible !important;
  }
  .animate-flipInY {
    animation: flipInY 0.8s ease-out forwards;
    backface-visibility: visible !important;
  }
  .animate-lightSpeedIn {
    animation: lightSpeedIn 0.8s ease-out forwards;
  }
  .animate-rotateIn {
    animation: rotateIn 0.8s ease-out forwards;
  }
  .animate-jackInTheBox {
    animation: jackInTheBox 0.8s ease-out forwards;
  }
  .animate-rollIn {
    animation: rollIn 0.8s ease-out forwards;
  }
  .animate-rubberBand {
    animation: rubberBand 0.8s ease-out forwards;
  }
`;

export default function Home() {
  const [portfolioData, setPortfolioData] = useState({
    name: "Esha",
    title: "A passionate frontend developer crafting beautiful and functional websites.",
    headerText: "Esha Portfolio",
    profileImage: ""
  });

  const [sections, setSections] = useState([]);
  const sectionRefs = useRef([]);
  const animationStates = useRef({});

  // Inject global styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Load portfolio data from Firebase
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const docRef = doc(db, "portfolio", "content");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      }
    };
    
    fetchPortfolioData();
  }, []);

  // Fetch sections from Firebase
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolioSections"));
        const sectionsData = [];
        querySnapshot.forEach((doc) => {
          sectionsData.push({ id: doc.id, ...doc.data() });
        });
        sectionsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching sections: ", error);
      }
    };
    fetchSections();
  }, []);

  // Intersection Observer for scroll animations with reset capability
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          const sectionId = section.dataset.sectionId;
          
          if (entry.isIntersecting) {
            // Reset animation state when section comes into view
            animationStates.current[sectionId] = false;
            
            // Only trigger animation if it hasn't been shown yet for this intersection
            if (!animationStates.current[sectionId]) {
              const animation = section.dataset.animation;
              
              // Reset any previous animation classes
              section.className = section.className.replace(/\banimate-\w+\b/g, '');
              section.style.opacity = animation === "none" ? "1" : "0";
              
              // Apply the appropriate animation
              if (animation === "letterByLetter") {
                const heading = section.querySelector(".animated-heading");
                const paragraph = section.querySelector(".animated-paragraph");
                
                if (heading) {
                  const text = heading.textContent;
                  heading.textContent = "";
                  for (let i = 0; i < text.length; i++) {
                    setTimeout(() => {
                      heading.textContent += text[i];
                    }, i * 50);
                  }
                }
                
                if (paragraph) {
                  const text = paragraph.textContent;
                  paragraph.textContent = "";
                  for (let i = 0; i < text.length; i++) {
                    setTimeout(() => {
                      paragraph.textContent += text[i];
                    }, i * 20);
                  }
                }
              } else if (animation !== "none") {
                section.classList.add(`animate-${animation}`);
                section.style.opacity = "1";
              }
              
              animationStates.current[sectionId] = true;
            }
          } else {
            // When section leaves view, reset its animation state
            animationStates.current[sectionId] = false;
            
            // Reset opacity for non-animated sections
            const animation = section.dataset.animation;
            if (animation !== "none") {
              section.style.opacity = "0";
              section.className = section.className.replace(/\banimate-\w+\b/g, '');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all section refs
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
      animationStates.current = {};
    };
  }, [sections]);

  // Get alignment classes
  const getAlignmentClasses = (position) => {
    switch (position) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      default:
        return "text-center";
    }
  };

  // Get border radius class
  const getBorderRadiusClass = (radius) => {
    return radius === "none" ? "" : `rounded-${radius}`;
  };

  // Get line spacing class
  const getLineSpacingClass = (spacing) => {
    const options = [
      { value: "tighter", class: "leading-tight" },
      { value: "tight", class: "leading-snug" },
      { value: "normal", class: "leading-normal" },
      { value: "relaxed", class: "leading-relaxed" },
      { value: "loose", class: "leading-loose" },
      { value: "6", class: "leading-6" },
      { value: "7", class: "leading-7" },
      { value: "8", class: "leading-8" },
      { value: "9", class: "leading-9" },
      { value: "10", class: "leading-10" }
    ];
    const option = options.find(opt => opt.value === spacing);
    return option ? option.class : "leading-normal";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-[length:400%_400%] animate-bg-pan">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="min-h-screen flex flex-col text-white relative pb-20">
        {/* Header */}
       <header className="bg-transparent text-white shadow-md sticky top-0 z-50 mt-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    {/* Left: Profile Image and Header Text */}
    <div className="flex items-center gap-4">
      {portfolioData.profileImage && (
        <img 
          src={portfolioData.profileImage} 
          alt="Profile" 
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
        />
      )}
      <div className="text-2xl font-bold">
        <span className="text-indigo-500">{portfolioData.headerText}</span>
      </div>
    </div>

    {/* Right: Login Button as <a> tag */}
    <div>
      <a
        href="/login"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-300"
      >
        Login
      </a>
    </div>
  </div>
</header>

        {/* Hero Section */}
        <main className="flex-1 px-6 py-20 bg-transparent">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hi, I'm <span className="text-indigo-500">{portfolioData.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
              {portfolioData.title}
            </p>
          </div>

          {/* Sections Content */}
          <div className="mt-12">
            {sections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No sections available.</p>
              </div>
            ) : (
              sections.map((section, index) => (
                <div 
                  key={section.id}
                  ref={el => sectionRefs.current[index] = el}
                  data-section-id={section.id}
                  data-animation={section.animation}
                  className={`mb-8 p-6 backdrop-blur-sm border ${getBorderRadiusClass(section.borderRadius)} ${section.customClasses || ''}`}
                  style={{ 
                    backgroundColor: section.bgColor,
                    borderColor: section.borderColor,
                    opacity: section.animation === "none" ? 1 : 0
                  }}
                >
                  {/* Heading with separate alignment */}
                  <div className={getAlignmentClasses(section.headingPosition)}>
                    {section.type === "hero" ? (
                      <h1 
                        className={`font-bold ${section.headingMargin} text-${section.headingSize} ${section.animation === 'letterByLetter' ? 'animated-heading' : ''}`}
                        style={{ color: section.textColor }}
                      >
                        {section.heading.split("Esha").map((part, i) => 
                          i === 0 ? part : <span key={i} className="text-indigo-500">Esha</span>
                        )}
                      </h1>
                    ) : (
                      <h2 
                        className={`font-bold ${section.headingMargin} text-${section.headingSize} ${section.animation === 'letterByLetter' ? 'animated-heading' : ''}`}
                        style={{ color: section.textColor }}
                      >
                        {section.heading}
                      </h2>
                    )}
                  </div>

                  {/* Paragraph with separate alignment and line spacing */}
                  <div className={`${getAlignmentClasses(section.paragraphPosition)} ${getLineSpacingClass(section.lineSpacing)}`}>
                    <p 
                      className={`text-${section.paragraphSize} ${section.paragraphMargin} ${section.animation === 'letterByLetter' ? 'animated-paragraph' : ''}`}
                      style={{ color: section.textColor }}
                    >
                      {section.paragraph}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}