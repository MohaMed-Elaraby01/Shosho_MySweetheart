// القائمة الأصلية للميوزك بوكس
let myCustomPlaylist = [
    { id: "box-1", title: "عشانك", src: "songs/musicBox/عشانك.mp3", cover: "asha.png" },
    { id: "box-2", title: "إنتِ وأنا والحب سوا", src: "songs/musicBox/إنتِ وأنا والحب سوا.mp3", cover: "enty.png" },
    { id: "box-3", title: "Yanna Yanna", src: "songs/musicBox/Yanna Yanna.mp3", cover: "yanna.png" },
    { id: "box-4", title: "بعشق روحك والكلمات", src: "songs/musicBox/بعشق روحك والكلمات.mp3", cover: "nbdy.png" },
    { id: "box-5", title: "حبك بحر ماله حدود", src: "songs/musicBox/حبك بحر ماله حدود.mp3", cover: "hbkbhr.png" },
    { id: "box-6", title: "أحلى رسمة", src: "songs/musicBox/أحلى رسمة.mp3", cover: "wana.png" },
    { id: "box-7", title: "نسيني وانا جمبك كل الدنيا", src: "songs/musicBox/نسيني وانا جمبك كل الدنيا.mp3", cover: "nasyny.png" },
    { id: "box-8", title: "أغار عليها", src: "songs/musicBox/أغار عليها.mp3", cover: "agar.png" },
    { id: "box-9", title: "معقول", src: "songs/musicBox/معقول.mp3", cover: "Maaqul.png" },
    { id: "box-10", title: "عيد الحب", src: "songs/musicBox/عيد الحب.mp3", cover: "edhb.png" },
    { id: "box-11", title: "ماريدك(امزح🙂)", src: "songs/musicBox/ماريدك.mp3", cover: "maridk.png" },
    { id: "box-12", title: "كل القصايد", src: "songs/musicBox/كل القصايد.mp3", cover: "kl.png" },
    { id: "box-13", title: "لو على قلبي", src: "songs/musicBox/لو على قلبي.mp3", cover: "lwa3.gif" },
    { id: "box-14", title: "غصن رمان", src: "songs/musicBox/gsnrman.mp3", cover: "gsn.png" },
    { id: "box-15", title: "أنا العاشق لعينيك", src: "songs/musicBox/أنا العاشقك لعينيك.mp3", cover: "ana.png" }
];

let currentTrackIndex = -1;
let isLoopingAll = true;   
let isLoopingOne = false;  

// متغيرات الفويسات والمودال المنفصلة
let currentAudio = null;
let currentButton = null;

// متغيرات التحكم بأصوات البروفايل لمنع التداخل
let leftProfileAudio = null;
let rightProfileAudio = null;

// شرط الأمان: يمنع الضغط على اليمين (رقم 2) حتى ينتهي صوت اليسار (رقم 1) تماماً
let isLeftAudioFinished = false; 

let audioPlayer, wPlayBtn, wLoopBtn, wTrackTitle, wTrackArt, progressBar, currentTimeLabel, totalDurationLabel, wHeartBtn;

document.addEventListener("DOMContentLoaded", function() {
    audioPlayer = document.getElementById('global-audio-player');
    wPlayBtn = document.getElementById('w-play-btn');
    wLoopBtn = document.getElementById('w-loop-btn');
    wTrackTitle = document.getElementById('widget-track-title');
    wTrackArt = document.getElementById('widget-track-art');
    progressBar = document.getElementById('track-progress-bar');
    currentTimeLabel = document.getElementById('current-time');
    totalDurationLabel = document.getElementById('total-duration');
    wHeartBtn = document.getElementById('widget-heart-btn');

    if(audioPlayer) {
        audioPlayer.onended = handleTrackEnded;
        audioPlayer.addEventListener('timeupdate', updateProgress);
    }

    reorderPlaylistByLikes();

    const firstMeetDate = new Date(2025, 4, 15); 
    const today = new Date();
    const differenceInTime = today.getTime() - firstMeetDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    const counterElement = document.getElementById('counter');
    if (counterElement) {
        counterElement.innerText = differenceInDays > 0 ? 
            `بقالنا سوا ${differenceInDays} يوم وإن شاء الله هنبقى مع بعض أكتر و أكتر.` : `بداية حكايتنا الأجمل في الكون.`;
    }

    // تفعيل البوردر المضيء على صورة اليسار (رقم واحد) تلقائياً عند تحميل الصفحة مباشرة
    const leftProfile = document.getElementById('left-profile-container');
    if (leftProfile) {
        leftProfile.classList.add('active-glow');
    }

    // تشغيل نظام القلوب المتطايرة المريح للعين
    startHeartsGenerator();
});

