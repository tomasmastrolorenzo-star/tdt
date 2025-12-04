console.log('\n3. Matching Services from Screenshot:');
if (foundServices.length > 0) {
    console.table(foundServices.map(s => ({
        ID: s.service,
        Name: s.name.substring(0, 50), // Truncate for display
        Rate: s.rate,
    } catch (error) {
        console.error('❌ Error verifying services:', error);
    }
}

verifyServices();
