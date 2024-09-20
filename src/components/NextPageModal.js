'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import PaymentPage from './PaymentPage'; // Import the PaymentPage component

export default function NextPageModal({ isOpen, onClose, selectedFeatures, models, features, advancedFeatures }) {
  const [companyName, setCompanyName] = useState('');
  const [botName, setBotName] = useState('');
  const [postgresUrl, setPostgresUrl] = useState('');
  const [trainingData, setTrainingData] = useState('');
  const [urls, setUrls] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [userData, setUserData] = useState(null);

  const userCollectionRef = collection(db, "users");
  const createUser = async (data) => {
    try {
      const docRef = await addDoc(userCollectionRef, data);
      console.log('Document written with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const data = {
      companyName,
      botName,
      postgresUrl,
      selectedFeatures,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "text": trainingData || "",
          "urls": urls.filter(url => url.trim() !== '')
        })
      });

      const result = await response.json();
      data.db_name = result['db_name'];
      console.log(result)

      const docId = await createUser(data);
      if (response.ok) {
        setUserData({ id: docId, ...data });
        setShowPaymentPage(true);
      } else {
        setSubmitStatus({ type: 'error', message: result.detail || 'Failed to process training data.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handlePaymentClose = () => {
    setShowPaymentPage(false);
    onClose(userData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose(null)}>
        <DialogContent className="sm:max-w-[800px] w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col bg-gradient-to-b from-indigo-50 via-white to-rose-50 shadow-lg rounded-lg border border-gray-300">
          <DialogHeader className="flex flex-row items-center justify-between p-2 bg-indigo-50 border-b border-indigo-100">
            <DialogTitle className="text-2xl font-bold text-indigo-700">Complete Your Chatbot Setup</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                    Company Name
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot-name" className="text-sm font-medium text-gray-700">
                    Bot Name
                  </Label>
                  <Input
                    id="bot-name"
                    placeholder="Name your chatbot"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    required
                    className="border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="postgres-url" className="text-sm font-medium text-gray-700">
                  Postgres URL
                </Label>
                <Input
                  id="postgres-url"
                  placeholder="Enter your Postgres database URL"
                  value={postgresUrl}
                  onChange={(e) => setPostgresUrl(e.target.value)}
                  required
                  className="border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="training-data" className="text-sm font-medium text-gray-700">
                  Training Data
                </Label>
                <Textarea
                  id="training-data"
                  placeholder="Enter the general data your chatbot needs to be trained on"
                  className="min-h-[50px] border-gray-300 rounded-lg shadow-sm"
                  value={trainingData}
                  onChange={(e) => setTrainingData(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Website URLs for Training
                </Label>
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter website URL"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      className="border-gray-300 rounded-lg shadow-sm flex-grow"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrlField(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addUrlField}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add URL
                </Button>
              </div>
              {submitStatus && (
                <Alert variant={submitStatus.type === 'success' ? 'default' : 'destructive'} className="mt-4">
                  <AlertTitle className="text-base font-semibold">{submitStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{submitStatus.message}</AlertDescription>
                </Alert>
              )}
              <DialogFooter className="p-4 border-t border-gray-200">
                <Button type="submit" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Proceed to Checkout'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {showPaymentPage && (
        <PaymentPage
          isOpen={showPaymentPage}
          onClose={handlePaymentClose}
          userData={userData}
          selectedFeatures={selectedFeatures}
          models={models}
          features={features}
          advancedFeatures={advancedFeatures}
        />
      )}
    </>
  );
}