// تم تعديل التوقيت ليكون كل 5 ثوانٍ ليعطي فترة هدوء صامتة وثابتة للعين بعد اختفاء القلوب
function startHeartsGenerator() {
    setInterval(() => {
        // توليد مجموعة القلوب لبروفايل اليسار واليمين معاً في نفس الوقت
        createHeartsCluster('left-profile-container');
        createHeartsCluster('right-profile-container');
    }, 5000); 
}

// دالة تصنع مجموعة من 3 قلوب تظهر وتختفي تماماً قبل بدء الدورة التالية
function createHeartsCluster(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let heartsHolder = container.querySelector('.hearts-container');
    if (!heartsHolder) {
        heartsHolder = document.createElement('div');
        heartsHolder.className = 'hearts-container';
        container.appendChild(heartsHolder);
    }

    // تطلق 3 قلوب متقاربة زمنياً لتظهر كمجموعة واحدة متناسقة
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.className = 'heart-particle';
            heart.innerText = '❤️';

            // توزيع عشوائي مريح ومحدود فوق حافة الصورة
            const randomLeft = Math.random() * 60 + 20; // تركيز القلوب في المنتصف أكثر لمنع التشتيت
            const randomXMove = (Math.random() * 30 - 15) + 'px'; 

            heart.style.left = `${randomLeft}%`;
            heart.style.setProperty('--random-x', randomXMove);

            heartsHolder.appendChild(heart);

            // يتم تدمير عنصر القلب بعد ثانيتين ونصف تماماً لتبقى الشاشة نظيفة وفارغة لثانيتين إضافيتين
            setTimeout(() => {
                heart.remove();
            }, 2500);
        }, i * 250); // فواصل زمنية قصيرة جداً (ربع ثانية) لتخرج القلوب كمجموعة واحدة متصلة
    }
}

function reorderPlaylistByLikes() {
    let likedSongs = [];
    let regularSongs = [];

    myCustomPlaylist.forEach(track => {
        if (localStorage.getItem('box_like_' + track.id) === 'true') {
            likedSongs.push(track);
        } else {
            regularSongs.push(track);
        }
    });
    myCustomPlaylist = [...likedSongs, ...regularSongs];
}

function togglePlayerWidget() {
    document.getElementById('player-widget').classList.toggle('active');
}

function toggleGlobalPlay() {
    stopModalAudioOnly();

    if (currentTrackIndex === -1) {
        loadTrack(0);
        return;
    }
    
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => wPlayBtn.classList.add('paused')).catch(err => console.log(err));
    } else {
        audioPlayer.pause();
        wPlayBtn.classList.remove('paused');
    }
}

function loadTrack(index) {
    if (index < 0 || index >= myCustomPlaylist.length) return;
    currentTrackIndex = index;
    
    stopModalAudioOnly();

    const track = myCustomPlaylist[index];
    audioPlayer.src = track.src;
    wTrackTitle.innerText = track.title;
    wTrackArt.src = track.cover || "music.png";
    
    progressBar.value = 0;
    progressBar.style.setProperty('--progress-tail', '0%');

    const isLiked = localStorage.getItem('box_like_' + track.id) === 'true';
    if (wHeartBtn) {
        wHeartBtn.innerText = isLiked ? '♥︎' : '♡';
        wHeartBtn.style.color = isLiked ? '#e2264d' : '#aeaeae';
    }

    audioPlayer.play().then(() => {
        wPlayBtn.classList.add('paused');
    }).catch(err => {
        wTrackTitle.innerText = "خطأ في تحميل الملف ❌";
    });
}

