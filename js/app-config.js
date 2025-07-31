// 앱 설정 데이터
// 양식변환.html에서 분리된 유용한 사이트, 상수 등의 앱 전반 설정

// ⏰ 자동 잠금 설정 상수
const AUTO_LOCK_TIMEOUT_MINUTES = 10; // 자동 잠금 시간 (분)

// 🔒 IP 제한 설정 상수
const IP_RESTRICTION_STORAGE_KEY = 'ip_restriction_config'; // localStorage 키
const IP_RESTRICTION_CONFIG = {
    enabled: false, // IP 제한 기능 활성화 여부 (기본: 비활성화)
    allowedIPs: [], // 허용된 개별 IP 주소 목록
    allowedRanges: [], // 허용된 IP 범위 목록 (CIDR 표기법)
    fallbackAction: 'block', // IP 확인 실패 시 동작 ('block' | 'warn' | 'allow')
    cacheTimeout: 300000, // IP 확인 결과 캐시 시간 (5분)
    apiEndpoints: [ // IP 확인 API 엔드포인트 목록 (폴백용)
        'https://ipapi.co/json',
        'https://api.ipify.org?format=json',
        'https://httpbin.org/ip'
    ]
};

// 유용한 URL 사이트 목록
const usefulSites = [
    { 
        name: 'SK 업무관련', 
        sites: [
            { name: 'SK 티게이트', url: 'https://tgate.sktelecom.com/' },
            { name: 'SK 티게이트 조회', url: 'https://tgateplus.sktelecom.com/scrb/frontList.do' },
            { name: '밀리언 접수 사이트', url: 'http://www.inbangpan.co.kr' },
            { name: 'SK 삼보/큐브 재고표(SK3 탭 확인)', url: 'https://docs.google.com/spreadsheets/d/1BlrYaOOqMFEb-TLVnvI6KXCjMJvUWT7UipUAUgvqI5g/edit?gid=634535474#gid=634535474' },
            { name: '럭스 재고표 확인', url: 'https://docs.google.com/spreadsheets/d/1kYLutrHNPLBbjA9YNcGDVmi0kys0nK2QBPNccyu1Skc/edit#gid=2040945696'},
            { name: '비앤컴 배송요청 구글시트', url: 'https://docs.google.com/spreadsheets/d/1KjUUeRSXYM_isXf6daxfSyhO9yFJUryoHHLxhOfxhoQ/edit?gid=1068685658#gid=1068685658'},
            { name: 'SK 삼보/큐브인증번호확인사이트', url: 'http://partner.tgateapp.com/'}
        ]
    },
    { 
        name: 'KT 업무관련', 
        sites: [
            { name: 'KT 재희 GTS', url: 'https://gts.bizmax.net/' }
        ]
    },
    { 
        name: 'LG 업무관련', 
        sites: [
            { name: 'LG 소리 GTS', url: 'https://gts.bizmax.net/' }
        ]
    },
    { 
        name: '휴대폰 요금관련 정보', 
        sites: [
            { name: '레인보우컨설팅', url: 'https://goodmorningrainbow.com/renew/index.php' },
            { name: '스마트초이스', url: 'https://www.smartchoice.or.kr/smc/index.do' }
        ]
    },
    { 
        name: '올바른 주소 확인', 
        sites: [
            { name: '주소정보누리집', url: 'https://www.juso.go.kr/openIndexPage.do' }
        ]
    },
    { 
        name: '업무에유용한사이트들', 
        sites: [
            { name: '사진-엑셀변환', url: 'https://www.cardscanner.co/ko/png-to-excel' }
        ]
    }
];

