// State
let subjects = [];
let attendanceRecords = [];
let settings = {
    startDate: null // timestamp
};
let extraClasses = {}; // { "DateString": [ { subject, time } ] }

// Default Timetable (Fallback)
let timetable = {
    "Monday": [
        { subject: "BCIDL601", time: "10:00 - 11:00" },
        { subject: "BXXXX656", time: "11:30 - 12:30" },
        { subject: "BCISE603", time: "12:30 - 1:30" },
        { subject: "BCIDO602 (M309)", time: "2:30 - 3:30" }
    ],
    "Tuesday": [
        { subject: "BCIXX614", time: "9:00 - 10:00" },
        { subject: "BXXXX656", time: "10:00 - 11:00" },
        { subject: "BCIDL601", time: "11:30 - 12:30" },
        { subject: "BCIDO602", time: "12:30 - 1:30" },
        { subject: "BCIDL601 (M308)", time: "2:30 - 3:30" }
    ],
    "Wednesday": [
        { subject: "BCISE603", time: "9:00 - 10:00" },
        { subject: "BCIDO602", time: "10:00 - 11:00" },
        { subject: "BCIXX614", time: "11:30 - 12:30" },
        { subject: "BXXXX656", time: "12:30 - 1:30" }
    ],
    "Thursday": [
        { subject: "BCIDL601", time: "10:00 - 11:00" },
        { subject: "BIKSK608", time: "11:30 - 12:30" },
        { subject: "BCIXX614", time: "12:30 - 1:30" },
        { subject: "BCELK656", time: "2:30 - 3:30" }
    ],
    "Friday": [
        { subject: "BCISE603", time: "10:00 - 11:00" },
        { subject: "BCIDO602", time: "11:30 - 12:30" },
        { subject: "BRIPK609", time: "12:30 - 1:30" },
        { subject: "BITTP607", time: "2:30 - 3:30" },
        { subject: "NSS/PE/YOGA", time: "4:30 - 6:30" }
    ],
    "Saturday": [],
    "Sunday": []
};

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    syncSubjectsWithTimetable();

    // Set settings inputs
    if (settings.startDate) {
        document.getElementById('start-date-input').value = new Date(settings.startDate).toISOString().split('T')[0];
    }

    navTo('dashboard');
});

// --- Data Persistence ---
function loadData() {
    const s = localStorage.getItem('checkin_subjects');
    const r = localStorage.getItem('checkin_records');
    const t = localStorage.getItem('checkin_timetable');
    const set = localStorage.getItem('checkin_settings');
    const ex = localStorage.getItem('checkin_extra_classes');

    if (s) subjects = JSON.parse(s);
    if (r) attendanceRecords = JSON.parse(r);
    if (t) timetable = JSON.parse(t);
    if (set) settings = JSON.parse(set);
    if (ex) extraClasses = JSON.parse(ex);


}

function saveData() {
    localStorage.setItem('checkin_subjects', JSON.stringify(subjects));
    localStorage.setItem('checkin_records', JSON.stringify(attendanceRecords));
    localStorage.setItem('checkin_timetable', JSON.stringify(timetable));
    localStorage.setItem('checkin_settings', JSON.stringify(settings));
    localStorage.setItem('checkin_extra_classes', JSON.stringify(extraClasses));
}

function syncSubjectsWithTimetable() {
    // Extract everything from new timetable state
    const allSubjects = new Set();
    Object.values(timetable).forEach(day => {
        day.forEach(slot => allSubjects.add(slot.subject));
    });

    allSubjects.forEach(name => {
        if (!subjects.find(s => s.name === name)) {
            subjects.push({
                id: Date.now() + Math.random(),
                name: name,
                minAttendance: settings.minAttendance || 75
            });
        }
    });
    saveData();
}

// --- Settings Logic ---
function updateStartDate(val) {
    settings.startDate = val;
    saveData();
    renderDashboard();
}

function updateMinAttendance(val) {
    const min = parseInt(val);
    settings.minAttendance = min;
    document.getElementById('min-attendance-display').innerText = min + '%';

    // Update ALL subjects
    subjects.forEach(s => s.minAttendance = min);
    saveData();

    // If on dashboard, re-render to show new bunk/attend stats
    if (document.getElementById('dashboard').classList.contains('active')) {
        renderDashboard();
    }
}

function clearData() {
    if (confirm("Reset ALL data? This cannot be undone.")) {
        localStorage.clear();
        location.reload();
    }
}

