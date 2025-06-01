// Initialize dashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setAuthToken(null);
            window.location.href = 'index.html';
        });
    }
    
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
});

// Function to load dashboard data
async function loadDashboardData() {
    try {
        // Show loading state
        const cards = document.querySelectorAll('.card-body .h5');
        cards.forEach(card => {
            card.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        });
        
        // Fetch data from API
        const [studentsRes, parentsRes, logsRes] = await Promise.allSettled([
            axios.get(`${API_BASE_URL}/students`),
            axios.get(`${API_BASE_URL}/parents`),
            axios.get(`${API_BASE_URL}/logs`)
        ]);

        // Update UI with fetched data
        if (studentsRes.status === 'fulfilled') {
            document.getElementById('totalStudents').textContent = 
                studentsRes.value.data.data?.length || 0;
        }

        if (parentsRes.status === 'fulfilled') {
            document.getElementById('totalParents').textContent = 
                parentsRes.value.data.data?.length || 0;
        }

        if (logsRes.status === 'fulfilled') {
            const today = new Date().toISOString().split('T')[0];
            const todaysLogs = logsRes.value.data.data?.filter(log => {
                return new Date(log.timestamp).toISOString().startsWith(today);
            }) || [];
            document.getElementById('todaysPickups').textContent = todaysLogs.length;
            
            // For pending verifications, we'll just show 0 for now
            // In a real app, you would have a status field to filter by
            document.getElementById('pendingVerifications').textContent = '0';
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error', 'Failed to load dashboard data', 'error');
        
        // Set default values on error
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('totalParents').textContent = '0';
        document.getElementById('todaysPickups').textContent = '0';
        document.getElementById('pendingVerifications').textContent = '0';
    }
}