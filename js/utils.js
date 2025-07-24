/**
 * 유틸리티 함수 모음
 * 양식변환.html에서 분리된 유틸리티 함수들
 */

// 펫네임을 실제 모델명으로 변환하는 매핑 테이블
const MODEL_NAME_MAPPING = {
    // 갤럭시 S 시리즈  
    '갤럭시S25울트라': 'S938',
    '갤럭시S25+': 'S936',
    '갤럭시S25플러스': 'S936',
    '갤럭시S25': 'S931',
    '갤럭시S25엣지' : 'S937',
    '갤럭시엣지' : 'S937',
    'S25울트라': 'S938',
    'S25+': 'S936',
    'S25': 'S931',
    '갤럭시S24울트라': 'S928',
    '갤럭시S24+': 'S926', 
    '갤럭시S24': 'S921',
    'S24울트라': 'S928',
    'S24+': 'S926',
    'S24': 'S921',
    '갤럭시S23': 'S911',
    '갤럭시S23+': 'S916',
    '갤럭시S23울트라': 'S918',
    '갤럭시S22': 'S901',
    '갤럭시S22+': 'S906',
    '갤럭시S22울트라': 'S908',
    
    // 갤럭시 A 시리즈
    '갤럭시퀀텀5': 'A556',
    '갤럭시와이드8': 'M166',
    '갤럭시와이드8 (M166)': 'M166',
    '갤럭시A16' : 'A165',
    
    // 갤럭시 Z 시리즈 (폴드)
    '갤럭시Z폴드7': 'F966',
    '폴드7': 'F966',
    '갤럭시Z폴드6': 'F956',
    '갤럭시Z폴드5': 'F946',
    '갤럭시Z폴드4': 'F936',
    '갤럭시플립7': 'F766',
    '갤럭시Z플립7': 'F766',
    '플립7': 'F766',
    '갤럭시Z플립6': 'F741',
    '갤럭시Z플립5': 'F731',
    '갤럭시Z플립4': 'F721',
    // 추가적인 매핑은 여기에 계속 추가 가능
};

/**
 * 생년월일/주민번호를 yymmdd 형식으로 변환
 * @param {string} input - 입력 문자열
 * @returns {string} - 변환된 문자열
 */
function formatBirthDate(input) {
    if (!input) return '';
    
    // 문자열로 변환하고 공백 제거
    const cleanInput = String(input).trim();
    
    // 하이픈(-) 제거
    const withoutHyphen = cleanInput.replace(/-/g, '');
    
    // 앞 6자리만 추출 (yymmdd)
    const yymmdd = withoutHyphen.substring(0, 6);
    
    // 6자리 숫자인지 확인
    if (yymmdd.length === 6 && /^\d{6}$/.test(yymmdd)) {
        return yymmdd;
    }
    
    // 형식이 맞지 않으면 원본 반환
    return cleanInput;
}

/**
 * SK 통신사 요금제 자동 변환 함수
 * @param {string} planValue - 요금제 값
 * @param {string} telecom - 통신사 (SK, KT, LG)
 * @returns {string} - 변환된 요금제 값
 */
function convertSKPlan(planValue, telecom) {
    if (!planValue || telecom !== 'SK') return planValue;
    
    // 39가 포함된 요금제 자동 변환
    if (planValue.includes('39')) {
        const originalPlan = planValue;
        const convertedPlan = '컴팩트';
        
        alert(`요금제 자동 변환이 감지되었습니다.\n변환 전 요금제명: ${originalPlan}\n변환 후 요금제명: ${convertedPlan}`);
        
        return convertedPlan;
    }
    
    // 109가 포함된 요금제 자동 변환
    if (planValue.includes('109')) {
        const originalPlan = planValue;
        const convertedPlan = '프리미엄(T우주)';
        
        alert(`요금제 자동 변환이 감지되었습니다.\n변환 전 요금제명: ${originalPlan}\n변환 후 요금제명: ${convertedPlan}`);
        
        return convertedPlan;
    }
    
    return planValue;
}

// 모델명 변환 함수
function convertModelName(modelName) {
    if (!modelName) return modelName;
    
    // 입력된 모델명에서 공백과 특수문자 제거하여 정규화
    const normalizedInput = modelName.replace(/[\s\-_]/g, '').toLowerCase();
    
    // 용량 정보 미리 추출 (예: 256G, 512GB, 1TB 등)
    const capacityMatch = modelName.match(/(\d+(?:GB?|TB?))/i);
    const capacity = capacityMatch ? ' ' + capacityMatch[1] : '';
    
    // 매핑 테이블의 키들을 길이순으로 정렬 (긴 것부터 매칭하여 정확도 향상)
    const sortedMappings = Object.entries(MODEL_NAME_MAPPING)
        .sort(([a], [b]) => b.length - a.length);
    
    // 매핑 테이블에서 일치하는 펫네임 찾기
    for (const [petName, realModelName] of sortedMappings) {
        const normalizedPetName = petName.replace(/[\s\-_]/g, '').toLowerCase();
        
        // 정확한 매칭을 위해 다양한 방식으로 확인
        // 1. 완전 일치
        if (normalizedInput === normalizedPetName) {
            // console.log(`모델명 변환 (완전일치): ${modelName} → ${realModelName}${capacity}`);
            return realModelName + capacity;
        }
        
        // 2. 용량 제거 후 완전 일치
        const inputWithoutCapacity = normalizedInput.replace(/\d+(?:gb?|tb?)/i, '');
        if (inputWithoutCapacity === normalizedPetName) {
            // console.log(`모델명 변환 (용량제외일치): ${modelName} → ${realModelName}${capacity}`);
            return realModelName + capacity;
        }
        
        // 3. 시작 부분 매칭 (더 정확한 매칭을 위해)
        if (normalizedInput.startsWith(normalizedPetName)) {
            // 시작 매칭 후 남은 부분이 용량 정보인지 확인
            const remaining = normalizedInput.slice(normalizedPetName.length);
            if (!remaining || /^\d+(?:gb?|tb?)?$/i.test(remaining)) {
                // console.log(`모델명 변환 (시작매칭): ${modelName} → ${realModelName}${capacity}`);
                return realModelName + capacity;
            }
        }
    }
    
    // console.log(`모델명 변환 실패: ${modelName} (매핑되지 않음)`);
    return modelName; // 매핑되지 않은 경우 원본 반환
}

// 토스트 메시지 표시 함수
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // 2초 후에 토스트 숨기기
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// 선택한 URL 열기 함수
function openSelectedUrl() {
    const selectBox = document.getElementById('usefulUrls');
    const selectedValue = selectBox.value;
    
    if (selectedValue) {
        window.open(selectedValue, '_blank');
        // 선택박스 초기화
        selectBox.selectedIndex = 0;
    }
}

// 비밀번호 인증 기능
const CORRECT_PASSWORD = '5577'; // 원하는 4자리 비밀번호로 변경하세요

function checkPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (inputPassword.length !== 4) {
        showPasswordError('4자리 숫자를 입력해주세요.');
        return;
    }
    
    if (inputPassword === CORRECT_PASSWORD) {
        // 비밀번호가 맞으면 모달 숨기고 메인 콘텐츠 표시
        document.getElementById('passwordModal').style.display = 'none';
        document.querySelector('.main-content').style.display = 'block';
        
        // 자동 잠금 매니저가 있으면 잠금 해제
        if (typeof autoLockManager !== 'undefined' && autoLockManager) {
            autoLockManager.unlockApplication();
        } else {
            // 자동 잠금 매니저가 없으면 새로 생성 (최초 로그인 시)
            if (typeof AutoLockManager !== 'undefined') {
                autoLockManager = new AutoLockManager(); // 기본 설정 사용
                console.log(`자동 잠금 기능이 시작되었습니다. (${typeof AUTO_LOCK_TIMEOUT_MINUTES !== 'undefined' ? AUTO_LOCK_TIMEOUT_MINUTES : '기본'}분 후 자동 잠금)`);
            }
        }
        
        // 페이지 초기화 함수 호출 (기존에 있다면)
        if (typeof initializePage === 'function') {
            initializePage();
        }
    } else {
        showPasswordError('비밀번호가 올바르지 않습니다.');
    }
}

function showPasswordError(message) {
    const errorDiv = document.getElementById('passwordError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // 입력 필드 초기화 및 포커스
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
    
    // 3초 후 에러 메시지 숨기기
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// 비밀번호 이벤트 리스너 설정
function setupPasswordEvents() {
    // 페이지 로드 시 비밀번호 입력 필드에 포커스
    window.addEventListener('load', function() {
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.focus();
        }
    });

    // Enter 키로 비밀번호 확인
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });

        // 숫자만 입력 가능하도록 제한 + 4자리 입력 시 자동 확인
        passwordInput.addEventListener('input', function(e) {
            const value = e.target.value;
            const numericValue = value.replace(/[^0-9]/g, '');
            if (value !== numericValue) {
                e.target.value = numericValue;
            }
            
            // 4자리가 입력되면 자동으로 비밀번호 확인
            if (numericValue.length === 4) {
                setTimeout(() => {
                    checkPassword();
                }, 100); // 약간의 지연을 두어 UI 업데이트 후 실행
            }
        });
    }
}

// 클립보드에 복사 후 피드백을 제공하는 함수
function copyToClipboardWithFeedback(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        // 복사 성공 표시
        element.classList.add('copied');
        
        // 1.5초 후 복사 성공 표시 제거
        setTimeout(() => {
            element.classList.remove('copied');
        }, 1500);
        
        // 화면 중앙에 복사 성공 알림 표시
        const copyNotice = document.createElement('div');
        copyNotice.className = 'copy-success';
        copyNotice.textContent = '복사됨!';
        copyNotice.style.position = 'fixed';
        copyNotice.style.top = '50%';
        copyNotice.style.left = '50%';
        copyNotice.style.transform = 'translate(-50%, -50%)';
        copyNotice.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
        copyNotice.style.color = 'white';
        copyNotice.style.padding = '10px 20px';
        copyNotice.style.borderRadius = '5px';
        copyNotice.style.zIndex = '2000';
        copyNotice.style.transition = 'opacity 0.3s';
        
        document.body.appendChild(copyNotice);
        
        // 1초 후 알림 페이드아웃
        setTimeout(() => {
            copyNotice.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(copyNotice);
            }, 300);
        }, 1000);
    }).catch(err => {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다.');
    });
}

// 결과 복사 함수
function copyToClipboard() {
    // 키-값 테이블이 표시되어 있는지 확인
    const keyValueTableContainer = document.getElementById('keyValueTableContainer');
    if (keyValueTableContainer && keyValueTableContainer.style.display !== 'none') {
        alert('키-값 테이블에서는 각 항목을 클릭하여 개별적으로 복사해주세요.');
        return;
    }
    
    // SK-큐브의 경우 여러 텍스트에리어가 있을 수 있음
    const outputText1 = document.getElementById('outputText1');
    const outputText2 = document.getElementById('outputText2');
    const outputText = document.getElementById('outputText');
    
    let textToCopy = '';
    let elementToCopy = null;
    
    if (outputText1 && outputText1.style.display !== 'none' && outputText1.value.trim() !== '') {
        textToCopy = outputText1.value;
        elementToCopy = outputText1;
    } else if (outputText2 && outputText2.style.display !== 'none' && outputText2.value.trim() !== '') {
        textToCopy = outputText2.value;
        elementToCopy = outputText2;
    } else if (outputText && outputText.value.trim() !== '') {
        textToCopy = outputText.value;
        elementToCopy = outputText;
    } else {
        alert('복사할 텍스트가 없습니다.');
        return;
    }
    
    // 클립보드 API를 사용하여 복사
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // 복사 완료 표시
                const originalBgColor = elementToCopy.style.backgroundColor;
                elementToCopy.style.backgroundColor = '#e6ffe6';
                
                setTimeout(() => {
                    elementToCopy.style.backgroundColor = originalBgColor;
                }, 500);
                
                // 화면 중앙에 복사 성공 알림 표시
                const copyNotice = document.createElement('div');
                copyNotice.className = 'copy-success';
                copyNotice.textContent = '복사됨!';
                copyNotice.style.position = 'fixed';
                copyNotice.style.top = '50%';
                copyNotice.style.left = '50%';
                copyNotice.style.transform = 'translate(-50%, -50%)';
                copyNotice.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
                copyNotice.style.color = 'white';
                copyNotice.style.padding = '10px 20px';
                copyNotice.style.borderRadius = '5px';
                copyNotice.style.zIndex = '2000';
                copyNotice.style.transition = 'opacity 0.3s';
                
                document.body.appendChild(copyNotice);
                
                // 1초 후 알림 페이드아웃
                setTimeout(() => {
                    copyNotice.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(copyNotice);
                    }, 300);
                }, 1000);
            })
            .catch(err => {
                console.error('복사 실패:', err);
                alert('복사에 실패했습니다.');
            });
    } else {
        // 예전 방식 사용 (Clipboard API가 지원되지 않는 경우)
        elementToCopy.select();
        document.execCommand('copy');
        
        // 복사 완료 표시
        const originalBgColor = elementToCopy.style.backgroundColor;
        elementToCopy.style.backgroundColor = '#e6ffe6';
        
        setTimeout(() => {
            elementToCopy.style.backgroundColor = originalBgColor;
        }, 500);
        
        // 알림 표시
        alert('텍스트가 복사되었습니다.');
    }
}

