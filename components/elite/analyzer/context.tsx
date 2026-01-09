"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Phase =
    | "ACCESS"         // 5.0
    | "VALIDATION"     // 5.1
    | "STATUS"         // 5.2
    | "NICHE"          // 5.3
    | "HEALTH"         // 5.4
    | "AMBITION"       // 5.5
    | "SEGMENTATION"   // 5.6
    | "PROCESSING"     // Final Process
    | "GATE";          // Final Gate

interface ProfileData {
    username: string;
    profilePicUrl: string;
    followersCount: number;
    followsCount: number;
    isPrivate: boolean;
    isVerified: boolean;
    posts: any[];
}

interface AnalyzerState {
    phase: Phase;
    handle: string;
    profileData: ProfileData | null;
    verificationStatus: string | null;
    niche: string | null;
    healthStatus: "CRITICAL" | "RISK" | "OPTIMAL" | null;
    growthGoal: string | null;
    geo: string;
    gender: string;
    age: string;
    logs: string[];
}

interface AnalyzerContextType extends AnalyzerState {
    setPhase: (p: Phase) => void;
    setHandle: (h: string) => void;
    setProfileData: (d: ProfileData | null) => void;
    setVerificationStatus: (s: string) => void;
    setNiche: (n: string) => void;
    setHealthStatus: (s: "CRITICAL" | "RISK" | "OPTIMAL") => void;
    setGrowthGoal: (g: string) => void;
    setGeo: (g: string) => void;
    setGender: (g: string) => void;
    setAge: (a: string) => void;
    addLog: (msg: string) => void;
}

const AnalyzerContext = createContext<AnalyzerContextType | undefined>(undefined);

export function AnalyzerProvider({ children }: { children: ReactNode }) {
    const [phase, setPhase] = useState<Phase>("ACCESS");
    const [handle, setHandle] = useState("");
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
    const [niche, setNiche] = useState<string | null>(null);
    const [healthStatus, setHealthStatus] = useState<"CRITICAL" | "RISK" | "OPTIMAL" | null>(null);
    const [growthGoal, setGrowthGoal] = useState<string | null>(null);
    const [geo, setGeo] = useState("Global");
    const [gender, setGender] = useState("Mixto");
    const [age, setAge] = useState("25-45 (Prime Force)");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    return (
        <AnalyzerContext.Provider value={{
            phase, setPhase,
            handle, setHandle,
            profileData, setProfileData,
            verificationStatus, setVerificationStatus,
            niche, setNiche,
            healthStatus, setHealthStatus,
            growthGoal, setGrowthGoal,
            geo, setGeo,
            gender, setGender,
            age, setAge,
            logs, addLog
        }}>
            {children}
        </AnalyzerContext.Provider>
    );
}

export const useAnalyzer = () => {
    const context = useContext(AnalyzerContext);
    if (!context) throw new Error("useAnalyzer must be used within AnalyzerProvider");
    return context;
};
