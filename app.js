document.addEventListener('DOMContentLoaded', () => {
    const exercises = {
        petto: ['Panca piana', 'Panca inclinata', 'Croci', 'Dip'],
        gambe: ['Squat', 'Affondi', 'Leg press', 'Stacchi rumeni'],
        spalle: ['Military press', 'Alzate laterali', 'Arnold press', 'Face pull'],
        schiena: ['Trazioni', 'Rematore', 'Pulldown', 'Hyperextension'],
        bicipiti: ['Curl con bilanciere', 'Curl a martello', 'Curl concentrato', 'Preacher curl'],
        tricipiti: ['Push down', 'French press', 'Dip', 'Kickback']
    };

    const storage = localStorage.getItem('fitnessData');
    let fitnessData = storage ? JSON.parse(storage) : {};

    // Inizializza le sezioni
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.nav-btn.active').classList.remove('active');
            btn.classList.add('active');
            showSection(btn.dataset.section);
        });
    });

    function showSection(section) {
        document.querySelectorAll('.exercise-section').forEach(sec => sec.remove());
        
        const container = document.createElement('div');
        container.className = 'exercise-section active';
        
        exercises[section].forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <h3>${exercise}</h3>
                <div class="input-group">
                    <input type="number" placeholder="Peso (kg)" id="${section}-${exercise}-weight">
                    <input type="number" placeholder="Ripetizioni" id="${section}-${exercise}-reps">
                </div>
                <div class="chart-container">
                    <canvas id="${section}-${exercise}-chart"></canvas>
                </div>
                <div class="history-log" id="${section}-${exercise}-history"></div>
            `;
            
            const weightInput = card.querySelector('input[type="number"]:first-of-type');
            const repsInput = card.querySelector('input[type="number"]:last-of-type');
            
            [weightInput, repsInput].forEach(input => {
                input.addEventListener('change', () => saveData(section, exercise));
            });

            container.appendChild(card);
            initChart(section, exercise);
            loadHistory(section, exercise);
        });

        document.getElementById('content').appendChild(container);
    }

    function saveData(section, exercise) {
        const weight = document.getElementById(`${section}-${exercise}-weight`).value;
        const reps = document.getElementById(`${section}-${exercise}-reps`).value;
        
        if(!weight || !reps) return;

        const date = new Date().toISOString().split('T')[0];
        
        if(!fitnessData[section]) fitnessData[section] = {};
        if(!fitnessData[section][exercise]) fitnessData[section][exercise] = [];
        
        fitnessData[section][exercise].push({
            date,
            weight: parseFloat(weight),
            reps: parseInt(reps)
        });

        localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
        initChart(section, exercise);
        loadHistory(section, exercise);
    }

    function initChart(section, exercise) {
        const ctx = document.getElementById(`${section}-${exercise}-chart`);
        const data = fitnessData[section]?.[exercise] || [];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(entry => entry.date),
                datasets: [{
                    label: 'Peso (kg)',
                    data: data.map(entry => entry.weight),
                    borderColor: '#00ff88',
                    tension: 0.4
                }]
            }
        });
    }

    function loadHistory(section, exercise) {
        const history = document.getElementById(`${section}-${exercise}-history`);
        const data = fitnessData[section]?.[exercise] || [];
        
        history.innerHTML = data.map(entry => `
            <div>${entry.date}: ${entry.weight}kg × ${entry.reps} reps</div>
        `).join('');
    }

    // Mostra la prima sezione all'avvio
    showSection('petto');
});