// 더블클릭 이벤트 핸들러
function handleDoubleClick(event) {
    const textarea = event.target;
    
    // 텍스트 선택
    textarea.select();
    
    // 클립보드에 복사
    navigator.clipboard.writeText(textarea.value).then(() => {
        // 복사 성공 시 시각적 피드백
        const originalBorder = textarea.style.border;
        textarea.style.border = '2px solid #4CAF50';
        textarea.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.3)';
        
        // 토스트 메시지 표시
        showToast('클립보드에 복사되었습니다!');
        
        // 0.5초 후에 원래 스타일로 복원
        setTimeout(() => {
            textarea.style.border = originalBorder;
            textarea.style.boxShadow = '';
        }, 500);
    }).catch(err => {
        console.error('클립보드 복사 오류:', err);
        alert('복사 중 오류가 발생했습니다.');
    });
}

// 텍스트에리어 더블클릭 복사 함수
function setupDoubleClickCopy() {
    // 출력 컨테이너에 이벤트 위임 방식으로 더블클릭 이벤트 추가
    const outputContainer = document.getElementById('outputContainer');
    
    // 기존 이벤트 리스너 제거 (중복 방지)
    outputContainer.removeEventListener('dblclick', handleTextareaDoubleClick);
    
    // 이벤트 위임을 사용하여 동적으로 추가된 textarea에도 적용
    outputContainer.addEventListener('dblclick', handleTextareaDoubleClick);
}

// 이벤트 위임을 위한 핸들러
function handleTextareaDoubleClick(event) {
    // 이벤트가 발생한 요소가 textarea인지 확인
    if (event.target.tagName === 'TEXTAREA') {
        handleDoubleClick(event);
    }
}

// 전역 함수로 노출
window.formatBirthDate = formatBirthDate;
window.convertSKPlan = convertSKPlan;
window.convertModelName = convertModelName;
window.showToast = showToast;
window.openSelectedUrl = openSelectedUrl;
window.checkPassword = checkPassword;
window.showPasswordError = showPasswordError;
window.copyToClipboardWithFeedback = copyToClipboardWithFeedback;
window.copyToClipboard = copyToClipboard;
window.handleDoubleClick = handleDoubleClick;
window.setupDoubleClickCopy = setupDoubleClickCopy;
window.handleTextareaDoubleClick = handleTextareaDoubleClick;
window.MODEL_NAME_MAPPING = MODEL_NAME_MAPPING;
window.CORRECT_PASSWORD = CORRECT_PASSWORD;

// ========================================
// 파싱 관련 유틸리티 함수들
// ========================================

