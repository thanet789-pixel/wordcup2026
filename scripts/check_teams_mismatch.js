const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

const mockTeams = [
  "mex", "rsa", "kor", "cze", "can", "bih", "qat", "sui",
  "bra", "mar", "hai", "sco", "usa", "par", "aus", "tur",
  "ger", "cuw", "civ", "ecu", "ned", "jpn", "swe", "tun",
  "bel", "egy", "irn", "nzl", "esp", "cpv", "ksa", "uru",
  "fra", "sen", "irq", "nor", "arg", "alg", "aut", "jor",
  "por", "cod", "uzb", "col", "eng", "cro", "gha", "pan"
];

const mockTeamSet = new Set(mockTeams);

async function test() {
  console.log("Checking API teams for mismatches with mock data...");
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    const data = await res.json();
    const apiMatches = data.matches || [];
    
    const missingTeams = new Set();
    
    for (const m of apiMatches) {
      if (m.homeTeam?.tla) {
        const homeCode = m.homeTeam.tla.toLowerCase();
        if (!mockTeamSet.has(homeCode)) {
          missingTeams.add(`${m.homeTeam.name} (${homeCode})`);
        }
      }
      if (m.awayTeam?.tla) {
        const awayCode = m.awayTeam.tla.toLowerCase();
        if (!mockTeamSet.has(awayCode)) {
          missingTeams.add(`${m.awayTeam.name} (${awayCode})`);
        }
      }
    }
    
    console.log("Missing teams in mock database:", Array.from(missingTeams));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
