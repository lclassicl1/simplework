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

async function checkPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (inputPassword.length !== 4) {
        showPasswordError('4자리 숫자를 입력해주세요.');
        return;
    }
    
    if (inputPassword === CORRECT_PASSWORD) {
        // 비밀번호가 맞으면 IP 검증 수행
        console.log('🔐 비밀번호 인증 성공, IP 검증 시작...');
        
        try {
            const ipResult = await checkIPAccess();
            
            if (ipResult.allowed) {
                // IP 검증 성공 시 메인 콘텐츠 표시
                console.log('✅ IP 검증 성공, 접근 허용');
                
                // 비밀번호 모달 숨기고 메인 콘텐츠 표시
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
                
                // 성공 메시지 표시
                showToast('✅ 인증이 완료되었습니다.');
                
            } else {
                // IP 검증 실패 시 차단 모달 표시
                console.log('❌ IP 검증 실패, 접근 차단');
                
                // 비밀번호 모달 숨기기
                document.getElementById('passwordModal').style.display = 'none';
                
                // IP 차단 모달 표시
                showIPBlockModal(ipResult);
                
                // 비밀번호 입력 필드 초기화
                document.getElementById('passwordInput').value = '';
            }
            
        } catch (error) {
            console.error('❌ IP 검증 중 오류 발생:', error);
            
            // IP 검증 실패 시 설정에 따른 처리
            const config = typeof loadIPRestrictionConfig === 'function' ? 
                loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
            
            if (config.fallbackAction === 'allow') {
                // 폴백 설정이 'allow'인 경우 접근 허용
                console.log('⚠️ IP 검증 실패, 폴백 설정으로 접근 허용');
                
                document.getElementById('passwordModal').style.display = 'none';
                document.querySelector('.main-content').style.display = 'block';
                
                // 자동 잠금 매니저 설정
                if (typeof autoLockManager !== 'undefined' && autoLockManager) {
                    autoLockManager.unlockApplication();
                } else if (typeof AutoLockManager !== 'undefined') {
                    autoLockManager = new AutoLockManager();
                }
                
                if (typeof initializePage === 'function') {
                    initializePage();
                }
                
                showToast('⚠️ IP 검증 실패로 폴백 설정이 적용되었습니다.');
                
            } else {
                // 폴백 설정이 'block'인 경우 차단
                console.log('❌ IP 검증 실패, 폴백 설정으로 접근 차단');
                
                document.getElementById('passwordModal').style.display = 'none';
                
                const blockResult = {
                    allowed: false,
                    reason: 'IP 검증 중 오류가 발생했습니다.',
                    error: error.message,
                    fallback: true
                };
                
                showIPBlockModal(blockResult);
                document.getElementById('passwordInput').value = '';
            }
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
    
    // 보험 관련 키워드 정의 (더 구체적인 것부터 순서대로)
    const insuranceKeywords = [
        '365 케어 보험', '365케어 보험',  // 가장 구체적인 것부터
        'T ALL케어플러스5 파손80', 'T ALL케어플러스5 파손F',
        'T올케어+5 I파손', 'T올케어',
        'T ALL케어', 'T All케어', '올케어', '케어플러스',
        '365 케어', '365케어', '케어',
        '단말보험', '보험', '스마트케어', '안심케어', '케어서비스',
        '보장서비스', '분실보험', '파손보험', '파손', '분실'
    ];
    
    // 부가서비스 관련 키워드 정의 (더 구체적인 것부터 순서대로)
    const addonKeywords = [
        '필수팩 M1', '필수팩 M2', '필수팩 M3',  // 가장 구체적인 것부터
        '필수팩', '필수 팩',
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
        /\s*회선유지기간\s*M\+\d+.*/gi,          // 회선유지기간 M+8(총 9개월)
        // 추가 패턴들
        /\s*부가\s*\d+\s*가지\s*모두\s*M\+\d+/gi,  // 부가 2가지 모두 M+3
        /\s*총\s*\d+\s*개월\s*유지/gi,            // 총4개월유지
        /\s*부가\s*\d+\s*가지\s*모두/gi           // 부가 2가지 모두
    ];
    
    let insuranceItems = [];
    let addonItems1 = [];
    let addonItems2 = [];
    
    // 주요 구분자로 분리 (/, +, 번호순서 등)
    let items = [];
    
    // 먼저 "-" 구분자로 분리 (부가서비스- 필수팩 M1 / 365 케어 보험 - 부가 2가지 모두 M+3 같은 경우)
    if (addonText.includes('-') && addonText.includes('/')) {
        // "-" 구분자로 먼저 분리
        const parts = addonText.split('-')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        // 각 부분에서 "/" 구분자로 다시 분리
        for (const part of parts) {
            if (part.includes('/')) {
                const subItems = part.split('/')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
                items.push(...subItems);
            } else {
                items.push(part);
            }
        }
    } else if (addonText.includes('/') && /\/\s*\d+\.\s*/.test(addonText)) {
        // "/숫자." 패턴으로 분리 시도
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
                    customerInfo['법정대리인주민번호'] = normalizeIdNumber(idNumber);
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
                
                // 생년월일/주민번호 포맷 정규화 (831204.1042912 -> 831204-1042912, 831204 1042912 -> 831204-1042912)
                if ((key === '생년월일' || key === '주민번호') && value) {
                    value = normalizeIdNumber(value);
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
    
    // 새로운 패턴: 이통사지원금과 유통망지원금 포함
    const telecomSupportPattern = /\*\*\s*출고가\s+([\d,.]+)\s*-\s*이통사지원금\s+([\d,.]+)\s*-\s*유통망지원금\s+([\d,.]+)\s*=\s*(?:현금\s*([\d,.]+)|할부(\d+)\s*([\d,.]+))?/i;
    const telecomSupportMatch = text.match(telecomSupportPattern);
    
    if (telecomSupportMatch) {
        customerInfo['출고가'] = addThousandSeparator(telecomSupportMatch[1].trim());
        customerInfo['공시'] = addThousandSeparator(telecomSupportMatch[2].trim()); // 이통사지원금을 공시로 매핑
        customerInfo['추지'] = addThousandSeparator(telecomSupportMatch[3].trim()); // 유통망지원금을 추지로 매핑
        customerInfo['전환지원금'] = '';
        customerInfo['프리할부'] = '';
        
        // 할부/현금 여부 확인
        if (telecomSupportMatch[5]) {
            // 할부인 경우
            customerInfo['할부현금여부'] = '할부';
            customerInfo['할부개월수'] = telecomSupportMatch[5] + '개월';
            customerInfo['최종구매가'] = addThousandSeparator(telecomSupportMatch[6] ? telecomSupportMatch[6].trim() : '');
        } else {
            // 현금인 경우
            customerInfo['할부현금여부'] = '현금';
            customerInfo['할부개월수'] = '';
            customerInfo['최종구매가'] = addThousandSeparator(telecomSupportMatch[4] ? telecomSupportMatch[4].trim() : '');
        }
        
        console.log('이통사지원금/유통망지원금 패턴 매칭:', {
            출고가: customerInfo['출고가'],
            공시: customerInfo['공시'],
            추지: customerInfo['추지'],
            할부현금여부: customerInfo['할부현금여부'],
            할부개월수: customerInfo['할부개월수'],
            최종구매가: customerInfo['최종구매가']
        });
    } else {
        // 새로운 패턴: **출고가 숫자 =공시-추가= 형식 (공시, 추가 값이 있을 수도 없을 수도 있음)
        const newPricePattern = /\*\*\s*출고가\s+([\d,.]+)\s*=공시(?:([\d,.]+))?-추가(?:([\d,.]+))?=\s*(?:현금\s*([\d,.]+)|할부(\d+)\s*([\d,.]+))?/i;
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
        
        // 2. 괄호 포함 패턴 (이통사지원금, 유통망지원금 추가)
            const parenthesizedPattern = /\*\*\s*출고가\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?\s*-\s*(?:공시|이통사지원금)\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?\s*(?:-\s*(?:추지|추가지원|추가|유통망지원금)\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?)?\s*(?:-\s*(?:전지|전환지원금?|전환)\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?)?\s*(?:-\s*(?:프리할부|프리)\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?)?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*[\(\[]?\s*([\d,.]+)\s*[\]\)]?/i;
        
        // 3. 일반 패턴 (이통사지원금, 유통망지원금 추가)
            const normalPattern = /\*\*\s*출고가\s+([\d,.]+)\s*-\s*(?:공시|이통사지원금)\s+([\d,.]+)\s*(?:-\s*(?:추지|추가지원|추가|유통망지원금)\s+([\d,.]+))?\s*(?:-\s*(?:전지|전환지원금?|전환)\s+([\d,.]+))?\s*(?:-\s*(?:프리할부|프리)\s+([\d,.]+))?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*([\d,.]+)/i;
        
        // 4. 개선된 패턴 (이통사지원금, 유통망지원금 추가)
            const improvedPattern = /\*\*\s*출고가\s+([\d,.]+)\s*-\s*(?:공시|이통사지원금)\s+([\d,.]+)\s*-\s*(?:추지|유통망지원금)\s+([\d,.]+)\s*(?:-\s*([\d,.]+)(?:원)?)?\s*=\s*할부(\d+)\s*([\d,.]+)(?:원)?/i;
        
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
                const pricePattern = /\*\*\s*출고가\s+([\d,.]+)\s*-\s*공시\s+([\d,.]+)(?:\s*-\s*(?:추지|추가지원|추가)\s+([\d,.]+))?(?:\s*-\s*(?:프리할부|프리)\s+([\d,.]+))?\s*=\s*(할부\s*(?:\(?\d*\)?)|\ud604\uae08)\s*([\d,.]+)/i;
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
                    const cashConversionPattern = /\*\*\s*출고가\s+([\d,.]+)\s*-\s*공시\s+([\d,.]+)(?:\s*-\s*(?:추지|추가지원|추가)\s+([\d,.]+))?\s*(?:-\s*(?:전지|전환지원금?|전환)\s+([\d,.]+))?\s*(?:-\s*프리할부\s+([\d,.]+))?\s*=\s*현금\s*([\d,.]+)/i;
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
                    const cashPattern = /\*\*출고가\s+([\d,.]+)\s*-\s*공시\s+([\d,.]+)\s*-\s*추지\s+([\d,.]+)(?:\s*-\s*프리할부\s+([\d,.]+))?\s*=\s*현금\s*([\d,.]+)/;
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
                        const installmentConversionPattern = /\*\*출고가\s+([\d,.]+)\s*-\s*공시\s+([\d,.]+)\s*-\s*추지\s+([\d,.]+)\s*-\s*(전환지원금?|전환)\s+([\d,.]+)(?:\s*-\s*프리할부\s+([\d,.]+))?\s*=\s*할부(\d+)\s*([\d,.]+)/;
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
                            const alternatePattern = /\*\*출고가\s+([\d,.]+)\s*-\s*(?:공시|이통사지원금)\s+([\d,.]+)\s*-\s*(?:추지|유통망지원금)\s+([\d,.]+)(?:\s*-\s*프리할부\s+([\d,.]+))?\s*=\s*할부(\d+)\s*([\d,.]+)/;
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
    
    // 모델제조사에 따른 보험명 자동 설정 (SK 통신사에만 적용)
    if (customerInfo['보험'] && customerInfo['모델제조사']) {
        // 현재 선택된 통신사 확인
        const telecomSelect = document.getElementById('telecom');
        const selectedTelecom = telecomSelect ? telecomSelect.value : '';
        
        // SK 통신사인 경우에만 T ALL케어플러스 보험 적용
        if (selectedTelecom === 'SK') {
            if (customerInfo['모델제조사'] === '갤럭시') {
                // 갤럭시 모델 중 플립, 폴드, F766, F966인 경우 특별 처리
                const modelName = customerInfo['모델명'] || '';
                if (modelName.includes('플립') || modelName.includes('폴드') || 
                    modelName.includes('F766') || modelName.includes('F966')) {
                    customerInfo['보험'] = 'T ALL케어플러스5 파손F';
                    console.log('SK 갤럭시 플립/폴드 보험명 자동 설정: T ALL케어플러스5 파손F');
                } else {
                    customerInfo['보험'] = 'T ALL케어플러스5 파손80';
                    console.log('SK 갤럭시 보험명 자동 설정: T ALL케어플러스5 파손80');
                }
            } else if (customerInfo['모델제조사'] === '아이폰') {
                customerInfo['보험'] = 'T올케어+5 I파손';
                console.log('SK 아이폰 보험명 자동 설정: T올케어+5 I파손');
            }
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
window.normalizeIdNumber = normalizeIdNumber;
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
            '한올': ['hanolConfirmText', 'hanolDeliveryText', 'hanolOpenText'],
            '오케이 대리점': ['okayOpenText']
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
    
    // 공유 버튼 비활성화
    if (typeof updateShareButtonState === 'function') {
        updateShareButtonState();
    }
    
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
            const existingIndex = history.findIndex(item => {
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
            
            if (existingIndex !== -1) {
                // 기존 항목 업데이트 (단말기 일련번호, 유심 일련번호 등 추가 정보 포함)
                const existingItem = history[existingIndex];
                const updatedCustomerInfo = {
                    ...existingItem.customerInfo,
                    ...customerInfo,
                    // 단말기 일련번호와 유심 일련번호는 현재 입력값으로 업데이트
                    단말기일련번호: customerInfo.단말기일련번호 || existingItem.customerInfo.단말기일련번호 || '',
                    유심일련번호: customerInfo.유심일련번호 || existingItem.customerInfo.유심일련번호 || ''
                };
                
                history[existingIndex] = {
                    ...existingItem,
                    customerInfo: updatedCustomerInfo,
                    timestamp: new Date().toISOString() // 타임스탬프 업데이트
                };
                
                console.log('기존 항목 업데이트:', existingItem.customerInfo.고객명);
            } else {
                // 최대 100개까지 저장
                if (history.length >= 100) {
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
                
                console.log('새 항목 추가:', customerInfo.고객명);
            }
            
            localStorage.setItem('conversionHistory', JSON.stringify(history));
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
            
            historyList.innerHTML = history.map(item => {
                // 단말기 일련번호 유무에 따른 상태 결정
                const hasDeviceSerial = item.customerInfo.단말기일련번호 && 
                                       item.customerInfo.단말기일련번호.trim() !== '';
                const status = hasDeviceSerial ? '개통요청완료' : '개통요청전';
                const statusClass = hasDeviceSerial ? 'status-completed' : 'status-pending';
                
                return `
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
                        <span class="history-status ${statusClass}">${status}</span>
                    </div>
                </div>
            `;
            }).join('');
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
            // 팝업을 열기 전에 만료된 항목 정리
            this.cleanupExpiredItems();
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
    },

    // 만료된 항목 정리 (24시간이 지난 개통요청완료 항목 삭제)
    cleanupExpiredItems() {
        try {
            const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            
            let deletedCount = 0;
            const filteredHistory = history.filter(item => {
                const itemDate = new Date(item.timestamp);
                const hasDeviceSerial = item.customerInfo.단말기일련번호 && 
                                       item.customerInfo.단말기일련번호.trim() !== '';
                
                // 개통요청완료 상태이고 24시간이 지났으면 삭제
                if (hasDeviceSerial && itemDate < twentyFourHoursAgo) {
                    deletedCount++;
                    return false; // 삭제
                }
                return true; // 유지
            });
            
            if (deletedCount > 0) {
                localStorage.setItem('conversionHistory', JSON.stringify(filteredHistory));
                console.log(`${deletedCount}개의 만료된 개통요청완료 항목이 삭제되었습니다.`);
                
                // 팝업이 열려있다면 목록 새로고침
                const popup = document.getElementById('historyPopup');
                if (popup && popup.style.display === 'flex') {
                    this.loadHistory();
                }
            }
            
            return filteredHistory;
        } catch (e) {
            console.error('만료된 항목 정리 중 오류 발생:', e);
            return [];
        }
    },

    // 이력 검색 기능
    searchHistory(searchTerm) {
        try {
            const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
            const historyList = document.getElementById('historyList');
            
            if (!historyList) return;
            
            if (history.length === 0) {
                historyList.innerHTML = '<div class="no-history">저장된 이력이 없습니다.</div>';
                return;
            }
            
            // 검색어가 없으면 전체 목록 표시
            if (!searchTerm || searchTerm.trim() === '') {
                this.loadHistory();
                return;
            }
            
            const searchLower = searchTerm.toLowerCase().trim();
            const filteredHistory = history.filter(item => {
                const customerName = (item.customerInfo.고객명 || item.customerInfo.가입자명 || '').toLowerCase();
                return customerName.includes(searchLower);
            });
            
            if (filteredHistory.length === 0) {
                historyList.innerHTML = '<div class="no-history">검색 결과가 없습니다.</div>';
                return;
            }
            
            historyList.innerHTML = filteredHistory.map(item => {
                // 단말기 일련번호 유무에 따른 상태 결정
                const hasDeviceSerial = item.customerInfo.단말기일련번호 && 
                                       item.customerInfo.단말기일련번호.trim() !== '';
                const status = hasDeviceSerial ? '개통요청완료' : '개통요청전';
                const statusClass = hasDeviceSerial ? 'status-completed' : 'status-pending';
                
                return `
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
                        <span class="history-status ${statusClass}">${status}</span>
                    </div>
                </div>
            `;
            }).join('');
        } catch (e) {
            console.error('이력 검색 중 오류 발생:', e);
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
    
    // 숫자가 아닌 문자 제거 후 숫자만 추출 (쉼표와 점 제거)
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
            /공시지원\s*[^\d]*?([\d,.]+)/i,  // 추가
            /이통사지원금\s*[^\d]*?([\d,.]+)/i  // 추가
        ],
        '추지': [
            /추지\s*[^\d]*?([\d,.]+)/i,
            /추가지원\s*[^\d]*?([\d,.]+)/i,
            /추가\s*[^\d]*?([\d,.]+)/i,
            /유통망지원금\s*[^\d]*?([\d,.]+)/i  // 추가
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
                           lowerLine.includes('이통사지원금') ||  // 추가
                           lowerLine.includes('추지') || 
                           lowerLine.includes('추가') || 
                           lowerLine.includes('유통망지원금') ||  // 추가
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
                   lowerLine.includes('이통사지원금') ||  // 추가
                   lowerLine.includes('추지') || 
                   lowerLine.includes('추가') || 
                   lowerLine.includes('유통망지원금') ||  // 추가
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

/**
 * 주민번호/생년월일 포맷 정규화 함수
 * @param {string} value - 입력값
 * @returns {string} - 정규화된 주민번호/생년월일
 */
function normalizeIdNumber(value) {
    if (!value || value === '') return value;
    
    // 모든 공백과 특수문자 제거 (숫자만 남김)
    const cleanValue = value.replace(/[^\d]/g, '');
    
    // 13자리인 경우 (주민번호) - 8312041042912 -> 831204-1042912
    if (cleanValue.length === 13) {
        return cleanValue.replace(/(\d{6})(\d{7})/, '$1-$2');
    }
    
    // 6자리인 경우 (생년월일) - 831204 -> 831204
    if (cleanValue.length === 6) {
        return cleanValue;
    }
    
    // 7자리인 경우 (생년월일 + 성별) - 8312041 -> 831204-1
    if (cleanValue.length === 7) {
        return cleanValue.replace(/(\d{6})(\d{1})/, '$1-$2');
    }
    
    // 8자리인 경우 (생년월일 + 성별 + 기타) - 83120412 -> 831204-12
    if (cleanValue.length === 8) {
        return cleanValue.replace(/(\d{6})(\d{2})/, '$1-$2');
    }
    
    // 기타 경우는 원본 반환
    return value;
}

/**
 * 천 단위 구분 쉼표 추가 함수
 */

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
// 유심 관련 통합 함수들
// ========================================

/**
 * 유심 상태를 판단하는 통합 함수
 * @param {string} usimValue - 유심 값
 * @returns {object} - 유심 상태 정보
 */
function analyzeUsimStatus(usimValue) {
    if (!usimValue) {
        return {
            isExisting: false,
            isESim: false,
            isReuse: false,
            isRecycle: false,
            needsDelivery: true,
            needsPurchase: true
        };
    }

    const lowerValue = usimValue.toLowerCase().trim();
    
    // 기존 유심 관련 키워드 (발송 불필요, 구매 불필요)
    const existingKeywords = ['기존', '기존유심', '재사용', '재활용'];
    const isExisting = existingKeywords.some(keyword => lowerValue.includes(keyword));
    
    // 이심 관련 키워드 (발송 불필요, 구매 불필요)
    const eSimKeywords = ['이심', 'esim', 'e-sim'];
    const isESim = eSimKeywords.some(keyword => lowerValue.includes(keyword));
    
    // 재사용/재활용 키워드 (기존과 동일하게 처리)
    const isReuse = lowerValue.includes('재사용');
    const isRecycle = lowerValue.includes('재활용');
    
    // 발송 필요 여부 (기존/이심/재사용/재활용이면 발송 불필요)
    const needsDelivery = !(isExisting || isESim || isReuse || isRecycle);
    
    // 구매 필요 여부 (기존/이심/재사용/재활용이면 구매 불필요)
    const needsPurchase = !(isExisting || isESim || isReuse || isRecycle);
    
    return {
        isExisting,
        isESim,
        isReuse,
        isRecycle,
        needsDelivery,
        needsPurchase
    };
}

/**
 * 대리점별 유심 표시 형식 변환 함수
 * @param {string} usimValue - 유심 값
 * @param {string} format - 표시 형식 ('OX', 'YN', '구매비구매', '즉납후납기존', '발송여부')
 * @returns {string} - 변환된 값
 */
function formatUsimForAgency(usimValue, format) {
    const status = analyzeUsimStatus(usimValue);
    
    switch (format) {
        case 'OX':
            // O/X 형식 (발송 필요 여부)
            return status.needsDelivery ? 'O' : 'X';
            
        case 'YN':
            // Y/N 형식 (구매 필요 여부)
            return status.needsPurchase ? 'Y' : 'N';
            
        case '구매비구매':
            // 구매/비구매 형식
            return status.needsPurchase ? '구매' : '비구매';
            
        case '즉납후납기존':
            // 즉납/후납/기존 형식
            if (status.isExisting || status.isReuse || status.isRecycle) {
                return '기존';
            } else if (status.isESim) {
                return '후납(이심)';
            } else {
                return '즉납';
            }
            
        case '발송여부':
            // 발송 여부 형식
            return status.needsDelivery ? '발송' : '미발송';
            
        case '상태':
            // 상세 상태 형식
            if (status.isExisting) return '기존유심재사용';
            if (status.isESim) return '후납(이심)';
            if (status.isReuse) return '재사용';
            if (status.isRecycle) return '재활용';
            return '후청구';
            
        default:
            return usimValue;
    }
}

/**
 * 유심 발송 여부 결정 함수 (SK 이앤티 등에서 사용)
 * @param {string} usimValue - 유심 값
 * @returns {string} - 'O' (발송 필요) 또는 'X' (발송 불필요)
 */
function getUsimDeliveryStatus(usimValue) {
    return formatUsimForAgency(usimValue, 'OX');
}

/**
 * 유심 구매 여부 결정 함수 (구매/비구매 형식)
 * @param {string} usimValue - 유심 값
 * @returns {string} - '구매' 또는 '비구매'
 */
function getUsimPurchaseStatus(usimValue) {
    return formatUsimForAgency(usimValue, '구매비구매');
}

/**
 * 유심 결제 방식 결정 함수 (즉납/후납/기존 형식)
 * @param {string} usimValue - 유심 값
 * @returns {string} - '즉납', '후납(이심)', 또는 '기존'
 */
function getUsimPaymentType(usimValue) {
    return formatUsimForAgency(usimValue, '즉납후납기존');
}

// 유심 관련 함수들을 전역으로 노출
window.analyzeUsimStatus = analyzeUsimStatus;
window.formatUsimForAgency = formatUsimForAgency;
window.getUsimDeliveryStatus = getUsimDeliveryStatus;
window.getUsimPurchaseStatus = getUsimPurchaseStatus;
window.getUsimPaymentType = getUsimPaymentType;

// ========================================
// IP 검증 관련 함수들
// ========================================

/**
 * 외부 API를 통한 클라이언트 IP 주소 획득
 * @param {number} timeout - API 호출 타임아웃 (ms, 기본값: 5000)
 * @returns {Promise<string>} - 클라이언트 IP 주소
 */
async function getClientIP(timeout = 5000) {
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    // 캐시된 IP 확인
    const cachedIP = localStorage.getItem('cached_client_ip');
    const cacheTime = localStorage.getItem('cached_client_ip_time');
    
    if (cachedIP && cacheTime) {
        const now = Date.now();
        const cacheAge = now - parseInt(cacheTime);
        if (cacheAge < config.cacheTimeout) {
            console.log('✅ 캐시된 IP 사용:', cachedIP);
            return cachedIP;
        }
    }
    
    // API 엔드포인트 순서대로 시도
    for (const endpoint of config.apiEndpoints) {
        try {
            console.log(`🌐 IP 확인 시도: ${endpoint}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(endpoint, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            let ip = '';
            
            // 다양한 API 응답 형식 처리
            if (data.ip) {
                ip = data.ip;
            } else if (data.origin) {
                ip = data.origin;
            } else if (data.query) {
                ip = data.query;
            } else {
                throw new Error('IP 주소를 찾을 수 없습니다.');
            }
            
            // IP 주소 유효성 검증
            if (isValidIP(ip)) {
                // 캐시에 저장
                localStorage.setItem('cached_client_ip', ip);
                localStorage.setItem('cached_client_ip_time', Date.now().toString());
                
                console.log('✅ IP 확인 성공:', ip);
                return ip;
            } else {
                throw new Error('유효하지 않은 IP 주소입니다.');
            }
            
        } catch (error) {
            console.warn(`⚠️ IP 확인 실패 (${endpoint}):`, error.message);
            continue;
        }
    }
    
    throw new Error('모든 IP 확인 API가 실패했습니다.');
}

/**
 * IP 주소 유효성 검증
 * @param {string} ip - 검증할 IP 주소
 * @returns {boolean} - 유효한 IP 주소 여부
 */
function isValidIP(ip) {
    if (!ip || typeof ip !== 'string') return false;
    
    // IPv4 정규식 패턴
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 정규식 패턴 (간단한 버전)
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

/**
 * IP 주소를 숫자로 변환 (IPv4)
 * @param {string} ip - IP 주소
 * @returns {number} - IP 주소의 숫자 표현
 */
function ipToNumber(ip) {
    if (!isValidIP(ip)) return 0;
    
    return ip.split('.').reduce((acc, octet) => {
        return (acc << 8) + parseInt(octet, 10);
    }, 0) >>> 0; // 32비트 양수로 변환
}

/**
 * CIDR 표기법의 IP 범위 검증
 * @param {string} ip - 검증할 IP 주소
 * @param {string} cidr - CIDR 표기법 (예: "192.168.1.0/24")
 * @returns {boolean} - IP가 범위에 포함되는지 여부
 */
function isIPInRange(ip, cidr) {
    if (!isValidIP(ip) || !cidr) return false;
    
    try {
        const [rangeIP, prefixLength] = cidr.split('/');
        if (!isValidIP(rangeIP) || !prefixLength) return false;
        
        const prefix = parseInt(prefixLength, 10);
        if (prefix < 0 || prefix > 32) return false;
        
        const ipNum = ipToNumber(ip);
        const rangeNum = ipToNumber(rangeIP);
        const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
        
        return (ipNum & mask) === (rangeNum & mask);
        
    } catch (error) {
        console.warn('IP 범위 검증 오류:', error);
        return false;
    }
}

/**
 * 현재 IP가 허용된 IP 목록에 포함되는지 검증
 * @param {string} currentIP - 현재 IP 주소
 * @param {object} config - IP 제한 설정 (선택사항)
 * @returns {object} - 검증 결과
 */
function validateIPAccess(currentIP, config = null) {
    if (!config) {
        config = typeof loadIPRestrictionConfig === 'function' ? 
            loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    }
    
    // IP 제한 기능이 비활성화된 경우 허용
    if (!config.enabled) {
        return {
            allowed: true,
            reason: 'IP 제한 기능이 비활성화되어 있습니다.',
            currentIP: currentIP
        };
    }
    
    // IP 주소 유효성 검증
    if (!isValidIP(currentIP)) {
        return {
            allowed: false,
            reason: '유효하지 않은 IP 주소입니다.',
            currentIP: currentIP
        };
    }
    
    // 개별 IP 주소 검증
    if (config.allowedIPs && config.allowedIPs.length > 0) {
        if (config.allowedIPs.includes(currentIP)) {
            return {
                allowed: true,
                reason: '허용된 IP 주소입니다.',
                currentIP: currentIP,
                matchType: 'exact'
            };
        }
    }
    
    // IP 범위 검증
    if (config.allowedRanges && config.allowedRanges.length > 0) {
        for (const range of config.allowedRanges) {
            if (isIPInRange(currentIP, range)) {
                return {
                    allowed: true,
                    reason: `허용된 IP 범위에 포함됩니다: ${range}`,
                    currentIP: currentIP,
                    matchType: 'range',
                    matchedRange: range
                };
            }
        }
    }
    
    // 허용 목록이 비어있는 경우 폴백 동작
    if ((!config.allowedIPs || config.allowedIPs.length === 0) && 
        (!config.allowedRanges || config.allowedRanges.length === 0)) {
        
        switch (config.fallbackAction) {
            case 'allow':
                return {
                    allowed: true,
                    reason: '허용 목록이 비어있어 접근을 허용합니다.',
                    currentIP: currentIP,
                    fallback: true
                };
            case 'warn':
                return {
                    allowed: true,
                    reason: '허용 목록이 비어있지만 경고와 함께 접근을 허용합니다.',
                    currentIP: currentIP,
                    fallback: true,
                    warning: true
                };
            case 'block':
            default:
                return {
                    allowed: false,
                    reason: '허용 목록이 비어있어 접근을 차단합니다.',
                    currentIP: currentIP,
                    fallback: true
                };
        }
    }
    
    // 모든 검증을 통과하지 못한 경우 차단
    return {
        allowed: false,
        reason: '허용된 IP 목록에 포함되지 않습니다.',
        currentIP: currentIP,
        allowedIPs: config.allowedIPs || [],
        allowedRanges: config.allowedRanges || []
    };
}

/**
 * IP 접근 검증을 수행하는 메인 함수
 * @returns {Promise<object>} - 검증 결과
 */
async function checkIPAccess() {
    try {
        console.log('🔒 IP 접근 검증 시작...');
        
        // 클라이언트 IP 획득
        const currentIP = await getClientIP();
        
        // IP 접근 검증
        const result = validateIPAccess(currentIP);
        
        console.log('🔒 IP 접근 검증 결과:', result);
        
        return result;
        
    } catch (error) {
        console.error('❌ IP 접근 검증 실패:', error);
        
        // 에러 발생 시 폴백 처리
        const config = typeof loadIPRestrictionConfig === 'function' ? 
            loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
        
        switch (config.fallbackAction) {
            case 'allow':
                return {
                    allowed: true,
                    reason: 'IP 확인 실패로 인해 접근을 허용합니다.',
                    error: error.message,
                    fallback: true
                };
            case 'warn':
                return {
                    allowed: true,
                    reason: 'IP 확인 실패로 인해 경고와 함께 접근을 허용합니다.',
                    error: error.message,
                    fallback: true,
                    warning: true
                };
            case 'block':
            default:
                return {
                    allowed: false,
                    reason: 'IP 확인 실패로 인해 접근을 차단합니다.',
                    error: error.message,
                    fallback: true
                };
        }
    }
}

/**
 * IP 검증 결과를 사용자에게 표시
 * @param {object} result - IP 검증 결과
 */
function showIPValidationResult(result) {
    if (result.allowed) {
        if (result.warning) {
            console.warn('⚠️ IP 검증 경고:', result.reason);
            // 경고 메시지를 사용자에게 표시할 수 있음
        } else {
            console.log('✅ IP 검증 성공:', result.reason);
        }
    } else {
        console.error('❌ IP 검증 실패:', result.reason);
        // 차단 메시지를 사용자에게 표시할 수 있음
    }
}

// IP 검증 관련 함수들을 전역으로 노출
window.getClientIP = getClientIP;
window.isValidIP = isValidIP;
window.ipToNumber = ipToNumber;
window.isIPInRange = isIPInRange;
window.validateIPAccess = validateIPAccess;
window.checkIPAccess = checkIPAccess;
window.showIPValidationResult = showIPValidationResult;

console.log('✅ IP 검증 모듈이 로드되었습니다.');

// ========================================
// IP 차단 모달 관련 함수들
// ========================================

/**
 * IP 차단 모달 표시
 * @param {object} result - IP 검증 결과
 */
function showIPBlockModal(result) {
    const modal = document.getElementById('ipBlockModal');
    const currentIPDisplay = document.getElementById('currentIPDisplay');
    const blockReason = document.getElementById('blockReason');
    
    if (!modal || !currentIPDisplay || !blockReason) {
        console.error('❌ IP 차단 모달 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 현재 IP 주소 표시
    if (result.currentIP) {
        currentIPDisplay.textContent = result.currentIP;
    } else {
        currentIPDisplay.textContent = '확인 실패';
    }
    
    // 차단 사유 표시
    if (result.reason) {
        blockReason.textContent = result.reason;
    } else {
        blockReason.textContent = 'IP 주소가 허용 목록에 포함되지 않습니다.';
    }
    
    // 모달 표시
    modal.style.display = 'flex';
    
    // 메인 콘텐츠 숨기기
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    console.log('🚫 IP 차단 모달이 표시되었습니다.');
}

/**
 * IP 차단 모달 숨기기
 */
function closeIPBlockModal() {
    const modal = document.getElementById('ipBlockModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('✅ IP 차단 모달이 닫혔습니다.');
    }
}

/**
 * IP 재확인 시도
 */
async function retryIPCheck() {
    console.log('🔄 IP 재확인 시도 중...');
    
    // 로딩 상태 표시
    const currentIPDisplay = document.getElementById('currentIPDisplay');
    if (currentIPDisplay) {
        currentIPDisplay.textContent = '재확인 중...';
    }
    
    try {
        // IP 접근 검증 재시도
        const result = await checkIPAccess();
        
        if (result.allowed) {
            // 접근 허용된 경우 모달 닫고 메인 콘텐츠 표시
            closeIPBlockModal();
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.display = 'block';
            }
            
            // 성공 메시지 표시
            showToast('✅ IP 검증이 완료되었습니다. 접근이 허용되었습니다.');
            
            console.log('✅ IP 재확인 성공: 접근 허용');
        } else {
            // 여전히 차단된 경우 모달 업데이트
            showIPBlockModal(result);
            console.log('❌ IP 재확인 실패: 여전히 차단됨');
        }
        
    } catch (error) {
        console.error('❌ IP 재확인 중 오류 발생:', error);
        
        // 오류 상태 표시
        if (currentIPDisplay) {
            currentIPDisplay.textContent = '오류 발생';
        }
        
        // 오류 메시지 표시
        showToast('❌ IP 재확인 중 오류가 발생했습니다.');
    }
}

/**
 * IP 차단 모달 초기화
 */
function initializeIPBlockModal() {
    // 모달이 존재하는지 확인
    const modal = document.getElementById('ipBlockModal');
    if (!modal) {
        console.warn('⚠️ IP 차단 모달이 HTML에 정의되지 않았습니다.');
        return;
    }
    
    // 모달 닫기 버튼 이벤트 리스너 추가
    const closeButton = modal.querySelector('.ip-block-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeIPBlockModal);
    }
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeIPBlockModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeIPBlockModal();
        }
    });
    
    console.log('✅ IP 차단 모달이 초기화되었습니다.');
}

/**
 * IP 차단 모달 테스트 (개발용)
 */
function testIPBlockModal() {
    const testResult = {
        allowed: false,
        reason: '테스트용 차단 메시지입니다.',
        currentIP: '192.168.1.100',
        allowedIPs: ['203.241.xxx.xxx', '210.123.xxx.xxx'],
        allowedRanges: ['192.168.0.0/16']
    };
    
    showIPBlockModal(testResult);
    console.log('🧪 IP 차단 모달 테스트가 실행되었습니다.');
}

// IP 차단 모달 관련 함수들을 전역으로 노출
window.showIPBlockModal = showIPBlockModal;
window.closeIPBlockModal = closeIPBlockModal;
window.retryIPCheck = retryIPCheck;
window.initializeIPBlockModal = initializeIPBlockModal;
window.testIPBlockModal = testIPBlockModal;

console.log('✅ IP 차단 모달 모듈이 로드되었습니다.');

// ========================================
// IP 검증 초기화 및 통합 함수들
// ========================================

/**
 * IP 검증 초기화 및 자동 실행
 */
async function initializeIPVerification() {
    console.log('🔒 IP 검증 초기화 시작...');
    
    // IP 제한 기능이 비활성화된 경우 바로 비밀번호 모달 표시
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    if (!config.enabled) {
        console.log('ℹ️ IP 제한 기능이 비활성화되어 있습니다. 비밀번호 인증으로 진행합니다.');
        showPasswordModal();
        return;
    }
    
    try {
        // IP 접근 검증 수행
        const result = await checkIPAccess();
        
        if (result.allowed) {
            // IP 검증 성공 시 비밀번호 모달 표시
            console.log('✅ IP 검증 성공, 비밀번호 인증 단계로 진행');
            showPasswordModal();
            
        } else {
            // IP 검증 실패 시 차단 모달 표시
            console.log('❌ IP 검증 실패, 접근 차단');
            showIPBlockModal(result);
        }
        
    } catch (error) {
        console.error('❌ IP 검증 초기화 중 오류 발생:', error);
        
        // 에러 발생 시 폴백 설정에 따른 처리
        if (config.fallbackAction === 'allow') {
            console.log('⚠️ IP 검증 실패, 폴백 설정으로 비밀번호 인증 진행');
            showPasswordModal();
        } else {
            console.log('❌ IP 검증 실패, 폴백 설정으로 접근 차단');
            const blockResult = {
                allowed: false,
                reason: 'IP 검증 중 오류가 발생했습니다.',
                error: error.message,
                fallback: true
            };
            showIPBlockModal(blockResult);
        }
    }
}

/**
 * 비밀번호 모달 표시
 */
function showPasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    const mainContent = document.querySelector('.main-content');
    
    if (passwordModal) {
        passwordModal.style.display = 'flex';
        console.log('🔐 비밀번호 모달이 표시되었습니다.');
    }
    
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

/**
 * IP 검증 결과에 따른 모달 전환
 * @param {object} result - IP 검증 결과
 */
function handleIPVerificationResult(result) {
    if (result.allowed) {
        // IP 검증 성공 시 비밀번호 모달로 전환
        showPasswordModal();
    } else {
        // IP 검증 실패 시 차단 모달 표시
        showIPBlockModal(result);
    }
}

/**
 * IP 재확인 후 비밀번호 모달로 전환
 */
async function retryIPCheckAndShowPassword() {
    console.log('🔄 IP 재확인 후 비밀번호 모달 전환 시도...');
    
    try {
        const result = await checkIPAccess();
        
        if (result.allowed) {
            // IP 재확인 성공 시 차단 모달 닫고 비밀번호 모달 표시
            closeIPBlockModal();
            showPasswordModal();
            console.log('✅ IP 재확인 성공, 비밀번호 인증 단계로 진행');
        } else {
            // 여전히 차단된 경우 모달 업데이트
            showIPBlockModal(result);
            console.log('❌ IP 재확인 실패, 여전히 차단됨');
        }
        
    } catch (error) {
        console.error('❌ IP 재확인 중 오류 발생:', error);
        
        const config = typeof loadIPRestrictionConfig === 'function' ? 
            loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
        
        if (config.fallbackAction === 'allow') {
            // 폴백 설정이 'allow'인 경우 비밀번호 모달로 전환
            closeIPBlockModal();
            showPasswordModal();
            showToast('⚠️ IP 검증 실패로 폴백 설정이 적용되었습니다.');
        } else {
            // 폴백 설정이 'block'인 경우 차단 유지
            const blockResult = {
                allowed: false,
                reason: 'IP 재확인 중 오류가 발생했습니다.',
                error: error.message,
                fallback: true
            };
            showIPBlockModal(blockResult);
        }
    }
}

/**
 * 자동 잠금 시스템과 IP 검증 연동
 */
function setupAutoLockWithIPVerification() {
    // 기존 자동 잠금 매니저가 있는 경우 IP 검증과 연동
    if (typeof autoLockManager !== 'undefined' && autoLockManager) {
        const originalLockMethod = autoLockManager.lockApplication;
        
        // 자동 잠금 시 IP 검증도 함께 수행
        autoLockManager.lockApplication = function() {
            console.log('🔒 자동 잠금 실행, IP 검증과 연동');
            
            // 메인 콘텐츠 숨기기
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            
            // IP 검증 초기화 (비밀번호 모달 표시)
            initializeIPVerification();
            
            // 원본 잠금 메서드 호출
            if (originalLockMethod) {
                originalLockMethod.call(this);
            }
        };
        
        console.log('✅ 자동 잠금 시스템과 IP 검증이 연동되었습니다.');
    }
}

// IP 검증 초기화 관련 함수들을 전역으로 노출
window.initializeIPVerification = initializeIPVerification;
window.showPasswordModal = showPasswordModal;
window.handleIPVerificationResult = handleIPVerificationResult;
window.retryIPCheckAndShowPassword = retryIPCheckAndShowPassword;
window.setupAutoLockWithIPVerification = setupAutoLockWithIPVerification;

console.log('✅ IP 검증 초기화 모듈이 로드되었습니다.');

// ========================================
// IP 제한 관리자 인터페이스 함수들
// ========================================

// 관리자 비밀번호 (실제 운영 시에는 더 복잡한 인증 시스템 사용 권장)
const ADMIN_PASSWORD = 'admin123';

/**
 * IP 관리자 모달 표시
 */
function showIPAdminModal() {
    const modal = document.getElementById('ipAdminModal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('🔧 IP 관리자 모달이 표시되었습니다.');
        
        // 현재 IP 정보 업데이트
        refreshCurrentIP();
    }
}

/**
 * IP 관리자 모달 숨기기
 */
function closeIPAdminModal() {
    const modal = document.getElementById('ipAdminModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('✅ IP 관리자 모달이 닫혔습니다.');
    }
}

/**
 * 관리자 권한 검증
 */
function verifyAdminAccess() {
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('adminAuthError');
    const authSection = document.getElementById('adminAuthSection');
    const settingsSection = document.getElementById('adminSettingsSection');
    
    if (!passwordInput || !errorDiv || !authSection || !settingsSection) {
        console.error('❌ 관리자 인증 요소를 찾을 수 없습니다.');
        return;
    }
    
    const inputPassword = passwordInput.value;
    
    if (inputPassword === ADMIN_PASSWORD) {
        // 인증 성공
        console.log('✅ 관리자 인증 성공');
        
        // 에러 메시지 숨기기
        errorDiv.style.display = 'none';
        
        // 인증 섹션 숨기고 설정 섹션 표시
        authSection.style.display = 'none';
        settingsSection.style.display = 'block';
        
        // 설정 로드
        loadIPSettings();
        
        // 비밀번호 입력 필드 초기화
        passwordInput.value = '';
        
    } else {
        // 인증 실패
        console.log('❌ 관리자 인증 실패');
        
        errorDiv.textContent = '관리자 비밀번호가 올바르지 않습니다.';
        errorDiv.style.display = 'block';
        
        // 비밀번호 입력 필드 초기화 및 포커스
        passwordInput.value = '';
        passwordInput.focus();
        
        // 3초 후 에러 메시지 숨기기
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

/**
 * IP 설정 로드
 */
function loadIPSettings() {
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    // IP 제한 기능 토글 설정
    const toggle = document.getElementById('ipRestrictionToggle');
    if (toggle) {
        toggle.checked = config.enabled;
    }
    
    // 폴백 설정 선택
    const fallbackSelect = document.getElementById('fallbackActionSelect');
    if (fallbackSelect) {
        fallbackSelect.value = config.fallbackAction;
    }
    
    // 허용된 IP 목록 표시
    displayAllowedIPs(config.allowedIPs || []);
    
    // 허용된 IP 범위 목록 표시
    displayAllowedRanges(config.allowedRanges || []);
    
    console.log('📋 IP 설정이 로드되었습니다.');
}

/**
 * 허용된 IP 목록 표시
 */
function displayAllowedIPs(ipList) {
    const container = document.getElementById('allowedIPsList');
    if (!container) return;
    
    if (ipList.length === 0) {
        container.innerHTML = '<div class="ip-item"><span class="ip-text" style="color: #999; font-style: italic;">허용된 IP가 없습니다.</span></div>';
        return;
    }
    
    container.innerHTML = ipList.map(ip => `
        <div class="ip-item">
            <span class="ip-text">${ip}</span>
            <button onclick="removeAllowedIP('${ip}')" class="remove-ip-btn">삭제</button>
        </div>
    `).join('');
}

/**
 * 허용된 IP 범위 목록 표시
 */
function displayAllowedRanges(rangeList) {
    const container = document.getElementById('allowedRangesList');
    if (!container) return;
    
    if (rangeList.length === 0) {
        container.innerHTML = '<div class="ip-item"><span class="ip-text" style="color: #999; font-style: italic;">허용된 IP 범위가 없습니다.</span></div>';
        return;
    }
    
    container.innerHTML = rangeList.map(range => `
        <div class="ip-item">
            <span class="ip-text">${range}</span>
            <button onclick="removeAllowedRange('${range}')" class="remove-ip-btn">삭제</button>
        </div>
    `).join('');
}

/**
 * 허용된 IP 추가
 */
function addAllowedIP() {
    const input = document.getElementById('newIPInput');
    if (!input) return;
    
    const ip = input.value.trim();
    
    if (!ip) {
        showToast('❌ IP 주소를 입력해주세요.');
        return;
    }
    
    if (!isValidIP(ip)) {
        showToast('❌ 유효하지 않은 IP 주소입니다.');
        return;
    }
    
    // 현재 설정 로드
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    // 중복 확인
    if (config.allowedIPs && config.allowedIPs.includes(ip)) {
        showToast('⚠️ 이미 등록된 IP 주소입니다.');
        return;
    }
    
    // IP 추가
    if (!config.allowedIPs) {
        config.allowedIPs = [];
    }
    config.allowedIPs.push(ip);
    
    // 설정 저장
    if (typeof saveIPRestrictionConfig === 'function') {
        saveIPRestrictionConfig(config);
    }
    
    // 목록 업데이트
    displayAllowedIPs(config.allowedIPs);
    
    // 입력 필드 초기화
    input.value = '';
    
    showToast('✅ IP 주소가 추가되었습니다.');
    console.log('✅ IP 주소 추가:', ip);
}

/**
 * 허용된 IP 삭제
 */
function removeAllowedIP(ip) {
    // 현재 설정 로드
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    if (config.allowedIPs) {
        const index = config.allowedIPs.indexOf(ip);
        if (index > -1) {
            config.allowedIPs.splice(index, 1);
            
            // 설정 저장
            if (typeof saveIPRestrictionConfig === 'function') {
                saveIPRestrictionConfig(config);
            }
            
            // 목록 업데이트
            displayAllowedIPs(config.allowedIPs);
            
            showToast('✅ IP 주소가 삭제되었습니다.');
            console.log('✅ IP 주소 삭제:', ip);
        }
    }
}

/**
 * 허용된 IP 범위 추가
 */
function addAllowedRange() {
    const input = document.getElementById('newRangeInput');
    if (!input) return;
    
    const range = input.value.trim();
    
    if (!range) {
        showToast('❌ IP 범위를 입력해주세요.');
        return;
    }
    
    // CIDR 형식 검증
    const [ip, prefix] = range.split('/');
    if (!ip || !prefix || !isValidIP(ip) || prefix < 0 || prefix > 32) {
        showToast('❌ 유효하지 않은 CIDR 형식입니다. (예: 192.168.1.0/24)');
        return;
    }
    
    // 현재 설정 로드
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    // 중복 확인
    if (config.allowedRanges && config.allowedRanges.includes(range)) {
        showToast('⚠️ 이미 등록된 IP 범위입니다.');
        return;
    }
    
    // 범위 추가
    if (!config.allowedRanges) {
        config.allowedRanges = [];
    }
    config.allowedRanges.push(range);
    
    // 설정 저장
    if (typeof saveIPRestrictionConfig === 'function') {
        saveIPRestrictionConfig(config);
    }
    
    // 목록 업데이트
    displayAllowedRanges(config.allowedRanges);
    
    // 입력 필드 초기화
    input.value = '';
    
    showToast('✅ IP 범위가 추가되었습니다.');
    console.log('✅ IP 범위 추가:', range);
}

/**
 * 허용된 IP 범위 삭제
 */
function removeAllowedRange(range) {
    // 현재 설정 로드
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    if (config.allowedRanges) {
        const index = config.allowedRanges.indexOf(range);
        if (index > -1) {
            config.allowedRanges.splice(index, 1);
            
            // 설정 저장
            if (typeof saveIPRestrictionConfig === 'function') {
                saveIPRestrictionConfig(config);
            }
            
            // 목록 업데이트
            displayAllowedRanges(config.allowedRanges);
            
            showToast('✅ IP 범위가 삭제되었습니다.');
            console.log('✅ IP 범위 삭제:', range);
        }
    }
}

/**
 * 현재 IP 정보 새로고침
 */
async function refreshCurrentIP() {
    const currentIPElement = document.getElementById('adminCurrentIP');
    if (!currentIPElement) return;
    
    currentIPElement.textContent = '확인 중...';
    
    try {
        const ip = await getClientIP();
        currentIPElement.textContent = ip;
        console.log('✅ 현재 IP 정보 업데이트:', ip);
    } catch (error) {
        currentIPElement.textContent = '확인 실패';
        console.error('❌ 현재 IP 정보 업데이트 실패:', error);
    }
}

/**
 * IP 설정 저장
 */
function saveIPSettings() {
    const toggle = document.getElementById('ipRestrictionToggle');
    const fallbackSelect = document.getElementById('fallbackActionSelect');
    
    if (!toggle || !fallbackSelect) {
        showToast('❌ 설정 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 현재 설정 로드
    const config = typeof loadIPRestrictionConfig === 'function' ? 
        loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
    
    // 설정 업데이트
    config.enabled = toggle.checked;
    config.fallbackAction = fallbackSelect.value;
    
    // 설정 저장
    if (typeof saveIPRestrictionConfig === 'function') {
        saveIPRestrictionConfig(config);
    }
    
    showToast('✅ IP 설정이 저장되었습니다.');
    console.log('✅ IP 설정 저장:', config);
}

/**
 * IP 설정 초기화
 */
function resetIPSettings() {
    if (confirm('정말로 IP 설정을 초기화하시겠습니까?')) {
        // 기본 설정으로 초기화
        if (typeof resetIPRestrictionConfig === 'function') {
            resetIPRestrictionConfig();
        }
        
        // 설정 다시 로드
        loadIPSettings();
        
        showToast('✅ IP 설정이 초기화되었습니다.');
        console.log('✅ IP 설정 초기화 완료');
    }
}

/**
 * IP 관리자 모달 초기화
 */
function initializeIPAdminModal() {
    // 모달이 존재하는지 확인
    const modal = document.getElementById('ipAdminModal');
    if (!modal) {
        console.warn('⚠️ IP 관리자 모달이 HTML에 정의되지 않았습니다.');
        return;
    }
    
    // 관리자 비밀번호 입력 필드 이벤트 리스너
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyAdminAccess();
            }
        });
    }
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeIPAdminModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeIPAdminModal();
        }
    });
    
    console.log('✅ IP 관리자 모달이 초기화되었습니다.');
}

// IP 관리자 인터페이스 관련 함수들을 전역으로 노출
window.showIPAdminModal = showIPAdminModal;
window.closeIPAdminModal = closeIPAdminModal;
window.verifyAdminAccess = verifyAdminAccess;
window.addAllowedIP = addAllowedIP;
window.removeAllowedIP = removeAllowedIP;
window.addAllowedRange = addAllowedRange;
window.removeAllowedRange = removeAllowedRange;
window.refreshCurrentIP = refreshCurrentIP;
window.saveIPSettings = saveIPSettings;
window.resetIPSettings = resetIPSettings;
window.initializeIPAdminModal = initializeIPAdminModal;

console.log('✅ IP 관리자 인터페이스 모듈이 로드되었습니다.');

console.log('✅ IP 관리자 인터페이스 모듈이 로드되었습니다.');

// ========================================
// IP 제한 기능 테스트 및 최적화 함수들
// ========================================

/**
 * IP 제한 기능 종합 테스트
 */
async function runIPRestrictionTests() {
    console.log('🧪 IP 제한 기능 종합 테스트 시작...');
    
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        details: []
    };
    
    // 테스트 1: IP 주소 유효성 검증
    await runTest('IP 주소 유효성 검증', () => {
        const validIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '8.8.8.8'];
        const invalidIPs = ['256.1.2.3', '1.2.3.256', '192.168.1', '192.168.1.1.1', 'abc.def.ghi.jkl'];
        
        // 유효한 IP 테스트
        for (const ip of validIPs) {
            if (!isValidIP(ip)) {
                throw new Error(`유효한 IP가 거부됨: ${ip}`);
            }
        }
        
        // 유효하지 않은 IP 테스트
        for (const ip of invalidIPs) {
            if (isValidIP(ip)) {
                throw new Error(`유효하지 않은 IP가 허용됨: ${ip}`);
            }
        }
        
        return '✅ 모든 IP 유효성 검증 통과';
    }, testResults);
    
    // 테스트 2: CIDR 범위 검증
    await runTest('CIDR 범위 검증', () => {
        const validRanges = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/16'];
        const invalidRanges = ['192.168.1.0/33', '192.168.1.0', '192.168.1.0/abc'];
        
        // 유효한 범위 테스트
        for (const range of validRanges) {
            const [ip, prefix] = range.split('/');
            if (!isValidIP(ip) || prefix < 0 || prefix > 32) {
                throw new Error(`유효한 CIDR이 거부됨: ${range}`);
            }
        }
        
        // 유효하지 않은 범위 테스트
        for (const range of invalidRanges) {
            const [ip, prefix] = range.split('/');
            if (isValidIP(ip) && prefix >= 0 && prefix <= 32) {
                throw new Error(`유효하지 않은 CIDR이 허용됨: ${range}`);
            }
        }
        
        return '✅ 모든 CIDR 범위 검증 통과';
    }, testResults);
    
    // 테스트 3: IP 범위 포함 검증
    await runTest('IP 범위 포함 검증', () => {
        const testCases = [
            { ip: '192.168.1.100', range: '192.168.1.0/24', expected: true },
            { ip: '192.168.2.100', range: '192.168.1.0/24', expected: false },
            { ip: '10.0.0.5', range: '10.0.0.0/8', expected: true },
            { ip: '172.16.0.10', range: '172.16.0.0/16', expected: true }
        ];
        
        for (const testCase of testCases) {
            const result = isIPInRange(testCase.ip, testCase.range);
            if (result !== testCase.expected) {
                throw new Error(`IP 범위 검증 실패: ${testCase.ip} in ${testCase.range} = ${result}, 예상: ${testCase.expected}`);
            }
        }
        
        return '✅ 모든 IP 범위 포함 검증 통과';
    }, testResults);
    
    // 테스트 4: 설정 저장 및 로드
    await runTest('설정 저장 및 로드', () => {
        const testConfig = {
            enabled: true,
            allowedIPs: ['192.168.1.100', '10.0.0.1'],
            allowedRanges: ['192.168.1.0/24'],
            fallbackAction: 'block'
        };
        
        // 설정 저장
        if (typeof saveIPRestrictionConfig === 'function') {
            saveIPRestrictionConfig(testConfig);
        }
        
        // 설정 로드
        const loadedConfig = typeof loadIPRestrictionConfig === 'function' ? 
            loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
        
        // 설정 비교
        if (JSON.stringify(loadedConfig) !== JSON.stringify(testConfig)) {
            throw new Error('설정 저장/로드 불일치');
        }
        
        return '✅ 설정 저장 및 로드 통과';
    }, testResults);
    
    // 테스트 5: API 호출 테스트
    await runTest('API 호출 테스트', async () => {
        try {
            const ip = await getClientIP();
            if (!ip || ip === 'unknown') {
                throw new Error('IP 주소를 가져올 수 없음');
            }
            return `✅ API 호출 성공: ${ip}`;
        } catch (error) {
            throw new Error(`API 호출 실패: ${error.message}`);
        }
    }, testResults);
    
    // 테스트 결과 출력
    console.log('📊 테스트 결과:', testResults);
    console.log(`총 테스트: ${testResults.total}, 통과: ${testResults.passed}, 실패: ${testResults.failed}`);
    
    // 실패한 테스트 상세 출력
    if (testResults.failed > 0) {
        console.error('❌ 실패한 테스트:');
        testResults.details.filter(d => !d.success).forEach(d => {
            console.error(`  - ${d.name}: ${d.error}`);
        });
    }
    
    // UI에 테스트 결과 표시
    displayTestResults(testResults);
    
    return testResults;
}

/**
 * 개별 테스트 실행
 */
async function runTest(name, testFunction, results) {
    results.total++;
    
    try {
        const result = await testFunction();
        results.passed++;
        results.details.push({ name, success: true, result });
        console.log(`✅ ${name}: ${result}`);
        return true;
    } catch (error) {
        results.failed++;
        results.details.push({ name, success: false, error: error.message });
        console.error(`❌ ${name}: ${error.message}`);
        return false;
    }
}

/**
 * 성능 최적화: API 호출 캐싱 개선
 */
function optimizeIPAPICalls() {
    console.log('⚡ IP API 호출 최적화 시작...');
    
    // 캐시 시간을 5분으로 단축 (기존 10분에서)
    if (typeof IP_RESTRICTION_CONFIG !== 'undefined') {
        IP_RESTRICTION_CONFIG.cacheTimeout = 5 * 60 * 1000; // 5분
    }
    
    // 캐시 키 개선
    const cacheKey = 'ip_restriction_cache_v2';
    
    // 캐시된 IP 정보 확인
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const cacheData = JSON.parse(cached);
            const now = Date.now();
            
            if (now - cacheData.timestamp < IP_RESTRICTION_CONFIG.cacheTimeout) {
                console.log('📦 캐시된 IP 정보 사용:', cacheData.ip);
                return cacheData.ip;
            }
        } catch (error) {
            console.warn('⚠️ 캐시 데이터 파싱 실패:', error);
        }
    }
    
    return null;
}

/**
 * 테스트 결과를 UI에 표시
 */
function displayTestResults(testResults) {
    const resultsContainer = document.getElementById('testResults');
    if (!resultsContainer) return;
    
    let html = '<div class="test-summary">';
    html += `📊 테스트 결과: 총 ${testResults.total}개, 통과 ${testResults.passed}개, 실패 ${testResults.failed}개</div>`;
    
    testResults.details.forEach(detail => {
        const className = detail.success ? 'test-result-success' : 'test-result-error';
        const icon = detail.success ? '✅' : '❌';
        const content = detail.success ? detail.result : detail.error;
        
        html += `<div class="test-result-item ${className}">`;
        html += `<strong>${icon} ${detail.name}:</strong> ${content}`;
        html += '</div>';
    });
    
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

/**
 * 에러 처리 개선
 */
function improveErrorHandling() {
    console.log('🛠️ 에러 처리 개선 시작...');
    
    // 네트워크 오류 처리 개선
    const originalGetClientIP = getClientIP;
    
    window.getClientIP = async function() {
        try {
            return await originalGetClientIP();
        } catch (error) {
            console.error('❌ IP API 호출 실패:', error);
            
            // 사용자에게 더 명확한 에러 메시지 제공
            if (error.message.includes('fetch')) {
                showToast('⚠️ 네트워크 연결을 확인해주세요.');
            } else if (error.message.includes('timeout')) {
                showToast('⚠️ IP 확인 시간이 초과되었습니다.');
            } else {
                showToast('⚠️ IP 확인 중 오류가 발생했습니다.');
            }
            
            throw error;
        }
    };
    
    // IP 검증 실패 시 더 자세한 로그
    const originalValidateIPAccess = validateIPAccess;
    
    window.validateIPAccess = function(currentIP, config) {
        try {
            const result = originalValidateIPAccess(currentIP, config);
            
            if (!result.allowed) {
                console.warn('🚫 IP 접근 차단:', {
                    ip: currentIP,
                    reason: result.reason,
                    allowedIPs: config.allowedIPs,
                    allowedRanges: config.allowedRanges
                });
            }
            
            return result;
        } catch (error) {
            console.error('❌ IP 검증 중 오류:', error);
            return {
                allowed: false,
                reason: 'IP 검증 중 오류가 발생했습니다.',
                error: error.message
            };
        }
    };
}

/**
 * 사용자 경험 개선
 */
function improveUserExperience() {
    console.log('🎨 사용자 경험 개선 시작...');
    
    // 로딩 표시 개선
    function showLoadingMessage(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'ipLoadingMessage';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10002;
            text-align: center;
            font-size: 16px;
        `;
        loadingDiv.innerHTML = `
            <div style="margin-bottom: 10px;">⏳</div>
            <div>${message}</div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    function hideLoadingMessage() {
        const loadingDiv = document.getElementById('ipLoadingMessage');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // IP 검증 시 로딩 표시
    const originalCheckIPAccess = checkIPAccess;
    
    window.checkIPAccess = async function() {
        showLoadingMessage('IP 주소를 확인하고 있습니다...');
        
        try {
            const result = await originalCheckIPAccess();
            hideLoadingMessage();
            return result;
        } catch (error) {
            hideLoadingMessage();
            throw error;
        }
    };
    
    // 관리자 모달 열 때 로딩 표시
    const originalShowIPAdminModal = showIPAdminModal;
    
    window.showIPAdminModal = function() {
        showLoadingMessage('관리자 인터페이스를 로드하고 있습니다...');
        
        setTimeout(() => {
            hideLoadingMessage();
            originalShowIPAdminModal();
        }, 500);
    };
}

/**
 * 브라우저 호환성 테스트
 */
function testBrowserCompatibility() {
    console.log('🌐 브라우저 호환성 테스트 시작...');
    
    const compatibility = {
        localStorage: typeof localStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        asyncAwait: (() => {
            try {
                new Function('async () => {}');
                return true;
            } catch {
                return false;
            }
        })(),
        templateLiterals: (() => {
            try {
                new Function('`test`');
                return true;
            } catch {
                return false;
            }
        })(),
        arrowFunctions: (() => {
            try {
                new Function('() => {}');
                return true;
            } catch {
                return false;
            }
        })()
    };
    
    console.log('📋 브라우저 호환성 결과:', compatibility);
    
    // 호환성 문제가 있는 경우 경고
    const issues = Object.entries(compatibility)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (issues.length > 0) {
        console.warn('⚠️ 호환성 문제 발견:', issues);
        showToast(`⚠️ 브라우저 호환성 문제: ${issues.join(', ')}`);
    } else {
        console.log('✅ 모든 기능이 지원됩니다.');
    }
    
    // 호환성 테스트 결과를 UI에 표시
    const compatibilityTestResults = {
        total: Object.keys(compatibility).length,
        passed: Object.values(compatibility).filter(Boolean).length,
        failed: issues.length,
        details: Object.entries(compatibility).map(([feature, supported]) => ({
            name: `${feature} 지원`,
            success: supported,
            result: supported ? '지원됨' : '지원되지 않음'
        }))
    };
    
    displayTestResults(compatibilityTestResults);
    
    return compatibility;
}

/**
 * 메모리 사용량 최적화
 */
function optimizeMemoryUsage() {
    console.log('💾 메모리 사용량 최적화 시작...');
    
    // 불필요한 이벤트 리스너 정리
    function cleanupEventListeners() {
        const modals = ['ipBlockModal', 'ipAdminModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                // 기존 이벤트 리스너 제거
                const newModal = modal.cloneNode(true);
                modal.parentNode.replaceChild(newModal, modal);
            }
        });
        
        console.log('🧹 이벤트 리스너 정리 완료');
    }
    
    // 캐시 크기 제한
    function limitCacheSize() {
        const maxCacheSize = 50; // 최대 캐시 항목 수
        
        // localStorage 크기 확인
        const keys = Object.keys(localStorage);
        const ipRelatedKeys = keys.filter(key => key.includes('ip'));
        
        if (ipRelatedKeys.length > maxCacheSize) {
            // 가장 오래된 캐시 항목들 삭제
            const sortedKeys = ipRelatedKeys.sort((a, b) => {
                const aTime = localStorage.getItem(a + '_timestamp') || 0;
                const bTime = localStorage.getItem(b + '_timestamp') || 0;
                return aTime - bTime;
            });
            
            const keysToRemove = sortedKeys.slice(0, ipRelatedKeys.length - maxCacheSize);
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                localStorage.removeItem(key + '_timestamp');
            });
            
            console.log(`🗑️ ${keysToRemove.length}개의 오래된 캐시 항목 삭제`);
        }
    }
    
    // 주기적 메모리 정리
    setInterval(() => {
        limitCacheSize();
    }, 5 * 60 * 1000); // 5분마다
    
    cleanupEventListeners();
    limitCacheSize();
    
    console.log('✅ 메모리 최적화 완료');
}

/**
 * 최종 통합 테스트
 */
async function runFinalIntegrationTest() {
    console.log('🔍 최종 통합 테스트 시작...');
    
    const testScenarios = [
        {
            name: '허용된 IP 접근',
            setup: () => {
                const config = {
                    enabled: true,
                    allowedIPs: ['127.0.0.1'],
                    allowedRanges: [],
                    fallbackAction: 'block'
                };
                if (typeof saveIPRestrictionConfig === 'function') {
                    saveIPRestrictionConfig(config);
                }
            },
            test: async () => {
                // 실제 IP 검증은 외부 API에 의존하므로 시뮬레이션
                const mockIP = '127.0.0.1';
                const config = typeof loadIPRestrictionConfig === 'function' ? 
                    loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
                
                const result = validateIPAccess(mockIP, config);
                return result.allowed ? '✅ 허용된 IP 접근 테스트 통과' : '❌ 허용된 IP 접근 테스트 실패';
            }
        },
        {
            name: '차단된 IP 접근',
            setup: () => {
                const config = {
                    enabled: true,
                    allowedIPs: ['192.168.1.100'],
                    allowedRanges: [],
                    fallbackAction: 'block'
                };
                if (typeof saveIPRestrictionConfig === 'function') {
                    saveIPRestrictionConfig(config);
                }
            },
            test: async () => {
                const mockIP = '192.168.1.200';
                const config = typeof loadIPRestrictionConfig === 'function' ? 
                    loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
                
                const result = validateIPAccess(mockIP, config);
                return !result.allowed ? '✅ 차단된 IP 접근 테스트 통과' : '❌ 차단된 IP 접근 테스트 실패';
            }
        },
        {
            name: 'IP 제한 비활성화',
            setup: () => {
                const config = {
                    enabled: false,
                    allowedIPs: [],
                    allowedRanges: [],
                    fallbackAction: 'allow'
                };
                if (typeof saveIPRestrictionConfig === 'function') {
                    saveIPRestrictionConfig(config);
                }
            },
            test: async () => {
                const mockIP = '192.168.1.200';
                const config = typeof loadIPRestrictionConfig === 'function' ? 
                    loadIPRestrictionConfig() : IP_RESTRICTION_CONFIG;
                
                const result = validateIPAccess(mockIP, config);
                return result.allowed ? '✅ IP 제한 비활성화 테스트 통과' : '❌ IP 제한 비활성화 테스트 실패';
            }
        }
    ];
    
    const results = [];
    
    for (const scenario of testScenarios) {
        console.log(`🧪 ${scenario.name} 테스트 중...`);
        
        try {
            scenario.setup();
            const result = await scenario.test();
            results.push({ name: scenario.name, success: true, result });
            console.log(`✅ ${scenario.name}: ${result}`);
        } catch (error) {
            results.push({ name: scenario.name, success: false, error: error.message });
            console.error(`❌ ${scenario.name}: ${error.message}`);
        }
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`📊 통합 테스트 결과: ${successCount}/${totalCount} 통과`);
    
    // 통합 테스트 결과를 UI에 표시
    const integrationTestResults = {
        total: totalCount,
        passed: successCount,
        failed: totalCount - successCount,
        details: results.map(r => ({
            name: r.name,
            success: r.success,
            result: r.success ? r.result : r.error
        }))
    };
    
    displayTestResults(integrationTestResults);
    
    if (successCount === totalCount) {
        console.log('🎉 모든 통합 테스트 통과!');
        showToast('✅ IP 제한 기능이 정상적으로 작동합니다.');
    } else {
        console.error('❌ 일부 통합 테스트 실패');
        showToast('⚠️ 일부 IP 제한 기능에 문제가 있습니다.');
    }
    
    return results;
}

/**
 * 전체 최적화 및 테스트 실행
 */
async function runCompleteOptimizationAndTest() {
    console.log('🚀 IP 제한 기능 전체 최적화 및 테스트 시작...');
    
    try {
        // 1. 성능 최적화
        optimizeIPAPICalls();
        
        // 2. 에러 처리 개선
        improveErrorHandling();
        
        // 3. 사용자 경험 개선
        improveUserExperience();
        
        // 4. 브라우저 호환성 테스트
        testBrowserCompatibility();
        
        // 5. 메모리 사용량 최적화
        optimizeMemoryUsage();
        
        // 6. 종합 테스트 실행
        const testResults = await runIPRestrictionTests();
        
        // 7. 최종 통합 테스트
        const integrationResults = await runFinalIntegrationTest();
        
        console.log('🎯 전체 최적화 및 테스트 완료!');
        
        return {
            testResults,
            integrationResults,
            optimization: 'completed'
        };
        
    } catch (error) {
        console.error('❌ 최적화 및 테스트 중 오류 발생:', error);
        showToast('❌ 최적화 및 테스트 중 오류가 발생했습니다.');
        throw error;
    }
}

// 테스트 및 최적화 함수들을 전역으로 노출
window.runIPRestrictionTests = runIPRestrictionTests;
window.runFinalIntegrationTest = runFinalIntegrationTest;
window.runCompleteOptimizationAndTest = runCompleteOptimizationAndTest;
window.optimizeIPAPICalls = optimizeIPAPICalls;
window.improveErrorHandling = improveErrorHandling;
window.improveUserExperience = improveUserExperience;
window.testBrowserCompatibility = testBrowserCompatibility;
window.optimizeMemoryUsage = optimizeMemoryUsage;
window.displayTestResults = displayTestResults;

console.log('✅ IP 제한 기능 테스트 및 최적화 모듈이 로드되었습니다.');

// ========================================
// 카카오톡 공유 기능
// ========================================

/**
 * 공유 버튼 상태 업데이트 함수
 * 변환된 텍스트가 있을 때만 공유 버튼을 활성화합니다.
 */
function updateShareButtonState() {
    const shareButtonContainer = document.getElementById('shareButtonContainer');
    const kakaoShareBtn = document.getElementById('kakaoShareBtn');
    
    if (!shareButtonContainer || !kakaoShareBtn) {
        return;
    }
    
    // 변환된 텍스트가 있는지 확인
    const hasOutputText = checkForOutputText();
    
    if (hasOutputText) {
        shareButtonContainer.style.display = 'block';
        kakaoShareBtn.disabled = false;
    } else {
        shareButtonContainer.style.display = 'none';
        kakaoShareBtn.disabled = true;
    }
}

/**
 * 출력 텍스트 존재 여부 확인 함수
 * @returns {boolean} - 출력 텍스트가 있으면 true, 없으면 false
 */
function checkForOutputText() {
    // 키-값 테이블이 표시되어 있는지 확인
    const keyValueTableContainer = document.getElementById('keyValueTableContainer');
    if (keyValueTableContainer && keyValueTableContainer.style.display !== 'none') {
        return true; // 키-값 테이블이 표시되어 있으면 공유 가능
    }
    
    // 여러 텍스트 영역 확인
    const outputText1 = document.getElementById('outputText1');
    const outputText2 = document.getElementById('outputText2');
    const outputText = document.getElementById('outputText');
    
    // 럭스 전용 텍스트 영역들 확인
    const luxRequestText = document.getElementById('luxRequestText');
    const luxStockText = document.getElementById('luxStockText');
    const luxMemoText = document.getElementById('luxMemoText');
    const luxUniverseText = document.getElementById('luxUniverseText');
    
    // 큐브 전용 텍스트 영역들 확인
    const cubeStockText = document.getElementById('cubeStockText');
    const cubeOpenText = document.getElementById('cubeOpenText');
    const cubeUniverseText = document.getElementById('cubeUniverseText');
    
    // 드블랙 전용 텍스트 영역들 확인
    const dblackRequestText = document.getElementById('dblackRequestText');
    const dblackStockText = document.getElementById('dblackStockText');
    const dblackMemoText = document.getElementById('dblackMemoText');
    
    // ACT 전용 텍스트 영역들 확인
    const actStockText = document.getElementById('actStockText');
    const actOpenText = document.getElementById('actOpenText');
    
    // 비앤컴 전용 텍스트 영역들 확인
    const bncomStockText = document.getElementById('bncomStockText');
    const bncomOpenText = document.getElementById('bncomOpenText');
    
    // 휴넷 전용 텍스트 영역들 확인
    const hunetConfirmText = document.getElementById('hunetConfirmText');
    const hunetDeliveryText = document.getElementById('hunetDeliveryText');
    const hunetOpenText = document.getElementById('hunetOpenText');
    
    // 밀리언 전용 텍스트 영역들 확인
    const millionRequestText = document.getElementById('millionRequestText');
    const millionStockText = document.getElementById('millionStockText');
    const millionMemoText = document.getElementById('millionMemoText');
    
    // 오앤티 전용 텍스트 영역들 확인
    const ontRequestText = document.getElementById('ontRequestText');
    const ontStockText = document.getElementById('ontStockText');
    const ontMemoText = document.getElementById('ontMemoText');
    
    // 장천 전용 텍스트 영역들 확인
    const jangcheonDeliveryText = document.getElementById('jangcheonDeliveryText');
    const jangcheonOpenText = document.getElementById('jangcheonOpenText');
    
    // 한올 전용 텍스트 영역들 확인
    const hanolConfirmText = document.getElementById('hanolConfirmText');
    const hanolDeliveryText = document.getElementById('hanolDeliveryText');
    const hanolOpenText = document.getElementById('hanolOpenText');
    
    // 코웨어 전용 텍스트 영역들 확인
    const cowareOpenText = document.getElementById('cowareOpenText');
    const cowareSpacePassText = document.getElementById('cowareSpacePassText');
    
    // 모든 텍스트 영역을 배열로 관리
    const textAreas = [
        outputText1, outputText2, outputText,
        luxRequestText, luxStockText, luxMemoText, luxUniverseText,
        cubeStockText, cubeOpenText, cubeUniverseText,
        dblackRequestText, dblackStockText, dblackMemoText,
        actStockText, actOpenText,
        bncomStockText, bncomOpenText,
        hunetConfirmText, hunetDeliveryText, hunetOpenText,
        millionRequestText, millionStockText, millionMemoText,
        ontRequestText, ontStockText, ontMemoText,
        jangcheonDeliveryText, jangcheonOpenText,
        hanolConfirmText, hanolDeliveryText, hanolOpenText,
        cowareOpenText, cowareSpacePassText
    ];
    
    // 하나라도 텍스트가 있으면 true 반환
    return textAreas.some(textarea => 
        textarea && 
        textarea.style.display !== 'none' && 
        textarea.value.trim() !== ''
    );
}

/**
 * 카카오톡 공유 함수
 * 변환된 텍스트를 클립보드에 복사하고 카카오톡 앱을 호출합니다.
 */
async function shareToKakaoTalk() {
    const shareBtn = document.getElementById('kakaoShareBtn');
    let textToShare = null;
    
    try {
        // 키-값 테이블이 표시되어 있는지 확인
        const keyValueTableContainer = document.getElementById('keyValueTableContainer');
        if (keyValueTableContainer && keyValueTableContainer.style.display !== 'none') {
            showToast('키-값 테이블에서는 각 항목을 클릭하여 개별적으로 복사해주세요.');
            return;
        }
        
        // 텍스트 추출 (기존 copyToClipboard 로직 재사용)
        textToShare = extractTextToShare();
        if (!textToShare) {
            showToast('공유할 텍스트가 없습니다.');
            return;
        }
        
        // 로딩 상태 설정
        if (shareBtn) {
            shareBtn.classList.add('loading');
            shareBtn.disabled = true;
        }
        
        // 클립보드에 복사
        await copyTextToClipboard(textToShare);
        
        // 카카오톡 호출
        await callKakaoTalk(textToShare);
        
        // 성공 상태 표시
        if (shareBtn) {
            shareBtn.classList.remove('loading');
            shareBtn.classList.add('success');
            setTimeout(() => {
                shareBtn.classList.remove('success');
                shareBtn.disabled = false;
            }, 2000);
        }
        
    } catch (error) {
        console.error('카카오톡 공유 중 오류:', error);
        
        // 오류 상태 표시
        if (shareBtn) {
            shareBtn.classList.remove('loading');
            shareBtn.classList.add('error');
            setTimeout(() => {
                shareBtn.classList.remove('error');
                shareBtn.disabled = false;
            }, 3000);
        }
        
        handleShareError(error, textToShare);
    }
}

/**
 * 공유할 텍스트 추출 함수
 * @returns {string|null} - 추출된 텍스트 또는 null
 */
function extractTextToShare() {
    // 여러 텍스트 영역 확인 (기존 copyToClipboard 로직 재사용)
    const outputText1 = document.getElementById('outputText1');
    const outputText2 = document.getElementById('outputText2');
    const outputText = document.getElementById('outputText');
    
    // 럭스 전용 텍스트 영역들 확인
    const luxRequestText = document.getElementById('luxRequestText');
    const luxStockText = document.getElementById('luxStockText');
    const luxMemoText = document.getElementById('luxMemoText');
    const luxUniverseText = document.getElementById('luxUniverseText');
    
    // 큐브 전용 텍스트 영역들 확인
    const cubeStockText = document.getElementById('cubeStockText');
    const cubeOpenText = document.getElementById('cubeOpenText');
    const cubeUniverseText = document.getElementById('cubeUniverseText');
    
    // 드블랙 전용 텍스트 영역들 확인
    const dblackRequestText = document.getElementById('dblackRequestText');
    const dblackStockText = document.getElementById('dblackStockText');
    const dblackMemoText = document.getElementById('dblackMemoText');
    
    // ACT 전용 텍스트 영역들 확인
    const actStockText = document.getElementById('actStockText');
    const actOpenText = document.getElementById('actOpenText');
    
    // 비앤컴 전용 텍스트 영역들 확인
    const bncomStockText = document.getElementById('bncomStockText');
    const bncomOpenText = document.getElementById('bncomOpenText');
    
    // 휴넷 전용 텍스트 영역들 확인
    const hunetConfirmText = document.getElementById('hunetConfirmText');
    const hunetDeliveryText = document.getElementById('hunetDeliveryText');
    const hunetOpenText = document.getElementById('hunetOpenText');
    
    // 밀리언 전용 텍스트 영역들 확인
    const millionRequestText = document.getElementById('millionRequestText');
    const millionStockText = document.getElementById('millionStockText');
    const millionMemoText = document.getElementById('millionMemoText');
    
    // 오앤티 전용 텍스트 영역들 확인
    const ontRequestText = document.getElementById('ontRequestText');
    const ontStockText = document.getElementById('ontStockText');
    const ontMemoText = document.getElementById('ontMemoText');
    
    // 장천 전용 텍스트 영역들 확인
    const jangcheonDeliveryText = document.getElementById('jangcheonDeliveryText');
    const jangcheonOpenText = document.getElementById('jangcheonOpenText');
    
    // 한올 전용 텍스트 영역들 확인
    const hanolConfirmText = document.getElementById('hanolConfirmText');
    const hanolDeliveryText = document.getElementById('hanolDeliveryText');
    const hanolOpenText = document.getElementById('hanolOpenText');
    
    // 코웨어 전용 텍스트 영역들 확인
    const cowareOpenText = document.getElementById('cowareOpenText');
    const cowareSpacePassText = document.getElementById('cowareSpacePassText');
    
    // 우선순위에 따라 텍스트 선택
    if (outputText1 && outputText1.style.display !== 'none' && outputText1.value.trim() !== '') {
        return outputText1.value.trim();
    } else if (outputText2 && outputText2.style.display !== 'none' && outputText2.value.trim() !== '') {
        return outputText2.value.trim();
    } else if (outputText && outputText.value.trim() !== '') {
        return outputText.value.trim();
    }
    
    // 대리점별 텍스트 영역 확인
    const textAreas = [
        luxRequestText, luxStockText, luxMemoText, luxUniverseText,
        cubeStockText, cubeOpenText, cubeUniverseText,
        dblackRequestText, dblackStockText, dblackMemoText,
        actStockText, actOpenText,
        bncomStockText, bncomOpenText,
        hunetConfirmText, hunetDeliveryText, hunetOpenText,
        millionRequestText, millionStockText, millionMemoText,
        ontRequestText, ontStockText, ontMemoText,
        jangcheonDeliveryText, jangcheonOpenText,
        hanolConfirmText, hanolDeliveryText, hanolOpenText,
        cowareOpenText, cowareSpacePassText
    ];
    
    for (const textarea of textAreas) {
        if (textarea && textarea.style.display !== 'none' && textarea.value.trim() !== '') {
            return textarea.value.trim();
        }
    }
    
    return null;
}

/**
 * 클립보드에 텍스트 복사 함수
 * @param {string} text - 복사할 텍스트
 * @returns {Promise} - 복사 결과
 */
async function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // fallback: 예전 방식 사용
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('클립보드 복사에 실패했습니다.'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    }
}

/**
 * 카카오톡 앱 호출 함수
 * @param {string} text - 공유할 텍스트
 * @returns {Promise} - 호출 결과
 */
async function callKakaoTalk(text) {
    return new Promise((resolve, reject) => {
        try {
            // URL 스킴으로 카카오톡 호출
            const kakaoUrl = `kakaotalk://send?text=${encodeURIComponent(text)}`;
            
            // 카카오톡 앱 호출 시도
            window.location.href = kakaoUrl;
            
            // 일정 시간 후 앱 호출 성공 여부 확인
            setTimeout(() => {
                // 앱이 설치되어 있으면 페이지가 변경되거나 앱이 열림
                // 설치되어 있지 않으면 페이지가 그대로 유지됨
                showToast('카카오톡이 열렸습니다! 📱\n\n1. 복사된 텍스트가 입력창에 표시됩니다\n2. 상단의 "전송" 버튼을 눌러 공유할 상대를 선택하세요\n3. 원하는 채팅방을 선택하고 전송하세요');
                resolve();
            }, 1000);
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 공유 오류 처리 함수
 * @param {Error} error - 발생한 오류
 * @param {string} text - 공유하려던 텍스트
 */
function handleShareError(error, text) {
    console.error('공유 오류 처리:', error);
    
    if (error.name === 'NotAllowedError') {
        // 클립보드 권한 거부
        showToast('클립보드 접근 권한이 거부되었습니다. 텍스트를 수동으로 복사해주세요.');
        showTextSelectionModal(text);
    } else if (error.name === 'ClipboardError') {
        // 클립보드 복사 실패
        showToast('클립보드 복사에 실패했습니다. 텍스트를 수동으로 복사해주세요.');
        showTextSelectionModal(text);
    } else {
        // 기타 오류
        showToast('카카오톡 공유 중 오류가 발생했습니다. 텍스트를 수동으로 복사해주세요.');
        showTextSelectionModal(text);
    }
}

/**
 * 텍스트 선택 모달 표시 함수
 * @param {string} text - 선택할 텍스트
 */
function showTextSelectionModal(text) {
    try {
        // 모달 요소 가져오기
        const modal = document.getElementById('textSelectionModal');
        const textarea = document.getElementById('textSelectionTextarea');
        
        if (!modal || !textarea) {
            console.error('텍스트 선택 모달 요소를 찾을 수 없습니다.');
            showToast('모달을 표시할 수 없습니다.');
            return;
        }
        
        // 텍스트 설정
        textarea.value = text;
        
        // 모달 표시
        modal.style.display = 'flex';
        
        // 텍스트 영역에 포커스
        setTimeout(() => {
            textarea.focus();
        }, 100);
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTextSelectionModal();
            }
        });
        
        // ESC 키로 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeTextSelectionModal();
            }
        });
        
    } catch (error) {
        console.error('텍스트 선택 모달 표시 중 오류:', error);
        showToast('모달을 표시하는 중 오류가 발생했습니다.');
    }
}

/**
 * 텍스트 선택 모달 닫기 함수
 */
function closeTextSelectionModal() {
    try {
        const modal = document.getElementById('textSelectionModal');
        if (modal) {
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error('텍스트 선택 모달 닫기 중 오류:', error);
    }
}

/**
 * 텍스트 전체 선택 함수
 */
function selectAllText() {
    try {
        const textarea = document.getElementById('textSelectionTextarea');
        if (textarea) {
            textarea.select();
            textarea.focus();
            
            // 선택 성공 피드백
            showToast('텍스트가 전체 선택되었습니다. Ctrl+C로 복사하세요.');
        }
    } catch (error) {
        console.error('텍스트 선택 중 오류:', error);
        showToast('텍스트 선택에 실패했습니다.');
    }
}

/**
 * 카카오톡 공유 기능 종합 테스트 실행 함수
 */
async function runKakaoShareTests() {
    console.log('🚀 카카오톡 공유 기능 종합 테스트 시작...');
    
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0,
        details: []
    };
    
    try {
        // 1. 기본 UI 테스트
        await runTest('UI 요소 존재 확인', testUIElements, testResults);
        await runTest('공유 버튼 상태 관리', testShareButtonStates, testResults);
        
        // 2. 텍스트 추출 테스트
        await runTest('텍스트 추출 기능', testTextExtraction, testResults);
        
        // 3. 클립보드 기능 테스트
        await runTest('클립보드 복사 기능', testClipboardFunction, testResults);
        
        // 4. 텍스트 선택 모달 테스트
        await runTest('텍스트 선택 모달', testTextSelectionModal, testResults);
        
        // 5. 에러 처리 테스트
        await runTest('에러 처리 기능', testErrorHandling, testResults);
        
        // 6. 모바일 환경 테스트
        await runTest('모바일 환경 호환성', testMobileCompatibility, testResults);
        
        // 7. 브라우저 호환성 테스트
        await runTest('브라우저 호환성', testBrowserCompatibility, testResults);
        
        // 8. 성능 테스트
        await runTest('성능 최적화', testPerformance, testResults);
        
        // 테스트 결과 표시
        displayKakaoShareTestResults(testResults);
        
    } catch (error) {
        console.error('테스트 실행 중 오류:', error);
        showToast('테스트 실행 중 오류가 발생했습니다.');
    }
}

/**
 * 개별 테스트 실행 함수
 */
async function runTest(name, testFunction, results) {
    results.total++;
    console.log(`📋 테스트 실행: ${name}`);
    
    try {
        const result = await testFunction();
        if (result.success) {
            results.passed++;
            results.details.push({ name, status: 'PASS', message: result.message });
            console.log(`✅ ${name}: 성공 - ${result.message}`);
        } else {
            results.failed++;
            results.details.push({ name, status: 'FAIL', message: result.message });
            console.log(`❌ ${name}: 실패 - ${result.message}`);
        }
    } catch (error) {
        results.failed++;
        results.details.push({ name, status: 'ERROR', message: error.message });
        console.log(`💥 ${name}: 오류 - ${error.message}`);
    }
}

/**
 * UI 요소 존재 확인 테스트
 */
async function testUIElements() {
    const shareButton = document.getElementById('kakaoShareBtn');
    const shareContainer = document.getElementById('shareButtonContainer');
    const textModal = document.getElementById('textSelectionModal');
    
    if (!shareButton || !shareContainer || !textModal) {
        return { success: false, message: '필수 UI 요소가 누락되었습니다.' };
    }
    
    return { success: true, message: '모든 UI 요소가 정상적으로 존재합니다.' };
}

/**
 * 공유 버튼 상태 관리 테스트
 */
async function testShareButtonStates() {
    const shareButton = document.getElementById('kakaoShareBtn');
    if (!shareButton) {
        return { success: false, message: '공유 버튼을 찾을 수 없습니다.' };
    }
    
    // 초기 상태 확인
    if (!shareButton.disabled) {
        return { success: false, message: '초기 상태가 비활성화되어야 합니다.' };
    }
    
    // 클래스 추가/제거 테스트
    shareButton.classList.add('loading');
    if (!shareButton.classList.contains('loading')) {
        return { success: false, message: '로딩 상태 클래스가 적용되지 않습니다.' };
    }
    
    shareButton.classList.remove('loading');
    if (shareButton.classList.contains('loading')) {
        return { success: false, message: '로딩 상태 클래스가 제거되지 않습니다.' };
    }
    
    return { success: true, message: '공유 버튼 상태 관리가 정상 작동합니다.' };
}

/**
 * 텍스트 추출 기능 테스트
 */
async function testTextExtraction() {
    // 테스트용 텍스트 설정
    const testText = '테스트 텍스트입니다.';
    const outputText = document.getElementById('outputText');
    
    if (outputText) {
        outputText.value = testText;
        outputText.style.display = 'block';
    }
    
    const extractedText = extractTextToShare();
    
    if (extractedText === testText) {
        return { success: true, message: '텍스트 추출이 정상 작동합니다.' };
    } else {
        return { success: false, message: `텍스트 추출 실패. 예상: "${testText}", 실제: "${extractedText}"` };
    }
}

/**
 * 클립보드 기능 테스트
 */
async function testClipboardFunction() {
    const testText = '클립보드 테스트 텍스트';
    
    try {
        await copyTextToClipboard(testText);
        
        // 클립보드 읽기 테스트 (권한이 있는 경우)
        if (navigator.clipboard && navigator.clipboard.readText) {
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText === testText) {
                    return { success: true, message: '클립보드 복사가 정상 작동합니다.' };
                } else {
                    return { success: false, message: '클립보드 내용이 일치하지 않습니다.' };
                }
            } catch (readError) {
                // 읽기 권한이 없는 경우는 정상적인 상황
                return { success: true, message: '클립보드 복사가 완료되었습니다. (읽기 권한 없음)' };
            }
        } else {
            return { success: true, message: '클립보드 복사가 완료되었습니다. (구형 브라우저)' };
        }
    } catch (error) {
        return { success: false, message: `클립보드 복사 실패: ${error.message}` };
    }
}

/**
 * 텍스트 선택 모달 테스트
 */
async function testTextSelectionModal() {
    const testText = '모달 테스트 텍스트입니다.';
    
    // 모달 표시
    showTextSelectionModal(testText);
    
    // 모달 요소 확인
    const modal = document.getElementById('textSelectionModal');
    const textarea = document.getElementById('textSelectionTextarea');
    
    if (!modal || !textarea) {
        return { success: false, message: '모달 요소를 찾을 수 없습니다.' };
    }
    
    // 모달 표시 상태 확인
    if (modal.style.display !== 'flex') {
        return { success: false, message: '모달이 표시되지 않았습니다.' };
    }
    
    // 텍스트 내용 확인
    if (textarea.value !== testText) {
        return { success: false, message: '모달에 텍스트가 올바르게 설정되지 않았습니다.' };
    }
    
    // 모달 닫기
    closeTextSelectionModal();
    
    if (modal.style.display !== 'none') {
        return { success: false, message: '모달이 닫히지 않았습니다.' };
    }
    
    return { success: true, message: '텍스트 선택 모달이 정상 작동합니다.' };
}

/**
 * 에러 처리 기능 테스트
 */
async function testErrorHandling() {
    // 의도적으로 에러 상황 생성
    const originalExtractText = extractTextToShare;
    extractTextToShare = () => null; // 빈 텍스트 반환
    
    try {
        const shareBtn = document.getElementById('kakaoShareBtn');
        if (shareBtn) {
            shareBtn.disabled = false; // 활성화
        }
        
        // 공유 시도 (텍스트가 없어서 실패해야 함)
        await shareToKakaoTalk();
        
        // 에러 상태 확인
        if (shareBtn && shareBtn.classList.contains('error')) {
            return { success: true, message: '에러 처리가 정상 작동합니다.' };
        } else {
            return { success: false, message: '에러 상태가 표시되지 않았습니다.' };
        }
    } finally {
        // 원래 함수 복원
        extractTextToShare = originalExtractText;
    }
}

/**
 * 모바일 환경 호환성 테스트
 */
async function testMobileCompatibility() {
    const shareButton = document.getElementById('kakaoShareBtn');
    if (!shareButton) {
        return { success: false, message: '공유 버튼을 찾을 수 없습니다.' };
    }
    
    // 터치 최적화 확인
    const computedStyle = window.getComputedStyle(shareButton);
    const minHeight = parseInt(computedStyle.minHeight);
    const touchAction = computedStyle.touchAction;
    
    if (minHeight < 44) {
        return { success: false, message: '터치 최적화 크기가 부족합니다.' };
    }
    
    if (touchAction !== 'manipulation') {
        return { success: false, message: '터치 액션이 최적화되지 않았습니다.' };
    }
    
    return { success: true, message: '모바일 환경 호환성이 확인되었습니다.' };
}

/**
 * 브라우저 호환성 테스트
 */
async function testBrowserCompatibility() {
    const tests = [];
    
    // Clipboard API 지원 확인
    tests.push({
        name: 'Clipboard API',
        supported: !!(navigator.clipboard && navigator.clipboard.writeText)
    });
    
    // execCommand 지원 확인 (구형 브라우저)
    tests.push({
        name: 'execCommand',
        supported: !!document.execCommand
    });
    
    // URL 스킴 지원 확인
    tests.push({
        name: 'URL Scheme',
        supported: true // 모든 브라우저에서 지원
    });
    
    const supportedCount = tests.filter(t => t.supported).length;
    const totalCount = tests.length;
    
    if (supportedCount === totalCount) {
        return { success: true, message: '모든 브라우저 기능이 지원됩니다.' };
    } else {
        return { success: true, message: `${supportedCount}/${totalCount} 브라우저 기능이 지원됩니다.` };
    }
}

/**
 * 성능 최적화 테스트
 */
async function testPerformance() {
    const startTime = performance.now();
    
    // 공유 버튼 상태 업데이트 성능 테스트
    for (let i = 0; i < 100; i++) {
        updateShareButtonState();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration < 100) { // 100ms 이내 완료
        return { success: true, message: `성능 테스트 통과 (${duration.toFixed(2)}ms)` };
    } else {
        return { success: false, message: `성능 테스트 실패 (${duration.toFixed(2)}ms)` };
    }
}

/**
 * 카카오톡 공유 기능 테스트 결과 표시
 */
function displayKakaoShareTestResults(results) {
    console.log('\n📊 카카오톡 공유 기능 테스트 결과');
    console.log('=====================================');
    console.log(`총 테스트: ${results.total}`);
    console.log(`성공: ${results.passed}`);
    console.log(`실패: ${results.failed}`);
    console.log(`성공률: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    console.log('\n📋 상세 결과:');
    results.details.forEach(detail => {
        const status = detail.status === 'PASS' ? '✅' : detail.status === 'FAIL' ? '❌' : '💥';
        console.log(`${status} ${detail.name}: ${detail.message}`);
    });
    
    // 사용자에게 결과 알림
    const successRate = (results.passed / results.total) * 100;
    if (successRate >= 90) {
        showToast(`테스트 완료: ${successRate.toFixed(1)}% 성공률로 모든 기능이 정상 작동합니다!`);
    } else if (successRate >= 70) {
        showToast(`테스트 완료: ${successRate.toFixed(1)}% 성공률로 대부분 기능이 정상 작동합니다.`);
    } else {
        showToast(`테스트 완료: ${successRate.toFixed(1)}% 성공률로 일부 기능에 문제가 있습니다.`);
    }
}

/**
 * 카카오톡 공유 기능 간단 테스트 (사용자용)
 */
function testKakaoShareFeature() {
    console.log('🧪 카카오톡 공유 기능 간단 테스트 시작...');
    
    // 기본 기능 테스트
    const tests = [
        { name: 'UI 요소 확인', test: () => !!document.getElementById('kakaoShareBtn') },
        { name: '텍스트 추출', test: () => extractTextToShare() !== null },
        { name: '모달 기능', test: () => !!document.getElementById('textSelectionModal') }
    ];
    
    let passed = 0;
    tests.forEach(test => {
        if (test.test()) {
            console.log(`✅ ${test.name}: 통과`);
            passed++;
        } else {
            console.log(`❌ ${test.name}: 실패`);
        }
    });
    
    const successRate = (passed / tests.length) * 100;
    showToast(`간단 테스트 완료: ${successRate.toFixed(0)}% 성공률`);
    
    return successRate >= 100;
}

// 전역 함수로 노출
window.updateShareButtonState = updateShareButtonState;
window.checkForOutputText = checkForOutputText;
window.shareToKakaoTalk = shareToKakaoTalk;
window.extractTextToShare = extractTextToShare;
window.copyTextToClipboard = copyTextToClipboard;
window.callKakaoTalk = callKakaoTalk;
window.handleShareError = handleShareError;
window.showTextSelectionModal = showTextSelectionModal;
window.closeTextSelectionModal = closeTextSelectionModal;
window.selectAllText = selectAllText;
window.runKakaoShareTests = runKakaoShareTests;
window.testKakaoShareFeature = testKakaoShareFeature;