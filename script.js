const mainScreen = document.getElementById('main-screen');
const breathScreen = document.getElementById('breath-screen');
const trackContainer = document.getElementById('track-container');
const dot = document.getElementById('breathing-dot');
const textEl = document.getElementById('instruction-text');
const btnBack = document.getElementById('btn-back');

// 호흡 패턴 데이터 정의 (경로는 모두 하단 중앙에서 시작하도록 통일)
const breathData = {
    anxiety: { // 5-5 호흡 (원형)
        phases: ['들이쉬기', '내쉬기'],
        times: [5000, 5000],
        path: "path('M 120 240 A 120 120 0 0 1 120 0 A 120 120 0 0 1 120 240 Z')",
        animation: 'moveLinear 10s linear infinite',
        shapeClass: 'shape-circle'
    },
    stress: { // 4-4-4-4 박스 호흡 (사각형)
        phases: ['들이쉬기', '참기', '내쉬기', '참기'],
        times: [4000, 4000, 4000, 4000],
        path: "path('M 0 240 L 0 0 L 240 0 L 240 240 Z')",
        animation: 'moveLinear 16s linear infinite',
        shapeClass: 'shape-box'
    },
    insomnia: { // 3-7-8 호흡 (역삼각형)
        phases: ['들이쉬기', '참기', '내쉬기'],
        times: [3000, 7000, 8000],
        path: "path('M 120 240 L 0 0 L 240 0 Z')",
        animation: 'moveTriangleOffset 18s linear infinite',
        shapeClass: 'shape-triangle'
    }
};

let phaseTimer, fadeTimer;
let isBreathing = false;
let currentMode = null;
let step = 0;

// 버튼 이벤트 리스너 등록
document.querySelectorAll('.breath-button').forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.getAttribute('data-mode');
        startMode(breathData[mode]);
    });
});

function startMode(modeData) {
    currentMode = modeData;
    
    // 궤적 모양 및 점 애니메이션 설정
    trackContainer.className = `box-track ${currentMode.shapeClass}`;
    dot.style.offsetPath = currentMode.path;
    
    mainScreen.style.opacity = '0';
    setTimeout(() => {
        mainScreen.style.display = 'none';
        breathScreen.style.display = 'flex';
        setTimeout(() => {
            breathScreen.style.opacity = '1';
            
            // 초기화 후 실행
            isBreathing = true;
            step = 0;
            dot.style.animation = currentMode.animation;
            dot.style.animationPlayState = 'running';
            runPhase();
        }, 50);
    }, 500);
}

// 정확한 타이밍으로 텍스트를 교체하는 재귀 함수
function runPhase() {
    if (!isBreathing) return;

    textEl.innerText = currentMode.phases[step];
    textEl.style.opacity = '1'; // 페이드 인

    const currentDuration = currentMode.times[step];

    // 목표 시간 0.5초 전에 페이드 아웃 시작
    fadeTimer = setTimeout(() => {
        if (isBreathing) textEl.style.opacity = '0';
    }, currentDuration - 500);

    // 목표 시간에 정확히 다음 단계로 이행
    phaseTimer = setTimeout(() => {
        if (isBreathing) {
            step = (step + 1) % currentMode.phases.length;
            runPhase();
        }
    }, currentDuration);
}

// 메인 화면으로 복귀
btnBack.addEventListener('click', () => {
    isBreathing = false;
    clearTimeout(phaseTimer);
    clearTimeout(fadeTimer);
    
    dot.style.animationPlayState = 'paused';
    dot.style.animation = 'none'; 
    textEl.style.opacity = '0';

    breathScreen.style.opacity = '0';
    setTimeout(() => {
        breathScreen.style.display = 'none';
        mainScreen.style.display = 'flex';
        setTimeout(() => mainScreen.style.opacity = '1', 50);
    }, 500);
});
