import { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
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
  // State for header/hero section editing
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    name: "Esha",
    title: "A passionate frontend developer crafting beautiful and functional websites.",
    headerText: "Esha Portfolio",
    profileImage: ""
  });

  // State for sections management
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    heading: "",
    paragraph: "",
    type: "hero",
    headingPosition: "center",
    paragraphPosition: "center",
    textColor: "#ffffff",
    bgColor: "rgba(0, 0, 0, 0.5)",
    headingSize: "3xl",
    paragraphSize: "lg",
    borderColor: "#4f46e5",
    borderRadius: "lg",
    animation: "fadeIn",
    lineSpacing: "normal",
    headingMargin: "mb-4",
    paragraphMargin: "mb-8",
    customClasses: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Refs
  const formRef = useRef(null);
  const sectionRefs = useRef([]);
  const animationStates = useRef({});

  // Animation options
  const animations = [
    { value: "fadeIn", label: "Fade In" },
    { value: "slideUp", label: "Slide Up" },
    { value: "letterByLetter", label: "Letter by Letter" },
    { value: "bounceIn", label: "Bounce In" },
    { value: "zoomIn", label: "Zoom In" },
    { value: "fadeInLeft", label: "Fade In Left" },
    { value: "fadeInRight", label: "Fade In Right" },
    { value: "flipInX", label: "Flip In X" },
    { value: "flipInY", label: "Flip In Y" },
    { value: "lightSpeedIn", label: "Light Speed In" },
    { value: "rotateIn", label: "Rotate In" },
    { value: "jackInTheBox", label: "Jack In The Box" },
    { value: "rollIn", label: "Roll In" },
    { value: "rubberBand", label: "Rubber Band" },
    { value: "none", label: "No Animation" }
  ];

  // Border radius options
  const borderRadiusOptions = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
    { value: "full", label: "Full" }
  ];

  // Line spacing options
  const lineSpacingOptions = [
    { value: "tighter", label: "Tighter", class: "leading-tight" },
    { value: "tight", label: "Tight", class: "leading-snug" },
    { value: "normal", label: "Normal", class: "leading-normal" },
    { value: "relaxed", label: "Relaxed", class: "leading-relaxed" },
    { value: "loose", label: "Loose", class: "leading-loose" },
    { value: "6", label: "Custom 6", class: "leading-6" },
    { value: "7", label: "Custom 7", class: "leading-7" },
    { value: "8", label: "Custom 8", class: "leading-8" },
    { value: "9", label: "Custom 9", class: "leading-9" },
    { value: "10", label: "Custom 10", class: "leading-10" }
  ];

  // Margin options
  const marginOptions = [
    { value: "none", label: "None", class: "" },
    { value: "xs", label: "Extra Small", class: "mb-1" },
    { value: "small", label: "Small", class: "mb-2" },
    { value: "medium", label: "Medium", class: "mb-4" },
    { value: "large", label: "Large", class: "mb-6" },
    { value: "xlarge", label: "Extra Large", class: "mb-8" },
    { value: "2xlarge", label: "2X Large", class: "mb-10" },
    { value: "3xlarge", label: "3X Large", class: "mb-12" },
    { value: "4xlarge", label: "4X Large", class: "mb-16" },
    { value: "auto", label: "Auto", class: "mb-auto" }
  ];

  // Text size options
  const textSizes = {
    heading: [
      { value: "xl", label: "Extra Small" },
      { value: "2xl", label: "Small" },
      { value: "3xl", label: "Medium" },
      { value: "4xl", label: "Large" },
      { value: "5xl", label: "Extra Large" },
      { value: "6xl", label: "Huge" },
      { value: "7xl", label: "Massive" },
      { value: "8xl", label: "Gigantic" },
      { value: "9xl", label: "Ultra Gigantic" }
    ],
    paragraph: [
      { value: "xs", label: "Extra Small" },
      { value: "sm", label: "Small" },
      { value: "base", label: "Medium" },
      { value: "lg", label: "Large" },
      { value: "xl", label: "Extra Large" },
      { value: "2xl", label: "Larger" },
      { value: "3xl", label: "Even Larger" }
    ]
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
        toast.success("Sections loaded successfully!");
      } catch (error) {
        toast.error("Failed to load sections");
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

  // Save portfolio data to Firebase
  const savePortfolioData = async () => {
    try {
      await setDoc(doc(db, "portfolio", "content"), portfolioData);
      setIsEditing(false);
      toast.success("Portfolio data saved successfully!");
    } catch (error) {
      toast.error("Failed to save portfolio data");
      console.error("Error saving data:", error);
    }
  };

  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "esha_portfolio"); // Replace with your actual upload preset
      
      // Make sure to use your actual cloud name
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPortfolioData(prev => ({
        ...prev,
        profileImage: data.secure_url
      }));
      toast.success("Image uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPortfolioData(prev => ({
      ...prev,
      profileImage: ""
    }));
    toast.success("Image removed successfully!");
  };

  // Reset section form
  const resetSectionForm = () => {
    setNewSection({
      heading: "",
      paragraph: "",
      type: "hero",
      headingPosition: "center",
      paragraphPosition: "center",
      textColor: "#ffffff",
      bgColor: "rgba(0, 0, 0, 0.5)",
      headingSize: "3xl",
      paragraphSize: "lg",
      borderColor: "#4f46e5",
      borderRadius: "lg",
      animation: "fadeIn",
      lineSpacing: "normal",
      headingMargin: "mb-4",
      paragraphMargin: "mb-8",
      customClasses: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Add new section
  const addSection = async () => {
    if (!newSection.heading || !newSection.paragraph) {
      toast.warning("Please fill in both heading and paragraph");
      return;
    }
    
    try {
      const docRef = await addDoc(collection(db, "portfolioSections"), {
        ...newSection,
        createdAt: new Date().toISOString()
      });
      
      setSections([...sections, {
        id: docRef.id,
        ...newSection
      }]);
      
      resetSectionForm();
      toast.success("Section added successfully!");
    } catch (e) {
      toast.error("Failed to add section");
      console.error("Error adding section: ", e);
    }
  };

  // Start editing a section
  const startEditing = (section) => {
    setEditingId(section.id);
    setNewSection({
      heading: section.heading,
      paragraph: section.paragraph,
      type: section.type,
      headingPosition: section.headingPosition || "center",
      paragraphPosition: section.paragraphPosition || "center",
      textColor: section.textColor,
      bgColor: section.bgColor,
      headingSize: section.headingSize,
      paragraphSize: section.paragraphSize,
      borderColor: section.borderColor,
      borderRadius: section.borderRadius,
      animation: section.animation,
      lineSpacing: section.lineSpacing || "normal",
      headingMargin: section.headingMargin || "mb-4",
      paragraphMargin: section.paragraphMargin || "mb-8",
      customClasses: section.customClasses
    });
    setShowForm(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update section
  const updateSection = async () => {
    if (!editingId || !newSection.heading || !newSection.paragraph) {
      toast.warning("Please fill in both heading and paragraph");
      return;
    }
    
    try {
      await updateDoc(doc(db, "portfolioSections", editingId), {
        ...newSection,
        updatedAt: new Date().toISOString()
      });
      
      setSections(sections.map(section => 
        section.id === editingId ? { ...section, ...newSection } : section
      ));
      
      resetSectionForm();
      toast.success("Section updated successfully!");
    } catch (e) {
      toast.error("Failed to update section");
      console.error("Error updating section: ", e);
    }
  };

  // Delete section
  const deleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    
    try {
      await deleteDoc(doc(db, "portfolioSections", id));
      setSections(sections.filter(section => section.id !== id));
      toast.success("Section deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete section");
      console.error("Error deleting section: ", e);
    }
  };

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
    const option = lineSpacingOptions.find(opt => opt.value === spacing);
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
            <div className="flex items-center gap-4">
              {portfolioData.profileImage ? (
                <div className="relative">
                  <img 
                    src={portfolioData.profileImage} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                  />
                  {isEditing && (
                    <button 
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : isEditing ? (
                <div className="relative">
                  <label className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
                    <input 
                      type="file" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-2xl">+</span>
                    )}
                  </label>
                </div>
              ) : null}
              <div className="text-2xl font-bold">
                {isEditing ? (
                  <input
                    type="text"
                    name="headerText"
                    value={portfolioData.headerText}
                    onChange={handlePortfolioChange}
                    className="bg-gray-800 text-white p-1 rounded"
                  />
                ) : (
                  <span className="text-indigo-500">{portfolioData.headerText}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
              >
                {isEditing ? "Cancel" : "Edit Header"}
              </button>
              {isEditing && (
                <button
                  onClick={savePortfolioData}
                  className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Save Header
                </button>
              )}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hover:text-indigo-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d={isOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="md:hidden bg-transparent px-4 pb-4 space-y-2 font-medium">
              <a href="#about" className="block hover:text-indigo-400">About</a>
              <a href="#projects" className="block hover:text-indigo-400">Projects</a>
              <a href="#skills" className="block hover:text-indigo-400">Skills</a>
              <a href="#contact" className="block hover:text-indigo-400">Contact</a>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 px-6 py-20 bg-transparent">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hi, I'm {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={portfolioData.name}
                  onChange={handlePortfolioChange}
                  className="bg-gray-800 text-indigo-500 p-1 rounded w-40 text-center"
                />
              ) : (
                <span className="text-indigo-500">{portfolioData.name}</span>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
              {isEditing ? (
                <textarea
                  name="title"
                  value={portfolioData.title}
                  onChange={handlePortfolioChange}
                  className="bg-gray-800 text-white p-2 rounded w-full"
                  rows="3"
                />
              ) : (
                portfolioData.title
              )}
            </p>
          </div>

          {/* Sections Content */}
          <div className="mt-12">
            {sections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No sections added yet. Click the + button to add your first section.</p>
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

                  <div className={`flex space-x-2 mt-4 ${section.headingPosition === 'center' && section.paragraphPosition === 'center' ? 'justify-center' : section.headingPosition === 'right' || section.paragraphPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <button
                      onClick={() => startEditing(section)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Add/Edit Section Form */}
        {showForm && (
          <div 
            ref={formRef}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetSectionForm()}
          >
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">
                {editingId ? "Edit Section" : "Add New Section"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Section Type</label>
                    <select
                      value={newSection.type}
                      onChange={(e) => setNewSection({...newSection, type: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="hero">Hero Section</option>
                      <option value="about">About Section</option>
                      <option value="projects">Projects Section</option>
                      <option value="skills">Skills Section</option>
                      <option value="contact">Contact Section</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Heading</label>
                    <input
                      type="text"
                      value={newSection.heading}
                      onChange={(e) => setNewSection({...newSection, heading: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Enter heading text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Paragraph</label>
                    <textarea
                      value={newSection.paragraph}
                      onChange={(e) => setNewSection({...newSection, paragraph: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      rows="4"
                      placeholder="Enter paragraph text"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Custom CSS Classes</label>
                    <input
                      type="text"
                      value={newSection.customClasses}
                      onChange={(e) => setNewSection({...newSection, customClasses: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="e.g. my-custom-class another-class"
                    />
                  </div>
                </div>

                {/* Styling Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heading Alignment</label>
                      <select
                        value={newSection.headingPosition}
                        onChange={(e) => setNewSection({...newSection, headingPosition: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Paragraph Alignment</label>
                      <select
                        value={newSection.paragraphPosition}
                        onChange={(e) => setNewSection({...newSection, paragraphPosition: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Animation</label>
                    <select
                      value={newSection.animation}
                      onChange={(e) => setNewSection({...newSection, animation: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {animations.map(anim => (
                        <option key={anim.value} value={anim.value}>{anim.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heading Size</label>
                      <select
                        value={newSection.headingSize}
                        onChange={(e) => setNewSection({...newSection, headingSize: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {textSizes.heading.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Paragraph Size</label>
                      <select
                        value={newSection.paragraphSize}
                        onChange={(e) => setNewSection({...newSection, paragraphSize: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {textSizes.paragraph.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Heading Margin</label>
                      <select
                        value={newSection.headingMargin}
                        onChange={(e) => setNewSection({...newSection, headingMargin: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {marginOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Paragraph Margin</label>
                      <select
                        value={newSection.paragraphMargin}
                        onChange={(e) => setNewSection({...newSection, paragraphMargin: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {marginOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Line Spacing</label>
                    <select
                      value={newSection.lineSpacing}
                      onChange={(e) => setNewSection({...newSection, lineSpacing: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {lineSpacingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.textColor}
                        onChange={(e) => setNewSection({...newSection, textColor: e.target.value})}
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.textColor}
                        onChange={(e) => setNewSection({...newSection, textColor: e.target.value})}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.bgColor}
                        onChange={(e) => setNewSection({...newSection, bgColor: e.target.value})}
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.bgColor}
                        onChange={(e) => setNewSection({...newSection, bgColor: e.target.value})}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Border Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.borderColor}
                        onChange={(e) => setNewSection({...newSection, borderColor: e.target.value})}
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.borderColor}
                        onChange={(e) => setNewSection({...newSection, borderColor: e.target.value})}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Border Radius</label>
                    <select
                      value={newSection.borderRadius}
                      onChange={(e) => setNewSection({...newSection, borderRadius: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {borderRadiusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {editingId ? (
                  <>
                    <button
                      onClick={updateSection}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                    >
                      Update Section
                    </button>
                    <button
                      onClick={resetSectionForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addSection}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
                  >
                    Add Section
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}