
"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { cn } from "@/lib/utils";
import { StepBusinessDetails } from "./onboarding/step-business-details";
import { StepBusinessObjectives } from "./onboarding/step-business-objectives";
import { StepDataCollection } from "./onboarding/step-data-collection";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const steps = [
  { id: 1, name: 'Business details', component: StepBusinessDetails, fields: ['craftType', 'experience', 'businessScale'] },
  { id: 2, name: 'Business objectives', component: StepBusinessObjectives, fields: ['objectives'] },
  { id: 3, name: 'Data collection', component: StepDataCollection, fields: [] },
];

interface OnboardingStepperProps {
  onComplete: () => void;
}

export function OnboardingStepper({ onComplete }: OnboardingStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm({
    // You can add zod resolver here if needed
    defaultValues: {
        craftType: "",
        experience: 0,
        businessScale: "individual",
        objectives: [],
        productImages: null,
        socialMediaLink: ""
    }
  });

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isValid = await methods.trigger(fieldsToValidate as any);

    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step, process and save data
      const data = methods.getValues();
       if (typeof window !== "undefined") {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            const updatedProfile = {
                ...profile,
                craft: data.craftType,
                experience: data.experience,
                businessScale: data.businessScale,
                objectives: data.objectives,
                story: `I am an artisan with ${data.experience} years of experience in ${data.craftType}, running an ${data.businessScale} business. My main goal is to ${data.objectives.join(', ')}.`
            };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        }
      }
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };

  const ActiveStepComponent = steps[currentStep - 1].component;

  return (
    <FormProvider {...methods}>
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
                <h1 className="text-3xl font-bold text-center font-headline mb-2">Welcome to कारीगर!</h1>
                <p className="text-muted-foreground text-center">Let's set up your profile to get the most out of our platform.</p>
        </div>

        <div className="mb-8 flex justify-center">
            <ol className="flex items-center w-full max-w-2xl">
            {steps.map((step, index) => (
                <li
                key={step.id}
                className={cn(
                    "flex w-full items-center",
                    index < steps.length - 1 && "after:content-[''] after:w-full after:h-px after:border-b after:inline-block",
                    currentStep > step.id ? "after:border-primary" : "after:border-muted"
                )}
                >
                <div className="flex flex-col items-center">
                    <span
                    className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors",
                        currentStep > step.id ? "bg-primary text-primary-foreground" :
                        currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                    >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </span>
                    <span className={cn(
                        "text-sm mt-2 text-center",
                        currentStep >= step.id ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>{step.name}</span>
                </div>
                </li>
            ))}
            </ol>
        </div>

        <Card>
            <CardContent className="p-8">
                <ActiveStepComponent />
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
            <div className="flex gap-4">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Back
                </Button>
                <Button onClick={handleNext}>
                {currentStep === steps.length ? "Finish" : "Next"}
                </Button>
            </div>
        </div>
        </div>
    </FormProvider>
  );
}
