document.addEventListener('DOMContentLoaded', function () {
    // Example user data
    const users = [
        { id: '1', name: 'John Doe', network: '4G', usage: '20GB' },
        { id: '2', name: 'Jane Smith', network: '5G', usage: '30GB' },
        // Add more users as needed
    ];

    const searchForm = document.getElementById('search-form');
    const userInfoDiv = document.getElementById('user-info');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const userId = document.getElementById('user-id').value;
            const user = users.find(user => user.id === userId);

            if (user) {
                userInfoDiv.innerHTML = `
                    <div class="card mt-3">
                        <div class="card-body">
                            <h5 class="card-title">${user.name}</h5>
                            <p class="card-text">Network: ${user.network}</p>
                            <p class="card-text">Usage: ${user.usage}</p>
                        </div>
                    </div>
                `;
            } else {
                userInfoDiv.innerHTML = '<p>User not found</p>';
            }
        });
    }

    // Chart.js example for Data Visualization
    const chartContainer = document.getElementById('chart-container');

    if (chartContainer) {
        const ctx = document.createElement('canvas');
        chartContainer.appendChild(ctx);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['1G', '2G', '3G', '4G', '5G'],
                datasets: [{
                    label: 'Network Distribution',
                    data: [10, 20, 30, 25, 15],
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0']
                }]
            },
            options: {
                responsive: true
            }
        });
    }
});
