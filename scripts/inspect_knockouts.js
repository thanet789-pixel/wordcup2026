const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

async function inspect() {
  console.log("Fetching matches from football-data.org...");
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    const data = await res.json();
    const apiMatches = data.matches || [];
    console.log(`Total matches in API: ${apiMatches.length}`);
    
    // Group matches by stage
    const stages = {};
    apiMatches.forEach(m => {
      stages[m.stage] = (stages[m.stage] || 0) + 1;
    });
    console.log("Matches count by stage in API:", stages);
    
    // Filter matches that are in knockout stages (e.g. LAST_32, ROUND_OF_16, etc. - wait, let's see what stages exist)
    const knockoutMatches = apiMatches.filter(m => m.stage !== "GROUP_STAGE");
    console.log(`Total knockout matches in API: ${knockoutMatches.length}`);
    
    // Print details of the first 10 knockout matches
    console.log("\nFirst 10 Knockout Matches from API:");
    knockoutMatches.slice(0, 10).forEach((m, idx) => {
      const homeName = m.homeTeam?.name || "TBD";
      const awayName = m.awayTeam?.name || "TBD";
      const homeTla = m.homeTeam?.tla || "TBD";
      const awayTla = m.awayTeam?.tla || "TBD";
      console.log(`${idx + 1}. [${m.id}] Stage: ${m.stage}, Group: ${m.group}, Date: ${m.utcDate}`);
      console.log(`   ${homeName} (${homeTla}) vs ${awayName} (${awayTla}) - Status: ${m.status}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

inspect();
