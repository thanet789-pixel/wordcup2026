const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

async function test() {
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    const data = await res.json();
    const apiMatches = data.matches || [];
    
    // Look at one R16 match in detail
    const r16Matches = apiMatches.filter(m => m.stage === "LAST_16");
    console.log("R16 Match sample JSON:");
    console.log(JSON.stringify(r16Matches[0], null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

test();