function toggleMusicBoxLike(event) {
    event.stopPropagation();
    if (currentTrackIndex === -1) return;

    const currentTrack = myCustomPlaylist[currentTrackIndex];
    const isLiked = localStorage.getItem('box_like_' + currentTrack.id) === 'true';

    if (!isLiked) {
        wHeartBtn.innerText = '♥︎';
        wHeartBtn.style.color = '#e2264d';
        localStorage.setItem('box_like_' + currentTrack.id, 'true');

        const bubble = document.createElement('div');
        bubble.className = 'bubble-pop';
        bubble.innerText = '💖..,like it';
        wHeartBtn.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1200);
    } else {
        wHeartBtn.innerText = '♡';
        wHeartBtn.style.color = '#aeaeae';
        localStorage.setItem('box_like_' + currentTrack.id, 'false');
    }

    reorderPlaylistByLikes();
    currentTrackIndex = myCustomPlaylist.findIndex(track => track.id === currentTrack.id);
}

function playNextTrack() {
    if (myCustomPlaylist.length === 0) return;
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= myCustomPlaylist.length) nextIndex = 0;
    loadTrack(nextIndex);
}

function playPrevTrack() {
    if (myCustomPlaylist.length === 0) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = myCustomPlaylist.length - 1;
    loadTrack(prevIndex);
}

function toggleGlobalLoop() {
    if (isLoopingAll) {
        isLoopingAll = false; isLoopingOne = true; audioPlayer.loop = true;
        wLoopBtn.className = "control-btn loop-mode-one"; 
    } else if (isLoopingOne) {
        isLoopingOne = false; audioPlayer.loop = false;
        wLoopBtn.className = "control-btn loop-mode-none"; 
    } else {
        isLoopingAll = true;
        wLoopBtn.className = "control-btn loop-mode-all"; 
    }
}

function handleTrackEnded() {
    if (isLoopingOne) { audioPlayer.play(); } 
    else if (isLoopingAll) { playNextTrack(); } 
    else if (currentTrackIndex === myCustomPlaylist.length - 1) { wPlayBtn.classList.remove('paused'); } 
    else { playNextTrack(); }
}

function updateProgress() {
    if (!isNaN(audioPlayer.duration)) {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercentage;
        progressBar.style.setProperty('--progress-tail', `${progressPercentage}%`);

        let curMins = Math.floor(audioPlayer.currentTime / 60), curSecs = Math.floor(audioPlayer.currentTime - curMins * 60);
        let durMins = Math.floor(audioPlayer.duration / 60), durSecs = Math.floor(audioPlayer.duration - durMins * 60);

        if (curSecs < 10) curSecs = "0" + curSecs; if (curMins < 10) curMins = "0" + curMins;
        if (durSecs < 10) durSecs = "0" + durSecs; if (durMins < 10) durMins = "0" + durMins;

        currentTimeLabel.innerText = curMins + ":" + curSecs;
        totalDurationLabel.innerText = durMins + ":" + durSecs;
    }
}

function seekTrack() {
    if (!isNaN(audioPlayer.duration)) {
        audioPlayer.currentTime = audioPlayer.duration * (progressBar.value / 100);
        progressBar.style.setProperty('--progress-tail', `${progressBar.value}%`);
    }
}

function stopModalAudioOnly() {
    if (currentAudio) {
        currentAudio.pause();
        if (currentButton) {
            currentButton.innerText = 'تشغيل ⏩';
            currentButton.classList.remove('playing');
        }
        currentAudio = null;
        currentButton = null;
    }
}

