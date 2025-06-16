import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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

  // State for sections management
  const [sections, setSections] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [skillsItems, setSkillsItems] = useState([]);
  const [projectsItems, setProjectsItems] = useState([]);
  
  const sectionRefs = useRef([]);
  const animationStates = useRef({});
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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

  // Fetch all data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sections
        const sectionsSnapshot = await getDocs(collection(db, "portfolioSections"));
        const sectionsData = [];
        sectionsSnapshot.forEach((doc) => {
          sectionsData.push({ id: doc.id, ...doc.data() });
        });
        sectionsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSections(sectionsData);
        
        // Fetch education items
        const educationSnapshot = await getDocs(collection(db, "education"));
        const educationData = [];
        educationSnapshot.forEach((doc) => {
          educationData.push({ id: doc.id, ...doc.data() });
        });
        setEducationItems(educationData);
        
        // Fetch skills items
        const skillsSnapshot = await getDocs(collection(db, "skills"));
        const skillsData = [];
        skillsSnapshot.forEach((doc) => {
          skillsData.push({ id: doc.id, ...doc.data() });
        });
        setSkillsItems(skillsData);
        
        // Fetch projects items
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = [];
        projectsSnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        setProjectsItems(projectsData);
        
        toast.success("Data loaded successfully!");
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const animation = element.dataset.animate;
          
          if (entry.isIntersecting) {
            // Reset animation classes
            element.classList.remove(`animate-${animation}`);
            void element.offsetWidth; // Trigger reflow
            
            // Apply the animation
            if (animation) {
              element.classList.add(`animate-${animation}`);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, educationItems, skillsItems, projectsItems]);

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
    const options = {
      "tighter": "leading-tight",
      "tight": "leading-snug",
      "normal": "leading-normal",
      "relaxed": "leading-relaxed",
      "loose": "leading-loose",
      "6": "leading-6",
      "7": "leading-7",
      "8": "leading-8",
      "9": "leading-9",
      "10": "leading-10"
    };
    return options[spacing] || "leading-normal";
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
        <header className="bg-transparent text-white shadow-md sticky top-0 z-50 mt-4 sm:mt-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap">
            {/* Left: Profile and Header Text */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {portfolioData.profileImage && (
                <div className="relative shrink-0">
                  <img 
                    src={portfolioData.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-500"
                  />
                </div>
              )}

              <div className="text-lg sm:text-2xl font-bold shrink-0">
                <span className="text-indigo-500">{portfolioData.headerText}</span>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 px-6 py-20 bg-transparent">
          <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 break-words">
              Hi, I'm <span className="text-indigo-500 break-words">{portfolioData.name}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xs sm:max-w-md md:max-w-xl mb-8">
              <span className="whitespace-pre-line">{portfolioData.title}</span>
            </p>
          </div>

          {/* Education Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">Education</h2>
            
            {educationItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No education entries added yet.</p>
            ) : (
              <div className="space-y-6">
                {educationItems.map((edu, index) => (
                  <div 
                    key={edu.id}
                    ref={el => sectionRefs.current[index] = el}
                    data-section-id={edu.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-gray-300">{edu.institution}</p>
                      {edu.year && <p className="text-gray-400 text-sm">{edu.year}</p>}
                      {edu.description && <p className="mt-2 text-gray-300">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">Skills</h2>
            
            {skillsItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No skills added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsItems.map((skill, index) => (
                  <div 
                    key={skill.id}
                    ref={el => sectionRefs.current[index] = el}
                    data-section-id={skill.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 className="text-lg font-bold">{skill.name}</h3>
                      <div className="flex items-center mt-1">
                        <span 
                          className="text-xs bg-indigo-600 px-2 py-1 rounded mr-2"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                        >
                          {skill.category}
                        </span>
                        <span 
                          className="text-xs bg-gray-600 px-2 py-1 rounded"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">Projects</h2>
            
            {projectsItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No projects added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsItems.map((project, index) => (
                  <div 
                    key={project.id}
                    ref={el => sectionRefs.current[index] = el}
                    data-section-id={project.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 
                        className="text-xl font-bold"
                        data-animate="flipInX"
                        style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                      >
                        {project.title}
                      </h3>
                      <p 
                        className="text-gray-300 mt-2"
                        data-animate="flipInX"
                        style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                      >
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.split(',').map((tech, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-gray-600 px-2 py-1 rounded"
                              data-animate="flipInX"
                              style={{ animationDelay: `${index * 0.1 + 0.3 + i * 0.05}s` }}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Sections Content */}
          <div className="mt-12">
            {sections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No additional sections added yet.</p>
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