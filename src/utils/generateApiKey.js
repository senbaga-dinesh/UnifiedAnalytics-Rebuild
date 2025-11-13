import crypto from "crypto";

// Function to generate a secure API key
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex"); 
};
