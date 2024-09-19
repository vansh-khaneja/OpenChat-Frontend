'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"
import ChoicesVisualization from '@/components/ChoicesVisualization'

const FeatureCard = ({ feature, isSelected, onClick }) => (
  <div
    className={`flex flex-col border rounded-lg cursor-pointer transition-all duration-300 ${
      isSelected 
      ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
      : 'border-gray-300 hover:border-rose-300 hover:bg-rose-50'
    }`}
    onClick={onClick}
  >
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-indigo-700">{feature.name}</h3>
      <p className="text-xl font-bold mt-2 text-rose-600">{feature.price}</p>
    </div>
    <div className="p-6 border-t border-indigo-100">
      <ul className="space-y-3">
        {feature.details.map((detail, index) => (
          <li key={index} className="flex items-start">
            <ChevronRight className="mr-2 h-5 w-5 text-indigo-500" />
            <span className="text-gray-700">{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const FeatureSection = ({ title, features, type, selectedFeatures, onFeatureSelect, columns }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6 text-indigo-700">{title}</h2>
    <div className={`grid gap-6 ${columns}`}>
      {features.map(feature => (
        <FeatureCard
          key={feature.name}
          feature={feature}
          isSelected={selectedFeatures.includes(feature.name)}
          onClick={() => onFeatureSelect(feature.name)}
        />
      ))}
    </div>
  </div>
)

export default function Page() {
  const models = [
    { name: "Gemma 2", price: "Free", details: ["Basic model with standard features", "Suitable for simple use cases"] },
    { name: "Llama 3", price: "150rs / month", details: ["Advanced model with improved capabilities", "Better performance and additional functionalities"] },
    { name: "Llama 3.1", price: "300rs / month", details: ["Latest model with premium features", "Comprehensive support for demanding applications"] },
  ]

  const features = [
    { name: "Greeting", price: "Free", details: ["Simple greeting feature", "Useful for welcoming new users"] },
    { name: "General", price: "Free", details: ["General-purpose feature for a wide range of tasks", "Versatile and adaptable"] },
    { name: "User data", price: "800rs", details: ["Manages and analyzes user data", "Personalizes interactions based on behavior"] },
    { name: "Connect", price: "400rs", details: ["Integration with external services", "Expands functionality by connecting to other platforms"] },
  ]

  const advancedFeatures = [
    { name: "Reranking", price: "800rs", details: ["Improves search results by re-ranking", "Enhances search outcome quality"] },
    { name: "Hybrid search", price: "1500rs", details: ["Combines multiple search methods", "Delivers optimal results by leveraging multiple techniques"] },
    { name: "Llama Guard", price: "2000rs", details: ["Monitors and alerts for suspicious activities immediately", "Allows tailored security settings and rules based on user needs"] },
  ]
  
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState({
    model: '',
    feature: [],
    advancedFeature: []
  })

  const handleFeatureSelection = (type, featureName) => {
    setSelectedFeatures(prevState => {
      const updatedFeatures = type === 'model'
        ? featureName
        : prevState[type].includes(featureName)
          ? prevState[type].filter(f => f !== featureName)
          : [...prevState[type], featureName]

      return {
        ...prevState,
        [type]: updatedFeatures
      }
    })
  }

  const handleVisualizationClose = () => {
    setIsVisualizationOpen(false)
  }

  const handleContinue = () => {
    // Handle continue action
    console.log('Continuing to next step')
  }

  const handleChangeChoice = () => {
    setIsVisualizationOpen(false)
  }

  return (
    <div className="container mx-auto p-28 bg-gradient-to-b from-indigo-50 via-white to-rose-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">Chatbot Pipeline Builder</h1>

      <div className="space-y-12">
        {/* Models Section */}
        <FeatureSection
          title="Models"
          features={models}
          type="model"
          selectedFeatures={[selectedFeatures.model]}
          onFeatureSelect={(featureName) => handleFeatureSelection('model', featureName)}
          columns="md:grid-cols-3"
        />

        {/* Features Section */}
        <FeatureSection
          title="Features"
          features={features}
          type="feature"
          selectedFeatures={selectedFeatures.feature}
          onFeatureSelect={(featureName) => handleFeatureSelection('feature', featureName)}
          columns="md:grid-cols-2 lg:grid-cols-4"
        />

        {/* Advanced Features Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Advanced Features</h2>
          <p className="text-lg text-gray-700 mb-6">
            Enhance your chatbot with advanced capabilities like reranking, hybrid search, and robust security measures.
          </p>
          <FeatureSection
            features={advancedFeatures}
            type="advancedFeature"
            selectedFeatures={selectedFeatures.advancedFeature}
            onFeatureSelect={(featureName) => handleFeatureSelection('advancedFeature', featureName)}
            columns="md:grid-cols-3"
          />
        </div>

        <div className="flex justify-center mt-12">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => setIsVisualizationOpen(true)}
          >
            Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <ChoicesVisualization
  isOpen={isVisualizationOpen}
  onClose={handleVisualizationClose}
  selectedFeatures={selectedFeatures}
  onContinue={handleContinue}
  onChangeChoice={handleChangeChoice}
  models={models}
  features={features}
  advancedFeatures={advancedFeatures}
/>
    </div>
  )
}