/**
 * Utility to test Supabase connection and validate API keys
 */
import { supabase } from "@/integrations/supabase/client";

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    url?: string;
    keyPrefix?: string;
    keyLength?: number;
  };
}

/**
 * Test Supabase connection by attempting to list buckets
 * This will fail if the API keys are incorrect
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // Check if env vars are set
  if (!url || !key) {
    return {
      success: false,
      message: "Missing environment variables. Please check your .env file.",
      details: {
        url: url ? "✓ Set" : "✗ Missing",
        keyPrefix: key ? key.substring(0, 20) + "..." : "✗ Missing",
        keyLength: key?.length || 0,
      },
    };
  }

  // Validate URL format
  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    return {
      success: false,
      message: "Invalid Supabase URL format. Should be: https://your-project.supabase.co",
      details: {
        url,
      },
    };
  }

  // Validate key format (JWT tokens start with eyJ)
  if (!key.startsWith("eyJ")) {
    return {
      success: false,
      message: "Invalid API key format. Make sure you're using the 'anon public' key (starts with 'eyJ'), not the service_role key.",
      details: {
        keyPrefix: key.substring(0, 20) + "...",
        keyLength: key.length,
      },
    };
  }

  // Test actual connection
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      // Check for specific error types
      if (error.message?.includes("signature") || error.message?.includes("JWT")) {
        return {
          success: false,
          message: "Signature verification failed. Your API key doesn't match your project URL. Please verify:\n1. The URL and key are from the same Supabase project\n2. You're using the 'anon public' key (not service_role)\n3. There are no extra spaces or quotes in your .env file",
          details: {
            url,
            keyPrefix: key.substring(0, 20) + "...",
          },
        };
      }

      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: {
          url,
          keyPrefix: key.substring(0, 20) + "...",
        },
      };
    }

    return {
      success: true,
      message: "✓ Connection successful! Supabase is properly configured.",
      details: {
        url,
        keyPrefix: key.substring(0, 20) + "...",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection error: ${error?.message || "Unknown error"}`,
      details: {
        url,
        keyPrefix: key.substring(0, 20) + "...",
      },
    };
  }
}

/**
 * Get instructions for finding the correct API keys
 */
export function getApiKeyInstructions(): string {
  return `
How to find your Supabase API keys:

1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Click on "Settings" (gear icon) in the left sidebar
4. Click on "API" in the settings menu
5. You'll see:
   - Project URL → Use this for VITE_SUPABASE_URL
   - anon public key → Use this for VITE_SUPABASE_PUBLISHABLE_KEY
     (This key starts with "eyJ" and is safe to use in frontend code)
   - service_role key → DO NOT USE THIS (it's for backend only)

Important:
- The URL and anon public key MUST be from the same project
- Copy the keys exactly (no extra spaces)
- Don't use quotes around the values in .env file
- After updating .env, restart your dev server

Example .env file:
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example_signature
`;
}

