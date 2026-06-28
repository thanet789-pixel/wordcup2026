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
    
    // Print first 5 matches
    console.log("First 5 matches:");
    apiMatches.slice(0, 5).forEach((m, idx) => {
      console.log(`${idx + 1}. [${m.id}] ${m.utcDate} - ${m.homeTeam.name} vs ${m.awayTeam.name} - Status: ${m.status}`);
    });
    
    // Search for Korea (South Korea) vs Mexico
    console.log("\nSearching for South Korea / Korea vs Mexico...");
    const matched = apiMatches.filter(m => {
      const h = m.homeTeam.name.toLowerCase();
      const a = m.awayTeam.name.toLowerCase();
      return (h.includes("korea") && a.includes("mexico")) || (h.includes("mexico") && a.includes("korea"));
    });
    
    matched.forEach(m => {
      console.log(`- Match [${m.id}] ${m.utcDate} - ${m.homeTeam.name} (${m.score?.fullTime?.home}) vs ${m.awayTeam.name} (${m.score?.fullTime?.away}) - Status: ${m.status}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
