import { useState, useEffect, useRef } from "react";
import { FaPhone, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaEnvelope } from "react-icons/fa";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Define all animation keyframes and styles outside the component
const globalStyles = `
  
`;

export default function Home() {
  // State for header/hero section editing
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    name: "Esha",
    title:
      "A passionate frontend developer crafting beautiful and functional websites.",
    headerText: "Esha Portfolio",
    profileImage: "",
  });

  // State for sections management
  const [sections, setSections] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [skillsItems, setSkillsItems] = useState([]);
  const [projectsItems, setProjectsItems] = useState([]);

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
    customClasses: "",
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate",
    category: "Technical",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showProjectsForm, setShowProjectsForm] = useState(false);


  // Add these state variables near your other state declarations
const [experienceItems, setExperienceItems] = useState([]);
const [contactItems, setContactItems] = useState([]);

const [newExperience, setNewExperience] = useState({
  position: "",
  company: "",
  duration: "",
  description: "",
});

const [newContact, setNewContact] = useState({
  method: "",
  value: "",
  icon: "FaEnvelope", // Default icon
});

const [editingExperienceId, setEditingExperienceId] = useState(null);
const [editingContactId, setEditingContactId] = useState(null);

const [showExperienceForm, setShowExperienceForm] = useState(false);
const [showContactForm, setShowContactForm] = useState(false);

const experienceFormRef = useRef(null);
const contactFormRef = useRef(null);

// Add these to your useEffect that fetches data
const fetchExperience = async () => {
  try {
    const experienceSnapshot = await getDocs(collection(db, "experience"));
    const experienceData = [];
    experienceSnapshot.forEach((doc) => {
      experienceData.push({ id: doc.id, ...doc.data() });
    });
    setExperienceItems(experienceData);
  } catch (error) {
    console.error("Error fetching experience: ", error);
  }
};

const fetchContact = async () => {
  try {
    const contactSnapshot = await getDocs(collection(db, "contact"));
    const contactData = [];
    contactSnapshot.forEach((doc) => {
      contactData.push({ id: doc.id, ...doc.data() });
    });
    setContactItems(contactData);
  } catch (error) {
    console.error("Error fetching contact: ", error);
  }
};

// Call these functions in your main fetch useEffect
fetchExperience();
fetchContact();

// Add these reset functions
const resetExperienceForm = () => {
  setNewExperience({
    position: "",
    company: "",
    duration: "",
    description: "",
  });
  setEditingExperienceId(null);
  setShowExperienceForm(false);
};

const resetContactForm = () => {
  setNewContact({
    method: "",
    value: "",
    icon: "FaEnvelope",
  });
  setEditingContactId(null);
  setShowContactForm(false);
};

// Add these CRUD operations
const addExperience = async () => {
  if (!newExperience.position || !newExperience.company) {
    toast.warning("Please fill in position and company");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "experience"), {
      ...newExperience,
      createdAt: new Date().toISOString(),
    });

    setExperienceItems([
      ...experienceItems,
      {
        id: docRef.id,
        ...newExperience,
      },
    ]);

    resetExperienceForm();
    toast.success("Experience added successfully!");
  } catch (e) {
    toast.error("Failed to add experience");
    console.error("Error adding experience: ", e);
  }
};

const addContact = async () => {
  if (!newContact.method || !newContact.value) {
    toast.warning("Please fill in contact method and value");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "contact"), {
      ...newContact,
      createdAt: new Date().toISOString(),
    });

    setContactItems([
      ...contactItems,
      {
        id: docRef.id,
        ...newContact,
      },
    ]);

    resetContactForm();
    toast.success("Contact method added successfully!");
  } catch (e) {
    toast.error("Failed to add contact method");
    console.error("Error adding contact method: ", e);
  }
};

const startEditingExperience = (experience) => {
  setEditingExperienceId(experience.id);
  setNewExperience({
    position: experience.position,
    company: experience.company,
    duration: experience.duration || "",
    description: experience.description || "",
  });
  setShowExperienceForm(true);
  experienceFormRef.current?.scrollIntoView({ behavior: "smooth" });
};