// 향상된 부가서비스와 보험 분리 함수
function parseAddonAndInsuranceEnhanced(addonText) {
    if (!addonText) {
        return { 보험: '', 부가서비스1: '', 부가서비스2: '' };
    }
    
    // 보험 관련 키워드 정의 (더 포괄적)
    const insuranceKeywords = [
        'T올케어', 'T ALL케어', 'T All케어', '올케어', '케어플러스', '케어',
        '단말보험', '보험', '스마트케어', '안심케어', '케어서비스',
        '보장서비스', '분실보험', '파손보험', '파손', '분실'
    ];
    
    // 부가서비스 관련 키워드 정의
    const addonKeywords = [
        '우주패스', '마이스마트콜', '스마트콜', '벨소리', '컬러링',
        '네이버플러스', '멜론', '지니뮤직', '플로', '티맵', '네비게이션',
        '클라우드', '백업', '바이브', '카카오VIP', '모바일TV', 'DMB',
        '데이터쉐어링', '패밀리플러스', '아이들나라', '키즈랜드'
    ];
    
    // 불필요한 기간/횟수 정보 패턴 (웨이브는 제외)
    const unwantedPatterns = [
        /\s*M\+\d+\s*개월/gi,
        /\s*M\+\d+/gi,
        /\s*총\s*\d+\s*개월/gi,
        /\d+\s*개월\s*무료/gi,
        /\s*무료\s*\d+/gi,
        /\(\s*총\s*\d+\s*개월\s*유지\s*\)/gi,  // 유지 텍스트가 포함된 경우만 제거
        /\(\s*총\s*\d+\s*개월\s*\)/gi,          // 유지 텍스트가 없는 경우
        /\(\s*유지\s*\)/gi,                       // (유지)만 있는 경우
        /\s*유지\s*/gi,                          // ' 유지' 단독 또는 띄어쓰기 포함
        // 새로 추가할 패턴들
        /\(\s*\d+\s*개월\s*유지\s*\)/gi,         // (3개월유지)
        /\(\s*\d+\s*달\s*유지\s*\)/gi,           // (2달유지)
        /\(\s*익월말\s*\)/gi,                    // (익월말)
        /\(\s*\d+\s*개월\s*\)/gi,                // (3개월)
        /\(\s*\d+\s*달\s*\)/gi,                  // (2달)
        /\s*\d+\s*개월\s*유지/gi,                // 3개월유지
        /\s*\d+\s*달\s*유지/gi,                  // 2달유지
        /\s*익월말/gi,                           // 익월말
        /\s*총\s*\d+\s*개월\s*유지/gi,           // 총 9개월 유지
        /\s*회선유지기간\s*M\+\d+.*/gi           // 회선유지기간 M+8(총 9개월)
    ];
    
    let insuranceItems = [];
    let addonItems1 = [];
    let addonItems2 = [];
    
    // 주요 구분자로 분리 (/, +, 번호순서 등)
    let items = [];
    
    // 먼저 "/숫자." 패턴으로 분리 시도
    if (addonText.includes('/') && /\/\s*\d+\.\s*/.test(addonText)) {
        items = addonText.split(/\/\s*\d+\.\s*/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        // 첫 번째 항목에서 "숫자." 제거
        if (items[0] && /^\d+\.\s*/.test(items[0])) {
            items[0] = items[0].replace(/^\d+\.\s*/, '').trim();
        }
    } else if (addonText.includes('+')) {
        // "+" 구분자로 분리 (우주패스 + 마이스마트콜3 같은 경우)
        items = addonText.split(/\s*\+\s*/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        // 익월말(2달유지) 형태가 별도로 분리된 경우 제거
        items = items.filter(item => !/^익월말\s*\(\s*\d+\s*달\s*유지\s*\)\s*$/i.test(item));
    } else {
        // 일반적인 "/" 구분자로 분리
        items = addonText.split('/')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }
    
    console.log('분리된 항목들:', items);
    
    for (let item of items) {
        // 1단계: 불필요한 기간/회수 패턴들을 제거 (M+숫자, 총숫자개월 등)
        let cleanItem = item;
        for (const pattern of unwantedPatterns) {
            cleanItem = cleanItem.replace(pattern, '').trim();
        }
        
        // 2단계: 빈 괄호만 제거 (내용이 있는 괄호는 보존)
        cleanItem = cleanItem.replace(/\(\s*\)/g, '').trim();
        
        // 3단계: 앞뒤 공백 및 특수문자 정리
        cleanItem = cleanItem.replace(/^[-\s]+|[-\s]+$/g, '').trim();
        
        // 4단계: "유지" 텍스트가 단독으로 남은 경우 제거
        if (cleanItem === '유지' || cleanItem === '(유지)') {
            cleanItem = '';
        }
        
        // 5단계: 숫자만 남은 경우 제거 (2달, 3개월 등)
        if (/^\s*\d+\s*(달|개월)\s*$/i.test(cleanItem)) {
            cleanItem = '';
        }
        
        // 6단계: 익월말만 남은 경우 제거
        if (cleanItem.trim() === '익월말') {
            cleanItem = '';
        }
        
        // 7단계: 익월말(숫자달유지) 형태 제거
        if (/^익월말\s*\(\s*\d+\s*달\s*유지\s*\)\s*$/i.test(cleanItem)) {
            cleanItem = '';
        }
        
        // 정리 후 빈 문자열이면 스킵
        if (!cleanItem || cleanItem.length < 2) {
            continue;
        }
        
        console.log('정리된 항목:', cleanItem);
        
        let isInsurance = false;
        let isAddon = false;
        
        // 보험 키워드 확인
        for (const keyword of insuranceKeywords) {
            if (cleanItem.toLowerCase().includes(keyword.toLowerCase())) {
                // 보험 항목에서 괄호 안의 숫자 제거 (예: T ALL케어플러스5 파손80(5300) -> T ALL케어플러스5 파손80)
                let insuranceItem = cleanItem.replace(/\(\s*\d+\s*\)/g, '').trim();
                insuranceItems.push(insuranceItem);
                isInsurance = true;
                console.log('보험으로 분류:', insuranceItem);
                break;
            }
        }
        
        // 보험이 아닌 경우 부가서비스 키워드 확인
        if (!isInsurance) {
            for (const keyword of addonKeywords) {
                if (cleanItem.toLowerCase().includes(keyword.toLowerCase())) {
                    // 마이스마트콜은 자동으로 마이스마트콜3로 보정
                    if (keyword === '마이스마트콜' && cleanItem.toLowerCase().includes('마이스마트콜')) {
                        cleanItem = '마이스마트콜3';
                    }
                    
                    // 첫 번째 부가서비스가 비어있으면 첫 번째에, 아니면 두 번째에
                    if (addonItems1.length === 0) {
                        addonItems1.push(cleanItem);
                        console.log('부가서비스1로 분류:', cleanItem);
                    } else {
                        addonItems2.push(cleanItem);
                        console.log('부가서비스2로 분류:', cleanItem);
                    }
                    isAddon = true;
                    break;
                }
            }
        }
        
        // 키워드에 매칭되지 않은 경우 길이로 판단
        if (!isInsurance && !isAddon && cleanItem.length >= 3) {
            // 우주패스나 G마켓 등이 포함된 경우 부가서비스로 분류
            if (cleanItem.includes('우주') || cleanItem.includes('G마켓') || cleanItem.includes('쇼핑')) {
                if (addonItems1.length === 0) {
                    addonItems1.push(cleanItem);
                    console.log('부가서비스1로 분류 (키워드 기반):', cleanItem);
                } else {
                    addonItems2.push(cleanItem);
                    console.log('부가서비스2로 분류 (키워드 기반):', cleanItem);
                }
            } else {
                // 기타 긴 텍스트는 부가서비스로 분류
                if (addonItems1.length === 0) {
                    addonItems1.push(cleanItem);
                    console.log('부가서비스1로 분류 (기타):', cleanItem);
                } else {
                    addonItems2.push(cleanItem);
                    console.log('부가서비스2로 분류 (기타):', cleanItem);
                }
            }
        }
    }
    
    return {
        보험: insuranceItems.join(' / '),
        부가서비스1: addonItems1.join(' / '),
        부가서비스2: addonItems2.join(' / ')
    };
}

// 기존 부가서비스와 보험 분리 함수 (호환성 유지)
function parseAddonAndInsurance(addonText) {
    if (!addonText) {
        return { 보험: '', 부가서비스: '' };
    }
    
    // 보험 관련 키워드 정의
    const insuranceKeywords = [
        'T All케어플러스',
        'T All케어',
        '케어플러스',
        '단말보험',
        '보험',
        '스마트케어',
        '안심케어',
        '케어서비스',
        '보장서비스',
        '분실보험',
        '파손보험'
    ];
    
    // 부가서비스 관련 키워드 정의  
    const addonKeywords = [
        '마이스마트콜',
        '스마트콜',
        '벨소리',
        '컬러링',
        '네이버플러스',
        '멜론',
        '지니뮤직',
        '플로',
        '티맵',
        '네비게이션',
        '클라우드',
        '백업',
        '바이브',
        '카카오VIP',
        '모바일TV',
        'DMB',
        '데이터쉐어링',
        '패밀리플러스',
        '아이들나라',
        '키즈랜드'
    ];
    
    // 불필요한 기간/횟수 정보 패턴 정의
    const unwantedPatterns = [
        /M\+\d+(?:개월)?/gi,           // M+1개월, M+2 등
        /\(총\s*\d+개월\)/gi,          // (총 2개월) 등
        /\(총\s*\d+\)/gi,              // (총 3) 등
        /총\s*\d+개월/gi,              // 총 2개월 등
        /무료\s*\d+/gi,                // 무료 3 등
        /\d+\s*개월\s*무료/gi          // 3개월 무료 등
    ];
    
    let insuranceItems = [];
    let addonItems = [];
    
    // "/" 구분자로 분리
    const items = addonText.split('/')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    
    for (let item of items) {
        // 불필요한 패턴들을 제거
        let cleanItem = item;
        for (const pattern of unwantedPatterns) {
            cleanItem = cleanItem.replace(pattern, '').trim();
        }
        
        // 빈 괄호만 제거 (내용이 있는 괄호는 보존)
        cleanItem = cleanItem.replace(/\(\s*\)/g, '').trim();
        
        // 앞뒤 공백 및 특수문자 정리
        cleanItem = cleanItem.replace(/^[-\s]+|[-\s]+$/g, '').trim();
        
        // 정리 후 빈 문자열이면 스킵
        if (!cleanItem || cleanItem.length < 2) {
            continue;
        }
        
        // 보험 키워드 확인
        let isInsurance = false;
        for (const keyword of insuranceKeywords) {
            if (cleanItem.toLowerCase().includes(keyword.toLowerCase())) {
                insuranceItems.push(cleanItem);
                isInsurance = true;
                break;
            }
        }
        
        // 보험이 아닌 경우 부가서비스로 분류
        if (!isInsurance) {
            addonItems.push(cleanItem);
        }
    }
    
    return {
        보험: insuranceItems.join(' / '),
        부가서비스: addonItems.join(' / ')
    };
}

// 가입유형, 할인유형, 현재통신사 파싱 함수 (원본과 동일한 복잡한 로직)
function parseSubscriptionAndDiscountInfo(customerInfo) {
    let subscriptionType = customerInfo['가입유형'] || '';
    let discountType = customerInfo['할인유형'] || '';
    let currentTelecom = customerInfo['현재통신사'] || '';
    let originalTelecomText = currentTelecom; // Store original for reference
    let discountMonths = '';
    let foundSubscription = false;
    let foundDiscountInSubscription = false;
    let isNormalCase = false; // Flag to check if this is a normal case (no need for special handling)

    // Define patterns for subscription types
    const subscriptionPatterns = {
        '번호이동': /(번호\s*이동|번\s*이|번호\s*변경|번호\s*이전)/,
        '기기변경': /(기기\s*변경|기변|기기\s*교체)/,
        '신규가입': /(신규|신규\s*가입|신\s*가)/,
        '보상기변': /(보상기변|보상\s*기변|보상\s*기기\s*변경)/
    };

    // Define patterns for discount types
    const discountPatterns = {
        '공시지원': /(공시\s*지원|공시)/,
        '선택약정': /(선택\s*약정|선약)/,
        '선약': /(선약|선\s*약)/
    };
    
    // Major telecom providers only (SK, KT, LG)
    const majorTelecomProviders = {
        'SK': /^(SK|에스케이|SKT|SK텔레콤|에스케이텔레콤)$/i,
        'KT': /^(KT|케이티|KT올레|케이티텔레콤)$/i,
        'LG': /^(LG|엘지|LG U\+|엘지유플러스|LG유플러스)$/i
    };

    // 1. First, check if discountType is empty and subscriptionType contains discount info
    if (!discountType && subscriptionType) {
        // Check for discount type patterns in subscriptionType
        for (const [type, pattern] of Object.entries(discountPatterns)) {
            if (pattern.test(subscriptionType)) {
                // Extract months if available (e.g., '24개월' or '24')
                const monthMatch = subscriptionType.match(/(\d+)\s*개?월?/);
                if (monthMatch) {
                    discountMonths = monthMatch[1] + '개월';
                    // Remove the months from subscriptionType
                    subscriptionType = subscriptionType.replace(monthMatch[0], '').trim();
                }
                // Set the discount type
                discountType = type;
                // Remove the discount type from subscriptionType
                subscriptionType = subscriptionType.replace(pattern, '').trim();
                foundDiscountInSubscription = true;
                break;
            }
        }
        
        // Special case: '공시' is treated as '공시지원'
        if (discountType === '공시') {
            discountType = '공시지원';
        }
    }
    // If discountType is provided, process it normally
    else if (discountType) {
        // Check for discount type patterns and extract months
        for (const [type, pattern] of Object.entries(discountPatterns)) {
            if (pattern.test(discountType)) {
                // Extract months if available (e.g., '24개월' or '24')
                const monthMatch = discountType.match(/(\d+)\s*개?월?/);
                if (monthMatch) {
                    discountMonths = monthMatch[1] + '개월';
                    // Remove the months from discountType
                    discountType = discountType.replace(monthMatch[0], '').trim();
                }
                // Normalize the discount type
                discountType = type;
                break;
            }
        }
        
        // Special case: '공시' is treated as '공시지원'
        if (discountType === '공시') {
            discountType = '공시지원';
        }
        
        // For 공시지원, set default 24 months if not specified
        if (discountType === '공시지원' && !discountMonths) {
            discountMonths = '24개월';
        }
    }
    
    if (currentTelecom) {
        const telecomText = currentTelecom.trim();
        
        // Check for subscription type patterns in currentTelecom
        for (const [type, pattern] of Object.entries(subscriptionPatterns)) {
            if (pattern.test(telecomText)) {
                // If we find a subscription type in currentTelecom, use it
                subscriptionType = type;
                foundSubscription = true;
                // Remove the subscription type from currentTelecom
                currentTelecom = telecomText.replace(pattern, '').trim();
                break;
            }
        }
        
        // Clean up currentTelecom (remove any remaining dashes, spaces, etc.)
        currentTelecom = currentTelecom.replace(/^[\s\-]+|[\s\-]+$/g, '').trim();
        
        // If currentTelecom is empty after removing subscription type, set it to empty
        if (!currentTelecom) {
            currentTelecom = '';
        }
    }

    // 2. Now check if subscriptionType contains discount info
    if (subscriptionType) {
        // First, check for discount type with months (e.g., "공시지원 24개월")
        const discountWithMonths = subscriptionType.match(/(공시\s*지원|공시|선택\s*약정|선약)\s*(\d+)\s*개?월?/i);
        if (discountWithMonths) {
            const [fullMatch, discount, months] = discountWithMonths;
            discountType = discount.includes('공시') ? '공시지원' : 
                          discount.includes('선약') ? '선택약정' : discount;
            discountMonths = months + '개월';
            foundDiscountInSubscription = true;
            subscriptionType = subscriptionType.replace(fullMatch, '').trim();
        } 
        // If no months pattern, just check for discount type
        else {
            for (const [type, pattern] of Object.entries(discountPatterns)) {
                if (pattern.test(subscriptionType)) {
                    discountType = type;
                    foundDiscountInSubscription = true;
                    // Remove discount info from subscriptionType
                    subscriptionType = subscriptionType.replace(pattern, '').trim();
                    break;
                }
            }
        }
    }

    // 4. Extract telecom provider from subscriptionType if currentTelecom is empty
    if ((!currentTelecom || currentTelecom.trim() === '') && subscriptionType) {
        const subscriptionKeywords = ['번호이동', '번이', '신규가입', '신규', '보상기변', '기기변경', '기변'];
        const subscriptionPattern = new RegExp(`(${subscriptionKeywords.join('|')})[\s\-]*(.*)`, 'i');
        const match = subscriptionType.match(subscriptionPattern);
        
        if (match && match[1] && match[2]) {
            // Found a subscription type and telecom provider in subscriptionType
            const subType = match[1].trim();
            const telecom = match[2].trim();
            
            // Map shortened forms to full forms
            const subscriptionMap = {
                '번이': '번호이동',
                '신규': '신규가입',
                '기변': '기기변경',
                '보상기변': '기기변경'
            };
            
            // Set subscription type (convert to full form if needed)
            subscriptionType = subscriptionMap[subType] || subType;
            
            // Set currentTelecom to the remaining text
            currentTelecom = telecom;
            foundSubscription = true;
        }
    }
    
    // 5. Final cleanup and validation
    if (!isNormalCase) {
        // Clean up subscription type
        if (subscriptionType) {
            subscriptionType = subscriptionType
                .replace(/[\s\-]+/g, ' ')
                .trim();
            
            // If subscriptionType is not a valid type, try to extract it from currentTelecom
            if (!/(기기변경|번호이동|신규가입|기변|번이|신규|보상기변)/.test(subscriptionType) && currentTelecom) {
                const telecomText = currentTelecom.trim();
                if (telecomText.includes('기기변경') || telecomText.includes('기변') || telecomText.includes('보상기변')) {
                    subscriptionType = '기기변경';
                    currentTelecom = telecomText
                        .replace(/(기기변경|기변|보상기변)/g, '')
                        .trim()
                        .replace(/^[\s\-]+|[\s\-]+$/g, '');
                } else if (telecomText.includes('번호이동') || telecomText.includes('번이')) {
                    subscriptionType = '번호이동';
                    currentTelecom = telecomText
                        .replace(/(번호이동|번이)/g, '')
                        .trim()
                        .replace(/^[\s\-]+|[\s\-]+$/g, '');
                } else if (telecomText.includes('신규가입') || telecomText.includes('신규')) {
                    subscriptionType = '신규가입';
                    currentTelecom = telecomText
                        .replace(/(신규가입|신규)/g, '')
                        .trim()
                        .replace(/^[\s\-]+|[\s\-]+$/g, '');
                }
            }
        }
        
        // If we still don't have a subscription type, try to determine from the text
        if (!subscriptionType || subscriptionType === '') {
            const allText = [currentTelecom, subscriptionType, discountType].join(' ');
            if (allText.includes('기변') || allText.includes('기기변경')) {
                subscriptionType = '기기변경';
            } else if (allText.includes('번이') || allText.includes('번호이동')) {
                subscriptionType = '번호이동';
            } else if (allText.includes('신규')) {
                subscriptionType = '신규가입';
            }
        }
    }

    // 5. Set contract type and months for specific discount types
    let contractType = '';
    if (discountType === '공시지원') {
        contractType = '공시지원';
        if (!discountMonths) {
            discountMonths = '24개월'; // Default for 공시지원
        }
    } else if (discountType === '선택약정' || discountType === '선약') {
        contractType = '선택약정';
    }

    // 6. Clean up currentTelecom - remove any remaining subscription or discount type indicators
    for (const pattern of Object.values(subscriptionPatterns).concat(Object.values(discountPatterns))) {
        currentTelecom = currentTelecom.replace(pattern, '').trim();
    }
    
    // Remove any numbers followed by '개월' or '개' from currentTelecom
    currentTelecom = currentTelecom.replace(/\d+\s*개?월?/g, '').trim();

    return {
        subscriptionType: subscriptionType,
        discountType: discountType,
        currentTelecom: currentTelecom,
        discountMonths: discountMonths,
        contractType: contractType,
        original: {
            subscriptionType: customerInfo['가입유형'] || '',
            discountType: customerInfo['할인유형'] || '',
            currentTelecom: customerInfo['현재통신사'] || ''
        }
    };
}

// ========================================
// 데이터 관리 관련 유틸리티 함수들
// ========================================

// 모델 데이터베이스 설정
const MODEL_STORAGE_KEY = 'deviceModelDatabase_v1'; // 변경이력관리와 구분되는 고유 키
let deviceModelDatabase = {};

// 기본 모델 데이터 (초기값으로 사용)
const defaultDeviceModels = {
    // 삼성
    "SM-S921N": { name: "갤럭시S24", brand: "삼성" },
    "SM-S926N": { name: "갤럭시S24+", brand: "삼성" },
    "SM-S928N": { name: "갤럭시S24 Ultra", brand: "삼성" },
    "SM-F946N": { name: "갤럭시Z폴드5", brand: "삼성" },
    "SM-F731N": { name: "갤럭시Z플립5", brand: "삼성" },
    "SM-S911N": { name: "갤럭시S23", brand: "삼성" },
    "SM-S916N": { name: "갤럭시S23+", brand: "삼성" },
    "SM-S918N": { name: "갤럭시S23 Ultra", brand: "삼성" },
    "SM-S931N": { name: "갤럭시S25", brand: "삼성"},
    "SM-S936N": { name: "갤럭시S25+", brand: "삼성"},
    "SM-S938N": { name: "갤럭시S25 Ultra", brand: "삼성"},
    
    // 애플
    "A2892": { name: "아이폰15", brand: "애플" },
    "A2846": { name: "아이폰15 Pro", brand: "애플" },
    "A2890": { name: "아이폰15 Pro Max", brand: "애플" },
    "A2882": { name: "아이폰14", brand: "애플" },
    "A2893": { name: "아이폰14 Pro", brand: "애플" },
    "A2895": { name: "아이폰14 Pro Max", brand: "애플" }
};

// localStorage에서 모델 데이터 로드
function loadModelsFromStorage() {
    try {
        const savedData = localStorage.getItem(MODEL_STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (e) {
        console.error('모델 데이터 로드 중 오류 발생:', e);
    }
    return null;
}

// 모델 데이터를 localStorage에 저장
function saveModelsToStorage() {
    try {
        localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(deviceModelDatabase));
        return true;
    } catch (e) {
        console.error('모델 데이터 저장 중 오류 발생:', e);
        return false;
    }
}

// 기본 모델로 초기화하는 함수
function resetToDefaultModels() {
    deviceModelDatabase = JSON.parse(JSON.stringify(defaultDeviceModels));
    saveModelsToStorage();
    console.log('모델 데이터가 기본값으로 초기화되었습니다.');
    return true;
}

// 모델 데이터베이스 초기화 (저장된 데이터가 없으면 기본값 사용)
function initializeModelDatabase() {
    const savedModels = loadModelsFromStorage();
    if (savedModels && Object.keys(savedModels).length > 0) {
        deviceModelDatabase = savedModels;
        console.log('저장된 모델 데이터를 불러왔습니다.');
    } else {
        resetToDefaultModels();
        console.log('기본 모델 데이터를 사용합니다.');
    }
}

// 모델 검색 함수
function searchDeviceModel(query) {
    if (!query) return [];
    
    query = query.toLowerCase().trim();
    const results = [];
    
    // 모델명, 모델번호, 브랜드명으로 검색
    for (const [modelNumber, model] of Object.entries(deviceModelDatabase)) {
        if (modelNumber.toLowerCase().includes(query) || 
            model.name.toLowerCase().includes(query) ||
            model.brand.toLowerCase().includes(query)) {
            results.push({ modelNumber, ...model });
        }
    }
    
    return results;
}

// 검색 결과 표시 함수
function displayDeviceSearchResults(results) {
    const resultsContainer = document.getElementById('modelSearchResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 10px; color: #888;">검색 결과가 없습니다.</div>';
        resultsContainer.style.display = 'block';
        return;
    }
    
    results.forEach(model => {
        const item = document.createElement('div');
        item.className = 'model-result';
        item.style.padding = '10px';
        item.style.borderBottom = '1px solid #eee';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div style="font-weight: bold;">${model.name}</div>
            <div style="font-size: 0.9em; color: #666;">
                <span>${model.brand}</span> · 
                <span>${model.modelNumber}</span>
            </div>
        `;
        
        // 클릭 이벤트 - 선택한 모델의 번호를 클립보드에 복사
        item.addEventListener('click', (event) => {
            event.preventDefault();
            
            navigator.clipboard.writeText(model.modelNumber).then(() => {
                const searchInput = document.getElementById('modelSearch');
                if (searchInput) searchInput.value = model.name;
                resultsContainer.style.display = 'none';
                
                if (typeof showToast === 'function') {
                    showToast(`모델 번호가 복사되었습니다: ${model.modelNumber} (${model.name})`);
                }
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
                if (typeof showToast === 'function') {
                    showToast('모델 번호 복사에 실패했습니다.');
                }
            });
        });
        
        resultsContainer.appendChild(item);
    });
    
    resultsContainer.style.display = 'block';
}

// ========================================
// 고객 정보 추출 관련 유틸리티 함수
// ========================================

// 텍스트에서 고객 정보 추출
function extractCustomerInfo(text) {
    const customerInfo = {};
    
    // 정규식 패턴으로 각 항목 추출
    const patterns = {
        '전화번호': /\*{1,2}(?:전\s*화\s*번\s*호|개\s*통\s*번\s*호)\s*[-:：]\s*([^\n]+)/i,
        '개통번호': /\*{1,2}(?:전\s*화\s*번\s*호|개\s*통\s*번\s*호)\s*[-:：]\s*([^\n]+)/i,
        '모델명': /\*{1,2}모\s*델\s*명\s*[-:：]\s*([^\n]+)/i,
        '색상': /\*{1,2}색\s*상\s*[-:：]\s*([^\n]+)/i,
        '고객명': /\*{1,2}(?:고\s*객\s*명|가\s*입\s*자\s*명)\s*[-:：]\s*([^\n]+)/i,
        '가입자명': /\*{1,2}(?:고\s*객\s*명|가\s*입\s*자\s*명)\s*[-:：]\s*([^\n]+)/i,
        '주민번호': /\*{1,2}(?:주\s*민\s*번\s*호|생\s*년\s*월\s*일)\s*[-:：]\s*([^\n]+)/i,
        '생년월일': /\*{1,2}(?:주\s*민\s*번\s*호|생\s*년\s*월\s*일)\s*[-:：]\s*([^\n]+)/i,
        '택배주소': /\*{1,2}택\s*배\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*([^\n]+)/i,
        '배송주소지': /\*{1,2}(?:택\s*배|배\s*송)\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*([^\n]+)/i,
        '현재통신사': /\*{1,2}현\s*재\s*통\s*신\s*사\s*[-:：]\s*([^\n]+)/i,
        '요금제': /\*{1,2}요\s*금\s*제\s*[-:：]\s*([^\n]+)/i,
        '가입유형': /\*{1,2}가\s*입\s*유\s*형\s*[-:：]\s*([^\n]+)/i,
        '할인유형': /\*{1,2}할\s*인\s*(?:유\s*형|방\s*식)\s*[-:：]\s*([^\n]+)/i,
        '유심': /\*{1,2}(?:유\s*심|이\s*심)\s*(?:비\s*용)?\s*[-:：]\s*([^\n]+)/i,
        '부가서비스': /\*{1,2}(?:부\s*가\s*서\s*비\s*스\s*[-:：]\s*([^\n]+)|올케어\s*\(보험\)\s*([^\n]+))/i,
        '보험': /\*{1,2}보\s*험\s*[-:：]\s*([^\n]+)/i,
        '법대정보': /\*{1,2}법\s*대\s*정\s*보\s*[-:：]\s*([^/]+)\s*\/\s*([^/]+)\s*\/\s*([^/]+)/i
    };
    
    // 각 패턴에 맞게 정보 추출
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = text.match(pattern);
        if (match) {
            if (key === '법대정보') {
                // 법대정보가 있는 경우 (미성년자)
                customerInfo['미성년자여부'] = 'Y';
                
                // 세 개의 그룹을 모두 가져옴
                let firstItem = match[1].trim();
                let secondItem = match[2].trim();
                let thirdItem = match[3].trim();
                
                // 각 항목에서 불필요한 텍스트 제거 (줄바꿈 이후 텍스트 제거)
                firstItem = firstItem.split('\n')[0].trim();
                secondItem = secondItem.split('\n')[0].trim();
                thirdItem = thirdItem.split('\n')[0].trim();
                
                // 전화번호 패턴: 010-1234-5678 또는 01012345678 (더 유연하게)
                const phonePattern = /^(\d{3})[-\s]*(\d{3,4})[-\s]*(\d{4})$/;
                // 주민번호 패턴: 821018-1804813 또는 8210181804813
                const idPattern = /^(\d{6})[-\s]*(\d{7})$/;
                // 이름 패턴: 한글 2-4자리
                const namePattern = /^[가-힣]{2,4}$/;
                
                let name = '';
                let phone = '';
                let idNumber = '';
                
                // 각 항목을 분석하여 타입 판별
                const items = [
                    { value: firstItem, type: 'unknown' },
                    { value: secondItem, type: 'unknown' },
                    { value: thirdItem, type: 'unknown' }
                ];
                
                // 각 항목의 타입을 판별
                items.forEach(item => {
                    const cleanValue = item.value.replace(/[^\d가-힣]/g, '');
                    const numbersOnly = item.value.replace(/[^\d]/g, '');
                    
                    // 전화번호 판별 (010으로 시작하고 10-11자리)
                    if (numbersOnly.startsWith('010') && (numbersOnly.length === 10 || numbersOnly.length === 11)) {
                        item.type = 'phone';
                    } 
                    // 주민번호 판별 (6자리-7자리 또는 13자리)
                    else if (idPattern.test(numbersOnly) || numbersOnly.length === 13) {
                        item.type = 'id';
                    } 
                    // 이름 판별 (한글 2-4자리)
                    else if (namePattern.test(item.value)) {
                        item.type = 'name';
                    }
                });
                
                // 타입에 따라 할당
                items.forEach(item => {
                    if (item.type === 'name') {
                        name = item.value;
                    } else if (item.type === 'phone') {
                        phone = item.value;
                    } else if (item.type === 'id') {
                        idNumber = item.value;
                    }
                });
                
                // 이름이 판별되지 않은 경우, 전화번호나 주민번호가 아닌 항목을 이름으로 처리
                if (!name) {
                    items.forEach(item => {
                        if (item.type === 'unknown' && !phonePattern.test(item.value.replace(/[^\d]/g, '')) && !idPattern.test(item.value.replace(/[^\d]/g, ''))) {
                            name = item.value;
                        }
                    });
                }
                
                // 법정대리인 이름 저장
                customerInfo['법정대리인이름'] = name;
                
                // 전화번호 포맷 정규화
                if (phone) {
                    const cleanPhone = phone.replace(/[^\d]/g, '');
                    if (cleanPhone.length >= 10) {
                        customerInfo['법정대리인연락처'] = cleanPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                    } else {
                        customerInfo['법정대리인연락처'] = phone;
                    }
                } else {
                    customerInfo['법정대리인연락처'] = '';
                }
                
                // 주민번호 포맷 정규화
                if (idNumber) {
                    const cleanId = idNumber.replace(/[^\d]/g, '');
                    if (cleanId.length === 13) {
                        customerInfo['법정대리인주민번호'] = cleanId.replace(/(\d{6})(\d{7})/, '$1-$2');
                    } else {
                        customerInfo['법정대리인주민번호'] = idNumber.replace(/\s*-\s*/g, '-');
                    }
                } else {
                    customerInfo['법정대리인주민번호'] = '';
                }
                
                continue;
            }
            
            // 일반 필드 처리
            if (match[1] || match[2]) {
                let value = (match[1] || match[2] || '').trim();
                
                // 전화번호/개통번호 포맷 정규화 (01012345678 -> 010-1234-5678)
                if ((key === '전화번호' || key === '개통번호') && value) {
                    // 괄호 안의 내용 제거 (예: (휴대전화) 제거)
                    value = value.replace(/\([^)]*\)/g, '').trim();
                    // 모든 공백과 하이픈 제거
                    const numbers = value.replace(/[^\d]/g, '');
                    // 01012345678 -> 010-1234-5678 형식으로 변환
                    if (numbers.length >= 10) {
                        value = numbers.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                        customerInfo[key] = value;  // 변환된 값 저장
                        
                        // 전화번호에서 개통번호 추출 (개통번호가 없을 경우에만)
                        if (key === '전화번호' && !customerInfo['개통번호']) {
                            customerInfo['개통번호'] = value;  // 전화번호를 개통번호로도 저장
                        }
                    }
                }
                
                // 생년월일/주민번호 포맷 정규화 (000718 - 3251915 -> 000718-3251915)
                if ((key === '생년월일' || key === '주민번호') && value) {
                    // 하이픈 주변의 공백 제거
                    value = value.replace(/\s*-\s*/g, '-');
                }
                
                // 배송주소/택배주소에서 "/" 이후의 전화번호 부분 제거
                if ((key === '택배주소' || key === '배송주소지') && value) {
                    // "/" 이후의 전화번호 패턴 제거 (예: / 010-8316-1294)
                    value = value.replace(/\s*\/\s*010-\d{3,4}-\d{4}.*$/, '').trim();
                }
                
                // 부가서비스 특별 처리: 올케어(보험) 형식인 경우 전체 텍스트 포함
                if (key === '부가서비스' && value && value.includes('익월말')) {
                    // 올케어(보험) 형식인 경우, 원본 텍스트에서 전체 부가서비스 부분을 찾아서 포함
                    const fullAddonMatch = text.match(/\*{1,2}올케어\s*\(보험\)\s*([^\n]+)/i);
                    if (fullAddonMatch) {
                        value = '올케어(보험) ' + fullAddonMatch[1].trim();
                    }
                }
                
                customerInfo[key] = value;
            } else {
                customerInfo[key] = '';
            }
        } else {
            customerInfo[key] = '';
        }
    }
    
    // 미성년자 여부 기본값 설정 (법대정보가 없으면 'N')
    if (!customerInfo.hasOwnProperty('미성년자여부')) {
        customerInfo['미성년자여부'] = 'N';
        customerInfo['법정대리인이름'] = '';
        customerInfo['법정대리인주민번호'] = '';
        customerInfo['법정대리인연락처'] = '';
    }
    
    // 개통번호와 전화번호 통합 처리 (전화번호가 없을 경우 개통번호 사용)
    if (!customerInfo['전화번호'] && customerInfo['개통번호']) {
        customerInfo['전화번호'] = customerInfo['개통번호'];
    }
    
    // 고객명과 가입자명 통합 처리 (고객명이 없을 경우 가입자명 사용)
    if (!customerInfo['고객명'] && customerInfo['가입자명']) {
        customerInfo['고객명'] = customerInfo['가입자명'];
    }
    
    // 주민번호와 생년월일 통합 처리 (주민번호가 없을 경우 생년월일 사용)
    if (!customerInfo['주민번호'] && customerInfo['생년월일']) {
        customerInfo['주민번호'] = customerInfo['생년월일'];
    }
    
    // 택배주소와 배송주소지 통합 처리 (택배주소가 없을 경우 배송주소지 사용)
    if (!customerInfo['택배주소'] && customerInfo['배송주소지']) {
        customerInfo['택배주소'] = customerInfo['배송주소지'];
    }
    
    // 1. Parse subscription, discount, and telecom info using the new function
    let subInfo;
    try {
        // utils.js에서 전역으로 노출된 함수 사용
        if (typeof window.parseSubscriptionAndDiscountInfo === 'function') {
                                 subInfo = window.parseSubscriptionAndDiscountInfo({
                 '가입유형': customerInfo['가입유형'] || '',
                 '할인유형': customerInfo['할인유형'] || '',
                 '현재통신사': customerInfo['현재통신사'] || ''
             });
             console.log('parseSubscriptionAndDiscountInfo 실행 성공');
             console.log('입력 데이터:', {
                 '가입유형': customerInfo['가입유형'] || '',
                 '할인유형': customerInfo['할인유형'] || '',
                 '현재통신사': customerInfo['현재통신사'] || ''
             });
             console.log('파싱 결과:', subInfo);
        } else {
            throw new Error('parseSubscriptionAndDiscountInfo 함수를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('parseSubscriptionAndDiscountInfo 오류:', error);
        // 오류 발생 시 기본값 사용
        subInfo = {
            subscriptionType: customerInfo['가입유형'] || '',
            discountType: customerInfo['할인유형'] || '',
            currentTelecom: customerInfo['현재통신사'] || '',
            discountMonths: '',
            contractType: ''
        };
    }

    // 2. Update customer info with parsed values
    customerInfo['가입유형'] = subInfo.subscriptionType;
    customerInfo['할인유형'] = subInfo.discountType;
    customerInfo['현재통신사'] = subInfo.currentTelecom;
    
    // 2-1. 가입유형이 비어있는 경우 현재통신사와 선택된 통신사 비교하여 자동 설정
    if (!customerInfo['가입유형'] || customerInfo['가입유형'].trim() === '') {
        alert('어드민 메모의 가입유형이 확인되지않아 자동 변환을 시작합니다. \n 현재통신사와 선택된 통신사를 비교하여 가입유형을 자동 설정합니다. \n 변환된 양식을 한번더 체크하세요.');
        // 현재 선택된 통신사 가져오기
        const selectedTelecom = document.getElementById('telecom') ? document.getElementById('telecom').value : '';
        const currentTelecom = customerInfo['현재통신사'] || '';
        
        console.log('가입유형 자동 판단:', {
            '선택된통신사': selectedTelecom,
            '현재통신사': currentTelecom
        });
        
        // 현재통신사와 선택된 통신사 비교
        if (currentTelecom && selectedTelecom) {
            if (currentTelecom.toLowerCase().trim() !== selectedTelecom.toLowerCase().trim()) {
                customerInfo['가입유형'] = '번호이동';
                console.log('가입유형 자동설정: 번호이동 (현재통신사 ≠ 선택통신사)');
            } else {
                customerInfo['가입유형'] = '기기변경';
                console.log('가입유형 자동설정: 기기변경 (현재통신사 = 선택통신사)');
            }
        } else {
            console.log('가입유형 자동설정 불가: 통신사 정보 부족');
        }
    }
    
    console.log('적용 후 customerInfo:', {
        '가입유형': customerInfo['가입유형'],
        '할인유형': customerInfo['할인유형'],
        '현재통신사': customerInfo['현재통신사']
    });

    // 3. Set 공시선약여부 and 약정개월수 based on discount type
    if (subInfo.discountType === '공시지원') {
        customerInfo['공시선약여부'] = '공시지원';
        customerInfo['약정개월수'] = subInfo.discountMonths || '24개월';
    } else if (subInfo.discountType === '선택약정' || subInfo.discountType === '선약') {
        customerInfo['공시선약여부'] = subInfo.discountType;
        customerInfo['약정개월수'] = subInfo.discountMonths || '';
    } else {
        customerInfo['공시선약여부'] = '';
        customerInfo['약정개월수'] = '';
    }
    
    console.log('최종 약정 정보:', {
        '공시선약여부': customerInfo['공시선약여부'],
        '약정개월수': customerInfo['약정개월수']
    });
    
    // 출고가, 공시, 추지, 전환지원금, 프리할부, 할부/현금 정보 추출
    // 1. 기본값 초기화
    customerInfo['추지'] = '0';
    customerInfo['전환지원금'] = '';
    customerInfo['프리할부'] = '';
    
    // 새로운 패턴: **출고가 숫자 =공시-추가= 형식 (공시, 추가 값이 있을 수도 없을 수도 있음)
    const newPricePattern = /\*\*\s*출고가\s+([\d,]+)\s*=공시(?:([\d,]+))?-추가(?:([\d,]+))?=\s*(?:현금\s*([\d,]+)|할부(\d+)\s*([\d,]+))?/i;
    const newPriceMatch = text.match(newPricePattern);
    
    if (newPriceMatch) {
        customerInfo['출고가'] = addThousandSeparator(newPriceMatch[1].trim());
        customerInfo['공시'] = addThousandSeparator(newPriceMatch[2] ? newPriceMatch[2].trim() : '0'); // 공시 금액이 있으면 추출, 없으면 0
        customerInfo['추지'] = addThousandSeparator(newPriceMatch[3] ? newPriceMatch[3].trim() : '0'); // 추가 금액이 있으면 추출, 없으면 0
        customerInfo['전환지원금'] = '';
        customerInfo['프리할부'] = '';
        
        // 할부/현금 여부 확인 (기존 패턴과 동일한 로직)
        if (newPriceMatch[5]) {
            // 할부인 경우
            customerInfo['할부현금여부'] = '할부';
            customerInfo['할부개월수'] = newPriceMatch[5] + '개월';
            customerInfo['최종구매가'] = addThousandSeparator(newPriceMatch[6] ? newPriceMatch[6].trim() : '');
        } else {
            // 현금인 경우
            customerInfo['할부현금여부'] = '현금';
            customerInfo['할부개월수'] = '';
            customerInfo['최종구매가'] = addThousandSeparator(newPriceMatch[4] ? newPriceMatch[4].trim() : '');
        }
        
        console.log('새로운 출고가 패턴 매칭:', {
            출고가: customerInfo['출고가'],
            공시: customerInfo['공시'],
            추지: customerInfo['추지'],
            할부현금여부: customerInfo['할부현금여부'],
            할부개월수: customerInfo['할부개월수'],
            최종구매가: customerInfo['최종구매가']
        });
    } else {
    
    // 2. 괄호 포함 패턴 (예: **출고가 (1,540,000)- 공시(700,000)- 전지(100,000) = 현금(740,000))
        const parenthesizedPattern = /\*\*\s*출고가\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?\s*-\s*공시\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?\s*(?:-\s*(?:추지|추가지원|추가)\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?)?\s*(?:-\s*(?:전지|전환지원금?|전환)\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?)?\s*(?:-\s*(?:프리할부|프리)\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?)?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*[\(\[]?\s*([\d,]+)\s*[\]\)]?/i;
    
    // 3. 일반 패턴 (괄호 없음, 기존 형식 유지)
        const normalPattern = /\*\*\s*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)\s*(?:-\s*(?:추지|추가지원|추가)\s+([\d,]+))?\s*(?:-\s*(?:전지|전환지원금?|전환)\s+([\d,]+))?\s*(?:-\s*(?:프리할부|프리)\s+([\d,]+))?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*([\d,]+)/i;
    
    // 4. 개선된 패턴: 단위 처리 및 키워드 없는 프리할부 지원
        const improvedPattern = /\*\*\s*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)\s*-\s*추지\s+([\d,]+)\s*(?:-\s*([\d,]+)(?:원)?)?\s*=\s*할부(\d+)\s*([\d,]+)(?:원)?/i;
    
    // 5. 패턴 매칭 시도 (개선된 패턴 먼저 시도)
    let match = text.match(improvedPattern) || text.match(parenthesizedPattern) || text.match(normalPattern);
    
    if (match) {
        // 매칭된 그룹 인덱스 정리 (개선된 패턴과 기존 패턴 구분)
        let groups;
        
        if (text.match(improvedPattern)) {
            // 개선된 패턴으로 매칭된 경우
            groups = {
                출고가: match[1] || '0',
                공시: match[2] || '0',
                추지: match[3] || '0',
                전환지원금: '',
                프리할부: match[4] || '',
                할부현금: '할부',
                최종구매가: match[6] || '0',
                할부개월수: match[5] || '24'
            };
        } else {
            // 기존 패턴으로 매칭된 경우
            groups = {
                출고가: match[1] || '0',
                공시: match[2] || '0',
                추지: match[3] || '0',
                전환지원금: match[4] || '',
                프리할부: match[5] || '',
                할부현금: match[6] || '현금',
                최종구매가: match[7] || '0'
            };
        }
        
        // 고객 정보에 할당 (값이 있는 경우에만 업데이트)
        customerInfo['출고가'] = addThousandSeparator(groups.출고가.trim());
        customerInfo['공시'] = addThousandSeparator(groups.공시.trim());
        if (groups.추지 !== '0') customerInfo['추지'] = addThousandSeparator(groups.추지.trim());
        if (groups.전환지원금 && groups.전환지원금.trim() !== '') customerInfo['전환지원금'] = addThousandSeparator(groups.전환지원금.trim());
        if (groups.프리할부 && groups.프리할부.trim() !== '') customerInfo['프리할부'] = addThousandSeparator(groups.프리할부.trim());
        
        console.log('매칭된 정보:', groups); // 디버깅용
        
        // 할부/현금 여부 확인
        if (groups.할부현금 === '할부' || groups.할부현금.includes('할부')) {
            customerInfo['할부현금여부'] = '할부';
            
            // 할부개월수 추출
            if (groups.할부개월수) {
                customerInfo['할부개월수'] = groups.할부개월수 + '개월';
            } else {
                const installmentMatch = groups.할부현금.match(/(\d+)/);
                if (installmentMatch && installmentMatch[1]) {
                    customerInfo['할부개월수'] = installmentMatch[1] + '개월';
                } else {
                    customerInfo['할부개월수'] = '24개월'; // 기본값
                }
            }
        } else {
            customerInfo['할부현금여부'] = '현금';
            customerInfo['할부개월수'] = '';
        }
        
        customerInfo['최종구매가'] = addThousandSeparator(groups.최종구매가.trim());
    } else {
        // 추가 패턴 시도: 추지만 있는 경우 (괄호 없음)
            const pricePattern = /\*\*\s*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)(?:\s*-\s*(?:추지|추가지원|추가)\s+([\d,]+))?(?:\s*-\s*(?:프리할부|프리)\s+([\d,]+))?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*([\d,]+)/i;
        const priceMatch = text.match(pricePattern);
        
        if (priceMatch) {
            customerInfo['출고가'] = addThousandSeparator(priceMatch[1].trim());
            customerInfo['공시'] = addThousandSeparator(priceMatch[2].trim());
            if (priceMatch[3]) customerInfo['추지'] = addThousandSeparator(priceMatch[3].trim());
            if (priceMatch[4] && priceMatch[4].trim() !== '') customerInfo['프리할부'] = addThousandSeparator(priceMatch[4].trim());
            
            // 할부/현금 여부 확인
            if (priceMatch[5].includes('할부')) {
                customerInfo['할부현금여부'] = '할부';
                
                // 할부개월수 추출
                const installmentMatch = priceMatch[5].match(/(\d+)/);
                if (installmentMatch && installmentMatch[1]) {
                    customerInfo['할부개월수'] = installmentMatch[1] + '개월';
                } else {
                    customerInfo['할부개월수'] = '24개월'; // 기본값
                }
            } else {
                customerInfo['할부현금여부'] = '현금';
                customerInfo['할부개월수'] = '';
            }
            
            customerInfo['최종구매가'] = addThousandSeparator(priceMatch[6].trim());
        } else {
            // 현금 형식 패턴 확인 (추지와 전환지원금이 모두 있는 경우)
                const cashConversionPattern = /\*\*\s*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)(?:\s*-\s*(?:추지|추가지원|추가)\s+([\d,]+))?\s*(?:-\s*(?:전지|전환지원금?|전환)\s+([\d,]+))?\s*(?:-\s*프리할부\s+([\d,]+))?\s*=\s*현금\s*([\d,]+)/i;
            const cashConversionMatch = text.match(cashConversionPattern);
            
            if (cashConversionMatch) {
                customerInfo['출고가'] = addThousandSeparator(cashConversionMatch[1].trim());
                customerInfo['공시'] = addThousandSeparator(cashConversionMatch[2].trim());
                if (cashConversionMatch[3]) customerInfo['추지'] = addThousandSeparator(cashConversionMatch[3].trim());
                if (cashConversionMatch[4] && cashConversionMatch[4].trim() !== '') customerInfo['전환지원금'] = addThousandSeparator(cashConversionMatch[4].trim());
                if (cashConversionMatch[5] && cashConversionMatch[5].trim() !== '') customerInfo['프리할부'] = addThousandSeparator(cashConversionMatch[5].trim());
                customerInfo['할부현금여부'] = '현금';
                customerInfo['할부개월수'] = '';
                customerInfo['최종구매가'] = addThousandSeparator(cashConversionMatch[7].trim());
            } else {
                // 기존 현금 형식 패턴 (전환지원금 없는 경우)
                const cashPattern = /\*\*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)\s*-\s*추지\s+([\d,]+)(?:\s*-\s*프리할부\s+([\d,]+))?\s*=\s*현금\s*([\d,]+)/;
                const cashMatch = text.match(cashPattern);
                
                if (cashMatch) {
                    customerInfo['출고가'] = addThousandSeparator(cashMatch[1].trim());
                    customerInfo['공시'] = addThousandSeparator(cashMatch[2].trim());
                    customerInfo['추지'] = addThousandSeparator(cashMatch[3].trim());
                    customerInfo['전환지원금'] = '';
                    customerInfo['프리할부'] = cashMatch[4] && cashMatch[4].trim() !== '' ? addThousandSeparator(cashMatch[4].trim()) : '';
                    customerInfo['할부현금여부'] = '현금';
                    customerInfo['할부개월수'] = '';
                    customerInfo['최종구매가'] = addThousandSeparator(cashMatch[5].trim());
                } else {
                    // 할부 형식 패턴 확인 (전환지원금 포함)
                    const installmentConversionPattern = /\*\*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)\s*-\s*추지\s+([\d,]+)\s*-\s*(전환지원금?|전환)\s+([\d,]+)(?:\s*-\s*프리할부\s+([\d,]+))?\s*=\s*할부(\d+)\s*([\d,]+)/;
                    const installmentConversionMatch = text.match(installmentConversionPattern);
                    
                    if (installmentConversionMatch) {
                        customerInfo['출고가'] = addThousandSeparator(installmentConversionMatch[1].trim());
                        customerInfo['공시'] = addThousandSeparator(installmentConversionMatch[2].trim());
                        customerInfo['추지'] = addThousandSeparator(installmentConversionMatch[3].trim());
                        customerInfo['전환지원금'] = addThousandSeparator(installmentConversionMatch[5].trim());
                        customerInfo['프리할부'] = installmentConversionMatch[6] && installmentConversionMatch[6].trim() !== '' ? addThousandSeparator(installmentConversionMatch[6].trim()) : '';
                        customerInfo['할부현금여부'] = '할부';
                        customerInfo['할부개월수'] = installmentConversionMatch[7] + '개월';
                        customerInfo['최종구매가'] = addThousandSeparator(installmentConversionMatch[8].trim());
                    } else {
                        // 기존 할부 형식 패턴 (전환지원금 없는 경우)
                        const alternatePattern = /\*\*출고가\s+([\d,]+)\s*-\s*공시\s+([\d,]+)\s*-\s*추지\s+([\d,]+)(?:\s*-\s*프리할부\s+([\d,]+))?\s*=\s*할부(\d+)\s*([\d,]+)/;
                        const alternateMatch = text.match(alternatePattern);
                        
                        if (alternateMatch) {
                            customerInfo['출고가'] = addThousandSeparator(alternateMatch[1].trim());
                            customerInfo['공시'] = addThousandSeparator(alternateMatch[2].trim());
                            customerInfo['추지'] = addThousandSeparator(alternateMatch[3].trim());
                            customerInfo['전환지원금'] = '';
                            customerInfo['프리할부'] = alternateMatch[4] && alternateMatch[4].trim() !== '' ? addThousandSeparator(alternateMatch[4].trim()) : '';
                            customerInfo['할부현금여부'] = '할부';
                            customerInfo['할부개월수'] = alternateMatch[5] + '개월';
                            customerInfo['최종구매가'] = addThousandSeparator(alternateMatch[6].trim());
                        } else {
                            // 모든 기존 패턴이 실패한 경우 초유연 파싱 시도
                            console.log('기존 패턴 실패, 초유연 파싱 시작...');
                            const flexiblePriceInfo = extractFlexiblePriceInfo(text);
                            
                            if (Object.keys(flexiblePriceInfo).length > 0) {
                                // 초유연 파싱으로 얻은 정보 적용 (이미 천 단위 구분 쉼표가 적용되어 있음)
                                if (flexiblePriceInfo['출고가']) customerInfo['출고가'] = flexiblePriceInfo['출고가'];
                                if (flexiblePriceInfo['공시']) customerInfo['공시'] = flexiblePriceInfo['공시'];
                                if (flexiblePriceInfo['추지']) customerInfo['추지'] = flexiblePriceInfo['추지'];
                                if (flexiblePriceInfo['전환지원금']) customerInfo['전환지원금'] = flexiblePriceInfo['전환지원금'];
                                if (flexiblePriceInfo['프리할부']) customerInfo['프리할부'] = flexiblePriceInfo['프리할부'];
                                if (flexiblePriceInfo['최종구매가']) customerInfo['최종구매가'] = flexiblePriceInfo['최종구매가'];
                                if (flexiblePriceInfo['현금가']) customerInfo['현금가'] = flexiblePriceInfo['현금가'];
                                
                                // 할부/현금 여부는 텍스트에서 추정
                                if (text.match(/할부/i)) {
                                    customerInfo['할부현금여부'] = '할부';
                                    customerInfo['할부개월수'] = '24개월'; // 기본값
                                } else if (text.match(/현금/i)) {
                                    customerInfo['할부현금여부'] = '현금';
                                    customerInfo['할부개월수'] = '';
                                }
                                
                                console.log('초유연 파싱 성공:', flexiblePriceInfo);
                            } else {
                                // 초유연 파싱도 실패한 경우 기본값 설정
                                customerInfo['출고가'] = '';
                                customerInfo['공시'] = '';
                                customerInfo['추지'] = '';
                                customerInfo['전환지원금'] = '';
                                customerInfo['프리할부'] = '';
                                customerInfo['할부현금여부'] = '';
                                customerInfo['할부개월수'] = '';
                                customerInfo['최종구매가'] = '';
                                console.log('초유연 파싱도 실패, 기본값 설정');
                            }
                        }
                    }
                }
            }
        }
    }
    }    
    // 모델명 변환 및 용량 정보 추출
    if (customerInfo['모델명']) {
        // 먼저 원본 모델명에서 용량 정보 추출 (convertModelName 실행 전)
        let capacityMatch = null;
        let hasUnit = false;
        let extractedCapacity = '';
        let originalModelName = customerInfo['모델명'];
        
        // 1. 단위가 있는 용량 먼저 찾기 (256G, 512GB, 1TB 등)
        capacityMatch = originalModelName.match(/(?:^|\s|_)(\d+)(?:\s*[GT]?[B]?)(?=\s|$|_)/i);
        
        let capacityFound = false;
        
        if (capacityMatch) {
            // 매칭된 결과에서 실제로 단위가 있는지 확인
            const matchedText = capacityMatch[0].replace(/^[\s_]+|[\s_]+$/g, '');
            const hasActualUnit = matchedText.match(/[GT]?[B]?$/i);
            // 실제로 G, GB, TB 등의 단위가 있는지 확인 (빈 문자열이 아닌 경우)
            const hasRealUnit = hasActualUnit && hasActualUnit[0] && hasActualUnit[0].length > 0;
            
            if (hasRealUnit) {
                // 실제로 단위가 있는 경우
                hasUnit = true;
                extractedCapacity = capacityMatch[1];
                customerInfo['용량'] = matchedText;
                // 원본 모델명에서 용량 부분 제거
                originalModelName = originalModelName.replace(/(?:^|\s|_)\d+(?:\s*[GT]?[B]?)(?:\s|$|_)/i, ' ').replace(/\s+/g, ' ').trim();
                capacityFound = true;
            }
        }
        
        if (!capacityFound) {
            // 2. 단위가 없는 용량 찾기 (256, 512 등)
            capacityMatch = originalModelName.match(/(?:^|\s|_)(\d+)(?:\s|$|_)/i);
            
            if (capacityMatch) {
                hasUnit = false;
                extractedCapacity = capacityMatch[1];
                customerInfo['용량'] = extractedCapacity + 'G';
                // 원본 모델명에서 용량 부분 제거
                originalModelName = originalModelName.replace(/(?:^|\s|_)\d+(?:\s|$|_)/i, ' ').replace(/\s+/g, ' ').trim();
                capacityFound = true;
            } else {
                // 3. 용량을 찾지 못한 경우
                customerInfo['용량'] = '';
            }
        }
        
        // 용량이 제거된 모델명으로 변환 적용 (펫네임 → 실제 모델명)
        const convertedModelName = convertModelName(originalModelName);
        customerInfo['모델명'] = convertedModelName;
        
        // 모델제조사 자동 분류 (아이폰/갤럭시)
        if (convertedModelName.toLowerCase().includes('아이폰') || 
            convertedModelName.toLowerCase().includes('iphone')) {
            customerInfo['모델제조사'] = '아이폰';
        } else {
            customerInfo['모델제조사'] = '갤럭시';
        }
    } else {
        customerInfo['용량'] = '';
        customerInfo['모델제조사'] = '';
    }
    
    // 부가서비스와 보험 분리 처리 (개선된 버전)
    if (customerInfo['부가서비스']) {
        const originalAddon = customerInfo['부가서비스'];
        const parsed = parseAddonAndInsuranceEnhanced(customerInfo['부가서비스']);
        
        // 분리된 결과를 customerInfo에 저장
        customerInfo['보험'] = parsed.보험;
        customerInfo['부가서비스'] = parsed.부가서비스1;
        customerInfo['부가서비스2'] = parsed.부가서비스2;
        
        console.log('부가서비스 분리 결과:', {
            '원본': originalAddon,
            '분리된 보험': parsed.보험,
            '분리된 부가서비스1': parsed.부가서비스1,
            '분리된 부가서비스2': parsed.부가서비스2
        });
    } else {
        customerInfo['부가서비스2'] = '';
    }
    
    // 모델제조사에 따른 보험명 자동 설정 (모델제조사 설정 후 실행)
    if (customerInfo['보험'] && customerInfo['모델제조사']) {
        if (customerInfo['모델제조사'] === '갤럭시') {
            // 갤럭시 모델 중 플립, 폴드, F766, F966인 경우 특별 처리
            const modelName = customerInfo['모델명'] || '';
            if (modelName.includes('플립') || modelName.includes('폴드') || 
                modelName.includes('F766') || modelName.includes('F966')) {
                customerInfo['보험'] = 'T ALL케어플러스5 파손F';
                console.log('갤럭시 플립/폴드 보험명 자동 설정: T ALL케어플러스5 파손F');
            } else {
                customerInfo['보험'] = 'T ALL케어플러스5 파손80';
                console.log('갤럭시 보험명 자동 설정: T ALL케어플러스5 파손80');
            }
        } else if (customerInfo['모델제조사'] === '아이폰') {
            customerInfo['보험'] = 'T올케어+5 I파손';
            console.log('아이폰 보험명 자동 설정: T올케어+5 I파손');
        }
    }
    
    return customerInfo;
}

// 모든 함수를 전역으로 노출
window.parseAddonAndInsuranceEnhanced = parseAddonAndInsuranceEnhanced;
window.parseAddonAndInsurance = parseAddonAndInsurance;
window.parseSubscriptionAndDiscountInfo = parseSubscriptionAndDiscountInfo;
window.loadModelsFromStorage = loadModelsFromStorage;
window.saveModelsToStorage = saveModelsToStorage;
window.resetToDefaultModels = resetToDefaultModels;
window.initializeModelDatabase = initializeModelDatabase;
window.searchDeviceModel = searchDeviceModel;
window.displayDeviceSearchResults = displayDeviceSearchResults;
window.extractCustomerInfo = extractCustomerInfo;
window.extractFlexiblePriceInfo = extractFlexiblePriceInfo;
window.addThousandSeparator = addThousandSeparator;
window.deviceModelDatabase = deviceModelDatabase;
window.defaultDeviceModels = defaultDeviceModels;
window.MODEL_STORAGE_KEY = MODEL_STORAGE_KEY;
window.checkPassword = checkPassword;
window.showPasswordError = showPasswordError;
window.setupPasswordEvents = setupPasswordEvents;
window.CORRECT_PASSWORD = CORRECT_PASSWORD;

// 비밀번호 이벤트 리스너 자동 설정
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPasswordEvents);
} else {
    setupPasswordEvents();
}

console.log('✅ Utils.js 로드 완료 - 모든 유틸리티 함수들이 통합되었습니다.'); 

// 대리점별 textarea 관리를 위한 유틸리티 클래스
const TextareaManager = {
    // 모든 textarea 초기화
    clearAllTextareas() {
        const outputContainer = document.getElementById('outputContainer');
        if (!outputContainer) return;
        
        const allTextareas = outputContainer.querySelectorAll('textarea');
        allTextareas.forEach(textarea => {
            textarea.value = '';
        });
    },
    
    // 모든 ExtraOutputs 컨테이너 숨기기
    hideAllExtraOutputs() {
        const outputContainer = document.getElementById('outputContainer');
        if (!outputContainer) return;
        
        const allExtraOutputs = outputContainer.querySelectorAll('[id$="ExtraOutputs"]');
        allExtraOutputs.forEach(container => {
            container.style.display = 'none';
        });
    },
    
    // 특정 대리점의 ExtraOutputs 컨테이너 표시
    showAgencyExtraOutputs(agencyName) {
        const outputContainer = document.getElementById('outputContainer');
        if (!outputContainer) return;
        
        // 먼저 모든 ExtraOutputs 숨기기
        this.hideAllExtraOutputs();
        
        // 해당 대리점의 ExtraOutputs 표시
        const agencyExtraOutputs = document.getElementById(`${agencyName.toLowerCase()}ExtraOutputs`);
        if (agencyExtraOutputs) {
            agencyExtraOutputs.style.display = 'block';
        }
    },
    
    // 대리점별 textarea ID 매핑 (필요시 확장 가능)
    getAgencyTextareaIds(agencyName) {
        const textareaMappings = {
            '큐브': ['cubeStockText', 'cubeOpenText', 'cubeUniverseText'],
            '럭스': ['luxRequestText', 'luxStockText', 'luxMemoText'],
            '드블랙': ['dblackRequestText', 'dblackStockText', 'dblackMemoText'],
            'ACT(택배)': ['actStockText', 'actOpenText'],
            '비앤컴': ['bncomStockText', 'bncomOpenText'],
            '휴넷': ['hunetConfirmText', 'hunetDeliveryText', 'hunetOpenText'],
            '밀리언': ['millionRequestText', 'millionStockText', 'millionMemoText'],
            '오앤티': ['ontRequestText', 'ontStockText', 'ontMemoText'],
            '장천': ['jangcheonDeliveryText', 'jangcheonOpenText'],
            '한올': ['hanolConfirmText', 'hanolDeliveryText', 'hanolOpenText']
        };
        
        return textareaMappings[agencyName] || [];
    },
    
    // 대리점별 textarea에 값 설정
    setAgencyTextareaValues(agencyName, values) {
        const textareaIds = this.getAgencyTextareaIds(agencyName);
        textareaIds.forEach((id, index) => {
            const textarea = document.getElementById(id);
            if (textarea && values[index] !== undefined) {
                textarea.value = values[index];
            }
        });
    }
};

// 모두 지우기 함수 (동적 방식으로 개선)
function clearAll() {
    // 입력 필드 초기화
    document.getElementById('inputText').value = '';
    document.getElementById('deviceSerial').value = '';
    document.getElementById('simSerial').value = '';
    
    // 엑셀 파일 입력 초기화 (excel-manager.js와 연동)
    if (typeof clearExcelInputs === 'function') {
        clearExcelInputs();
    } else {
        // fallback: 직접 초기화
        document.getElementById('excelFile').value = '';
        document.getElementById('extractCount').textContent = '';
        
        const excelFile2 = document.getElementById('excelFile2');
        if (excelFile2) excelFile2.value = '';
        
        const extractCount2Element = document.getElementById('extractCount2');
        if (extractCount2Element) {
            extractCount2Element.textContent = '';
        }
        
        const downloadBtn = document.getElementById('downloadDeliveryBtn');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
            downloadBtn.removeAttribute('data-telecom');
            downloadBtn.removeAttribute('data-agency');
            downloadBtn.removeAttribute('data-count');
        }
    }
    
    // 통신사 및 대리점 선택 초기화
    const telecomSelect = document.getElementById('telecom');
    const agencySelect = document.getElementById('agency');
    const currentTelecom = telecomSelect.value;
    const currentAgency = agencySelect.value;
    
    // 출력 컨테이너 초기화 (TextareaManager 사용)
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.style.display = 'block';
    
    // TextareaManager를 사용하여 모든 textarea 초기화 및 컨테이너 숨기기
    TextareaManager.clearAllTextareas();
    TextareaManager.hideAllExtraOutputs();
    
    // 기본 출력 컨테이너 표시
    const singleOutputContainer = document.getElementById('singleOutputContainer');
    const splitOutputContainer = document.getElementById('splitOutputContainer');
    const keyValueTableContainer = document.getElementById('keyValueTableContainer');
    
    if (singleOutputContainer) singleOutputContainer.style.display = 'block';
    if (splitOutputContainer) splitOutputContainer.style.display = 'none';
    if (keyValueTableContainer) keyValueTableContainer.style.display = 'none';
    
    // Reset telecom and agency selects after updating the output container
    telecomSelect.value = '';
    agencySelect.innerHTML = '<option value="">대리점을 선택하세요</option>';
    agencySelect.disabled = true;
    
    // 더블클릭 이벤트 설정
    setupDoubleClickCopy();
    
    // 입력 필드에 포커스
    document.getElementById('inputText').focus();
    
    // If the current selection was 럭스 or 드블랙, re-enable the agency select
    if (currentTelecom === 'SK' && (currentAgency === '럭스' || currentAgency === '드블랙')) {
        updateAgencies();
        document.getElementById('agency').value = currentAgency;
    }
}

// 전역으로 노출
window.TextareaManager = TextareaManager;
window.clearAll = clearAll; 

// 변환 이력 관리 유틸리티
const HistoryManager = {
    // 변환 이력 저장
    saveToHistory(customerInfo, telecom, agency) {
        try {
            let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            
            // 원본 텍스트가 없으면 저장하지 않음 (불필요한 데이터 방지)
            const inputText = document.getElementById('inputText');
            if (inputText && inputText.value.trim()) {
                customerInfo.원본텍스트 = inputText.value.trim();
            } else {
                return; // 원본 텍스트가 없으면 저장하지 않음
            }
            
            // 개선된 중복 체크 (더 유연한 매칭)
            const exists = history.some(item => {
                const currentName = String(customerInfo.고객명 || '').trim();
                const currentPhone = String(customerInfo.전화번호 || '').trim();
                const currentAgency = String(agency || '').trim();
                
                const savedName = String(item.customerInfo.고객명 || '').trim();
                const savedPhone = String(item.customerInfo.전화번호 || '').trim();
                const savedAgency = String(item.agency || '').trim();
                
                // 이름과 전화번호가 모두 일치하고, 동일한 대리점인 경우에만 중복으로 판단
                // 전화번호는 하이픈 제거 후 비교
                const normalizePhone = (phone) => phone.replace(/[-\s]/g, '');
                const normalizedCurrentPhone = normalizePhone(currentPhone);
                const normalizedSavedPhone = normalizePhone(savedPhone);
                
                return currentName && savedName && 
                       currentName === savedName && 
                       normalizedCurrentPhone && normalizedSavedPhone &&
                       normalizedCurrentPhone === normalizedSavedPhone && 
                       currentAgency === savedAgency;
            });
            
            if (!exists) {
                // 최대 50개까지 저장
                if (history.length >= 50) {
                    history.pop(); // 가장 오래된 항목 제거
                }
                
                // 새 항목 추가 (최신순으로 정렬하기 위해 unshift 사용)
                history.unshift({
                    id: Date.now(),
                    customerInfo: customerInfo,
                    telecom: telecom,
                    agency: agency,
                    timestamp: new Date().toISOString()
                });
                
                localStorage.setItem('conversionHistory', JSON.stringify(history));
            }
        } catch (e) {
            console.error('이력 저장 중 오류 발생:', e);
        }
    },
    
    // 변환 이력 불러오기
    loadHistory() {
        try {
            const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            const historyList = document.getElementById('historyList');
            
            if (!historyList) return;
            
            if (history.length === 0) {
                historyList.innerHTML = '<div class="no-history">저장된 이력이 없습니다.</div>';
                return;
            }
            
            historyList.innerHTML = history.map(item => `
                <div class="history-item" onclick="HistoryManager.loadFromHistory('${item.id}')">
                    <div class="history-header">
                        <span class="history-name">${item.customerInfo.고객명 || '이름 없음'}</span>
                        <span class="history-phone">${item.customerInfo.전화번호 || item.customerInfo.연락처 || '전화번호 없음'}</span>
                        <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="history-details">
                        <span class="history-model">${item.customerInfo.모델명 || ''} ${item.customerInfo.색상 || ''}</span>
                        <span class="history-plan">${item.customerInfo.요금제 || ''}</span>
                    </div>
                    <div class="history-footer">
                        <span class="history-agency">${item.telecom} / ${item.agency}</span>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            console.error('이력 불러오기 중 오류 발생:', e);
        }
    },
    
    // 이력에서 불러오기 (개선된 버전)
    loadFromHistory(id) {
        try {
            const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            const item = history.find(item => item.id.toString() === id.toString());
            
            if (item) {
                // 통신사와 대리점 선택
                const telecomSelect = document.getElementById('telecom');
                const agencySelect = document.getElementById('agency');
                
                // 현재 선택된 값 저장
                const currentTelecom = telecomSelect.value;
                const currentAgency = agencySelect.value;
                
                // 새 값으로 설정
                telecomSelect.value = item.telecom;
                
                // 대리점이 로드될 때까지 기다렸다가 선택 (타임아웃 추가)
                let attempts = 0;
                const maxAttempts = 100; // 최대 5초 (50ms * 100)
                
                const checkAgency = setInterval(() => {
                    attempts++;
                    
                    // updateAgencies 함수가 존재하는지 확인
                    if (typeof updateAgencies === 'function') {
                        updateAgencies();
                    }
                    
                    // 대리점이 로드되었는지 확인 (옵션 목록에 있는지)
                    const agencyOptions = Array.from(agencySelect.options).map(opt => opt.value);
                    if (agencyOptions.includes(item.agency)) {
                        clearInterval(checkAgency);
                        
                        // 대리점 선택
                        agencySelect.value = item.agency;
                        
                        // 입력 필드 채우기
                        const info = item.customerInfo;
                        const inputText = document.getElementById('inputText');
                        const deviceSerial = document.getElementById('deviceSerial');
                        const simSerial = document.getElementById('simSerial');
                        
                        // 원본 텍스트가 없으면 기본 텍스트 생성
                        if (!info.원본텍스트) {
                            let defaultText = '';
                            if (info.고객명) defaultText += `고객명: ${info.고객명}\n`;
                            if (info.전화번호) defaultText += `전화번호: ${info.전화번호}\n`;
                            if (info.모델명) defaultText += `모델명: ${info.모델명}\n`;
                            if (info.색상) defaultText += `색상: ${info.색상}\n`;
                            if (info.요금제) defaultText += `요금제: ${info.요금제}\n`;
                            if (info.가입유형) defaultText += `가입유형: ${info.가입유형}\n`;
                            if (info.할부현금여부) defaultText += `할부/현금: ${info.할부현금여부}\n`;
                            if (info.최종구매가) defaultText += `최종구매가: ${info.최종구매가}원\n`;
                            
                            inputText.value = defaultText.trim();
                        } else {
                            inputText.value = info.원본텍스트 || '';
                        }
                        
                        if (deviceSerial) deviceSerial.value = info.단말기일련번호 || '';
                        if (simSerial) simSerial.value = info.유심일련번호 || '';
                        
                        // 변환 실행 (안전한 방식으로 개선)
                        setTimeout(() => {
                            this.safeConvertFromHistory(item.agency);
                            this.closeHistoryPopup();
                        }, 300);
                    } else if (attempts >= maxAttempts) {
                        // 타임아웃 발생 시 처리
                        clearInterval(checkAgency);
                        console.error('대리점 로드 타임아웃:', item.agency);
                        alert(`대리점 "${item.agency}" 로드에 실패했습니다. 수동으로 선택해주세요.`);
                    }
                }, 50);
            }
        } catch (e) {
            console.error('이력 불러오기 중 오류 발생:', e);
            alert('이력 불러오기에 실패했습니다.');
        }
    },
    
    // 이력에서 안전하게 변환 실행하는 함수
    safeConvertFromHistory(agencyName) {
        try {
            // 먼저 해당 대리점의 ExtraOutputs 컨테이너 표시
            if (TextareaManager && TextareaManager.showAgencyExtraOutputs) {
                TextareaManager.showAgencyExtraOutputs(agencyName);
            }
            
            // 변환 실행
            if (typeof convertFormat === 'function') {
                convertFormat();
            } else {
                console.error('convertFormat 함수를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('이력에서 변환 실행 중 오류:', error);
            alert('이력에서 변환 실행 중 오류가 발생했습니다: ' + error.message);
        }
    },
    
    // 이력 팝업 열기
    openHistoryPopup() {
        const popup = document.getElementById('historyPopup');
        if (popup) {
            this.loadHistory();
            popup.style.display = 'flex';
        }
    },
    
    // 이력 팝업 닫기
    closeHistoryPopup() {
        const popup = document.getElementById('historyPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    },
    
    // 이력 전체 삭제
    clearHistory() {
        if (confirm('모든 변환 이력을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            localStorage.removeItem('conversionHistory');
            this.loadHistory();
        }
    }
};

// 전역으로 노출
window.HistoryManager = HistoryManager;

// 출시색상 검색 관련 함수들

/**
 * 모델명 정규화 함수 (iPhone16 → 아이폰16)
 * @param {string} modelName - 모델명
 * @returns {string} - 정규화된 모델명
 */
function normalizeModelName(modelName) {
    const normalized = modelName.toLowerCase()
        .replace(/iphone/g, '아이폰')
        .replace(/galaxy/g, '갤럭시')
        .replace(/samsung/g, '삼성')
        .replace(/\s+/g, '');
    
    return normalized;
}

/**
 * 모델 색상 검색 함수
 * @param {string} searchTerm - 검색어
 * @returns {Array} - 검색 결과 배열
 */
function searchModelColors(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }
    
    const normalizedSearch = normalizeModelName(searchTerm);
    const results = [];
    
    for (const [model, colors] of Object.entries(MODEL_COLORS)) {
        const normalizedModel = normalizeModelName(model);
        
        if (normalizedModel.includes(normalizedSearch) || 
            normalizedSearch.includes(normalizedModel)) {
            results.push({
                model: model,
                colors: colors
            });
        }
    }
    
    return results;
}

/**
 * 출시색상 검색 결과 표시 함수
 * @param {Array} results - 검색 결과 배열
 */
function displayModelColorResults(results) {
    const searchResults = document.getElementById('modelSearchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    let html = '';
    results.forEach(result => {
        html += `<div class="model-result" style="padding: 10px; border-bottom: 1px solid #eee;">`;
        html += `<div style="font-weight: bold; margin-bottom: 5px; color: #333;">${result.model}</div>`;
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px;">`;
        result.colors.forEach(color => {
            html += `<span style="padding: 4px 8px; background: #f5f5f5; border-radius: 12px; font-size: 12px; color: #555;">${color}</span>`;
        });
        html += `</div>`;
        html += `</div>`;
    });
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
}

/**
 * 천 단위 구분 쉼표 추가 함수
 * @param {string} value - 숫자 문자열
 * @returns {string} - 천 단위 구분 쉼표가 추가된 문자열
 */
function addThousandSeparator(value) {
    if (!value || value === '' || value === '0') return value;
    
    // 숫자가 아닌 문자 제거 후 숫자만 추출
    const cleanValue = value.toString().replace(/[^\d]/g, '');
    
    if (cleanValue === '') return value;
    
    // 천 단위 구분 쉼표 추가
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 초유연 가격 파싱 함수 - 어떤 형태의 입력이든 처리 가능
 * @param {string} text - 입력 텍스트
 * @returns {Object} - 파싱된 가격 정보
 */
function extractFlexiblePriceInfo(text) {
    const priceInfo = {};
    
    console.log('=== 초유연 파싱 시작 ===');
    console.log('입력 텍스트:', text);
    
    // 1단계: 키워드 기반 추출 (가장 정확)
    const keywordPatterns = {
        '출고가': [
            /출고가\s*[^\d]*?([\d,.]+)/i,
            /출고\s*[^\d]*?([\d,.]+)/i
        ],
        '공시': [
            /공시\s*[^\d]*?([\d,.]+)/i,
            /공시지원\s*[^\d]*?([\d,.]+)/i
        ],
        '추지': [
            /추지\s*[^\d]*?([\d,.]+)/i,
            /추가지원\s*[^\d]*?([\d,.]+)/i,
            /추가\s*[^\d]*?([\d,.]+)/i
        ],
        '전환지원금': [
            /전환지원금\s*[^\d]*?([\d,.]+)/i,
            /전환\s*[^\d]*?([\d,.]+)/i,
            /전지\s*[^\d]*?([\d,.]+)/i
        ],
        '프리할부': [
            /프리할부\s*[^\d]*?([\d,.]+)/i,
            /프리\s*[^\d]*?([\d,.]+)/i
        ],
        '최종구매가': [
            /최종구매가\s*[^\d]*?([\d,.]+)/i,
            /실구매가\s*[^\d]*?([\d,.]+)/i,
            /구매가\s*[^\d]*?([\d,.]+)/i
        ],
        '현금가': [
            /현금가\s*[^\d]*?([\d,.]+)/i,
            /현금\s*[^\d]*?([\d,.]+)/i
        ]
    };
    
    // 키워드 기반 추출 시도
    console.log('=== 1단계: 키워드 기반 추출 ===');
    for (const [key, patterns] of Object.entries(keywordPatterns)) {
        if (!priceInfo[key]) {
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    const cleanValue = match[1].replace(/[,.]/g, '');
                    priceInfo[key] = addThousandSeparator(cleanValue);
                    console.log(`${key} 매칭됨: ${match[1]} → ${priceInfo[key]}`);
                    break;
                }
            }
        }
    }
    console.log('1단계 결과:', priceInfo);
    
    // 2단계: 위치 기반 추출 (키워드가 없어도)
    console.log('=== 2단계: 위치 기반 추출 ===');
    const lines = text.split(/\n|\r/);
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // 가격 관련 라인인지 확인
        const lowerLine = trimmedLine.toLowerCase();
        const isPriceLine = lowerLine.includes('출고가') || 
                           lowerLine.includes('공시') || 
                           lowerLine.includes('추지') || 
                           lowerLine.includes('추가') || 
                           lowerLine.includes('전환') || 
                           lowerLine.includes('프리') || 
                           lowerLine.includes('구매가') || 
                           lowerLine.includes('현금가') ||
                           lowerLine.includes('현금') ||
                           /[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+/.test(trimmedLine);
        
        if (!isPriceLine) {
            console.log(`가격 관련 라인이 아님, 건너뜀: ${trimmedLine}`);
            continue;
        }
        
        console.log(`가격 관련 라인 처리: ${trimmedLine}`);
        
        // 숫자들을 모두 찾기
        const numbers = trimmedLine.match(/[\d,.]+/g);
        if (!numbers || numbers.length < 2) {
            console.log(`숫자가 부족함: ${numbers}`);
            continue;
        }
        
        console.log(`찾은 숫자들: ${numbers}`);
        
        // 첫 번째 숫자는 출고가로 추정
        if (!priceInfo['출고가']) {
            const cleanValue = numbers[0].replace(/[,.]/g, '');
            priceInfo['출고가'] = addThousandSeparator(cleanValue);
            console.log(`출고가 설정: ${numbers[0]} → ${priceInfo['출고가']}`);
        }
        
        // 두 번째 숫자는 공시로 추정
        if (!priceInfo['공시']) {
            const cleanValue = numbers[1].replace(/[,.]/g, '');
            priceInfo['공시'] = addThousandSeparator(cleanValue);
            console.log(`공시 설정: ${numbers[1]} → ${priceInfo['공시']}`);
        }
        
        // 세 번째 숫자는 추지로 추정
        if (!priceInfo['추지'] && numbers.length > 2) {
            const cleanValue = numbers[2].replace(/[,.]/g, '');
            priceInfo['추지'] = addThousandSeparator(cleanValue);
            console.log(`추지 설정: ${numbers[2]} → ${priceInfo['추지']}`);
        }
        
        // 마지막 숫자는 최종구매가로 추정
        if (!priceInfo['최종구매가'] && numbers.length > 3) {
            const cleanValue = numbers[numbers.length - 1].replace(/[,.]/g, '');
            priceInfo['최종구매가'] = addThousandSeparator(cleanValue);
            console.log(`최종구매가 설정: ${numbers[numbers.length - 1]} → ${priceInfo['최종구매가']}`);
        }
    }
    console.log('2단계 결과:', priceInfo);
    
    // 3단계: 전체 텍스트에서 순서 기반 추출 (최후수단)
    console.log('=== 3단계: 전체 텍스트에서 순서 기반 추출 ===');
    if (!priceInfo['출고가'] || !priceInfo['공시'] || !priceInfo['추지'] || !priceInfo['최종구매가']) {
        // 가격 관련 키워드가 있는 라인에서만 숫자 추출
        const priceLines = text.split(/\n|\r/).filter(line => {
            const lowerLine = line.toLowerCase();
            return lowerLine.includes('출고가') || 
                   lowerLine.includes('공시') || 
                   lowerLine.includes('추지') || 
                   lowerLine.includes('추가') || 
                   lowerLine.includes('전환') || 
                   lowerLine.includes('프리') || 
                   lowerLine.includes('구매가') || 
                   lowerLine.includes('현금가') ||
                   lowerLine.includes('현금') ||
                   /[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+\s*[=@→|~><&#]+\s*[\d,.]+/.test(line);
        });
        
        console.log('가격 관련 라인들:', priceLines);
        
        if (priceLines.length > 0) {
            // 가격 관련 라인에서만 숫자 추출
            const priceNumbers = [];
            for (const line of priceLines) {
                const numbers = line.match(/[\d,.]+/g);
                if (numbers) {
                    // 가격 관련 숫자인지 필터링 (전화번호, 주민번호 등 제외)
                    const filteredNumbers = numbers.filter(num => {
                        const cleanNum = num.replace(/[,.]/g, '');
                        // 전화번호 패턴 제외 (010으로 시작하는 10-11자리)
                        if (/^010\d{7,8}$/.test(cleanNum)) return false;
                        // 주민번호 패턴 제외 (6자리 또는 13자리)
                        if (/^\d{6}$/.test(cleanNum) || /^\d{13}$/.test(cleanNum)) return false;
                        // 주소 관련 숫자 제외 (3자리 이하)
                        if (cleanNum.length <= 3) return false;
                        // 용량 관련 숫자 제외 (256, 512 등)
                        if (/^(256|512|128|64|32|16|8|4|2|1)$/.test(cleanNum)) return false;
                        // 개월수 관련 숫자 제외 (12, 24, 36 등)
                        if (/^(12|24|36|48|60)$/.test(cleanNum)) return false;
                        // 요금제 관련 숫자 제외 (99000 등)
                        if (/^99\d{3}$/.test(cleanNum)) return false;
                        // 이심 관련 숫자 제외 (2750 등)
                        if (/^27\d{2}$/.test(cleanNum)) return false;
                        
                        return true;
                    });
                    priceNumbers.push(...filteredNumbers);
                }
            }
            
            console.log('필터링된 가격 관련 숫자들:', priceNumbers);
            
            if (priceNumbers.length >= 4) {
                const cleanNumbers = priceNumbers.map(num => num.replace(/[,.]/g, ''));
                console.log('정리된 숫자들:', cleanNumbers);
                
                // 키워드 순서대로 매칭
                const keywords = ['출고가', '공시', '추지', '최종구매가'];
                let numberIndex = 0;
                
                for (const keyword of keywords) {
                    if (!priceInfo[keyword] && numberIndex < cleanNumbers.length) {
                        // 해당 키워드가 텍스트에 있는지 확인
                        if (text.toLowerCase().includes(keyword.toLowerCase())) {
                            priceInfo[keyword] = addThousandSeparator(cleanNumbers[numberIndex]);
                            console.log(`${keyword} 키워드 매칭으로 설정: ${addThousandSeparator(cleanNumbers[numberIndex])}`);
                            numberIndex++;
                        }
                    }
                }
                
                // 키워드가 없어도 순서대로 할당 (가격 관련 숫자만)
                if (!priceInfo['출고가'] && cleanNumbers.length > 0) {
                    priceInfo['출고가'] = addThousandSeparator(cleanNumbers[0]);
                    console.log(`출고가 순서대로 설정: ${addThousandSeparator(cleanNumbers[0])}`);
                }
                if (!priceInfo['공시'] && cleanNumbers.length > 1) {
                    priceInfo['공시'] = addThousandSeparator(cleanNumbers[1]);
                    console.log(`공시 순서대로 설정: ${addThousandSeparator(cleanNumbers[1])}`);
                }
                if (!priceInfo['추지'] && cleanNumbers.length > 2) {
                    priceInfo['추지'] = addThousandSeparator(cleanNumbers[2]);
                    console.log(`추지 순서대로 설정: ${addThousandSeparator(cleanNumbers[2])}`);
                }
                if (!priceInfo['최종구매가'] && cleanNumbers.length > 3) {
                    priceInfo['최종구매가'] = addThousandSeparator(cleanNumbers[3]);
                    console.log(`최종구매가 순서대로 설정: ${addThousandSeparator(cleanNumbers[3])}`);
                }
            }
        }
    }
    console.log('3단계 결과:', priceInfo);
    
    // 4단계: 현금가 별도 처리
    console.log('=== 4단계: 현금가 별도 처리 ===');
    if (!priceInfo['현금가']) {
        const 현금가Match = text.match(/현금가\s*[^\d]*?([\d,.]+)/i);
        if (현금가Match) {
            const cleanValue = 현금가Match[1].replace(/[,.]/g, '');
            priceInfo['현금가'] = addThousandSeparator(cleanValue);
            console.log(`현금가 매칭됨: ${현금가Match[1]} → ${priceInfo['현금가']}`);
        }
    }
    console.log('4단계 결과:', priceInfo);
    
    // 5단계: 기본값 설정
    console.log('=== 5단계: 기본값 설정 ===');
    if (!priceInfo['공시']) {
        priceInfo['공시'] = '0';
        console.log('공시 기본값 설정: 0');
    }
    if (!priceInfo['추지']) {
        priceInfo['추지'] = '0';
        console.log('추지 기본값 설정: 0');
    }
    
    console.log('=== 최종 초유연 파싱 결과 ===', priceInfo);
    return priceInfo;
}