// --- Subject Management Logic ---
function openSubjectManager() {
    renderSubjectManager();
    document.getElementById('manage-subjects-modal').classList.add('active');
}

function closeSubjectManager() {
    document.getElementById('manage-subjects-modal').classList.remove('active');
    renderDashboard(); // Update stats in case subject names changed/deleted affect anything
}

function renderSubjectManager() {
    const list = document.getElementById('subjects-list');
    list.innerHTML = '';

    if (subjects.length === 0) {
        list.innerHTML = '<div style="text-align:center; color:#888; padding:20px;">No subjects added</div>';
        return;
    }

    subjects.forEach((s, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '12px';
        item.style.borderBottom = '1px solid #eee';

        item.innerHTML = `
            <span style="font-weight:900; font-size:16px;">${s.name}</span>
            <button onclick="deleteSubjectById(${s.id})" style="background:var(--nb-red); border:2px solid black; color:white; font-weight:bold; padding:4px 8px; font-size:12px; cursor:pointer;">X</button>
        `;
        list.appendChild(item);
    });
}

function addNewSubject() {
    const input = document.getElementById('new-subject-name');
    const name = input.value.trim();
    if (!name) return;

    // Check duplicate
    if (subjects.find(s => s.name.toUpperCase() === name.toUpperCase())) {
        alert("Subject already exists!");
        return;
    }

    subjects.push({
        id: Date.now(),
        name: name,
        minAttendance: settings.minAttendance || 75
    });

    saveData();
    input.value = '';
    renderSubjectManager();
}

function deleteSubjectById(id) {
    subjects = subjects.filter(s => s.id !== id);
    saveData();
    renderSubjectManager();
}

function saveSettings() {
    const dateInput = document.getElementById('start-date-input').value;
    if (dateInput) {
        settings.startDate = new Date(dateInput).getTime();
    } else {
        settings.startDate = null;
    }
    saveData();
    alert("Settings Saved");
    renderDashboard(); // Refresh stats
}

function clearData() {
    if (confirm("Reset all data? This cannot be undone.")) {
        localStorage.clear();
        location.reload();
    }
}

// --- Navigation ---
function navTo(pageId) {
    // Hide overlays
    document.getElementById('add-class-modal').classList.remove('active');
    document.getElementById('detail-view').classList.remove('active');

    // Hide pages
    document.querySelectorAll('.page').forEach(p => {
        if (p.id !== 'detail-view') p.classList.remove('active');
    });

    // Show target
    document.getElementById(pageId).classList.add('active');

    // Nav State
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(`tab-${pageId}`);
    if (tab) tab.classList.add('active');

    // Render
    if (pageId === 'dashboard') renderDashboard();
    if (pageId === 'timetable') renderTimetable();

    // FAB Logic
    const fab = document.querySelector('.fab-corner');
    // Show FAB on Timetable page to add Classes
    if (pageId === 'timetable') {
        fab.style.display = 'flex';
        fab.onclick = () => openAddClassModal();
    } else {
        fab.style.display = 'none';
    }
}

function openAddClassModal() {
    const modal = document.getElementById('add-class-modal');
    const select = document.getElementById('class-subject');
    select.innerHTML = '';

    if (subjects.length === 0) {
        const opt = document.createElement('option');
        opt.innerText = "No Subjects - Add in Settings";
        select.appendChild(opt);
    } else {
        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.innerText = s.name;
            select.appendChild(opt);
        });
    }
    modal.classList.add('active');
}

function closeAddClassModal() {
    document.getElementById('add-class-modal').classList.remove('active');
}

function closeDetail() {
    document.getElementById('detail-view').classList.remove('active');
    renderDashboard();
}

// --- Extra Class Logic ---
function openAddExtraClassModal() {
    const modal = document.getElementById('add-extra-class-modal');
    const select = document.getElementById('extra-class-subject');

    // Populate subjects
    select.innerHTML = '';
    subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.innerText = s.name;
        select.appendChild(opt);
    });

    modal.classList.add('active');
}

function closeAddExtraClassModal() {
    document.getElementById('add-extra-class-modal').classList.remove('active');
}

function saveExtraClass() {
    const name = document.getElementById('extra-class-subject').value;
    if (!name) return;

    const todayKey = new Date().toDateString();

    if (!extraClasses[todayKey]) extraClasses[todayKey] = [];

    extraClasses[todayKey].push({
        id: Date.now(),
        subject: name,
        time: "EXTRA"
    });

    saveData();
    closeAddExtraClassModal();
    renderDashboard();
}