const startEditingContact = (contact) => {
  setEditingContactId(contact.id);
  setNewContact({
    method: contact.method,
    value: contact.value,
    icon: contact.icon || "FaEnvelope",
  });
  setShowContactForm(true);
  contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
};

const updateExperience = async () => {
  if (!editingExperienceId || !newExperience.position || !newExperience.company) {
    toast.warning("Please fill in position and company");
    return;
  }

  try {
    await updateDoc(doc(db, "experience", editingExperienceId), {
      ...newExperience,
      updatedAt: new Date().toISOString(),
    });

    setExperienceItems(
      experienceItems.map((item) =>
        item.id === editingExperienceId ? { ...item, ...newExperience } : item
      )
    );

    resetExperienceForm();
    toast.success("Experience updated successfully!");
  } catch (e) {
    toast.error("Failed to update experience");
    console.error("Error updating experience: ", e);
  }
};

const updateContact = async () => {
  if (!editingContactId || !newContact.method || !newContact.value) {
    toast.warning("Please fill in contact method and value");
    return;
  }

  try {
    await updateDoc(doc(db, "contact", editingContactId), {
      ...newContact,
      updatedAt: new Date().toISOString(),
    });

    setContactItems(
      contactItems.map((item) =>
        item.id === editingContactId ? { ...item, ...newContact } : item
      )
    );

    resetContactForm();
    toast.success("Contact method updated successfully!");
  } catch (e) {
    toast.error("Failed to update contact method");
    console.error("Error updating contact method: ", e);
  }
};

const deleteExperience = async (id) => {

  try {
    await deleteDoc(doc(db, "experience", id));
    setExperienceItems(experienceItems.filter((item) => item.id !== id));
    toast.success("Experience deleted successfully!");
  } catch (e) {
    toast.error("Failed to delete experience");
    console.error("Error deleting experience: ", e);
  }
};

const deleteContact = async (id) => {

  try {
    await deleteDoc(doc(db, "contact", id));
    setContactItems(contactItems.filter((item) => item.id !== id));
    toast.success("Contact method deleted successfully!");
  } catch (e) {
    toast.error("Failed to delete contact method");
    console.error("Error deleting contact method: ", e);
  }
};

