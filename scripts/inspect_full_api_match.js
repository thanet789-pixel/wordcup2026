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
    
    // Print the full first match object
    console.log("Full Match Object structure:");
    console.log(JSON.stringify(apiMatches[0], null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
