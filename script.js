// مصفوفة الأغاني الخاصة بالمشغل المودرن العلوي (بدون إيموجيات، ومع إمكانية تخصيص صورة لكل أغنية)
const myCustomPlaylist = [
    { title: "عشانك", src: "songs/musicBox/عشانك.mp3", cover: "asha.png" },
    { title: "إنتِ وأنا والحب سوا", src: "songs/musicBox/إنتِ وأنا والحب سوا.mp3", cover: "enty.png" },
    { title: "Yanna Yanna", src: "songs/musicBox/Yanna Yanna.mp3", cover: "yanna.png" },
    { title: "بعشق روحك والكلمات", src: "songs/musicBox/بعشق روحك والكلمات.mp3", cover: "nbdy.png" },
    { title: "حبك بحر ماله حدود", src: "songs/musicBox/حبك بحر ماله حدود.mp3", cover: "hbkbhr.png" },
    { title: "أحلى رسمة", src: "songs/musicBox/أحلى رسمة.mp3", cover: "wana.png" },
    { title: "نسيني وانا جمبك كل الدنيا", src: "songs/musicBox/نسيني وانا جمبك كل الدنيا.mp3", cover: "nasyny.png" },
    { title: "أغار عليها", src: "songs/musicBox/أغار عليها.mp3", cover: "agar.png" },
    { title: "معقول", src: "songs/musicBox/معقول.mp3", cover: "Maaqul.png" },
    { title: "عيد الحب", src: "songs/musicBox/عيد الحب.mp3", cover: "edhb.png" },
    { title: "ماريدك(امزح🙂)", src: "songs/musicBox/ماريدك.mp3", cover: "maridk.png" }
];

let currentTrackIndex = -1;
let isLoopingAll = true;   // الافتراضي: تكرار القائمة بالكامل
let isLoopingOne = false;  // تكرار أغنية واحدة فقط
let updateTimer;

// المتغيرات الخاصة بالتحكم في الصوت داخل الـ Modals القديمة
let currentAudio = null;
let currentButton = null;

// عناصر المشغل المودرن الجديد
let audioPlayer;
let wPlayBtn;
let wLoopBtn;
let wTrackTitle;
let wTrackArt;
let progressBar;
let currentTimeLabel;
let totalDurationLabel;

document.addEventListener("DOMContentLoaded", function() {
    // ربط عناصر المشغل الجديد
    audioPlayer = document.getElementById('global-audio-player');
    wPlayBtn = document.getElementById('w-play-btn');
    wLoopBtn = document.getElementById('w-loop-btn');
    wTrackTitle = document.getElementById('widget-track-title');
    wTrackArt = document.getElementById('widget-track-art');
    progressBar = document.getElementById('track-progress-bar');
    currentTimeLabel = document.getElementById('current-time');
    totalDurationLabel = document.getElementById('total-duration');

    if(audioPlayer) {
        audioPlayer.onended = handleTrackEnded;
        // تحديث شريط التقدم أثناء التشغيل
        audioPlayer.addEventListener('timeupdate', updateProgress);
    }

    // حساب العداد للأيام أسفل الصفحة
    const firstMeetDate = new Date(2025, 4, 15); 
    const today = new Date();
    const differenceInTime = today.getTime() - firstMeetDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    const counterElement = document.getElementById('counter');
    if (counterElement) {
        if (differenceInDays > 0) {
            counterElement.innerText = `بقالنا سوا ${differenceInDays} يوم وإن شاء الله هنبقى مع بعض أكتر و أكتر.`;
        } else {
            counterElement.innerText = `بداية حكايتنا الأجمل في الكون.`;
        }
    }
});

// فتح وإغلاق صندوق الموسيقى العلوي
function togglePlayerWidget() {
    const widget = document.getElementById('player-widget');
    if (widget.classList.contains('active')) {
        widget.classList.remove('active');
    } else {
        widget.classList.add('active');
    }
}

// تشغيل أو إيقاف مؤقت للمشغل الرئيسي المودرن
function toggleGlobalPlay() {
    // إيقاف أي صوت شغال جوة الـ Modals لعدم التداخل
    stopModalAudioOnly();

    if (currentTrackIndex === -1) {
        loadTrack(0);
        return;
    }
    
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            wPlayBtn.classList.add('paused'); 
        }).catch(err => console.log("خطأ في التشغيل:", err));
    } else {
        audioPlayer.pause();
        wPlayBtn.classList.remove('paused');
    }
}

