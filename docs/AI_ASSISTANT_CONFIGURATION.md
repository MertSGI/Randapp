# AI Assistant Configuration

This document outlines the current state and mock behavior of the Gemini API integration in Randapp for the pilot MVP phase.

## Current State (Pilot MVP)
- The Gemini API key is currently mocked or absent on the frontend for safety reasons, as it should not be exposed to clients directly.
- The `geminiService.ts` handles the interface with Gemini.
- In `mock` mode, the module returns predefined responses for Demo and AI Visualizer flows.
- Visualizer Page is simplified: NO quality selectors, NO technical jargon. Just a simple "Tavsiye Al / Get Recommendation" flow.

## Future Production Implementation Requirements
1. **Edge Function Proxy**: All AI requests MUST go through a backend endpoint (e.g., Supabase Edge Functions), which will hold the `GEMINI_API_KEY` securely.
2. **Quota Tracking**: Monitor tenant-level token or request usage to enforce limits based on Subscription Plans.
3. **Advanced Modes**: True image generation and multi-modal styling using user uploads, properly sanitized for safety guidelines.
