document.addEventListener('DOMContentLoaded', async function() {
    const isAdmin = true;

    let tournaments = [];

    // Fetch tournaments from backend
    async function fetchTournaments() {
        try {
            const response = await fetch('http://localhost:5000/tournaments');
            tournaments = await response.json();
            renderTournaments();
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    }

    // Initialize
    await fetchTournaments();

    if (isAdmin) {
        document.getElementById('adminControls').style.display = 'flex';
    }

    setupModal('addTournamentBtn', 'addTournamentModal', 'closeAddModal');

    document.getElementById('closeDetailsModal').addEventListener('click', () => {
        document.getElementById('detailsModal').style.display = 'none';
    });

    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.getElementById('addTournamentModal').style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
        }
    });

    document.getElementById('addTournamentForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const newTournament = {
            name: formData.get('name'),
            date: formatDate(formData.get('date')),
            location: formData.get('location'),
            description: formData.get('description'),
            image: formData.get('image'), // just the filename for now
            badge: "Upcoming"
        };

        try {
            await fetch('http://localhost:5000/tournaments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTournament)
            });

            await fetchTournaments(); // Reload tournaments
            this.reset();
            document.getElementById('addTournamentModal').style.display = 'none';
        } catch (error) {
            console.error('Error adding tournament:', error);
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            e.preventDefault();
            const tournamentId = parseInt(e.target.closest('.tournament-card').dataset.id);
            const tournament = tournaments.find(t => t.id === tournamentId);
            showTournamentDetails(tournament);
        }
    });

    function setupModal(openBtnId, modalId, closeBtnId) {
        const openBtn = document.getElementById(openBtnId);
        const modal = document.getElementById(modalId);
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'block';
            });
        }
    }

    function renderTournaments() {
        const container = document.getElementById('tournamentGrid');
        container.innerHTML = '';

        tournaments.forEach(tournament => {
            const card = document.createElement('div');
            card.className = 'tournament-card';
            card.dataset.id = tournament.id;

            card.innerHTML = `
                <div class="tournament-image">
                    <img src="${tournament.image}" alt="${tournament.name}">
                    <div class="tournament-badge">${tournament.badge}</div>
                </div>
                <div class="tournament-content">
                    <div class="tournament-date">${tournament.date}</div>
                    <h3 class="tournament-title">${tournament.name}</h3>
                    <div class="tournament-location">
                        <i class="fas fa-map-marker-alt"></i> ${tournament.location}
                    </div>
                    <div class="tournament-actions">
                        <a href="#" class="btn btn-secondary view-details-btn">View Details</a>
                        <a href="tournament-register.html" class="btn btn-primary">Register Now</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    function showTournamentDetails(tournament) {
        const detailsContainer = document.getElementById('tournamentDetails');
        detailsContainer.innerHTML = `
            <img src="${tournament.image}" alt="${tournament.name}" style="width:100%; border-radius:8px; margin-bottom:1rem;">
            <h2>${tournament.name}</h2>
            <p><strong>Date:</strong> ${tournament.date}</p>
            <p><strong>Location:</strong> ${tournament.location}</p>
            <p>${tournament.description}</p>
            <div style="margin-top:2rem;">
                <a href="tournament-register.html" class="btn btn-primary">Register Now</a>
            </div>
        `;

        document.getElementById('detailsModal').style.display = 'block';
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
});

