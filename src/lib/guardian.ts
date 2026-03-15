'use client';

/**
 * @fileOverview The Pulse Guardian's decision engine.
 * Calibrates safety status based on physiological thresholds and intake volume.
 * Substance-aware: Adjusts thresholds based on current active intake (e.g., Poppers).
 */

export interface Vitals {
  heartRate: number;
  temperature?: number;
}

export interface SessionStatus {
  isLocked: boolean;
  lockReason?: 'vitals_high' | 'limit_reached' | 'critical_interaction' | 'manual';
  lockedAt?: string;
  unlockAt?: string;
  lastHeartRate?: number;
  activeSubstances: string[];
}

/**
 * Evaluates the current safety state based on vitals and active substances.
 * personalized with user baseline if available.
 */
export const checkSafetyStatus = (
  vitals: Vitals, 
  activeSubstances: string[] | number,
  baselineHR?: number
): SessionStatus => {
  const activeSubs = typeof activeSubstances === 'number' ? [] : activeSubstances;
  const intakeCount = typeof activeSubstances === 'number' ? activeSubstances : activeSubstances.length;
  const now = new Date();
  
  const normalizedSubs = activeSubs.map(s => s.toLowerCase());

  // 1. CRITICAL INTERACTION CHECK
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));
  const hasEDMeds = normalizedSubs.some(s => 
    ['sildenafil', 'viagra', 'cialis', 'tadalafil'].includes(s)
  );

  if (hasPoppers && hasEDMeds) {
    return {
      isLocked: true,
      lockReason: 'critical_interaction',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs
    };
  }

  // 2. SUBSTANCE-SPECIFIC THRESHOLDS
  // Standard threshold is 130 BPM, or 2x baseline if baseline is significantly high.
  // Poppers threshold is 100 BPM or baseline + 30.
  let hrThreshold = 130;
  if (baselineHR) {
    hrThreshold = Math.max(130, baselineHR * 2);
  }

  if (hasPoppers) {
    hrThreshold = baselineHR ? Math.min(100, baselineHR + 30) : 100;
  }

  if (vitals.heartRate > hrThreshold) {
    return {
      isLocked: true,
      lockReason: 'vitals_high',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs
    };
  }

  // 3. INTAKE VOLUME LIMIT
  const MAX_INTAKES = 5;
  if (intakeCount >= MAX_INTAKES) {
    return {
      isLocked: true,
      lockReason: 'limit_reached',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs
    };
  }

  return { isLocked: false, activeSubstances: activeSubs };
};
