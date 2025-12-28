const fs = require('fs');
async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/test/medical-verification');
        const data = await res.json();

        let output = "--- RESULTS START ---\n";
        data.test_results.forEach(r => {
            output += `SCENARIO: ${r.scenario}\n`;
            output += `DECISION: ${r.outcome.decision}\n`;
            output += `PLAYBOOK: ${r.outcome.playbook}\n`;
            output += `PRICE:    $${r.outcome.pricing}\n`;
            output += `TIER:     ${r.outcome.tier}\n`;
            output += `RISK:     ${r.outcome.risk_score.toFixed(2)}\n`;
            output += `GAP:      ${r.outcome.gap_class}\n`;
            output += `RATIONALE: ${r.outcome.rationale}\n`;
            output += "--------------------------------------------------\n";
        });
        output += "--- RESULTS END ---\n";

        fs.writeFileSync('final_results_utf8.txt', output, 'utf8');
        console.log("Written to final_results_utf8.txt");

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
run();
