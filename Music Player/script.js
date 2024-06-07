
document.addEventListener("DOMContentLoaded", () => {
    const playlist = [
        { title: "Kabira (Yeh Jawaani Hai Deewani) ", src: "assets/Kabira Yeh Jawaani Hai Deewani 320 Kbps.mp3", img: "assets/Kabira (Yeh-Jawaani-Hai-Deewani).jpg", category: "Pop" },
        { title: "Sooraj Dooba Hain (Roy)", src: "assets/Kabira Yeh Jawaani Hai Deewani 320 Kbps.mp3", img: "assets/Sooraj Dooba Hain (Roy).jpg", category: "Rock" },
        { title: "Sau Tarah Ke (Dishoom)", src: "assets/Kabira Yeh Jawaani Hai Deewani 320 Kbps.mp3", img: "assets/Sau Tarah Ke.jpeg", category: "Jazz" },
    ];

    const categories = ["All", "Pop", "Rock", "Jazz"];
    let currentTrackIndex = 0;
    const audio = new Audio(playlist[currentTrackIndex].src);

    const playlistElement = document.getElementById("playlist");
    const nowPlayingElement = document.getElementById("now-playing");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const volumeSlider = document.getElementById("volume-slider");
    const muteIcon = document.getElementById("mute-icon");
    const unmuteIcon = document.getElementById("unmute-icon");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const categoriesElement = document.getElementById("categories");
    const currentTimeElement = document.getElementById("current-time");
    const totalTimeElement = document.getElementById("total-time");
    const seekSlider = document.getElementById("seek-slider");
    const trackImage = document.getElementById("track-image");

    const loadPlaylist = (playlist) => {
        playlistElement.innerHTML = "";
        playlist.forEach((track, index) => {
            const li = document.createElement("li");
            li.textContent = track.title;
            li.addEventListener("click", () => {
                currentTrackIndex = index;
                audio.src = track.src;
                playAudio();
                trackImage.src = track.img;
            });
            playlistElement.appendChild(li);
        });
        highlightCurrentTrack();
    };

    const loadCategories = (categories) => {
        categoriesElement.innerHTML = "";
        categories.forEach((category) => {
            const li = document.createElement("li");
            li.textContent = category;
            li.addEventListener("click", () => filterPlaylistByCategory(category));
            categoriesElement.appendChild(li);
        });
    };

    const filterPlaylistByCategory = (category) => {
        const filteredPlaylist = category === "All"
            ? playlist
            : playlist.filter(track => track.category === category);
        loadPlaylist(filteredPlaylist);
    };

    const updateNowPlaying = () => {
        nowPlayingElement.textContent = `Now playing: ${playlist[currentTrackIndex].title}`;
        trackImage.src = playlist[currentTrackIndex].img;
    };

    const updateTiming = () => {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };
        currentTimeElement.textContent = formatTime(audio.currentTime);
        totalTimeElement.textContent = formatTime(audio.duration);
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
    };

    const playAudio = () => {
        audio.play();
        updateNowPlaying();
        playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
        highlightCurrentTrack();
    };

    const pauseAudio = () => {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="ri-play-fill"></i>';
    };

    const highlightCurrentTrack = () => {
        const tracks = playlistElement.getElementsByTagName("li");
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].classList.remove("active");
        }
        tracks[currentTrackIndex].classList.add("active");
    };

    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    prevBtn.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        audio.src = playlist[currentTrackIndex].src;
        playAudio();
        trackImage.src = playlist[currentTrackIndex].img;
    });

    nextBtn.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        audio.src = playlist[currentTrackIndex].src;
        playAudio();
        trackImage.src = playlist[currentTrackIndex].img;
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
        if (audio.volume === 0) {
            muteIcon.style.display = "block";
            unmuteIcon.style.display = "none";
        } else {
            muteIcon.style.display = "none";
            unmuteIcon.style.display = "block";
        }
    });

    muteIcon.addEventListener("click", () => {
        audio.volume = 1;
        volumeSlider.value = 1;
        muteIcon.style.display = "none";
        unmuteIcon.style.display = "block";
    });

    unmuteIcon.addEventListener("click", () => {
        audio.volume = 0;
        volumeSlider.value = 0;
        muteIcon.style.display = "block";
        unmuteIcon.style.display = "none";
    });

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const filteredPlaylist = playlist.filter(track =>
            track.title.toLowerCase().includes(query)
        );
        loadPlaylist(filteredPlaylist);
    });

    seekSlider.addEventListener("input", () => {
        const seekTo = audio.duration * (seekSlider.value / 100);
        audio.currentTime = seekTo;
    });

    audio.addEventListener("timeupdate", updateTiming);

    audio.addEventListener("ended", () => {
        nextBtn.click();
    });

    // Load the initial categories and playlist
    loadCategories(categories);
    loadPlaylist(playlist);
    updateNowPlaying();
    highlightCurrentTrack();
});
