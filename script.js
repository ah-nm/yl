function setScreenHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function updateLayout() {
    setScreenHeight();

    if (isMobileDevice()) {
        const originalMinHeight = document.body.style.minHeight;
        document.body.style.minHeight = '102vh'; 

        setTimeout(function() {
            window.scrollTo(0, 1); 
            setTimeout(() => {
                document.body.style.minHeight = originalMinHeight;
                setScreenHeight();
            }, 200);
        }, 50);
    } else {
        setTimeout(function() { window.scrollTo(0, 1); }, 0);
    }

    var currentWidth = window.innerWidth;
    var orient = currentWidth == 320 ? "profile" : "landscape";
    document.body.setAttribute("orient", orient);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isInFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
}

function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {}); 
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateLayout();
    }
});

window.addEventListener('resize', setScreenHeight);
window.addEventListener('load', function() {
    updateLayout();
}, false);

setInterval(() => {
    if(isMobileDevice() && !isInFullscreen()) {
        setScreenHeight(); 
    }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    setScreenHeight();

    const enterScreen = document.getElementById('enter-screen');
    const gameContainer = document.getElementById('game-container');
    const video = document.getElementById('intro-video');
    const objectsLayer = document.getElementById('objects-layer');
    const bgm = document.getElementById('bgm');
    const musicInfo = document.getElementById('music-info');
    const guideText = document.getElementById('interaction-guide');
    const bgImg = document.querySelector('.bg-img');

    const modal = document.getElementById('modal-overlay');
    const modalWrapper = document.getElementById('modal-inner-wrapper');
    const closeBtn = document.querySelector('.close-btn');

    const songTitle = "no one is coming to save you - far";
    
    let gameStarted = false;

    const tryRestoreFullscreen = (e) => {
        if (gameStarted && isMobileDevice()) {
            if (!isInFullscreen()) {
                openFullscreen();
            }
            updateLayout();
        }
    };

    document.addEventListener('click', tryRestoreFullscreen);
    document.addEventListener('touchstart', (e) => {
        tryRestoreFullscreen(e);
    }, { passive: true });


    enterScreen.addEventListener('click', () => {
        gameStarted = true;

        if (isMobileDevice()) {
            openFullscreen();
            updateLayout();
        }

        gsap.to(enterScreen, {
            duration: 0.5, opacity: 0,
            onComplete: () => { enterScreen.style.display = 'none'; }
        });
        gameContainer.style.display = 'block';
        
        if(bgImg) {
            gsap.to(bgImg, { duration: 5, opacity: 1, delay: 3 });
        }
        if(objectsLayer) {
            gsap.to(objectsLayer, { duration: 5, opacity: 1, delay: 3 });
        }

        if(bgm) { 
            bgm.volume = 0.5; 
            bgm.play().catch(e => console.log("BGM Error", e)); 
        }
        
        video.currentTime = 0; video.muted = false;
        video.play().catch(e => console.log("Video Error", e));
    });

    video.addEventListener('ended', () => {
        gsap.to(video, {
            duration: 1.5, opacity: 0,
            onComplete: () => { video.style.display = 'none'; }
        });
        
        if(objectsLayer) {
            objectsLayer.style.pointerEvents = 'auto';
        }

        gsap.to(musicInfo, { duration: 3, opacity: 1, delay: 1 });

        if (guideText) {
            const tl = gsap.timeline({ delay: 1.5 });
            tl.to(guideText, { duration: 1, opacity: 1 })
              .to(guideText, { duration: 1, opacity: 0, delay: 2.5 });
        }
    });

    musicInfo.addEventListener('click', (e) => {
        if (bgm.paused) {
            bgm.play();
            musicInfo.innerHTML = `♪ ${songTitle}`;
            musicInfo.style.opacity = 1; 
        } else {
            bgm.pause();
            musicInfo.innerHTML = `🔇 (Music Paused)`;
            musicInfo.style.opacity = 0.5; 
        }
    });

    const renderUnifiedModal = (icon, title, bodyContent) => {
        return `
            <div class="unified-modal">
                <div class="modal-header">
                    <span class="modal-icon">${icon}</span>
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    ${bodyContent}
                </div>
            </div>
        `;
    };

    const renderNPCList = () => {
        const npcs = [
            {
                name: "윤세림",
                age: "21세",
                role: "시각디자인과 2학년",
                img: "ysr_pf.png",
                desc: "남지아의 전 fwb. 애증과 미련이 얽힌 관계.",
            },
            {
                name: "박태범",
                age: "23세",
                role: "조소과 3학년",
                img: "ptb_pf.png",
                desc: "고교 동창. 부유하고 냉소적이며 건조한 우정.",
            },
            {
                name: "손석훈",
                age: "53세",
                role: "회화과 정교수",
                img: "ssh_pf.png",
                desc: "권위와 가식의 상징. 남지아 모친의 지인.",
            },
            {
                name: "민한결",
                age: "25세",
                role: "유리조형과 4학년",
                img: "mhg_pf.png",
                desc: "4차원. 남지아가 열등감을 느끼는 존재.",
            },
            {
                name: "김 조교",
                age: "28세",
                role: "학과 사무실 조교",
                img: "kzg_pf.png",
                desc: "피곤에 찌든 행정가. 원칙주의자.",
            }
        ];

        let html = `<div class="npc-list">`;
        npcs.forEach(npc => {
            html += `
                <div class="npc-item" onclick="openLightbox('${npc.img}')">
                    <div class="npc-img-box">
                        <img src="${npc.img}" alt="${npc.name}">
                    </div>
                    <div class="npc-info">
                        <div class="npc-header-row">
                            <h3 class="npc-name">${npc.name}</h3>
                            <span class="npc-age">${npc.age}</span>
                        </div>
                        <span class="npc-role-tag">${npc.role}</span>
                        <p class="npc-desc">${npc.desc}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        
        html += `<div id="lightbox" class="lightbox" onclick="closeLightbox()">
                    <img id="lightbox-img" src="">
                    <div class="lightbox-close">× 닫기</div>
                 </div>`;
                 
        return html;
    };


    const galleryImages = [];
    const totalImages = 30; 
    for (let i = 1; i <= totalImages; i++) {
        galleryImages.push(`img/${i}.jpg`);
    }

    document.querySelectorAll('.obj').forEach(obj => {
        obj.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            let content = "";

            if (id === 'phone') {
                const npcHtml = renderNPCList();
                
                const placeHtml = `
                    <div class="place-container">
                        <div class="place-category">
                            <h4 class="place-cat-title">🏛️ 구관 (조형예술대학 본관)</h4>
                            <p class="place-cat-desc">실기실과 작업실이 밀집된 낡은 건물.</p>
                            <ul class="place-list">
                                <li><span class="place-name">[조형예술대학 소각장]</span> <span class="place-desc">구관 뒤편. 남지아가 스트레스를 푸는 장소.</span></li>
                                <li><span class="place-name">[제3실기실]</span> <span class="place-desc">유리조형 작업실. 24시간 가마가 돌아가 후끈함.</span></li>
                                <li><span class="place-name">[회화실]</span> <span class="place-desc">환기가 안 되어 기름 냄새와 묵은 먼지가 가득한 공용 공간.</span></li>
                                <li><span class="place-name">[310호(3학년 개인 작업실)]</span> <span class="place-desc">남지아가 작업물을 쌓아놓거나, 쪽잠을 자는 곳.</span></li>
                                <li><span class="place-name">[구관 옥상]</span><span class="place-desc">남지아가 몰래 올라가 줄담배를 피우는 곳.</span></li>
                                <li><span class="place-name">[조교실]</span></li>
                            </ul>
                        </div>
                        
                        <div class="place-category">
                            <h4 class="place-cat-title">🏢 신관</h4>
                            <p class="place-cat-desc">이론강의가 이루어지는 현대식 건물.</p>
                            <ul class="place-list">
                                <li><span class="place-name">[교내 갤러리]</span><span class="place-desc">학생들이 사용할 수 있는 화이트 큐브 전시장.</span></li>
                                <li><span class="place-name">[시청각실]</span> <span class="place-desc">비평 수업이 진행되는 계단식 강의실.</span></li>
                                <li><span class="place-name">[휴게 라운지]</span><span class="place-desc">쉼터지만, 어쩐지 껄끄러운 인물들과 자주 마주치는 장소.</span></li>
                            </ul>
                        </div>
                    </div>
                `;

                content = renderUnifiedModal("👥", "인물 및 환경", `
                    <h3 class="system-section-title">주변 인물</h3>
                    ${npcHtml}
                    <div class="divider"></div>
                    <h3 class="system-section-title">주요 장소 (H대학교)</h3>
                    ${placeHtml}
                `);
            } 
            else if (id === 'painting') {
                let gridHtml = `<div class="gallery-grid">`;
                
                galleryImages.forEach((src, index) => {
                    const imgNum = index + 1;
                    const isSensitive = (imgNum >= 20 && imgNum <= 30);
                    const blurClass = isSensitive ? 'sensitive-thumb' : '';
                    
                    gridHtml += `<img src="${src}" class="gallery-item ${blurClass}" onclick="openLightbox('${src}', ${isSensitive})">`;
                });
                
                gridHtml += `</div>
                             <div id="lightbox" class="lightbox" onclick="handleLightboxClick(event)">
                                <img id="lightbox-img" src="">
                                <div class="lightbox-close" onclick="closeLightbox()">× 닫기</div>
                             </div>`;
                
                content = renderUnifiedModal("🎨", "갤러리", gridHtml);
            } 
            else if (id === 'note') {
                content = renderUnifiedModal("📒", "프로필", `
                    <div class="profile-img-container">
                        <img src="pf.png" alt="남지아 프로필" class="profile-img">
                    </div>
                    <div class="profile-section">
                        <span class="profile-label">기본 정보</span>
                        <p class="profile-text">
                            <strong>이름:</strong> 남지아<br>
                            <strong>나이:</strong> (만) 23세<br>
                            <strong>생일:</strong> 4월 2일<br>
                            <strong>소속:</strong> H대 회화과 3학년 (유리조형 부전공)
                        </p>
                    </div>
                    
                    <div class="profile-section">
                        <span class="profile-label">외형 & 스타일</span>
                        <p class="profile-text">
                            179cm, 불건전하게 마른 근육. <br>
                            관리되지 않은 푸석한 금발과 탁한 갈색 눈동자.<br>
                            물감이 튀어도 티가 안 나는 무채색 옷을 주로 착용.<br>
                            사각 은테 안경, 피어싱, 반지 등 과한 악세사리.<br> 
                            머리가 아플 정도로 자극적인 향수를 사용.
                        </p>
                    </div>

                    <div class="profile-section">
                        <span class="profile-label">취향</span>
                        <p class="profile-text">
                            <strong>좋아하는 것:</strong> 그로테스크한 영화, 망가진 것들, 술, 담배.<br>
                            <strong>싫어하는 것:</strong> 단 디저트.<br>
                            <strong>음악:</strong> 슈게이징, 앰비언트, 포스트 록.
                        </p>
                    </div>

                    <div class="profile-section">
                        <span class="profile-label">대화 특징</span>
                        <p class="profile-text">
                            <strong>목소리:</strong> 나른한 듯, 신경을 긁는 차가운 미성.<br>
                            <strong>말투:</strong> 냉소적인 어휘, 비꼬는 듯한 어조.<br>
                        </p>
                    </div>

                    <div class="profile-section">
                        <span class="profile-label">여담</span>
                        <p class="profile-text">
                            <strong>습관:</strong> 손을 자주 씻는 강박이 있어 늘 손이 건조.<br>
                            <strong>가족:</strong> 유명한 갤러리 관장(母)과 건축가(父). 외동.<br>
                            <strong>학력:</strong> 예중→예고 출신.<br>
                            <strong>소문:</strong> 오는 여자 안 막고 가는 여자 안 잡기로 유명.
                        </p>
                    </div>

                    <div class="divider"></div>

                    <div class="profile-section" id="secret-section">
                        <span class="profile-label" style="color:#e74c3c; margin-bottom:10px;">🔒 비밀 정보</span>
                        
                        <div id="secret-lock-container">
                            <p class="lock-msg">이 정보는 잠겨있습니다.<br>키워드를 입력하여 열람하세요.</p>
                            <div class="lock-input-box">
                                <input type="text" id="secret-input" placeholder="암호 입력">
                                <button id="secret-unlock-btn">해제</button>
                            </div>
                            <p class="lock-hint">힌트: 남지아의 상징색.</p>
                            <p id="lock-error" class="error-msg"></p>
                        </div>

                        <div id="secret-real-content" style="display:none; flex-direction:column; gap:8px;">
                            <div class="secret-block revealed">성격 유형: ISFP-T / 4w3 / 혼돈 악.</div>
                            <div class="secret-block revealed">성격 키워드: 예술적 허무주의 / 유리멘탈 / 이상주의 / 사색적 / 감정기복 / 집요한 / 신경질적 / 회피형 애착 / 애정결핍 / 충동적 자기파괴.</div>
                            <div class="secret-block revealed">진정성을 강요하는 사람을 극도로 혐오함. 타인의 진심을 믿지 못하고, 모든 관계를 '연기'로 치부함.</div>
                            <div class="secret-block revealed">어릴 때부터 '천재'로 소비되며 화단의 입맛에 맞는 그림을 그려옴. 호평을 받으려면 '거짓 감정'을 팔아야 했기에, 자신의 진짜 감정이 무엇인지 모름. 남들이 자신의 그림에서 의미를 찾는 것을 비웃으면서도, 정작 본인은 아무런 의미도 없는 텅 빈 상태라는 것에 대한 깊은 열등감과 공포가 있음.</div>
                        </div>
                    </div>
                `);
            } 
            else if (id === 'poster') {
                content = renderUnifiedModal("📄", "보도자료", `
                    <p class="pr-meta">[202x.xx.xx 남지아 개인전 - 유리 정원]</p>
                    <h3 class="pr-title">불투명한 투명성에 대하여</h3>
                    <p class="pr-author">남지아 (Nam Jia)</p>
                    <div class="divider"></div>
                    <div class="pr-body">
                        <p>우리가 대상을 본다는 행위는 얼마나 진실에 가까운가? 빛은 사물의 표면에 부딪혀 반사되고, 망막에 맺히기 전까지 수없이 굴절된다. 우리는 어쩌면 대상의 본질이 아닌, 껍데기가 만들어낸 환영만을 소비하고 있는지도 모른다.</p>
                        <p>회화는 본질적으로 기만이다. 3차원의 세계를 2차원의 평면에 납작하게 눌러 담는 행위는, 대상을 영원히 박제하는 동시에 죽이는 일이다. 나는 붓끝에서 탄생하는 완벽한 재현을 불신한다. 매끄럽게 마감된 캔버스의 표면은 관객의 시선이 미끄러지게 만들 뿐, 그 안의 실재에 닿지 못하게 차단한다.</p>
                        <p>나의 작업은 이 견고한 '회화적 환영'에 유리라는 투명한 물성을 충돌시키는 실험에서 시작한다. 1,000도 이상의 열기는 안료를 태우고, 캔버스를 수축시키며, 이미지를 왜곡한다. 이 과정은 통제된 우연이자 계획된 파괴다.</p>
                        <p>투명함의 상징인 유리는 역설적으로 대상을 가장 불투명하게 만든다. 깨지고 균열 간 유리라는 필터를 통해서만 관객은 이미지를 볼 수 있다. 그 굴절된 시선 끝에 남는 것은 파괴된 흔적뿐이다. 나는 이 파괴의 과정을 통해 가공된 아름다움 뒤에 숨겨진 불안과, 매끄러운 표면 아래 감춰진 날 것의 실체를 질문하고자 한다.</p>
                    </div>
                    <p class="burnt-text">(종이가 찢어져 이 다음은 읽을 수 없다)</p>
                `);
            } 
            else if (id === 'pill') {
                content = renderUnifiedModal("⚠️", "시스템 정보", `
                    <h3 class="system-section-title">균열 상태</h3>
                    <p style="margin-bottom:20px; color:#ccc; font-size:0.9rem;">
                        {user}의 말과 행동에 따라 남지아의 <span class="highlight">방어기제</span>가 무너집니다.<br>
                        수치가 높아질수록 그의 숨겨진 결핍과 본능이 드러납니다.
                    </p>

                    <div class="crack-stage stage-low">
                        <h4>🟡 Low <span>0~29</span></h4>
                        <p>겉으로는 다정하고 능글맞지만, 속으로는 당신을 평가하고 있다.</p>
                    </div>

                    <div class="crack-stage stage-mid">
                        <h4>🟠 Mid <span>30~59</span></h4>
                        <p>당신의 존재가 거슬리기 시작했다.</p>
                    </div>

                    <div class="crack-stage stage-high">
                        <h4>🔴 High <span>60~89</span></h4>
                        <p>당신이 자신의 세계를 침범했다고 인식한다.</p>
                    </div>

                    <div class="crack-stage stage-broken">
                        <h4>⚫ Max <span>90~100</span></h4>
                        <p>"날 이렇게 망가뜨리니까 속이 시원해?"</p>
                    </div>

                    <div class="divider"></div>

                    <h3 class="system-section-title">명령어</h3>
                    <div class="command-list">
                        <div class="command-item">
                            <div class="cmd-tag">!요약</div>
                            <div class="cmd-desc">현재까지 일어난 상황을 요약.</div>
                        </div>
                        <div class="command-item">
                            <div class="cmd-tag">!에타</div>
                            <div class="cmd-desc">직전 상황에 대한 대학 커뮤니티의 반응.</div>
                        </div>
                        <div class="command-item">
                            <div class="cmd-tag">!일기</div>
                            <div class="cmd-desc">남지아의 일기 확인.</div>
                        </div>
                        <div class="command-item">
                            <div class="cmd-tag">!폰</div>
                            <div class="cmd-desc">남지아의 핸드폰 확인. (스포티파이 / 카카오톡 / 인스타 / 유튜브 / 메모장)</div>
                        </div>
                        <div class="command-item">
                            <div class="cmd-tag">!핫픽스</div>
                            <div class="cmd-desc">AI 긴급 수리(프로챗 1.0에서 작동).</div>
                        </div>
                    </div>
                `);
            }

            showModal(content);

            if (id === 'note') {
                const unlockBtn = document.getElementById('secret-unlock-btn');
                const inputField = document.getElementById('secret-input');
                const lockContainer = document.getElementById('secret-lock-container');
                const realContent = document.getElementById('secret-real-content');
                const errorMsg = document.getElementById('lock-error');

                if (unlockBtn) {
                    const checkCode = () => {
                        const val = inputField.value.trim().toLowerCase();
                        const answers = ['카드뮴 옐로', '카드뮴 옐로우', 'cadmium yellow'];
                        
                        if (answers.includes(val)) {
                            lockContainer.style.display = 'none';
                            realContent.style.display = 'flex';
                            
                            if(typeof gsap !== 'undefined') {
                                gsap.fromTo(realContent, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.5});
                            }
                        } else {
                            errorMsg.textContent = "⛔ 잘못된 암호입니다.";
                            if(typeof gsap !== 'undefined') {
                                gsap.fromTo(errorMsg, {x:-5}, {x:5, duration:0.1, yoyo:true, repeat:3});
                            }
                        }
                    };

                    unlockBtn.addEventListener('click', checkCode);
                    inputField.addEventListener('keypress', (e) => {
                        if(e.key === 'Enter') checkCode();
                    });
                }
            }
        });
    });

    modalWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('secret-block')) {
            e.target.classList.add('revealed');
        }
    });

    function showModal(content) {
        modalWrapper.innerHTML = content;
        modal.classList.remove('hidden');
        modal.style.opacity = 1;
        modal.style.pointerEvents = "auto";
    }

    closeBtn.addEventListener('click', () => {
        modal.style.opacity = 0;
        modal.style.pointerEvents = "none";
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    });

    window.openLightbox = function(src, isSensitive = false) {
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        
        img.src = src;
        
        img.className = ''; 
        if (isSensitive) {
            img.classList.add('sensitive-content');
        }
        
        lb.style.display = 'flex';
    };

    window.handleLightboxClick = function(event) {
        const img = document.getElementById('lightbox-img');
        
        if (event.target === img) {
            if (img.classList.contains('sensitive-content')) {
                img.classList.remove('sensitive-content');
                event.stopPropagation(); 
                return;
            }
        }
        
        closeLightbox();
    };

    window.closeLightbox = function() {
        document.getElementById('lightbox').style.display = 'none';
    };
});

console.log("%c훔쳐보는 취미가 있나 봐?", "color: #f1c40f; font-size: 20px; font-family: 'Times New Roman'; font-weight: bold;");
console.log("%c내 속을 다 안다고 착각하지 마. 역겨우니까.", "color: #ccc; font-size: 12px;");