// 유용한 사이트 목록을 select box에 추가하는 함수
function initializeUsefulSites() {
    const usefulUrlsSelect = document.getElementById('usefulUrls');
    if (!usefulUrlsSelect) {
        console.warn('usefulUrls select 요소를 찾을 수 없습니다.');
        return;
    }

    // 기존 옵션 제거 (선택하세요 옵션 제외)
    while (usefulUrlsSelect.children.length > 1) {
        usefulUrlsSelect.removeChild(usefulUrlsSelect.lastChild);
    }

    // 그룹별로 사이트 목록 추가
    usefulSites.forEach(group => {
        // 그룹 제목 추가
        const groupOption = document.createElement('optgroup');
        groupOption.label = group.name;
        
        // 그룹 내 사이트 추가
        group.sites.forEach(site => {
            const option = document.createElement('option');
            option.value = site.url;
            option.textContent = site.name;
            groupOption.appendChild(option);
        });
        
        usefulUrlsSelect.appendChild(groupOption);
    });

    console.log('✅ 유용한 사이트 목록이 초기화되었습니다.');
    console.log('📊 총 그룹 수:', usefulSites.length);
    console.log('🔗 총 사이트 수:', usefulSites.reduce((total, group) => total + group.sites.length, 0));
}

// 🔒 IP 제한 관련 유틸리티 함수들

/**
 * IP 제한 설정을 localStorage에서 로드
 * @returns {object} 로드된 IP 제한 설정
 */
function loadIPRestrictionConfig() {
    try {
        const savedConfig = localStorage.getItem(IP_RESTRICTION_STORAGE_KEY);
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            // 기본 설정과 병합하여 누락된 속성 보완
            return { ...IP_RESTRICTION_CONFIG, ...parsedConfig };
        }
    } catch (error) {
        console.warn('IP 제한 설정 로드 중 오류 발생:', error);
    }
    return { ...IP_RESTRICTION_CONFIG }; // 기본 설정 반환
}

/**
 * IP 제한 설정을 localStorage에 저장
 * @param {object} config - 저장할 IP 제한 설정
 */
function saveIPRestrictionConfig(config) {
    try {
        localStorage.setItem(IP_RESTRICTION_STORAGE_KEY, JSON.stringify(config));
        console.log('✅ IP 제한 설정이 저장되었습니다.');
    } catch (error) {
        console.error('IP 제한 설정 저장 중 오류 발생:', error);
    }
}

/**
 * IP 제한 설정을 기본값으로 초기화
 */
function resetIPRestrictionConfig() {
    saveIPRestrictionConfig(IP_RESTRICTION_CONFIG);
    console.log('✅ IP 제한 설정이 기본값으로 초기화되었습니다.');
}

/**
 * IP 제한 설정 업데이트
 * @param {object} updates - 업데이트할 설정 객체
 */
function updateIPRestrictionConfig(updates) {
    const currentConfig = loadIPRestrictionConfig();
    const updatedConfig = { ...currentConfig, ...updates };
    saveIPRestrictionConfig(updatedConfig);
    return updatedConfig;
}

/**
 * IP 제한 기능 활성화/비활성화 토글
 * @param {boolean} enabled - 활성화 여부
 */
