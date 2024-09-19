'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import NextPageModal from './NextPageModal'; // Import the NextPageModal

const FeatureCard = ({ title, items }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-lg"
  >
    <h3 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center text-gray-700"
        >
          <Check className="mr-2 h-5 w-5 text-green-500" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default function ChoicesVisualization({ isOpen, onClose, selectedFeatures, onChangeChoice, models, features, advancedFeatures }) {
  const [currentStep, setCurrentStep] = useState('visualization');
  const [total, setTotal] = useState(0);
  const [showNextPageModal, setShowNextPageModal] = useState(false); // State for modal

  useEffect(() => {
    const calculateTotal = () => {
      const modelPrice = parseInt(models.find(m => m.name === selectedFeatures.model)?.price.replace(/\D/g, '') || '0');
      const featuresPrices = selectedFeatures.feature.reduce((sum, f) => {
        const feature = features.find(feat => feat.name === f);
        return sum + parseInt(feature?.price.replace(/\D/g, '') || '0');
      }, 0);
      const advancedFeaturesPrices = selectedFeatures.advancedFeature.reduce((sum, f) => {
        const feature = advancedFeatures.find(feat => feat.name === f);
        return sum + parseInt(feature?.price.replace(/\D/g, '') || '0');
      }, 0);
      return modelPrice + featuresPrices + advancedFeaturesPrices;
    }
    setTotal(calculateTotal());
  }, [selectedFeatures, models, features, advancedFeatures]);

  const handleContinue = () => {
    if (currentStep === 'visualization') {
      setCurrentStep('confirm');
    } else {
      setShowNextPageModal(true); // Show the NextPageModal
    }
  };

  const handleBack = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('visualization');
    } else {
      onChangeChoice();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto bg-gradient-to-b from-indigo-50 via-white to-rose-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
              {currentStep === 'visualization' ? 'Your Selection' : 'Confirm Your Choices'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {currentStep === 'visualization' ? (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-indigo-100 p-4 rounded-lg text-center"
                >
                  <h2 className="text-2xl font-bold text-indigo-700 mb-2">Selected Model</h2>
                  <p className="text-xl text-indigo-600">{selectedFeatures.model}</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureCard title="Selected Features" items={selectedFeatures.feature} />
                  <FeatureCard title="Advanced Features" items={selectedFeatures.advancedFeature} />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-green-100 p-6 rounded-lg text-center"
                >
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Your Chatbot Selection is Done!</h2>
                  <p className="text-lg text-green-600">Click 'Confirm Choices' to proceed</p>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Selected Model:</h3>
                  <p className="text-gray-700 flex justify-between">
                    <span>{selectedFeatures.model}</span>
                    <span>{models.find(m => m.name === selectedFeatures.model)?.price || 'N/A'}</span>
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Selected Features:</h3>
                  <ul className="space-y-2">
                    {selectedFeatures.feature.map((feature, index) => {
                      const featureDetails = features.find(f => f.name === feature);
                      return (
                        <li key={index} className="flex justify-between text-gray-700">
                          <span>{feature}</span>
                          <span>{featureDetails?.price || 'N/A'}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Selected Advanced Features:</h3>
                  <ul className="space-y-2">
                    {selectedFeatures.advancedFeature.map((feature, index) => {
                      const featureDetails = advancedFeatures.find(f => f.name === feature);
                      return (
                        <li key={index} className="flex justify-between text-gray-700">
                          <span>{feature}</span>
                          <span>{featureDetails?.price || 'N/A'}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="bg-indigo-100 p-6 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-indigo-700">Total: {total}rs/month</h3>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between mt-6">
            <Button 
              onClick={handleBack} 
              className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 'visualization' ? 'Change Choices' : 'Back to Visualization'}
            </Button>
            <Button 
              onClick={handleContinue} 
              className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
            >
              {currentStep === 'visualization' ? 'Confirm Choices' : 'Continue to Setup'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Render NextPageModal */}
      {showNextPageModal && (
        <NextPageModal
          isOpen={showNextPageModal}
          onClose={() => setShowNextPageModal(false)}
          selectedFeatures={selectedFeatures}
          models={models}
          features={features}
          advancedFeatures={advancedFeatures}
        />
      )}
    </>
  );
}
