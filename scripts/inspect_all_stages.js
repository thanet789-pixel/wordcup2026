const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

async function inspect() {
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    const data = await res.json();
    const apiMatches = data.matches || [];
    
    // Group matches by stage and sort them by date/id
    const stages = {};
    apiMatches.forEach(m => {
      if (!stages[m.stage]) {
        stages[m.stage] = [];
      }
      stages[m.stage].push(m);
    });

    Object.keys(stages).forEach(stage => {
      if (stage === "GROUP_STAGE") return;
      console.log(`\n=== STAGE: ${stage} (${stages[stage].length} matches) ===`);
      // Sort by ID or date
      stages[stage].sort((a, b) => a.id - b.id);
      stages[stage].forEach(m => {
        console.log(`Match ID: ${m.id} | Date: ${m.utcDate} | ${m.homeTeam?.name || "TBD"} vs ${m.awayTeam?.name || "TBD"} | Status: ${m.status}`);
      });
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

inspect();
