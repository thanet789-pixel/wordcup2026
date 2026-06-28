const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

async function test() {
  console.log("Fetching matches from football-data.org...");
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    if (!res.ok) {
      console.error(`HTTP error: ${res.status} ${await res.text()}`);
      return;
    }
    const data = await res.json();
    const apiMatches = data.matches || [];
    console.log(`Total matches in API: ${apiMatches.length}`);
    
    // Search for Korea (South Korea) or Mexico
    console.log("\nSearching for South Korea / Korea or Mexico matches...");
    const matched = apiMatches.filter(m => {
      const h = m.homeTeam?.name ? m.homeTeam.name.toLowerCase() : "";
      const a = m.awayTeam?.name ? m.awayTeam.name.toLowerCase() : "";
      return h.includes("korea") || a.includes("korea") || h.includes("mexico") || a.includes("mexico");
    });
    
    matched.forEach(m => {
      const homeName = m.homeTeam?.name || "TBD";
      const awayName = m.awayTeam?.name || "TBD";
      const homeScore = m.score?.fullTime?.home !== undefined ? m.score.fullTime.home : "-";
      const awayScore = m.score?.fullTime?.away !== undefined ? m.score.fullTime.away : "-";
      console.log(`- Match [${m.id}] ${m.utcDate} - ${homeName} (${homeScore}) vs ${awayName} (${awayScore}) - Status: ${m.status}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
