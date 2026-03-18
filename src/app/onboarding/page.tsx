
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Step1ImportantStuff } from '@/components/onboarding/Step1';
import { Step2WhoAreYou } from '@/components/onboarding/Step2';
import { Step3HealthConditions } from '@/components/onboarding/Step3HealthConditions';
import { Step4Medications } from '@/components/onboarding/Step4Medications';
import { Step6StripeVerify } from '@/components/onboarding/Step6StripeVerify';
import { Step7VibeCheck } from '@/components/onboarding/Step7VibeCheck';
import { StepPartyGoal } from '@/components/onboarding/StepPartyGoal';
import { safeStringify } from '@/lib/safe-storage';
import { useAuth, signOutAfterRegistration } from '@/firebase';

export type LegalAgreements = {
  agreedToHarmReduction: boolean;
  agreedToMedicalDisclaimer: boolean;
  agreedToGDPR: boolean;
  agreedToSafetyNetwork: boolean;
  agreedToImmediateHelp: boolean;
  termsAcceptedAt: string;
  appVersion: string;
};

export type OnboardingData = {
  name: string;
  dob: string;
  weight: number;
  height: number;
  age?: number;
  medications: string[];
  substances: { name: string; dose: string }[];
  healthConditions: string[];
  goals: string[];
  legalAgreements?: LegalAgreements;
  verification?: { stripeCustomerId: string; last4: string; method: string; isAgeVerified: boolean };
};

export default function Onboarding() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    dob: '',
    weight: 0,
    height: 0,
    medications: [],
    substances: [],
    healthConditions: [],
    goals: [],
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateAndPersist = (updates: Partial<OnboardingData>) => {
    const final = { ...data, ...updates };
    setData(final);
    try {
      localStorage.setItem('stayonbeat_profile', safeStringify(final));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Step7VibeCheck already handles the Firestore save before calling this.
      // We now sign the user out to reset for their first real session check-in.
      await signOutAfterRegistration(auth);
      
      // Redirect to sign-in with the welcome param
      router.push("/auth?welcome=true");
    } catch (error) {
      console.error("Onboarding completion error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-2xl py-8 md:py-16 relative">
        {step === 1 && (
          <Step1ImportantStuff onComplete={(legal) => { updateAndPersist({ legalAgreements: legal }); nextStep(); }} />
        )}
        
        {step === 2 && (
          <Step2WhoAreYou onBack={prevStep} onComplete={(profile) => { updateAndPersist(profile); nextStep(); }} />
        )}

        {step === 3 && (
          <StepPartyGoal onBack={prevStep} onComplete={(goals) => { updateAndPersist({ goals }); nextStep(); }} />
        )}
        
        {step === 4 && (
          <Step3HealthConditions selected={data.healthConditions} onBack={prevStep} onComplete={(conditions) => { updateAndPersist({ healthConditions: conditions }); nextStep(); }} />
        )}
        
        {step === 5 && (
          <Step4Medications selected={data.medications} onBack={prevStep} onComplete={(meds) => { updateAndPersist({ medications: meds }); nextStep(); }} />
        )}

        {step === 6 && (
          <Step6StripeVerify
            onBack={prevStep}
            onComplete={(stripeData) => {
              updateAndPersist({
                verification: {
                  isAgeVerified: true,
                  method: "stripe_card_check_demo",
                  stripeCustomerId: stripeData.stripeId,
                  last4: stripeData.last4,
                },
              });
              setStep(7);
            }}
          />
        )}

        {step === 7 && (
          <Step7VibeCheck 
            onBack={prevStep}
            onComplete={handleOnboardingComplete} 
            isOnboarding={true}
            finalOnboardingData={data}
          />
        )}
      </div>
    </main>
  );
}
