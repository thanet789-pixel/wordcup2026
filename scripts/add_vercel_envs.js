const { execSync } = require("child_process");

const envs = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAUCGk7SsSU-Gb9_Sj9wjXdlu_GdpQzQ48",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "wordcup2026-7ae55.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "wordcup2026-7ae55",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "wordcup2026-7ae55.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "785402346943",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:785402346943:web:611a4657a95fdc6582f50a",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-3C3FV4PVS4"
};

const targets = ["production", "preview", "development"];

async function addEnvs() {
  console.log("Adding Firebase environment variables to Vercel...");
  
  for (const [name, value] of Object.entries(envs)) {
    for (const target of targets) {
      try {
        console.log(`Adding ${name} to ${target}...`);
        // Vercel CLI command: npx vercel env add <name> <environment> --value <value> --yes --force
        // Escape quotes in value for safety
        const escapedValue = value.replace(/"/g, '\\"');
        execSync(`npx vercel env add ${name} ${target} --value "${escapedValue}" --yes --force`, {
          encoding: "utf-8",
          stdio: ["ignore", "ignore", "pipe"] // ignore stdin and stdout, keep stderr for debugging
        });
      } catch (err) {
        // If it already exists, Vercel env add might fail, which is fine
        if (err.stderr && err.stderr.includes("already exists")) {
          console.log(`- ${name} already exists in ${target}. Skipping.`);
        } else {
          console.error(`- Error adding ${name} to ${target}:`, err.stderr || err.message);
        }
      }
    }
  }
  
  console.log("Vercel environment variables update completed!");
}

addEnvs();
