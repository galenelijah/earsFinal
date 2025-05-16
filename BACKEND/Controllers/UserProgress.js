const UserProgress = async (req, res) => {
    try {
        // Mock data for now - you can replace this with actual database queries later
        const mockProgressData = [
            {
                name: "POS Basics Training",
                status: "completed",
                progress: 100,
                score: 95,
                lastActivity: new Date("2024-03-15")
            },
            {
                name: "Customer Service Essentials",
                status: "in-progress",
                progress: 60,
                score: null,
                lastActivity: new Date("2024-03-16")
            },
            {
                name: "Safety Protocols",
                status: "not-started",
                progress: 0,
                score: null,
                lastActivity: null
            },
            {
                name: "Product Knowledge",
                status: "completed",
                progress: 100,
                score: 88,
                lastActivity: new Date("2024-03-14")
            }
        ];

        res.json(mockProgressData);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Error fetching progress data' });
    }
};

module.exports = { UserProgress }; 