function toggleIPRestriction(enabled) {
    const updatedConfig = updateIPRestrictionConfig({ enabled });
    console.log(`🔒 IP 제한 기능이 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
    return updatedConfig;
}

/**
 * 허용된 IP 주소 추가
 * @param {string} ip - 추가할 IP 주소
 */
function addAllowedIP(ip) {
    const currentConfig = loadIPRestrictionConfig();
    if (!currentConfig.allowedIPs.includes(ip)) {
        currentConfig.allowedIPs.push(ip);
        saveIPRestrictionConfig(currentConfig);
        console.log(`✅ 허용 IP 추가: ${ip}`);
    } else {
        console.log(`⚠️ 이미 허용된 IP입니다: ${ip}`);
    }
    return currentConfig;
}

/**
 * 허용된 IP 주소 제거
 * @param {string} ip - 제거할 IP 주소
 */
function removeAllowedIP(ip) {
    const currentConfig = loadIPRestrictionConfig();
    const index = currentConfig.allowedIPs.indexOf(ip);
    if (index > -1) {
        currentConfig.allowedIPs.splice(index, 1);
        saveIPRestrictionConfig(currentConfig);
        console.log(`✅ 허용 IP 제거: ${ip}`);
    } else {
        console.log(`⚠️ 허용 목록에 없는 IP입니다: ${ip}`);
    }
    return currentConfig;
}

/**
 * 허용된 IP 범위 추가
 * @param {string} range - 추가할 IP 범위 (CIDR 표기법)
 */
function addAllowedRange(range) {
    const currentConfig = loadIPRestrictionConfig();
    if (!currentConfig.allowedRanges.includes(range)) {
        currentConfig.allowedRanges.push(range);
        saveIPRestrictionConfig(currentConfig);
        console.log(`✅ 허용 IP 범위 추가: ${range}`);
    } else {
        console.log(`⚠️ 이미 허용된 IP 범위입니다: ${range}`);
    }
    return currentConfig;
}

/**
 * 허용된 IP 범위 제거
 * @param {string} range - 제거할 IP 범위
 */
function removeAllowedRange(range) {
    const currentConfig = loadIPRestrictionConfig();
    const index = currentConfig.allowedRanges.indexOf(range);
    if (index > -1) {
        currentConfig.allowedRanges.splice(index, 1);
        saveIPRestrictionConfig(currentConfig);
        console.log(`✅ 허용 IP 범위 제거: ${range}`);
    } else {
        console.log(`⚠️ 허용 목록에 없는 IP 범위입니다: ${range}`);
    }
    return currentConfig;
}

/**
 * 현재 IP 제한 설정 상태 출력
 */
function logIPRestrictionStatus() {
    const config = loadIPRestrictionConfig();
    console.log('🔒 IP 제한 설정 상태:');
    console.log('  - 활성화:', config.enabled);
    console.log('  - 허용 IP 개수:', config.allowedIPs.length);
    console.log('  - 허용 IP 범위 개수:', config.allowedRanges.length);
    console.log('  - 폴백 동작:', config.fallbackAction);
    if (config.allowedIPs.length > 0) {
        console.log('  - 허용 IP 목록:', config.allowedIPs);
    }
    if (config.allowedRanges.length > 0) {
        console.log('  - 허용 IP 범위:', config.allowedRanges);
    }
}

// 전역 객체로 노출
window.usefulSites = usefulSites;
window.initializeUsefulSites = initializeUsefulSites;
window.AUTO_LOCK_TIMEOUT_MINUTES = AUTO_LOCK_TIMEOUT_MINUTES;

// IP 제한 관련 전역 노출
window.IP_RESTRICTION_CONFIG = IP_RESTRICTION_CONFIG;
window.IP_RESTRICTION_STORAGE_KEY = IP_RESTRICTION_STORAGE_KEY;
window.loadIPRestrictionConfig = loadIPRestrictionConfig;
window.saveIPRestrictionConfig = saveIPRestrictionConfig;
window.resetIPRestrictionConfig = resetIPRestrictionConfig;
window.updateIPRestrictionConfig = updateIPRestrictionConfig;
window.toggleIPRestriction = toggleIPRestriction;
window.addAllowedIP = addAllowedIP;
window.removeAllowedIP = removeAllowedIP;
window.addAllowedRange = addAllowedRange;
window.removeAllowedRange = removeAllowedRange;
window.logIPRestrictionStatus = logIPRestrictionStatus;

// 로드 확인 메시지
console.log('✅ app-config.js 로드 완료: 앱 설정 데이터가 로드되었습니다.');
console.log('📂 로드된 사이트 그룹:', usefulSites.map(group => group.name));
console.log('⏰ 자동 잠금 시간 설정:', AUTO_LOCK_TIMEOUT_MINUTES + '분');
console.log('🔒 IP 제한 기능 설정 완료');

// IP 제한 설정 초기화 및 상태 출력
logIPRestrictionStatus();

// DOM이 로드되면 자동으로 초기화 (옵션)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUsefulSites);
} else {
    // DOM이 이미 로드된 경우 바로 실행
    initializeUsefulSites();
} 