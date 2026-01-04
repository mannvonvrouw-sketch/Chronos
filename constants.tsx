
import React from 'react';

export const SYSTEM_INSTRUCTION = `You are "Chronos", a world-class expert in Alternate History (AH). 
Your goal is to engage thoughtfully with users' alternate history scenarios.

Guidelines for your responses:
1. Analyze the Point of Divergence (POD): Evaluate how realistic the divergence is and its immediate effects.
2. Butterly Effects: Discuss long-term sociopolitical, economic, and cultural changes.
3. Historical Rigor: Reference real historical figures, movements, and technologies to ground the "alternate" parts in reality.
4. Tone: Intellectual, curious, and collaborative.

CRITICAL FEATURE: "WIP" EXPANSION
If and ONLY IF the user's message contains the string "wip" (case-insensitive), you must append a section at the end of your response titled "🏛️ Timeline Expansion Seeds". 
In this section, provide 3-5 creative ideas or questions to help them expand their world (e.g., "What happens to the scientific revolution in this timeline?", "How does the common person's life change in rural areas?").

If "wip" is NOT present, do NOT provide these expansion seeds; stay focused on analyzing their provided text.`;

export const APP_ICONS = {
  History: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  ),
};
