class SpotifyPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.volume = 1;
        
        this.songs = [
            {
                title: 'Ishq sufiyan',
    artist: 'Nursat Ali',
    src: 'https://dl.prokerala.com/downloads/ringtones/files/mp3/https-bestringtones-net-music-ishq-sufiyana-ringtone-61652.mp3',
                    },
                    {
                        title: 'Ishq',
    artist: 'Mitraz',
    src: 'https://pagalfree.com/musics/128-Sanam%20Re%20-%20Sanam%20Re%20128%20Kbps.mp3',
                    },
                    {
                        title: 'Madhubala',
    artist: 'Amit Trivedi',
    src: 'https://djpunjab.com.se/upload_file/419/571/Madhubala_Amit_Trivedi.mp3',
                    },
                    {
                        title: "Suniyan Suniyan",
                        artist: "Juss",
                        src: "https://www.ringtoneviral.com/wp-content/uploads/2024/08/Suniya-Suniya-Raatan-Ringtone.mp3" 
                    },
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.renderPlaylist();
        this.loadSong(0);
    }

    initializeElements() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.volumeBar = document.getElementById('volumeBar');
        this.volumeFill = document.getElementById('volumeFill');
        this.playlistItems = document.getElementById('playlistItems');
    }

    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        this.progressBar.addEventListener('click', (e) => this.seekAudio(e));
        this.volumeBar.addEventListener('click', (e) => this.setVolume(e));
        
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateTotalTime());
    }

    loadSong(index) {
        if (index >= 0 && index < this.songs.length) {
            this.currentSongIndex = index;
            const song = this.songs[index];
            
            this.songTitle.textContent = song.title;
            this.songArtist.textContent = song.artist;
            this.audioPlayer.src = song.src;
            
            this.updatePlaylistUI();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audioPlayer.play();
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '⏸';
        this.updatePlaylistUI();
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '▶';
        this.updatePlaylistUI();
    }

    previousSong() {
        let newIndex = this.currentSongIndex - 1;
        if (newIndex < 0) newIndex = this.songs.length - 1;
        
        this.loadSong(newIndex);
        if (this.isPlaying) this.play();
    }

    nextSong() {
        let newIndex = this.currentSongIndex + 1;
        if (newIndex >= this.songs.length) newIndex = 0;
        
        this.loadSong(newIndex);
        if (this.isPlaying) this.play();
    }

    seekAudio(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        if (this.audioPlayer.duration) {
            this.audioPlayer.currentTime = percentage * this.audioPlayer.duration;
        }
    }

    setVolume(e) {
        const rect = this.volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        this.volume = Math.max(0, Math.min(1, percentage));
        this.audioPlayer.volume = this.volume;
        this.volumeFill.style.width = (this.volume * 100) + '%';
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressFill.style.width = percentage + '%';
            
            this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }

    updateTotalTime() {
        if (this.audioPlayer.duration) {
            this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    renderPlaylist() {
        this.playlistItems.innerHTML = '';
        
        this.songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-item-number">${index + 1}</div>
                <div class="playing-indicator">
                    <div class="wave">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.loadSong(index);
                this.play();
            });
            
            this.playlistItems.appendChild(item);
        });
    }

    updatePlaylistUI() {
        const items = this.playlistItems.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.remove('active', 'playing');
            if (index === this.currentSongIndex) {
                item.classList.add('active');
                if (this.isPlaying) {
                    item.classList.add('playing');
                }
            }
        });

        // Update the container class for wave animation
        const container = document.querySelector('.player-container');
        if (this.isPlaying) {
            container.classList.remove('paused');
        } else {
            container.classList.add('paused');
        }
    }
}

// Initialize the player when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotifyPlayer();
});