function openModal(folderType) {
    const modal = document.getElementById('folderModal');
    const modalBody = document.getElementById('modal-body');
    let content = '';

    if (folderType === 'my-songs') {
        content = `
            <h2>ها! ها! تشغليش 🙂</h2>
            ${createNormalAudioHTML('وحدي بقيت أتخيلك 🎵', 'songs/my-voice/song1.mp3')}
            ${createNormalAudioHTML('قولوا لها أنني 🎤', 'songs/my-voice/song2.mp3')}
            ${createNormalAudioHTML('كل وعد ✨', 'songs/my-voice/song3.mp3')}
            ${createNormalAudioHTML('إستني خليكِ معايا 🌸', 'songs/my-voice/song4.mp3')}
            ${createNormalAudioHTML('عيد ميلاد 🎉', 'songs/my-voice/song5.mp3')}
            ${createNormalAudioHTML('لو رحتي بتضلي بقلبي ❤️', 'songs/my-voice/لو رحتي بتضلي بقلبي.mp3')}
            ${createNormalAudioHTML('وبعدين...', 'songs/my-voice/وبعدين.mp3')}
            ${createNormalAudioHTML('يا صبابة قلبي', 'songs/my-voice/من يدري.mp3')}
        `;
    } 
    else if (folderType === 'her-photos') {
        content = `
            <h2>أنا و أنتِ 🤭❤️</h2>
            <div class="gallery">
                <img src="images/we.png" alt="صورتنا سوا">
                <img src="images/photo1.jpg" alt="صورة 1"><img src="images/photo2.jpg" alt="صورة 2">
                <img src="images/photo3.jpg" alt="صورة 3"><img src="images/photo4.jpg" alt="صورة 4">
                <img src="images/photo5.jpg" alt="صورة 5"><img src="images/photo6.jpg" alt="صورة 6">
                <img src="images/photo7.jpg" alt="صورة 7"><img src="images/us (2).png" alt="صورة جديدة 2">
                <div class="special-image-container" onclick="toggleSpecialImage(this)">
                    <div class="image-wrapper">
                        <img src="images/us3.png" data-alt-src="images/us32.png" alt="صورة us3" class="smooth-toggle-img">
                        <div class="click-hint">اضغطي على الصورة (ومش بعرف اتصور🙃)</div>
                    </div>
                    <div class="gray-caption-border">(الجودة زبالة بسبب التابلت 🙂)</div>
                </div>
            </div>`;
    } 
    else if (folderType === 'fav-songs') {
        content = `
            <h2>أغانيكي المفضلة ⭐</h2>
            ${createNormalAudioHTML('أقبل قمرك بعد غياب 🌔', 'songs/her-fav/fav1.mp3')}
            ${createNormalAudioHTML('مكسرات 🍬', 'songs/her-fav/fav2.mp3')}
            ${createNormalAudioHTML('رمضان في مصر حاجة تانية 🌙', 'songs/her-fav/fav3.mp3')}
            ${createNormalAudioHTML('يـا وردة فـي البستـان 🌹', 'songs/her-fav/fav4.mp3')}
            ${createNormalAudioHTML('أيسل خالد - أختي حبيبيتي 💖', 'songs/her-fav/fav5.mp3')}
        `;
    } 
    else if (folderType === 'story') {
        content = `
            <h2>بحبك من بعد الله 🌸✨</h2>
            <div style="line-height: 2; font-size: 1.15rem; color: #4f4f4f; text-align: justify;">
                <p>🌸3285🌼</p>

                <p>أقرأي و قولي آمين من سكات</p>
                <p>يارب لو شادية شادي رأفت الأعرج مكتوبة لحد غيري جوزه ملكة جمال العالم واكتبها من نصيبي</p>

                <p>اللهم إن لم تسكنها بيتي فأسكنها فسيح جناتك</p>
                <div class="gallery" style="margin-top: 20px;">
                    <img src="images/moh.png" alt="صورة خاصة">
                </div>
            </div>`;
    }
    else if (folderType === 'other-sites') {
        content = `
            <h2>عقبال ما يبقوا 1000 موقع 😍💖</h2>
            <p style="color: #ff8ca6; font-size: 0.95rem; font-weight: bold; margin-bottom: 20px; text-align: center;">آسف باقي المواقع خربت ودول اللي لسة شغالين 🥲</p>
            <div class="sites-list">
                <a href="https://mohamed-elaraby01.github.io/Happy-Birthday-Shadia/" target="_blank" class="site-link-item"><span>🎉 موقع يوم ميلادكك</span><span class="link-arrow">⬅️</span></a>
                <a href="https://mohamed-elaraby01.github.io/hayaty/" target="_blank" class="site-link-item"><span>🐑 موقع العيددد</span><span class="link-arrow">⬅️</span></a>
                <a href="https://mohamed-elaraby01.github.io/shosho/" target="_blank" class="site-link-item"><span>🌸 موقع الأغاني</span><span class="link-arrow">⬅️</span></a>
            </div>`;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

function createNormalAudioHTML(title, src) {
    return `
        <div class="audio-item">
            <div class="audio-info-wrapper">
                <div class="audio-info">
                    <p>🎵 ${title}</p>
                </div>
            </div>
            <button class="play-btn" onclick="togglePlay(this, '${src}')">تشغيل ⏩</button>
        </div>
    `;
}

// تشغيل الأغاني مع إمكانية التبديل والإيقاف
function togglePlay(btn, src) {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        if (wPlayBtn) wPlayBtn.classList.remove('paused');
    }

    let decodedCurrentSrc = currentAudio ? decodeURIComponent(currentAudio.src) : '';
    let decodedTargetSrc = decodeURIComponent(new URL(src, window.location.href).href);

    if (currentAudio && decodedCurrentSrc === decodedTargetSrc) {
        if (!currentAudio.paused) {
            currentAudio.pause();
            btn.innerText = 'تشغيل ⏩';
            btn.classList.remove('playing');
        } else {
            currentAudio.play();
            btn.innerText = 'إيقاف مؤقت ⏸';
            btn.classList.add('playing');
        }
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        if (currentButton) {
            currentButton.innerText = 'تشغيل ⏩';
            currentButton.classList.remove('playing');
        }
    }

    currentAudio = new Audio(src);
    currentAudio.loop = true; 
    currentButton = btn;
    
    currentAudio.play().then(() => {
        btn.innerText = 'إيقاف مؤقت ⏸';
        btn.classList.add('playing');
    }).catch(error => {
        console.error(error);
    });
}

// تشغيل صوت بروفايل اليسار (كل وعد.mp3)
function playLeftProfileAudio() {
    const leftProfile = document.getElementById('left-profile-container');
    const rightProfile = document.getElementById('right-profile-container');

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        if (wPlayBtn) wPlayBtn.classList.remove('paused');
    }

    isLeftAudioFinished = false; 
    rightProfile.classList.add('disabled-profile'); 
    rightProfile.classList.remove('hearts-active'); 

    if (leftProfileAudio) { leftProfileAudio.pause(); leftProfileAudio.currentTime = 0; }
    if (rightProfileAudio) { rightProfileAudio.pause(); rightProfileAudio.currentTime = 0; }

    leftProfile.classList.add('active-glow');
    rightProfile.classList.remove('active-glow');

    leftProfileAudio = new Audio('songs/profile/كل وعد.mp3');
    leftProfileAudio.play().catch(err => {
        console.log("تعذر تشغيل صوت اليسار:", err);
    });

    leftProfileAudio.onended = function() {
        isLeftAudioFinished = true; 
        leftProfile.classList.remove('active-glow');
        rightProfile.classList.remove('disabled-profile'); 
        rightProfile.classList.add('active-glow'); 
        rightProfile.classList.add('hearts-active'); 
    };
}