// تحميل وتشغيل أغنية من القائمة المخصصة
function loadTrack(index) {
    if (index < 0 || index >= myCustomPlaylist.length) return;
    currentTrackIndex = index;
    
    // إيقاف أي صوت في المودال القديم
    stopModalAudioOnly();

    audioPlayer.src = myCustomPlaylist[index].src;
    wTrackTitle.innerText = myCustomPlaylist[index].title;
    
    wTrackArt.src = myCustomPlaylist[index].cover || "music.png";
    
    progressBar.value = 0;
    progressBar.style.setProperty('--progress-tail', '0%');

    audioPlayer.play().then(() => {
        wPlayBtn.classList.add('paused');
    }).catch(err => {
        console.log("ملف الصوت غير موجود:", err);
        wTrackTitle.innerText = "خطأ في تحميل الملف ❌";
    });
}

// الأغنية التالية في المشغل المودرن
function playNextTrack() {
    if (myCustomPlaylist.length === 0) return;
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= myCustomPlaylist.length) {
        nextIndex = 0;
    }
    loadTrack(nextIndex);
}

// الأغنية السابقة في المشغل المودرن
function playPrevTrack() {
    if (myCustomPlaylist.length === 0) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
        prevIndex = myCustomPlaylist.length - 1;
    }
    loadTrack(prevIndex);
}

// التبديل بين أوضاع التكرار
function toggleGlobalLoop() {
    if (isLoopingAll) {
        isLoopingAll = false;
        isLoopingOne = true;
        audioPlayer.loop = true;
        wLoopBtn.className = "control-btn loop-mode-one"; 
    } else if (isLoopingOne) {
        isLoopingOne = false;
        audioPlayer.loop = false;
        wLoopBtn.className = "control-btn loop-mode-none"; 
    } else {
        isLoopingAll = true;
        wLoopBtn.className = "control-btn loop-mode-all"; 
    }
}

// انتهاء الأغنية تلقائياً
function handleTrackEnded() {
    if (isLoopingOne) {
        audioPlayer.play();
    } else if (isLoopingAll) {
        playNextTrack();
    } else {
        if (currentTrackIndex === myCustomPlaylist.length - 1) {
            wPlayBtn.classList.remove('paused');
        } else {
            playNextTrack();
        }
    }
}

// تحديث شريط التقدم والوقت الحالي
function updateProgress() {
    if (!isNaN(audioPlayer.duration)) {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercentage;
        
        progressBar.style.setProperty('--progress-tail', `${progressPercentage}%`);

        let curMins = Math.floor(audioPlayer.currentTime / 60);
        let curSecs = Math.floor(audioPlayer.currentTime - curMins * 60);
        let durMins = Math.floor(audioPlayer.duration / 60);
        let durSecs = Math.floor(audioPlayer.duration - durMins * 60);

        if (curSecs < 10) curSecs = "0" + curSecs;
        if (curMins < 10) curMins = "0" + curMins;
        if (durSecs < 10) durSecs = "0" + durSecs;
        if (durMins < 10) durMins = "0" + durMins;

        currentTimeLabel.innerText = curMins + ":" + curSecs;
        totalDurationLabel.innerText = durMins + ":" + durSecs;
    }
}

// تقديم وتأخير الأغنية عند سحب شريط التقدم
function seekTrack() {
    if (!isNaN(audioPlayer.duration)) {
        const seekTo = audioPlayer.duration * (progressBar.value / 100);
        audioPlayer.currentTime = seekTo;
        progressBar.style.setProperty('--progress-tail', `${progressBar.value}%`);
    }
}

// إيقاف صوت المودال لعدم حدوث تداخل
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

