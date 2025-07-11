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
    '갤럭시Z폴드6': 'F956',
    '갤럭시Z폴드5': 'F946',
    '갤럭시Z폴드4': 'F936',
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
        'T올케어', 'T ALL케어', 'T All케어', '케어플러스', '케어',
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
        /\(\s*총\s*\d+\s*개월\s*\)/gi
    ];
    
    let insuranceItems = [];
    let addonItems1 = [];
    let addonItems2 = [];
    
    // 주요 구분자로 분리 (/, 번호순서 등)
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
                insuranceItems.push(cleanItem);
                isInsurance = true;
                console.log('보험으로 분류:', cleanItem);
                break;
            }
        }
        
        // 보험이 아닌 경우 부가서비스 키워드 확인
        if (!isInsurance) {
            for (const keyword of addonKeywords) {
                if (cleanItem.toLowerCase().includes(keyword.toLowerCase())) {
                    // 마이스마트콜은 자동으로 마이스마트콜3로 보정
                    if (keyword === '마이스마트콜' && cleanItem.toLowerCase() === '마이스마트콜') {
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

// 가입유형, 할인유형, 통신사 정보 분석 함수
function parseSubscriptionAndDiscountInfo(customerInfo) {
    const result = {
        subscriptionType: '',    // 신규/기변/번이
        discountType: '',        // 선택약정/공시지원금
        currentTelecom: '',      // SKT/KT/LGU+
        discountMonths: ''       // 24개월/30개월 등
    };
    
    // 가입유형 처리
    if (customerInfo['가입유형']) {
        const joinType = customerInfo['가입유형'];
        if (joinType.includes('신규')) {
            result.subscriptionType = '신규';
        } else if (joinType.includes('기변') || joinType.includes('기기변경')) {
            result.subscriptionType = '기변';
        } else if (joinType.includes('번이') || joinType.includes('번호이동')) {
            result.subscriptionType = '번이';
        } else {
            result.subscriptionType = joinType; // 원본 값 유지
        }
    }
    
    // 할인유형 처리
    if (customerInfo['할인유형']) {
        const discountType = customerInfo['할인유형'];
        if (discountType.includes('선택약정') || discountType.includes('선약')) {
            // 개월수 추출
            const monthMatch = discountType.match(/(\d+)개월/);
            if (monthMatch) {
                result.discountMonths = monthMatch[1] + '개월';
                result.discountType = '선택약정';
            } else {
                result.discountType = '선택약정';
            }
        } else if (discountType.includes('공시') || discountType.includes('지원금')) {
            result.discountType = '공시지원금';
        } else {
            result.discountType = discountType; // 원본 값 유지
        }
    }
    
    // 현재통신사 처리
    if (customerInfo['현재통신사']) {
        const telecom = customerInfo['현재통신사'];
        if (telecom.includes('SK') || telecom.includes('에스케이')) {
            result.currentTelecom = 'SKT';
        } else if (telecom.includes('KT') || telecom.includes('케이티')) {
            result.currentTelecom = 'KT';
        } else if (telecom.includes('LG') || telecom.includes('엘지')) {
            result.currentTelecom = 'LGU+';
        } else {
            result.currentTelecom = telecom; // 원본 값 유지
        }
    }
    
    return result;
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
        '유심': /\*{1,2}유\s*심\s*(?:비\s*용)?\s*[-:：]\s*([^\n]+)/i,
        '부가서비스': /\*{1,2}부\s*가\s*서\s*비\s*스\s*[-:：]\s*([^\n]+)/i,
        '보험': /\*{1,2}보\s*험\s*[-:：]\s*([^\n]+)/i,
        '법대정보': /\*{1,2}법\s*대\s*정\s*보\s*[-:：]\s*([^/]+)\s*\/\s*([\d-]+)\s*\/\s*([\d-]+)/i
    };
    
    // 각 패턴에 맞게 정보 추출
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = text.match(pattern);
        if (match) {
            if (key === '법대정보') {
                // 법대정보가 있는 경우 (미성년자)
                customerInfo['미성년자여부'] = 'Y';
                customerInfo['법정대리인이름'] = match[1].trim();
                customerInfo['법정대리인주민번호'] = match[2].trim().replace(/\s*-\s*/g, '-');
                customerInfo['법정대리인연락처'] = match[3].trim().replace(/[\s\-]/g, '').replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                continue;
            }
            
            // 일반 필드 처리
            if (match[1]) {
                let value = match[1].trim();
                
                // 전화번호/개통번호 포맷 정규화
                if ((key === '전화번호' || key === '개통번호') && value) {
                    value = value.replace(/\([^)]*\)/g, '').trim();
                    const numbers = value.replace(/[^\d]/g, '');
                    if (numbers.length >= 10) {
                        value = numbers.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                        customerInfo[key] = value;
                        
                        if (key === '전화번호' && !customerInfo['개통번호']) {
                            customerInfo['개통번호'] = value;
                        }
                    }
                }
                
                // 생년월일/주민번호 포맷 정규화
                if ((key === '생년월일' || key === '주민번호') && value) {
                    value = value.replace(/\s*-\s*/g, '-');
                }
                
                // 배송주소/택배주소에서 전화번호 부분 제거
                if ((key === '택배주소' || key === '배송주소지') && value) {
                    value = value.replace(/\s*\/\s*010-\d{3,4}-\d{4}.*$/, '').trim();
                }
                
                if (!customerInfo[key]) {
                    customerInfo[key] = value;
                }
            }
        }
    }
    
    // 필드 간 복사 로직
    if (!customerInfo['개통번호'] && customerInfo['전화번호']) {
        customerInfo['개통번호'] = customerInfo['전화번호'];
    }
    
    if (!customerInfo['고객명'] && customerInfo['가입자명']) {
        customerInfo['고객명'] = customerInfo['가입자명'];
    }
    
    if (!customerInfo['가입자명'] && customerInfo['고객명']) {
        customerInfo['가입자명'] = customerInfo['고객명'];
    }
    
    if (!customerInfo['생년월일'] && customerInfo['주민번호']) {
        customerInfo['생년월일'] = customerInfo['주민번호'];
    }
    
    if (!customerInfo['주민번호'] && customerInfo['생년월일']) {
        customerInfo['주민번호'] = customerInfo['생년월일'];
    }
    
    if (!customerInfo['배송주소지'] && customerInfo['택배주소']) {
        customerInfo['배송주소지'] = customerInfo['택배주소'];
    }
    
    if (!customerInfo['택배주소'] && customerInfo['배송주소지']) {
        customerInfo['택배주소'] = customerInfo['배송주소지'];
    }
    
    // 가입유형, 할인유형, 현재통신사 추가 파싱
    if (typeof parseSubscriptionAndDiscountInfo === 'function') {
        const subInfo = parseSubscriptionAndDiscountInfo({
            '가입유형': customerInfo['가입유형'],
            '할인유형': customerInfo['할인유형'],
            '현재통신사': customerInfo['현재통신사']
        });
        
        customerInfo['가입유형'] = subInfo.subscriptionType;
        customerInfo['할인유형'] = subInfo.discountType;
        customerInfo['현재통신사'] = subInfo.currentTelecom;
        customerInfo['약정개월수'] = subInfo.discountMonths;
        customerInfo['공시선약여부'] = subInfo.discountType;
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