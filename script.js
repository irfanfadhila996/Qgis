// ===== DATA SAMPLE AWAL =====
const initialData = [
    {
        nama: "RSUD Dr Rehatta",
        jenis: "Rumah Sakit",
        lat: -6.50203,
        lng: 110.90746,
        alamat: "Jl. Jepara - Pati, Jepara"
    },
    {
        nama: "RSUD Kelet",
        jenis: "Rumah Sakit",
        lat: -6.50233,
        lng: 110.90758,
        alamat: "Jl. Raya Kelet-Jepara No.KM 33, Kec. Keling, Jepara"
    },
    {
        nama: "RSUD R.A. Kartini",
        jenis: "Rumah Sakit",
        lat: -6.605673,
        lng: 110.682005,
        alamat: "Jl. KH. Wahid Hasyim, Jepara"
    },
    {
        nama: "RS Graha Husada",
        jenis: "Rumah Sakit",
        lat: -6.593192,
        lng: 110.670141,
        alamat: "Jl. MH Thamrin No.14, Jepara"
    },
    {
        nama: "Puskesmas Bangsri I",
        jenis: "Puskesmas",
        lat: -6.5935,
        lng: 110.7434,
        alamat: "Kecamatan Bangsri, Jepara"
    }
];

// ===== GLOBAL VARIABLES =====
let map;
let markers = [];
let layerGroups = {
    'Rumah Sakit': L.layerGroup(),
    'Puskesmas': L.layerGroup(),
    'Klinik': L.layerGroup()
};
let facilities = [];
let isPickingLocation = false;
let tempMarker = null;

// ===== ICON DEFINITIONS =====
const icons = {
    'Rumah Sakit': L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #dc2626; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    }),
    'Puskesmas': L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #16a34a; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    }),
    'Klinik': L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    })
};

// ===== INITIALIZE APP =====
function initApp() {
    // Load data from localStorage or use initial data
    const savedData = localStorage.getItem('fasilitasKesehatan');
    if (savedData) {
        facilities = JSON.parse(savedData);
    } else {
        facilities = [...initialData];
        saveToLocalStorage();
    }

    // Initialize map
    initMap();
    
    // Load markers
    loadMarkers();
    
    // Update UI
    updateStatistics();
    updateFacilityList();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// ===== INITIALIZE MAP =====
function initMap() {
    // Create map centered on Jepara
    map = L.map('map').setView([-6.5889, 110.6684], 11);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add layer groups to map
    Object.values(layerGroups).forEach(layer => layer.addTo(map));
    
    // Add layer control
    L.control.layers(null, {
        'Rumah Sakit': layerGroups['Rumah Sakit'],
        'Puskesmas': layerGroups['Puskesmas'],
        'Klinik': layerGroups['Klinik']
    }, { position: 'topleft' }).addTo(map);
    
    // Map click event for picking location
    map.on('click', function(e) {
        if (isPickingLocation) {
            const { lat, lng } = e.latlng;
            document.getElementById('latitude').value = lat.toFixed(6);
            document.getElementById('longitude').value = lng.toFixed(6);
            
            // Remove temp marker if exists
            if (tempMarker) {
                map.removeLayer(tempMarker);
            }
            
            // Add temp marker
            tempMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'temp-marker',
                    html: '<div style="background-color: #f59e0b; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(map);
            
            isPickingLocation = false;
            document.getElementById('pickLocationBtn').textContent = '📍 Pilih dari Peta';
            document.getElementById('pickLocationBtn').style.background = '';
        }
    });
}

// ===== LOAD MARKERS =====
function loadMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];
    Object.values(layerGroups).forEach(layer => layer.clearLayers());
    
    // Add markers for each facility
    facilities.forEach((facility, index) => {
        const marker = L.marker([facility.lat, facility.lng], {
            icon: icons[facility.jenis]
        });
        
        // Create popup content
        const popupContent = createPopupContent(facility, index);
        marker.bindPopup(popupContent);
        
        // Add to appropriate layer group
        marker.addTo(layerGroups[facility.jenis]);
        markers.push(marker);
    });
}