function deleteExtraClass(e, id) {
    if (e) e.stopPropagation();
    if (e) e.stopPropagation();
    if (navigator.vibrate) navigator.vibrate(50);


    const todayKey = new Date().toDateString();
    if (extraClasses[todayKey]) {
        extraClasses[todayKey] = extraClasses[todayKey].filter(c => c.id !== id);
        saveData();
        renderDashboard();
    }
}

// --- Timetable Logic ---
function saveClass() {
    const day = document.getElementById('class-day').value;
    const name = document.getElementById('class-subject').value;
    const time = document.getElementById('class-time').value;

    if (!name || !time) return alert("Please fill all fields");

    if (!timetable[day]) timetable[day] = [];
    timetable[day].push({ subject: name, time: time });

    // Sort logic could go here, but simple append is fine for now

    syncSubjectsWithTimetable(); // Ensure subject exists in DB
    saveData();

    // Clear & Close
    document.getElementById('class-subject').value = '';
    document.getElementById('class-time').value = '';
    closeAddClassModal();
    renderTimetable();
}

function deleteClass(day, index) {
    timetable[day].splice(index, 1);
    saveData();
    renderTimetable();
}

// --- Stats Logic ---
function calculateStats(subjectName) {
    const subject = subjects.find(s => s.name === subjectName);
    if (!subject) return { present: 0, total: 0, percent: 0, bunkText: '', minAttendance: 75, id: null };

    // FILTER RECORDS BY START DATE
    let records = attendanceRecords.filter(r => r.subjectId === subject.id);

    if (settings.startDate) {
        records = records.filter(r => r.timestamp >= settings.startDate);
    }

    const present = records.filter(r => r.status === 'PRESENT').length;
    const total = records.filter(r => r.status !== 'CANCELLED').length;
    let percent = total === 0 ? 0 : (present / total) * 100;

    const min = subject.minAttendance;
    let bunkText = "";

    if (total === 0) bunkText = "NO DATA";
    else if (percent >= min) {
        const canBunk = Math.floor((present / (min / 100)) - total);
        bunkText = `CAN BUNK: ${canBunk}`;
    } else {
        const numerator = (min / 100) * total - present;
        const denominator = 1 - (min / 100);
        const need = Math.ceil(numerator / denominator);
        bunkText = `NEED TO ATTEND: ${need}`;
    }
    return { present, total, percent, bunkText, minAttendance: min, id: subject.id };
}

// --- Renderers ---
function renderDashboard() {
    const list = document.getElementById('dashboard-list');
    list.innerHTML = '';

    const date = new Date();
    const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    const dateHeader = document.createElement('div');
    dateHeader.style.marginBottom = '20px';
    dateHeader.innerHTML = `
        <div style="font-weight:900; text-transform:uppercase; font-size:14px; color:#666">TODAY</div>
        <div style="font-weight:900; font-size:24px; text-transform:uppercase; line-height:1.1">${dateString}</div>
    `;
    list.appendChild(dateHeader);

    // Show Start Date Warning if active
    if (settings.startDate) {
        const sd = new Date(settings.startDate).toLocaleDateString();
        const info = document.createElement('div');
        info.innerHTML = `Stats from: <span style="font-weight:bold">${sd}</span>`;
        info.style.fontSize = '12px';
        info.style.marginBottom = '16px';
        info.style.color = 'var(--nb-blue)';
        info.style.fontWeight = 'bold';
        list.appendChild(info);
    }

    let classes = timetable[dayName] || [];

    // Merge with Extra Classes
    const todayKey = date.toDateString();
    if (extraClasses[todayKey]) {
        classes = classes.concat(extraClasses[todayKey]);
    }

    if (classes.length === 0) {
        list.innerHTML += `
            <div style="text-align:center; padding:40px; border:3px dashed black; border-radius:12px;">
                <h2 style="margin:0; font-weight:900;">NO CLASSES</h2>
                <p>Enjoy your day off!</p>
            </div>
        `;
        // return; // Removed return to allow date header to show
    }

    classes.forEach(cls => {
        const stats = calculateStats(cls.subject);
        const card = document.createElement('div');
        card.className = 'mono-card';
        card.innerHTML = `
            ${cls.time === 'EXTRA' ?
                `<button class="delete-btn" onclick="deleteExtraClass(event, ${cls.id})">X</button>`
                : ''}
            <div style="position:absolute; top:-10px; right:10px; background:black; color:white; padding:4px 8px; font-weight:700; font-size:12px; transform:rotate(2deg)">
                ${cls.time}
            </div>
            <div class="subject-row" style="margin-top:10px">
                <span class="subject-name">${cls.subject}</span>
            </div>
            
            <div class="prediction-box" style="background:${stats.percent >= stats.minAttendance ? 'var(--nb-green)' : 'var(--nb-red)'}">
                ${stats.bunkText}
            </div>
            
            <div class="progress-container">
                <div class="progress-fill ${stats.percent >= stats.minAttendance ? 'progress-good' : 'progress-bad'}" style="width:${stats.percent}%"></div>
            </div>
            <div style="text-align:right; font-size:12px; font-weight:700; margin-top:4px">${stats.percent.toFixed(1)}% (${stats.present}/${stats.total})</div>

            <div class="action-bar" style="border-top: 3px solid black; padding-top: 16px;">
                <button class="mono-btn-small btn-present" onclick="quickMark(event, ${stats.id}, 'PRESENT')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <button class="mono-btn-small btn-absent" onclick="quickMark(event, ${stats.id}, 'ABSENT')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <button class="mono-btn-small btn-cancel" onclick="quickMark(event, ${stats.id}, 'CANCELLED')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                </button>
            </div>
        `;

        list.appendChild(card);
    });
}