// Add these icon options (you'll need to import the icons from react-icons)
const iconOptions = [
  { value: "FaEnvelope", label: "Email" },
  { value: "FaPhone", label: "Phone" },
  { value: "FaLinkedin", label: "LinkedIn" },
  { value: "FaGithub", label: "GitHub" },
  { value: "FaTwitter", label: "Twitter" },
  { value: "FaGlobe", label: "Website" },
];

  // Refs
  const formRef = useRef(null);
  const educationFormRef = useRef(null);
  const skillsFormRef = useRef(null);
  const projectsFormRef = useRef(null);
  const sectionRefs = useRef([]);
  const animationStates = useRef({});

  // Animation options
  const animations = [
    { value: "fadeIn", label: "Fade In" },
    { value: "slideUp", label: "Slide Up" },
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
    { value: "none", label: "No Animation" },
  ];

  // Border radius options
  const borderRadiusOptions = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
    { value: "full", label: "Full" },
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
    { value: "10", label: "Custom 10", class: "leading-10" },
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
    { value: "auto", label: "Auto", class: "mb-auto" },
  ];
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Logged out successfully");
      navigate("/"); // Redirect to /home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
      { value: "9xl", label: "Ultra Gigantic" },
    ],
    paragraph: [
      { value: "xs", label: "Extra Small" },
      { value: "sm", label: "Small" },
      { value: "base", label: "Medium" },
      { value: "lg", label: "Large" },
      { value: "xl", label: "Extra Large" },
      { value: "2xl", label: "Larger" },
      { value: "3xl", label: "Even Larger" },
    ],
  };

  // Skill levels
  const skillLevels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Expert", label: "Expert" },
  ];

  // Skill categories
  const skillCategories = [
    { value: "Technical", label: "Technical" },
    { value: "Soft", label: "Soft" },
    { value: "Language", label: "Language" },
    { value: "Other", label: "Other" },
  ];

  // Inject global styles
  useEffect(() => {
    const styleElement = document.createElement("style");
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
        const querySnapshot = await getDocs(
          collection(db, "portfolioSections")
        );
        const sectionsData = [];
        querySnapshot.forEach((doc) => {
          sectionsData.push({ id: doc.id, ...doc.data() });
        });
        sectionsData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
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

      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data: ", error);
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
              section.className = section.className.replace(
                /\banimate-\w+\b/g,
                ""
              );
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
              section.className = section.className.replace(
                /\banimate-\w+\b/g,
                ""
              );
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
  }, [sections, educationItems, skillsItems, projectsItems]);

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
    setPortfolioData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_preset"); // Replace with your actual upload preset

      // Make sure to use your actual cloud name
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtv5vzkms/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPortfolioData((prev) => ({
        ...prev,
        profileImage: data.secure_url,
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
    setPortfolioData((prev) => ({
      ...prev,
      profileImage: "",
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
      customClasses: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Reset education form
  const resetEducationForm = () => {
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
      description: "",
    });
    setEditingEducationId(null);
    setShowEducationForm(false);
  };

  // Reset skills form
  const resetSkillsForm = () => {
    setNewSkill({
      name: "",
      level: "Intermediate",
      category: "Technical",
    });
    setEditingSkillId(null);
    setShowSkillsForm(false);
  };

  // Reset projects form
  const resetProjectsForm = () => {
    setNewProject({
      title: "",
      description: "",
      technologies: "",
      link: "",
    });
    setEditingProjectId(null);
    setShowProjectsForm(false);
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
        createdAt: new Date().toISOString(),
      });

      setSections([
        ...sections,
        {
          id: docRef.id,
          ...newSection,
        },
      ]);

      resetSectionForm();
      toast.success("Section added successfully!");
    } catch (e) {
      toast.error("Failed to add section");
      console.error("Error adding section: ", e);
    }
  };

  // Add new education item
  const addEducation = async () => {
    if (!newEducation.degree || !newEducation.institution) {
      toast.warning("Please fill in degree and institution");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "education"), {
        ...newEducation,
        createdAt: new Date().toISOString(),
      });

      setEducationItems([
        ...educationItems,
        {
          id: docRef.id,
          ...newEducation,
        },
      ]);

      resetEducationForm();
      toast.success("Education added successfully!");
    } catch (e) {
      toast.error("Failed to add education");
      console.error("Error adding education: ", e);
    }
  };

  // Add new skill
  const addSkill = async () => {
    if (!newSkill.name) {
      toast.warning("Please fill in skill name");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "skills"), {
        ...newSkill,
        createdAt: new Date().toISOString(),
      });

      setSkillsItems([
        ...skillsItems,
        {
          id: docRef.id,
          ...newSkill,
        },
      ]);

      resetSkillsForm();
      toast.success("Skill added successfully!");
    } catch (e) {
      toast.error("Failed to add skill");
      console.error("Error adding skill: ", e);
    }
  };

  // Add new project
  const addProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast.warning("Please fill in title and description");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...newProject,
        createdAt: new Date().toISOString(),
      });

      setProjectsItems([
        ...projectsItems,
        {
          id: docRef.id,
          ...newProject,
        },
      ]);

      resetProjectsForm();
      toast.success("Project added successfully!");
    } catch (e) {
      toast.error("Failed to add project");
      console.error("Error adding project: ", e);
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
      customClasses: section.customClasses,
    });
    setShowForm(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start editing education
  const startEditingEducation = (education) => {
    setEditingEducationId(education.id);
    setNewEducation({
      degree: education.degree,
      institution: education.institution,
      year: education.year,
      description: education.description || "",
    });
    setShowEducationForm(true);
    educationFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start editing skill
  const startEditingSkill = (skill) => {
    setEditingSkillId(skill.id);
    setNewSkill({
      name: skill.name,
      level: skill.level || "Intermediate",
      category: skill.category || "Technical",
    });
    setShowSkillsForm(true);
    skillsFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start editing project
  const startEditingProject = (project) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      technologies: project.technologies || "",
      link: project.link || "",
    });
    setShowProjectsForm(true);
    projectsFormRef.current?.scrollIntoView({ behavior: "smooth" });
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
        updatedAt: new Date().toISOString(),
      });

      setSections(
        sections.map((section) =>
          section.id === editingId ? { ...section, ...newSection } : section
        )
      );

      resetSectionForm();
      toast.success("Section updated successfully!");
    } catch (e) {
      toast.error("Failed to update section");
      console.error("Error updating section: ", e);
    }
  };

  // Update education
  const updateEducation = async () => {
    if (
      !editingEducationId ||
      !newEducation.degree ||
      !newEducation.institution
    ) {
      toast.warning("Please fill in degree and institution");
      return;
    }

    try {
      await updateDoc(doc(db, "education", editingEducationId), {
        ...newEducation,
        updatedAt: new Date().toISOString(),
      });

      setEducationItems(
        educationItems.map((item) =>
          item.id === editingEducationId ? { ...item, ...newEducation } : item
        )
      );

      resetEducationForm();
      toast.success("Education updated successfully!");
    } catch (e) {
      toast.error("Failed to update education");
      console.error("Error updating education: ", e);
    }
  };

  // Update skill
  const updateSkill = async () => {
    if (!editingSkillId || !newSkill.name) {
      toast.warning("Please fill in skill name");
      return;
    }

    try {
      await updateDoc(doc(db, "skills", editingSkillId), {
        ...newSkill,
        updatedAt: new Date().toISOString(),
      });

      setSkillsItems(
        skillsItems.map((item) =>
          item.id === editingSkillId ? { ...item, ...newSkill } : item
        )
      );

      resetSkillsForm();
      toast.success("Skill updated successfully!");
    } catch (e) {
      toast.error("Failed to update skill");
      console.error("Error updating skill: ", e);
    }
  };

  // Update project
  const updateProject = async () => {
    if (!editingProjectId || !newProject.title || !newProject.description) {
      toast.warning("Please fill in title and description");
      return;
    }

    try {
      await updateDoc(doc(db, "projects", editingProjectId), {
        ...newProject,
        updatedAt: new Date().toISOString(),
      });

      setProjectsItems(
        projectsItems.map((item) =>
          item.id === editingProjectId ? { ...item, ...newProject } : item
        )
      );

      resetProjectsForm();
      toast.success("Project updated successfully!");
    } catch (e) {
      toast.error("Failed to update project");
      console.error("Error updating project: ", e);
    }
  };

  // Delete section
  const deleteSection = async (id) => {

    try {
      await deleteDoc(doc(db, "portfolioSections", id));
      setSections(sections.filter((section) => section.id !== id));
      toast.success("Section deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete section");
      console.error("Error deleting section: ", e);
    }
  };

  // Delete education
  const deleteEducation = async (id) => {

    try {
      await deleteDoc(doc(db, "education", id));
      setEducationItems(educationItems.filter((item) => item.id !== id));
      toast.success("Education deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete education");
      console.error("Error deleting education: ", e);
    }
  };

  // Delete skill
  const deleteSkill = async (id) => {

    try {
      await deleteDoc(doc(db, "skills", id));
      setSkillsItems(skillsItems.filter((item) => item.id !== id));
      toast.success("Skill deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete skill");
      console.error("Error deleting skill: ", e);
    }
  };

  // Delete project
  const deleteProject = async (id) => {

    try {
      await deleteDoc(doc(db, "projects", id));
      setProjectsItems(projectsItems.filter((item) => item.id !== id));
      toast.success("Project deleted successfully!");
    } catch (e) {
      toast.error("Failed to delete project");
      console.error("Error deleting project: ", e);
    }
  };
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
    document.querySelectorAll("[data-animate]").forEach((el) => {
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
    const option = lineSpacingOptions.find((opt) => opt.value === spacing);
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
        <header className="bg-transparent text-white shadow-md sticky top-0 z-50 mt-4 sm:mt-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap">
            {/* Left: Profile and Header Text */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {portfolioData.profileImage ? (
                <div className="relative shrink-0">
                  <img
                    src={portfolioData.profileImage}
                    alt="Profile"
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-500"
                  />
                  {isEditing && (
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : isEditing ? (
                <div className="relative shrink-0">
                  <label className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer shrink-0">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-lg sm:text-2xl">+</span>
                    )}
                  </label>
                </div>
              ) : null}

              <div className="text-lg sm:text-2xl font-bold shrink-0">
                {isEditing ? (
                  <input
                    type="text"
                    name="headerText"
                    value={portfolioData.headerText}
                    onChange={handlePortfolioChange}
                    className="bg-gray-800 text-white p-1 rounded text-xs sm:text-base w-24 sm:w-auto"
                  />
                ) : (
                  <span className="text-indigo-500">
                    {portfolioData.headerText}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 px-2 sm:px-3 py-1 rounded"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>

              {isEditing && (
                <button
                  onClick={savePortfolioData}
                  className="text-xs sm:text-sm bg-green-600 hover:bg-green-700 px-2 sm:px-3 py-1 rounded"
                >
                  Save
                </button>
              )}

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
    {/* Profile Image Section */}
    <div className="mb-8">
      {portfolioData.profileImage ? (
        <div className="relative">
          <img
            src={portfolioData.profileImage}
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-500 mx-auto"
          />
          {isEditing && (
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          )}
        </div>
      ) : isEditing ? (
        <div className="relative mx-auto">
          <label className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer mx-auto">
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
              disabled={uploading}
            />
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <span className="text-4xl">+</span>
            )}
          </label>
        </div>
      ) : null}
    </div>

   <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 break-words">
  Hi, I'm{" "}
  {isEditing ? (
    <input
      type="text"
      name="name"
      value={portfolioData.name}
      onChange={handlePortfolioChange}
      className="bg-gray-800 text-indigo-500 p-2 rounded w-48 sm:w-64 md:w-72 text-center text-base sm:text-lg"
    />
  ) : (
    <span className="text-indigo-500 break-words">
      {portfolioData.name.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            animation: "fadeIn 0.5s ease forwards",
            animationDelay: `${i * 0.3}s`,
            opacity: 0,
            display: "inline-block",
            marginRight: "0.3ch",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )}
</h1>

<p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xs sm:max-w-md md:max-w-xl mb-8">
  {isEditing ? (
    <textarea
      name="title"
      value={portfolioData.title}
      onChange={handlePortfolioChange}
      className="bg-gray-800 text-white p-2 rounded w-full text-sm sm:text-base"
      rows="3"
    />
  ) : (
    <span className="whitespace-pre-line">
      {portfolioData.title.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            animation: "fadeIn 0.5s ease forwards",
            animationDelay: `${i * 0.3}s`,
            opacity: 0,
            display: "inline-block",
            marginRight: "0.3ch",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )}
</p>

  </div>

  
          {/* Education Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
                Education
              </h2>
              <button
                onClick={() => setShowEducationForm(true)}
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center"
                data-animate="flipInX"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            {educationItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No education entries added yet.
              </p>
            ) : (
              <div className="space-y-6">
                {educationItems.map((edu, index) => (
                  <div
                    key={edu.id}
                    ref={(el) => (sectionRefs.current[index] = el)}
                    data-section-id={edu.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-gray-300">{edu.institution}</p>
                        {edu.year && (
                          <p className="text-gray-400 text-sm">{edu.year}</p>
                        )}
                        {edu.description && (
                          <p className="mt-2 text-gray-300">
                            {edu.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingEducation(edu)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEducation(edu.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
                Skills
              </h2>
              <button
                onClick={() => setShowSkillsForm(true)}
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center"
                data-animate="flipInX"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            {skillsItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No skills added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsItems.map((skill, index) => (
                  <div
                    key={skill.id}
                    ref={(el) => (sectionRefs.current[index] = el)}
                    data-section-id={skill.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingSkill(skill)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
                Projects
              </h2>
              <button
                onClick={() => setShowProjectsForm(true)}
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center"
                data-animate="flipInX"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            {projectsItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No projects added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsItems.map((project, index) => (
                  <div
                    key={project.id}
                    ref={(el) => (sectionRefs.current[index] = el)}
                    data-section-id={project.id}
                    data-animate="flipInX"
                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
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
                            {project.technologies.split(",").map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-600 px-2 py-1 rounded"
                                data-animate="flipInX"
                                style={{
                                  animationDelay: `${
                                    index * 0.1 + 0.3 + i * 0.05
                                  }s`,
                                }}
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingProject(project)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          data-animate="flipInX"
                          style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Experience Section */}
<div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
      Experience
    </h2>
    <button
      onClick={() => setShowExperienceForm(true)}
      className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center"
      data-animate="flipInX"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  </div>

  {experienceItems.length === 0 ? (
    <p className="text-gray-400 text-center py-4">
      No experience entries added yet.
    </p>
  ) : (
    <div className="space-y-6">
      {experienceItems.map((exp, index) => (
        <div
          key={exp.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          data-section-id={exp.id}
          data-animate="flipInX"
          className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-start">
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
            <div className="flex space-x-2">
              <button
                onClick={() => startEditingExperience(exp)}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                data-animate="flipInX"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteExperience(exp.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                data-animate="flipInX"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* Contact Section */}
<div className="w-[90%] max-w-screen-xl mx-auto my-12 p-6 bg-gray-900 rounded-lg shadow-lg">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
      Contact Me
    </h2>
    <button
      onClick={() => setShowContactForm(true)}
      className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center"
      data-animate="flipInX"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  </div>

  {contactItems.length === 0 ? (
    <p className="text-gray-400 text-center py-4">
      No contact methods added yet.
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contactItems.map((contact, index) => (
        <div
          key={contact.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          data-section-id={contact.id}
          data-animate="flipInX"
          className="p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="mr-3 text-indigo-400">
                {/* You'll need to dynamically render the icon based on contact.icon */}
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
            <div className="flex space-x-2">
              <button
                onClick={() => startEditingContact(contact)}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                data-animate="flipInX"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteContact(contact.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                data-animate="flipInX"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



          {/* Other Sections Content */}
          <div className="mt-12 w-[90%] mx-auto justify-center">
            {sections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  No additional sections added yet.
                </p>
              </div>
            ) : (
              sections.map((section, index) => (
                <div
                  key={section.id}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  data-section-id={section.id}
                  data-animation={section.animation}
                  className={`mb-8 p-6 backdrop-blur-sm border ${getBorderRadiusClass(
                    section.borderRadius
                  )} ${section.customClasses || ""}`}
                  style={{
                    backgroundColor: section.bgColor,
                    borderColor: section.borderColor,
                    opacity: section.animation === "none" ? 1 : 0,
                  }}
                >
                  {/* Heading with separate alignment */}
                  <div className={getAlignmentClasses(section.headingPosition)}>
                    {section.type === "hero" ? (
                      <h1
                        className={`font-bold ${section.headingMargin} text-${
                          section.headingSize
                        } ${
                          section.animation === "letterByLetter"
                            ? "animated-heading"
                            : ""
                        }`}
                        style={{ color: section.textColor }}
                      >
                        {section.heading.split("Esha").map((part, i) =>
                          i === 0 ? (
                            part
                          ) : (
                            <span key={i} className="text-indigo-500">
                              Esha
                            </span>
                          )
                        )}
                      </h1>
                    ) : (
                      <h2
                        className={`font-bold ${section.headingMargin} text-${
                          section.headingSize
                        } ${
                          section.animation === "letterByLetter"
                            ? "animated-heading"
                            : ""
                        }`}
                        style={{ color: section.textColor }}
                      >
                        {section.heading}
                      </h2>
                    )}
                  </div>

                  {/* Paragraph with separate alignment and line spacing */}
                  <div
                    className={`${getAlignmentClasses(
                      section.paragraphPosition
                    )} ${getLineSpacingClass(
                      section.lineSpacing
                    )} break-words whitespace-normal`}
                  >
                    <p
                      className={`text-${section.paragraphSize} ${
                        section.paragraphMargin
                      } ${
                        section.animation === "letterByLetter"
                          ? "animated-paragraph"
                          : ""
                      }`}
                      style={{ color: section.textColor }}
                    >
                      {section.paragraph}
                    </p>
                  </div>

                  <div
                    className={`flex space-x-2 mt-4 ${
                      section.headingPosition === "center" &&
                      section.paragraphPosition === "center"
                        ? "justify-center"
                        : section.headingPosition === "right" ||
                          section.paragraphPosition === "right"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
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
          {/* Add/Edit Experience Form */}
{showExperienceForm && (
  <div
    ref={experienceFormRef}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    onClick={(e) => e.target === e.currentTarget && resetExperienceForm()}
  >
    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        {editingExperienceId ? "Edit Experience" : "Add Experience"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Position
          </label>
          <input
            type="text"
            value={newExperience.position}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                position: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Company
          </label>
          <input
            type="text"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                company: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="e.g. Tech Company Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration
          </label>
          <input
            type="text"
            value={newExperience.duration}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                duration: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="e.g. Jan 2020 - Present"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            rows="4"
            placeholder="Describe your responsibilities and achievements"
          ></textarea>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {editingExperienceId ? (
          <>
            <button
              onClick={updateExperience}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
            >
              Update Experience
            </button>
            <button
              onClick={resetExperienceForm}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={addExperience}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
          >
            Add Experience
          </button>
        )}
      </div>
    </div>
  </div>
)}

{/* Add/Edit Contact Form */}
{showContactForm && (
  <div
    ref={contactFormRef}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    onClick={(e) => e.target === e.currentTarget && resetContactForm()}
  >
    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        {editingContactId ? "Edit Contact Method" : "Add Contact Method"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Method (e.g., Email, Phone, LinkedIn)
          </label>
          <input
            type="text"
            value={newContact.method}
            onChange={(e) =>
              setNewContact({
                ...newContact,
                method: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="e.g. Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Value
          </label>
          <input
            type="text"
            value={newContact.value}
            onChange={(e) =>
              setNewContact({
                ...newContact,
                value: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            placeholder="e.g. your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Icon
          </label>
          <select
            value={newContact.icon}
            onChange={(e) =>
              setNewContact({
                ...newContact,
                icon: e.target.value,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            {iconOptions.map((icon) => (
              <option key={icon.value} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {editingContactId ? (
          <>
            <button
              onClick={updateContact}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
            >
              Update Contact
            </button>
            <button
              onClick={resetContactForm}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={addContact}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
          >
            Add Contact
          </button>
        )}
      </div>
    </div>
  </div>
)}
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
                    <label className="block text-sm font-medium mb-1">
                      Section Type
                    </label>
                    <select
                      value={newSection.type}
                      onChange={(e) =>
                        setNewSection({ ...newSection, type: e.target.value })
                      }
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
                    <label className="block text-sm font-medium mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={newSection.heading}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          heading: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Enter heading text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Paragraph
                    </label>
                    <textarea
                      value={newSection.paragraph}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          paragraph: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      rows="4"
                      placeholder="Enter paragraph text"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Custom CSS Classes
                    </label>
                    <input
                      type="text"
                      value={newSection.customClasses}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          customClasses: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="e.g. my-custom-class another-class"
                    />
                  </div>
                </div>

                {/* Styling Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Heading Alignment
                      </label>
                      <select
                        value={newSection.headingPosition}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            headingPosition: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Paragraph Alignment
                      </label>
                      <select
                        value={newSection.paragraphPosition}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            paragraphPosition: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Animation
                    </label>
                    <select
                      value={newSection.animation}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          animation: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {animations.map((anim) => (
                        <option key={anim.value} value={anim.value}>
                          {anim.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Heading Size
                      </label>
                      <select
                        value={newSection.headingSize}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            headingSize: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {textSizes.heading.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Paragraph Size
                      </label>
                      <select
                        value={newSection.paragraphSize}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            paragraphSize: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {textSizes.paragraph.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Heading Margin
                      </label>
                      <select
                        value={newSection.headingMargin}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            headingMargin: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {marginOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Paragraph Margin
                      </label>
                      <select
                        value={newSection.paragraphMargin}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            paragraphMargin: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        {marginOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Line Spacing
                    </label>
                    <select
                      value={newSection.lineSpacing}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          lineSpacing: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {lineSpacingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.textColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            textColor: e.target.value,
                          })
                        }
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.textColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            textColor: e.target.value,
                          })
                        }
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.bgColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            bgColor: e.target.value,
                          })
                        }
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.bgColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            bgColor: e.target.value,
                          })
                        }
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newSection.borderColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            borderColor: e.target.value,
                          })
                        }
                        className="h-10 w-10 cursor-pointer rounded border border-gray-600"
                      />
                      <input
                        type="text"
                        value={newSection.borderColor}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            borderColor: e.target.value,
                          })
                        }
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Border Radius
                    </label>
                    <select
                      value={newSection.borderRadius}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          borderRadius: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {borderRadiusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
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

        {/* Add/Edit Education Form */}
        {showEducationForm && (
          <div
            ref={educationFormRef}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={(e) =>
              e.target === e.currentTarget && resetEducationForm()
            }
          >
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">
                {editingEducationId ? "Edit Education" : "Add Education"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Degree/Certificate
                  </label>
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        degree: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={newEducation.institution}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        institution: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. University of Technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="text"
                    value={newEducation.year}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, year: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. 2018 - 2022"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    rows="3"
                    placeholder="Optional: Add details about your education"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {editingEducationId ? (
                  <>
                    <button
                      onClick={updateEducation}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                    >
                      Update Education
                    </button>
                    <button
                      onClick={resetEducationForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
                  >
                    Add Education
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Skills Form */}
        {showSkillsForm && (
          <div
            ref={skillsFormRef}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetSkillsForm()}
          >
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">
                {editingSkillId ? "Edit Skill" : "Add Skill"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. JavaScript, React, Project Management"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Level
                    </label>
                    <select
                      value={newSkill.level}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, level: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {skillLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={newSkill.category}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, category: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {skillCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {editingSkillId ? (
                  <>
                    <button
                      onClick={updateSkill}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                    >
                      Update Skill
                    </button>
                    <button
                      onClick={resetSkillsForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
                  >
                    Add Skill
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Projects Form */}
        {showProjectsForm && (
          <div
            ref={projectsFormRef}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetProjectsForm()}
          >
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-400">
                {editingProjectId ? "Edit Project" : "Add Project"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="e.g. Portfolio Website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    rows="3"
                    placeholder="Describe the project and your role in it"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        technologies: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Comma separated list (e.g. React, Node.js, MongoDB)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Link (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.link}
                    onChange={(e) =>
                      setNewProject({ ...newProject, link: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {editingProjectId ? (
                  <>
                    <button
                      onClick={updateProject}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                    >
                      Update Project
                    </button>
                    <button
                      onClick={resetProjectsForm}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addProject}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
                  >
                    Add Project
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}