// ===== CREATE POPUP CONTENT =====
function createPopupContent(facility, index) {
    const typeClass = facility.jenis.toLowerCase().replace(' ', '-');
    const typeShort = facility.jenis === 'Rumah Sakit' ? 'rs' : 
                      facility.jenis === 'Puskesmas' ? 'puskesmas' : 'klinik';
    
    return `
        <div class="popup-content">
            <h3>${facility.nama}</h3>
            <span class="popup-type ${typeShort}">${facility.jenis}</span>
            <p>📍 ${facility.alamat}</p>
            <p>📌 ${facility.lat.toFixed(6)}, ${facility.lng.toFixed(6)}</p>
            <div class="popup-actions">
                <button class="btn-edit" onclick="editFacility(${index})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteFacility(${index})">🗑️ Hapus</button>
            </div>
        </div>
    `;
}

// ===== UPDATE STATISTICS =====
function updateStatistics() {
    const stats = {
        'Rumah Sakit': 0,
        'Puskesmas': 0,
        'Klinik': 0
    };
    
    facilities.forEach(facility => {
        stats[facility.jenis]++;
    });
    
    document.getElementById('statRS').textContent = stats['Rumah Sakit'];
    document.getElementById('statPuskesmas').textContent = stats['Puskesmas'];
    document.getElementById('statKlinik').textContent = stats['Klinik'];
}

// ===== UPDATE FACILITY LIST =====
function updateFacilityList() {
    const listContainer = document.getElementById('facilityList');
    listContainer.innerHTML = '';
    
    if (facilities.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Belum ada data fasilitas</p>';
        return;
    }
    
    facilities.forEach((facility, index) => {
        const typeClass = facility.jenis === 'Rumah Sakit' ? 'rs' : 
                          facility.jenis === 'Puskesmas' ? 'puskesmas' : 'klinik';
        
        const item = document.createElement('div');
        item.className = `facility-item ${typeClass}`;
        item.innerHTML = `
            <h4>${facility.nama}</h4>
            <div class="facility-type">${facility.jenis}</div>
            <div class="facility-address">${facility.alamat}</div>
            <div class="facility-actions">
                <button class="btn-small btn-zoom" onclick="zoomToFacility(${index})">🔍 Zoom</button>
                <button class="btn-small btn-edit" onclick="editFacility(${index})">✏️ Edit</button>
                <button class="btn-small btn-delete" onclick="deleteFacility(${index})">🗑️</button>
            </div>
        `;
        
        listContainer.appendChild(item);
    });
}

// ===== ZOOM TO FACILITY =====
function zoomToFacility(index) {
    const facility = facilities[index];
    map.setView([facility.lat, facility.lng], 16);
    markers[index].openPopup();
}

// ===== ADD FACILITY =====
function addFacility(e) {
    e.preventDefault();
    
    const newFacility = {
        nama: document.getElementById('namaFasilitas').value,
        jenis: document.getElementById('jenisFasilitas').value,
        lat: parseFloat(document.getElementById('latitude').value),
        lng: parseFloat(document.getElementById('longitude').value),
        alamat: document.getElementById('alamat').value
    };
    
    facilities.push(newFacility);
    saveToLocalStorage();
    
    // Reset form
    document.getElementById('addLocationForm').reset();
    
    // Remove temp marker
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
    
    // Reload markers and update UI
    loadMarkers();
    updateStatistics();
    updateFacilityList();
    
    // Zoom to new facility
    map.setView([newFacility.lat, newFacility.lng], 15);
    
    // Show success message
    alert('✅ Fasilitas berhasil ditambahkan!');
}

// ===== EDIT FACILITY =====
function editFacility(index) {
    const facility = facilities[index];
    
    // Fill edit form
    document.getElementById('editIndex').value = index;
    document.getElementById('editNama').value = facility.nama;
    document.getElementById('editJenis').value = facility.jenis;
    document.getElementById('editLat').value = facility.lat;
    document.getElementById('editLng').value = facility.lng;
    document.getElementById('editAlamat').value = facility.alamat;
    
    // Show modal
    document.getElementById('editModal').classList.add('active');
}