/* النوافذ القديمة للأقسام الأخرى */
function openModal(folderType) {
    const modal = document.getElementById('folderModal');
    const modalBody = document.getElementById('modal-body');
    
    let content = '';

    if (folderType === 'my-songs') {
        content = `
            <h2>ها! ها! تشغليش 🙂</h2>
            ${createAudioPlayer('وحدي بقيت أتخيلك 🎵', 'songs/my-voice/song1.mp3')}
            ${createAudioPlayer('قولوا لها أنني 🎤', 'songs/my-voice/song2.mp3')}
            ${createAudioPlayer('كل وعد ✨', 'songs/my-voice/song3.mp3')}
            ${createAudioPlayer('إستني خليكِ معايا 🌸', 'songs/my-voice/song4.mp3')}
            ${createAudioPlayer('عيد ميلاد 🎉', 'songs/my-voice/song5.mp3')}
        `;
    } 
    else if (folderType === 'her-photos') {
        content = `
            <h2>قمرتييييي 📸✨</h2>
            <div class="gallery">
                <img src="images/we.png" alt="صورتنا سوا">
                <img src="images/photo1.jpg" alt="صورة 1">
                <img src="images/photo2.jpg" alt="صورة 2">
                <img src="images/photo3.jpg" alt="صورة 3">
                <img src="images/photo4.jpg" alt="صورة 4">
                <img src="images/photo5.jpg" alt="صورة 5">
                <img src="images/photo6.jpg" alt="صورة 6">
                <img src="images/photo7.jpg" alt="صورة 7">
            </div>
        `;
    } 
    else if (folderType === 'fav-songs') {
        content = `
            <h2>أغانيكي المفضلة ⭐</h2>
            ${createAudioPlayer('أقبل قمرك بعد غياب 🌔', 'songs/her-fav/fav1.mp3')}
            ${createAudioPlayer('مكسرات 🍬', 'songs/her-fav/fav2.mp3')}
            ${createAudioPlayer('رمضان في مصر حاجة تانية 🌙', 'songs/her-fav/fav3.mp3')}
            ${createAudioPlayer('يـا وردة فـي البستـان 🌹', 'songs/her-fav/fav4.mp3')}
            ${createAudioPlayer('أيسل خالد - أختي حبيبيتي 💖', 'songs/her-fav/fav5.mp3')}
        `;
    } 
    else if (folderType === 'story') {
        content = `
            <h2>بحبك من بعد الله 🌸✨</h2>
            <div style="line-height: 2; font-size: 1.15rem; color: #4f4f4f; text-align: justify;">
                <p>🌸 فاكرة لما قلتلك <strong>"باي يحلوة"</strong>؟ الجملة دي كانت بداية إني أعرف أجمل وأرق واحدة شفتها في حياتي كلها.</p>
                <p>شايفة العداد اللي تحت ده؟ إن شاء الله لو ربنا كاتب لنا نصيب، هاجي يوم <strong>"3285"</strong> وأطلب إيدك رسمي.. ولحد ما يجي الوقت ده، كل يوم هقعد أدعي من كل قلبي إنك تكوني من نصيبي وتفضلي منورة دنيتي دايماً 🌼</p>
                
                <p>طب فاكرة لما قلتلك باي يوحشة؟ هههههههههههههههههههههههههههههههههههه بحبك موت والله</p>
                <!-- 📸 تم نقل حاوية الصورة لتصبح أسفل الكلام مباشرة -->
                <div class="gallery" style="margin-top: 20px;">
                    <img src="images/moh.png" alt="صورة خاصة">
                </div>
            </div>
        `;
    }
    else if (folderType === 'other-sites') {
        content = `
            <h2>عقبال ما يبقوا 1000 موقع 😍💖</h2>
            <p style="color: #ff8ca6; font-size: 0.95rem; font-weight: bold; margin-bottom: 20px; text-align: center;">
                آسف باقي المواقع خربت ودول اللي لسة شغالين 🥲
            </p>
            <div class="sites-list">
                <a href="https://mohamed-elaraby01.github.io/Happy-Birthday-Shadia/" target="_blank" class="site-link-item">
                    <span>🎉 موقع يوم ميلادكك</span>
                    <span class="link-arrow">⬅️</span>
                </a>
                <a href="https://mohamed-elaraby01.github.io/hayaty/" target="_blank" class="site-link-item">
                    <span>🐑 موقع العيددد</span>
                    <span class="link-arrow">⬅️</span>
                </a>
                <a href="https://mohamed-elaraby01.github.io/shosho/" target="_blank" class="site-link-item">
                    <span>🌸 موقع الأغاني</span>
                    <span class="link-arrow">⬅️</span>
                </a>
            </div>
        `;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

function createAudioPlayer(title, src) {
    return `
        <div class="audio-item">
            <div class="audio-info">
                <p>${title}</p>
            </div>
            <button class="play-btn" onclick="togglePlay(this, '${src}')">تشغيل ⏩</button>
        </div>
    `;
}

function togglePlay(btn, src) {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        if (wPlayBtn) wPlayBtn.classList.remove('paused');
    }

    if (currentAudio && currentAudio.src === window.location.origin + '/' + encodeURI(src)) {
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
        console.error("خطأ في تشغيل الملف:", error);
        alert("لم يتم العثور على ملف الأغنية! تأكد من وضع الملف بالاسم الصحيح داخل المجلد المناسب.");
    });
}

function closeModal() {
    const modal = document.getElementById('folderModal');
    modal.style.display = 'none';
    stopModalAudioOnly();
}

window.onclick = function(event) {
    const modal = document.getElementById('folderModal');
    if (event.target == modal) { closeModal(); }
}
