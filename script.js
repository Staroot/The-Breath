const mainScreen = document.getElementById('main-screen');
const breathScreen = document.getElementById('breath-screen');
const btnStress = document.getElementById('btn-stress');
const btnBack = document.getElementById('btn-back');
const dot = document.getElementById('breathing-dot');
const textEl = document.getElementById('instruction-text');

let step = 0;
const phases = ['들이쉬기', '참기', '내쉬기', '참기'];

// 화면 전환 및 호흡 시작
btnStress.addEventListener('click', () => {
    mainScreen.style.opacity = '0';
    
    setTimeout(() => {
        mainScreen.style.display = 'none';
        breathScreen.style.display = 'flex';
        
        setTimeout(() => {
            breathScreen.style.opacity = '1';
            startBreathingCycle();
        }, 50);
    }, 500);
});

// 호흡 사이클 시작 (애니메이션 재생)
function startBreathingCycle() {
    step = 0;
    textEl.innerText = phases[step];
    
    // 점과 텍스트의 CSS 애니메이션을 동시에 시작
    dot.style.animationPlayState = 'running';
    textEl.style.animationPlayState = 'running';
}

// 핵심 로직: 텍스트 애니메이션(4초)이 한 사이클 끝날 때마다 발생하는 이벤트
textEl.addEventListener('animationiteration', () => {
    // 투명도가 0%인 상태(100% -> 0%로 넘어가는 순간)에서 글자 교체
    step = (step + 1) % phases.length;
    textEl.innerText = phases[step];
});

// 메인 화면으로 복귀
btnBack.addEventListener('click', () => {
    // 점과 텍스트의 애니메이션 정지 및 초기화
    dot.style.animationPlayState = 'paused';
    textEl.style.animationPlayState = 'paused';
    
    dot.style.animation = 'none'; 
    textEl.style.animation = 'none'; 
    
    // 리플로우 강제 발생시켜 애니메이션 초기화 적용
    void dot.offsetWidth;
    void textEl.offsetWidth; 
    
    // 애니메이션 속성 원상복구
    dot.style.animation = 'moveAroundBox 16s linear infinite';
    dot.style.animationPlayState = 'paused';
    textEl.style.animation = 'textPulse 4s linear infinite';
    textEl.style.animationPlayState = 'paused';

    breathScreen.style.opacity = '0';
    
    setTimeout(() => {
        breathScreen.style.display = 'none';
        mainScreen.style.display = 'flex';
        setTimeout(() => {
            mainScreen.style.opacity = '1';
        }, 50);
    }, 500);
});