// ===== UPDATE FACILITY =====
function updateFacility(e) {
    e.preventDefault();
    
    const index = parseInt(document.getElementById('editIndex').value);
    
    facilities[index] = {
        nama: document.getElementById('editNama').value,
        jenis: document.getElementById('editJenis').value,
        lat: parseFloat(document.getElementById('editLat').value),
        lng: parseFloat(document.getElementById('editLng').value),
        alamat: document.getElementById('editAlamat').value
    };
    
    saveToLocalStorage();
    loadMarkers();
    updateStatistics();
    updateFacilityList();
    
    // Close modal
    document.getElementById('editModal').classList.remove('active');
    
    alert('✅ Fasilitas berhasil diupdate!');
}

// ===== DELETE FACILITY =====
function deleteFacility(index) {
    if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
        facilities.splice(index, 1);
        saveToLocalStorage();
        loadMarkers();
        updateStatistics();
        updateFacilityList();
        
        // Close modal if open
        document.getElementById('editModal').classList.remove('active');
        
        alert('✅ Fasilitas berhasil dihapus!');
    }
}

// ===== SEARCH FACILITY =====
function searchFacility(query) {
    const items = document.querySelectorAll('.facility-item');
    const lowerQuery = query.toLowerCase();
    
    items.forEach((item, index) => {
        const facility = facilities[index];
        const matchName = facility.nama.toLowerCase().includes(lowerQuery);
        const matchType = facility.jenis.toLowerCase().includes(lowerQuery);
        const matchAddress = facility.alamat.toLowerCase().includes(lowerQuery);
        
        if (matchName || matchType || matchAddress) {
            item.style.display = 'block';
            if (query.length > 0) {
                item.classList.add('highlight');
            } else {
                item.classList.remove('highlight');
            }
        } else {
            item.style.display = 'none';
            item.classList.remove('highlight');
        }
    });
}

// ===== MY LOCATION =====
function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 14);
                
                // Add temporary marker
                L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        className: 'my-location-marker',
                        html: '<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
                        iconSize: [15, 15],
                        iconAnchor: [7.5, 7.5]
                    })
                }).addTo(map).bindPopup('📍 Lokasi Anda').openPopup();
            },
            (error) => {
                alert('❌ Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.');
            }
        );
    } else {
        alert('❌ Browser Anda tidak mendukung Geolocation.');
    }
}

// ===== EXPORT DATA =====
function exportData() {
    const dataStr = JSON.stringify(facilities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faskes-jepara-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Data berhasil diexport!');
}

// ===== TOGGLE DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update button emoji
    document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
}

// ===== SAVE TO LOCAL STORAGE =====
function saveToLocalStorage() {
    localStorage.setItem('fasilitasKesehatan', JSON.stringify(facilities));
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Add location form
    document.getElementById('addLocationForm').addEventListener('submit', addFacility);
    
    // Edit location form
    document.getElementById('editLocationForm').addEventListener('submit', updateFacility);
    
    // Delete button in modal
    document.getElementById('deleteBtn').addEventListener('click', function() {
        const index = parseInt(document.getElementById('editIndex').value);
        deleteFacility(index);
    });
    
    // Close modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('editModal').classList.remove('active');
    });
    
    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Pick location button
    document.getElementById('pickLocationBtn').addEventListener('click', function() {
        isPickingLocation = !isPickingLocation;
        if (isPickingLocation) {
            this.textContent = '❌ Batal Pilih';
            this.style.background = '#ef4444';
            this.style.color = 'white';
            alert('📍 Klik pada peta untuk memilih lokasi');
        } else {
            this.textContent = '📍 Pilih dari Peta';
            this.style.background = '';
            this.style.color = '';
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }
        }
    });
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchFacility(e.target.value);
    });
    
    // My location button
    document.getElementById('myLocationBtn').addEventListener('click', getMyLocation);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', initApp);
