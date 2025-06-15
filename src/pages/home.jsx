import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    name: "Esha",
    title: "A passionate frontend developer crafting beautiful and functional websites.",
    headerText: "Esha Portfolio",
    profileImage: ""
  });

  // Load data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "portfolio", "content");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    fetchData();
  }, []);

  // Save data to Firebase
  const saveData = async () => {
    try {
      await setDoc(doc(db, "portfolio", "content"), portfolioData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleChange = (e) => {
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
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPortfolioData(prev => ({
      ...prev,
      profileImage: ""
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black bg-[length:400%_400%] animate-bg-pan">
      <div className="min-h-screen flex flex-col text-white">

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
                    onChange={handleChange}
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
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button
                  onClick={saveData}
                  className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Save
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
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 bg-transparent">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I'm {isEditing ? (
              <input
                type="text"
                name="name"
                value={portfolioData.name}
                onChange={handleChange}
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
                onChange={handleChange}
                className="bg-gray-800 text-white p-2 rounded w-full"
                rows="3"
              />
            ) : (
              portfolioData.title
            )}
          </p>
        </main>
      </div>
    </div>
  );
}