function renderTimetable() {
    const list = document.getElementById('timetable-list');
    list.innerHTML = '';

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    days.forEach(day => {
        const classes = timetable[day] || [];
        const dayBlock = document.createElement('div');
        dayBlock.style.marginBottom = '24px';

        let rows = '';
        classes.forEach((c, index) => {
            rows += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #ddd; font-weight:700;">
                    <div>
                        <div style="font-size:16px">${c.subject}</div>
                        <div style="font-size:12px; color:#666">${c.time}</div>
                    </div>
                    <button onclick="deleteClass('${day}', ${index})" style="background:var(--nb-red); border:2px solid black; color:white; font-weight:bold; padding:4px 8px; font-size:12px;">X</button>
                </div>
            `;
        });

        dayBlock.innerHTML = `
            <h3 style="background:black; color:white; padding:8px; margin:0; font-weight:900; text-transform:uppercase;">${day}</h3>
            <div style="border:3px solid black; border-top:none; background:white; padding:12px;">
                ${rows || '<div style="color:#999; font-size:14px">No classes</div>'}
            </div>
        `;
        list.appendChild(dayBlock);
    });
}

// ... (Detail View logic remains same, mostly)
function openDetail(id) {
    if (!id) return;
    const s = subjects.find(Sub => Sub.id === id);
    if (!s) return;

    document.getElementById('detail-title').innerText = s.name.toUpperCase();
    document.getElementById('detail-view').classList.add('active');

    window.currentDetailId = id;
    updateDetailUI(id);
}

function updateDetailUI(id) {
    const s = subjects.find(Sub => Sub.id === id);
    const stats = calculateStats(s.name); // Uses Date Filter internally

    document.getElementById('detail-percent').innerText = `${stats.percent.toFixed(1)}%`;
    document.getElementById('detail-prediction').innerText = stats.bunkText;
    document.getElementById('detail-prediction').style.background = stats.percent >= s.minAttendance ? 'var(--nb-green)' : 'var(--nb-red)';

    renderHistory(id);
}

function quickMark(e, id, status) {
    if (e) e.stopPropagation();
    markAttendanceForId(id, status);
}

function markAttendance(status) {
    if (window.currentDetailId) markAttendanceForId(window.currentDetailId, status);
}

function markAttendanceForId(id, status) {
    attendanceRecords.unshift({
        id: Date.now(),
        subjectId: id,
        timestamp: Date.now(),
        status: status
    });
    saveData();
    renderDashboard();
    if (document.getElementById('detail-view').classList.contains('active')) {
        updateDetailUI(id);
    }
}

function renderHistory(id) {
    const list = document.getElementById('history-list');
    list.innerHTML = '';

    // Filter by Subject AND Date
    let records = attendanceRecords.filter(r => r.subjectId === id);
    if (settings.startDate) {
        records = records.filter(r => r.timestamp >= settings.startDate);
    }

    if (records.length === 0) {
        list.innerHTML = '<div style="color:#999;font-family:monospace">NO HISTORY</div>';
        return;
    }

    records.forEach(r => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.padding = '12px 0';
        item.style.borderBottom = '1px solid #eee';

        const date = new Date(r.timestamp).toLocaleDateString();
        item.innerHTML = `
            <span style="font-family:monospace">${date}</span>
            <span style="font-weight:700">${r.status}</span>
        `;
        list.appendChild(item);
    });
}
