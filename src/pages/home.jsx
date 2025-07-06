import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaEnvelope } from "react-icons/fa";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, to { animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000); }
    0% { opacity: 0; transform: scale3d(.3, .3, .3); }
    20% { transform: scale3d(1.1, 1.1, 1.1); }
    40% { transform: scale3d(.9, .9, .9); }
    60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
    80% { transform: scale3d(.97, .97, .97); }
    to { opacity: 1; transform: scale3d(1, 1, 1); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale3d(.3, .3, .3); }
    50% { opacity: 1; }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translate3d(-50px, 0, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translate3d(50px, 0, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes flipInX {
    from { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); animation-timing-function: ease-in; opacity: 0; }
    40% { transform: perspective(400px) rotate3d(1, 0, 0, -20deg); animation-timing-function: ease-in; }
    60% { transform: perspective(400px) rotate3d(1, 0, 0, 10deg); opacity: 1; }
    80% { transform: perspective(400px) rotate3d(1, 0, 0, -5deg); }
    to { transform: perspective(400px); }
  }
  @keyframes flipInY {
    from { transform: perspective(400px) rotate3d(0, 1, 0, 90deg); animation-timing-function: ease-in; opacity: 0; }
    40% { transform: perspective(400px) rotate3d(0, 1, 0, -20deg); animation-timing-function: ease-in; }
    60% { transform: perspective(400px) rotate3d(0, 1, 0, 10deg); opacity: 1; }
    80% { transform: perspective(400px) rotate3d(0, 1, 0, -5deg); }
    to { transform: perspective(400px); }
  }
  @keyframes lightSpeedIn {
    from { transform: translate3d(100%, 0, 0) skewX(-30deg); opacity: 0; }
    60% { transform: skewX(20deg); opacity: 1; }
    80% { transform: skewX(-5deg); opacity: 1; }
    to { transform: translate3d(0, 0, 0); }
  }
  @keyframes rotateIn {
    from { transform: rotate3d(0, 0, 1, -200deg); opacity: 0; }
    to { transform: translate3d(0, 0, 0); opacity: 1; }
  }
  @keyframes jackInTheBox {
    from { opacity: 0; transform: scale(0.1) rotate(30deg); transform-origin: center bottom; }
    50% { transform: rotate(-10deg); }
    70% { transform: rotate(3deg); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes rollIn {
    from { opacity: 0; transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes rubberBand {
    from { transform: scale3d(1, 1, 1); }
    30% { transform: scale3d(1.25, 0.75, 1); }
    40% { transform: scale3d(0.75, 1.25, 1); }
    50% { transform: scale3d(1.15, 0.85, 1); }
    65% { transform: scale3d(.95, 1.05, 1); }
    75% { transform: scale3d(1.05, .95, 1); }
    to { transform: scale3d(1, 1, 1); }
  }
  @keyframes bg-pan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes wordByWord {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: white }
  }

  .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-slideRight { animation: slideRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-bounceIn { animation: bounceIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-zoomIn { animation: zoomIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-fadeInLeft { animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-fadeInRight { animation: fadeInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-flipInX { animation: flipInX 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-flipInY { animation: flipInY 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-lightSpeedIn { animation: lightSpeedIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-rotateIn { animation: rotateIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-jackInTheBox { animation: jackInTheBox 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-rollIn { animation: rollIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-rubberBand { animation: rubberBand 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-bg-pan { animation: bg-pan 10s ease infinite; }
  .animate-wordByWord { animation: wordByWord 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .typing-animation {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid white;
    animation: 
      typing 3.5s steps(40, end),
      blink-caret 0.75s step-end infinite;
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState({
    name: "",
    title: "",
    headerText: "",
    profileImage: "",
  });

  const [sections, setSections] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [skillsItems, setSkillsItems] = useState([]);
  const [projectsItems, setProjectsItems] = useState([]);
  const [experienceItems, setExperienceItems] = useState([]);
  const [contactItems, setContactItems] = useState([]);

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = `Hi, I'm ${portfolioData.name}`;
  const typingIntervalRef = useRef(null);

  const [subtitleDisplay, setSubtitleDisplay] = useState("");
  const subtitleText = "A passionate frontend developer crafting beautiful and functional websites";
  const subtitleIndexRef = useRef(0);
  const subtitleIntervalRef = useRef(null);

  const sectionRefs = useRef([]);
  const animationStates = useRef({});

  const handleProfileClick = () => {
    navigate("/Login");
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (portfolioData.name) {
      setCurrentIndex(0);
      setDisplayText("");
      
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayText(prev => prev + fullText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, 100);

      return () => clearInterval(typingIntervalRef.current);
    }
  }, [portfolioData.name]);

  useEffect(() => {
    if (portfolioData.title) {
      subtitleIndexRef.current = 0;
      setSubtitleDisplay("");
      
      subtitleIntervalRef.current = setInterval(() => {
        if (subtitleIndexRef.current < subtitleText.length) {
          setSubtitleDisplay(prev => prev + subtitleText[subtitleIndexRef.current]);
          subtitleIndexRef.current += 1;
        } else {
          clearInterval(subtitleIntervalRef.current);
        }
      }, 50);

      return () => clearInterval(subtitleIntervalRef.current);
    }
  }, [portfolioData.title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const animation = element.dataset.animate;

          if (entry.isIntersecting) {
            element.classList.remove(`animate-${animation}`);
            void element.offsetWidth;
            element.classList.add(`animate-${animation}`);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, educationItems, skillsItems, projectsItems, experienceItems, contactItems]);

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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const sectionsSnapshot = await getDocs(collection(db, "portfolioSections"));
        const sectionsData = [];
        sectionsSnapshot.forEach((doc) => {
          sectionsData.push({ id: doc.id, ...doc.data() });
        });
        sectionsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSections(sectionsData);

        const educationSnapshot = await getDocs(collection(db, "education"));
        const educationData = [];
        educationSnapshot.forEach((doc) => {
          educationData.push({ id: doc.id, ...doc.data() });
        });
        setEducationItems(educationData);

        const skillsSnapshot = await getDocs(collection(db, "skills"));
        const skillsData = [];
        skillsSnapshot.forEach((doc) => {
          skillsData.push({ id: doc.id, ...doc.data() });
        });
        setSkillsItems(skillsData);

        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = [];
        projectsSnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });
        setProjectsItems(projectsData);

        const experienceSnapshot = await getDocs(collection(db, "experience"));
        const experienceData = [];
        experienceSnapshot.forEach((doc) => {
          experienceData.push({ id: doc.id, ...doc.data() });
        });
        setExperienceItems(experienceData);

        const contactSnapshot = await getDocs(collection(db, "contact"));
        const contactData = [];
        contactSnapshot.forEach((doc) => {
          contactData.push({ id: doc.id, ...doc.data() });
        });
        setContactItems(contactData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-[length:400%_400%] animate-bg-pan">
      <div className="min-h-screen flex flex-col text-white relative pb-20">
        <header className="bg-transparent text-white shadow-md sticky top-0 z-50 mt-4 sm:mt-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              {portfolioData.profileImage && (
                <img
                  src={portfolioData.profileImage}
                  alt="Profile"
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
                  onClick={handleProfileClick}
                  data-animate="flipInY"
                />
              )}
              <div className="text-lg sm:text-2xl font-bold">
                <span className="text-indigo-500" data-animate="fadeInRight">
                  {portfolioData.headerText}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-20 bg-transparent">
          <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-8">
            {portfolioData.profileImage && (
              <div className="mb-8" data-animate="zoomIn">
                <img
                  src={portfolioData.profileImage}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-500 mx-auto cursor-pointer"
                  onClick={handleProfileClick}
                />
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 break-words">
              {fullText.split(" ").map((word, i) => (
                <span 
                  key={i}
                  className="inline-block mr-2"
                  style={{
                    animation: `wordByWord 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="w-full max-w-md">
              <p 
                className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 min-h-[3rem]"
                data-animate="fadeIn"
                style={{ animationDelay: `${fullText.split(" ").length * 0.2 + 0.5}s` }}
              >
                {subtitleDisplay}
                {subtitleIndexRef.current < subtitleText.length && (
                  <span className="ml-1 animate-pulse">|</span>
                )}
              </p>
            </div>
          </div>

          {educationItems.length > 0 && (
            <div 
              className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg" 
              data-animate="slideRight"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Education
              </h2>
              <div className="space-y-6">
                {educationItems.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    data-animate="fadeInRight"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-gray-300">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-gray-400 text-sm">{edu.year}</p>
                      )}
                      {edu.description && (
                        <p className="mt-2 text-gray-300">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillsItems.length > 0 && (
            <div 
              className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg" 
              data-animate="slideRight"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsItems.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    data-animate="fadeInRight"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 className="text-lg font-bold">{skill.name}</h3>
                      <div className="flex items-center mt-1">
                        <span 
                          className="text-xs bg-indigo-600 px-2 py-1 rounded mr-2"
                          data-animate="fadeIn"
                          style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                        >
                          {skill.category}
                        </span>
                        <span 
                          className="text-xs bg-gray-600 px-2 py-1 rounded"
                          data-animate="fadeIn"
                          style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projectsItems.length > 0 && (
            <div 
              className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg" 
              data-animate="slideRight"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsItems.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    data-animate="fadeInRight"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 
                        className="text-xl font-bold"
                        data-animate="fadeIn"
                        style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                      >
                        {project.title}
                      </h3>
                      <p 
                        className="text-gray-300 mt-2"
                        data-animate="fadeIn"
                        style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                      >
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.split(",").map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-600 px-2 py-1 rounded"
                              data-animate="fadeIn"
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
                          data-animate="fadeIn"
                          style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {experienceItems.length > 0 && (
            <div 
              className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg" 
              data-animate="slideRight"
              style={{ animationDelay: "0.5s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Experience
              </h2>
              <div className="space-y-6">
                {experienceItems.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    data-animate="fadeInRight"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h3 className="text-xl font-bold">{exp.position}</h3>
                      <p className="text-gray-300">{exp.company}</p>
                      {exp.duration && (
                        <p className="text-gray-400 text-sm">{exp.duration}</p>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-gray-300 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contactItems.length > 0 && (
            <div 
              className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg" 
              data-animate="slideRight"
              style={{ animationDelay: "0.6s" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Contact Me
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactItems.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    data-animate="fadeInRight"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-indigo-400">
                        {contact.icon === "FaEnvelope" && <FaEnvelope className="text-xl" />}
                        {contact.icon === "FaPhone" && <FaPhone className="text-xl" />}
                        {contact.icon === "FaLinkedin" && <FaLinkedin className="text-xl" />}
                        {contact.icon === "FaGithub" && <FaGithub className="text-xl" />}
                        {contact.icon === "FaTwitter" && <FaTwitter className="text-xl" />}
                        {contact.icon === "FaGlobe" && <FaGlobe className="text-xl" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{contact.method}</h3>
                        <p className="text-gray-300">{contact.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.length > 0 && (
            <div className="mt-12 w-[90%] mx-auto justify-center">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`mb-8 p-6 backdrop-blur-sm border rounded-lg`}
                  style={{
                    backgroundColor: section.bgColor,
                    borderColor: section.borderColor,
                  }}
                  data-animate="fadeIn"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className={`text-${section.headingPosition}`}>
                    <h2
                      className={`font-bold mb-4 text-${section.headingSize}`}
                      style={{ color: section.textColor }}
                    >
                      {section.heading}
                    </h2>
                  </div>
                  <div className={`text-${section.paragraphPosition}`}>
                    <p
                      className={`text-${section.paragraphSize} mb-8`}
                      style={{ color: section.textColor }}
                    >
                      {section.paragraph}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}