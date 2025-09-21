
"use client";

import { useState } from "react";
import { SignupForm, type FormValues } from "./signup-form";
import { OtpVerificationForm } from "./otp-verification-form";
import { Logo } from "@/components/logo";
import { CheckCircle, Circle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "signup" | "otp";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("signup");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSignupSuccess = (data: FormValues) => {
    setPhoneNumber(data.phoneNumber);
    if (typeof window !== "undefined") {
      const userProfile = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        location: `${data.city}, ${data.state}`,
        // In a real app, you'd get craft from onboarding. For now, let's use a placeholder.
        craft: 'Not Specified', 
      };
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    setStep("otp");
  };

  const handleOtpSuccess = () => {
    // Redirect to dashboard after successful verification
    window.location.href = "/dashboard";
  };

  const handleChangeNumber = () => {
    setStep("signup");
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
                <Logo />
            </div>

            <div className="mb-8">
                <ol className="flex items-center w-full">
                    <li className={cn(
                        "flex w-full items-center text-primary after:content-[''] after:w-full after:h-1 after:border-b after:border-primary after:border-4 after:inline-block",
                         step === 'signup' && "after:border-muted"
                    )}>
                        <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-full lg:h-12 lg:w-12 shrink-0">
                            {step === 'otp' ? <CheckCircle className="w-5 h-5 text-primary-foreground" /> : <UserPlus className="w-5 h-5 text-primary-foreground" /> }
                        </span>
                    </li>
                    <li className="flex items-center">
                        <span className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0",
                            step === 'otp' ? 'bg-primary' : 'bg-muted'
                        )}>
                             <Circle className={cn("w-5 h-5", step === 'otp' ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        </span>
                    </li>
                </ol>
            </div>

            {step === "signup" && <SignupForm onSuccess={handleSignupSuccess} />}
            {step === "otp" && <OtpVerificationForm phoneNumber={phoneNumber} onSuccess={handleOtpSuccess} onChangeNumber={handleChangeNumber} />}
       </div>
    </div>
  );
}
