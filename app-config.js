// 앱 설정 데이터
// 양식변환.html에서 분리된 유용한 사이트, 상수 등의 앱 전반 설정

// ⏰ 자동 잠금 설정 상수
const AUTO_LOCK_TIMEOUT_MINUTES = 10; // 자동 잠금 시간 (분)

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

// 전역 객체로 노출
window.usefulSites = usefulSites;
window.initializeUsefulSites = initializeUsefulSites;
window.AUTO_LOCK_TIMEOUT_MINUTES = AUTO_LOCK_TIMEOUT_MINUTES;

// 로드 확인 메시지
console.log('✅ app-config.js 로드 완료: 앱 설정 데이터가 로드되었습니다.');
console.log('📂 로드된 사이트 그룹:', usefulSites.map(group => group.name));
console.log('⏰ 자동 잠금 시간 설정:', AUTO_LOCK_TIMEOUT_MINUTES + '분');

// DOM이 로드되면 자동으로 초기화 (옵션)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUsefulSites);
} else {
    // DOM이 이미 로드된 경우 바로 실행
    initializeUsefulSites();
} 