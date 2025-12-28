const fs = require('fs');
try {
    const raw = fs.readFileSync('test_output.json', 'utf8');
    // Remove potential BOM or garbage
    const jsonStr = raw.replace(/^\uFEFF/, '').trim();
    // Sometimes curl includes headers/stats in output if not silent, but here likely just JSON.
    // Use simple regex to find the JSON array if needed, or straight parse.
    const data = JSON.parse(jsonStr);

    console.table(data.test_results.map(r => ({
        Scenario: r.scenario,
        Decision: r.outcome.decision,
        Playbook: r.outcome.playbook,
        Pricing: r.outcome.pricing,
        Risk: r.outcome.risk_score,
        Tier: r.outcome.tier,
        Gap: r.outcome.gap_class
    })));
} catch (e) {
    console.error("Error reading JSON:", e);
}
