const fs = require("fs");
const path = require("path");

// 1. Fix Uruguay ID in src/data/mock.ts
const mockPath = path.join(__dirname, "../src/data/mock.ts");
if (fs.existsSync(mockPath)) {
  console.log("Fixing mock.ts...");
  let content = fs.readFileSync(mockPath, "utf8");
  
  // Replace uru with ury in teams list
  content = content.replace(/id:\s*"uru"/g, 'id: "ury"');
  content = content.replace(/code:\s*"URU"/g, 'code: "URY"');
  // Replace in matches list
  content = content.replace(/awayTeamId:\s*"uru"/g, 'awayTeamId: "ury"');
  content = content.replace(/homeTeamId:\s*"uru"/g, 'homeTeamId: "ury"');
  // Replace in standings
  content = content.replace(/teamId:\s*"uru"/g, 'teamId: "ury"');
  
  fs.writeFileSync(mockPath, content, "utf8");
  console.log("- mock.ts fixed!");
}

// 2. Fix scripts/update_mock_and_db.js
const updateDbPath = path.join(__dirname, "update_mock_and_db.js");
if (fs.existsSync(updateDbPath)) {
  console.log("Fixing update_mock_and_db.js...");
  let content = fs.readFileSync(updateDbPath, "utf8");
  content = content.replace(/"uru"/g, '"ury"');
  fs.writeFileSync(updateDbPath, content, "utf8");
  console.log("- update_mock_and_db.js fixed!");
}

// 3. Make src/components/MatchCard.tsx null-safe
const cardPath = path.join(__dirname, "../src/components/MatchCard.tsx");
if (fs.existsSync(cardPath)) {
  console.log("Fixing MatchCard.tsx null-safety...");
  let content = fs.readFileSync(cardPath, "utf8");
  
  const oldHome = 'const home = getTeam(match.homeTeamId)!;';
  const newHome = 'const home = getTeam(match.homeTeamId) || { id: match.homeTeamId, name: match.homeTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };';
  
  const oldAway = 'const away = getTeam(match.awayTeamId)!;';
  const newAway = 'const away = getTeam(match.awayTeamId) || { id: match.awayTeamId, name: match.awayTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };';
  
  content = content.replace(oldHome, newHome);
  content = content.replace(oldAway, newAway);
  
  fs.writeFileSync(cardPath, content, "utf8");
  console.log("- MatchCard.tsx fixed!");
}

// 4. Make src/app/matches/[id]/MatchDetailClient.tsx null-safe
const clientPath = path.join(__dirname, "../src/app/matches/[id]/MatchDetailClient.tsx");
if (fs.existsSync(clientPath)) {
  console.log("Fixing MatchDetailClient.tsx null-safety...");
  let content = fs.readFileSync(clientPath, "utf8");
  
  const oldHome = 'const home = getTeam(match.homeTeamId)!;';
  const newHome = 'const home = getTeam(match.homeTeamId) || { id: match.homeTeamId, name: match.homeTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };';
  
  const oldAway = 'const away = getTeam(match.awayTeamId)!;';
  const newAway = 'const away = getTeam(match.awayTeamId) || { id: match.awayTeamId, name: match.awayTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };';
  
  content = content.replace(oldHome, newHome);
  content = content.replace(oldAway, newAway);
  
  fs.writeFileSync(clientPath, content, "utf8");
  console.log("- MatchDetailClient.tsx fixed!");
}

console.log("All fixes applied successfully!");