// تشغيل صوت بروفايل اليمين (بحبك.mp3)
function playRightProfileAudio() {
    if (!isLeftAudioFinished) {
        console.log("الوصول محظور: يجب تشغيل صوت صورة اليسار (1) وانتهاءه بالكامل أولاً!");
        return; 
    }

    const leftProfile = document.getElementById('left-profile-container');
    const rightProfile = document.getElementById('right-profile-container');

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        if (wPlayBtn) wPlayBtn.classList.remove('paused');
    }

    if (leftProfileAudio) { leftProfileAudio.pause(); leftProfileAudio.currentTime = 0; }
    if (rightProfileAudio) { rightProfileAudio.pause(); rightProfileAudio.currentTime = 0; }

    leftProfile.classList.remove('active-glow');
    rightProfile.classList.add('active-glow');

    rightProfileAudio = new Audio('songs/profile/بحبك.mp3');
    rightProfileAudio.play().catch(err => {
        console.log("تعذر تشغيل صوت اليمين:", err);
    });

    rightProfileAudio.onended = function() {
        rightProfile.classList.remove('active-glow');
    };
}

function closeModal() {
    document.getElementById('folderModal').style.display = 'none';
    stopModalAudioOnly();
}

window.onclick = function(event) {
    const modal = document.getElementById('folderModal');
    if (event.target == modal) { closeModal(); }
}

function toggleSpecialImage(container) {
    const img = container.querySelector('.smooth-toggle-img');
    const currentSrc = img.getAttribute('src');
    const altSrc = img.getAttribute('data-alt-src');
    
    img.classList.add('fade-out');
    setTimeout(() => {
        img.setAttribute('src', altSrc);
        img.setAttribute('data-alt-src', currentSrc);
        img.classList.remove('fade-out');
    }, 250); 
}
