const TELECOM_CONFIG = {
    'SK': {
        name: 'SK',
        agencies: {
            'ACT(택배)': {
                name: 'ACT(택배)',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['ACT(택배)'],
                templates: {
                    stockRequest: (info) => {
                        return `ACT / ${info.모델명 || ''} ${info.용량 || ''} / ${info.가입유형 || ''}
${info.고객명 || ''} / ${info.전화번호 || ''} / ${info.생년월일 || info.주민번호 || ''}
접수 확인 부탁드립니다.`;
                    },
                    openRequest: (info) => {
                        // 최종할부원금/개월수 처리
                        let installmentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            installmentInfo = '현금완납';
                        } else if (info.할부현금여부 === '할부') {
                            installmentInfo = `${info.최종구매가 || ''}/${info.할부개월수 || '24'}개월`;
                        } else {
                            installmentInfo = info.최종구매가 || '';
                        }
                        
                        // 보험과 부가서비스를 위한 배열
                        const additionalServices = [];
                        
                        // 보험 정보 추가
                        const insurance = info.보험 || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(`${insurance}`);
                        }
                        
                        // 부가서비스 정보 추가
                        const addon = info.부가서비스 || '';
                        if (addon && addon !== '무') {
                            additionalServices.push(`${addon}`);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info.부가서비스2 || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(`${addon2}`);
                        }
                        
                        // 기타특이사항 구성
                        let specialNotes = '도매C';
                        if (additionalServices.length > 0) {
                            specialNotes += ' / ' + additionalServices.join(' / ');
                        }
                        
                        return `도매c
1. 고객명 : ${info.고객명 || info.가입자명 || ''}
2. 전화번호 : ${info.전화번호 || info.개통번호 || ''}
3. 주민번호전체 : ${formatBirthDate(info.주민번호 || info.생년월일 || '')}
4. 법대명 : ${info.법정대리인이름 || ''}
5. 법대주민번호전체 : ${info.법정대리인주민번호 || ''}
6. 법대연락처 : ${info.법정대리인연락처 || ''}
7. 전통신사 : ${info.현재통신사 || ''}
8. 모델명 : ${info.모델명 || ''} ${info.용량 || ''}
9. 일련번호 : ${info.단말기일련번호 || ''}
10. 유심번호(13자리) : ${info.유심일련번호 || info.유심 || ''}
11. 요금제 : ${info.요금제 || ''}
12. 공시/선약 : ${info.공시선약여부 || info.할인유형 || ''} ${info.약정개월수 || ''}
13. 현금/할부 : ${info.할부현금여부 || ''}
14. 공시지원금 : ${info.공시 || ''}
15. 추가지원금 : ${info.추지 || ''}
16. 프리할부 : ${info.프리할부 || ''}
17. 최종할부원금/개월수 : ${installmentInfo}
18. 기타특이사항 : ${specialNotes}
19. 판매점명 : 도담`;
                    }
                }
            },
            '드블랙': {
                name: '드블랙',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['드블랙'],
                templates: {
                    request: (info) => {
                        const subscriptionType = info.가입유형 || '';
                        const name = info.고객명 || info.가입자명 || '';
                        const contact = info.개통번호 || info.전화번호 || '';
                        const isMinor = info.미성년자여부 === 'Y';
                        
                        // 미성년자인 경우 특별 양식 사용
                        if (isMinor) {
                            const idInfo = info.주민번호 || info.생년월일 || '';
                            const legalGuardianName = info.법정대리인이름 || '';
                            const legalGuardianContact = info.법정대리인연락처 || '';
                            
                            return `■미성년자 번호이동 & 기변 신조요청■
＃고객명	${name}
# 연락처	${contact}
＃주민번호	${idInfo}
# 법대 성함 / 주민번호	${legalGuardianName} / ${legalGuardianContact}`;
                        }
                        
                        // 미성년자가 아닌 경우 기존 로직 사용
                        const isDeviceChange = ['기기변경', '기변'].includes(subscriptionType);
                        const isNumberPortability = ['번호이동', '번이'].includes(subscriptionType);
                        
                        // 가입유형에 따른 주민번호/생년월일 선택
                        let idInfo = '';
                        let idLabel = '';
                        if (isDeviceChange) {
                            // 기기변경인 경우 생년월일 사용
                            idInfo = info.생년월일 || info.주민번호 || '';
                            idLabel = '생년월일';
                        } else if (isNumberPortability) {
                            // 번호이동인 경우 주민번호 사용
                            idInfo = info.주민번호 || info.생년월일 || '';
                            idLabel = '주민번호';
                        } else {
                            // 기타의 경우 주민번호 우선
                            idInfo = info.주민번호 || info.생년월일 || '';
                            idLabel = '주민번호';
                        }
                        
                        return `■${subscriptionType} 신조요청■
＃고객명	${name}
＃연락처	${contact}
＃${idLabel}	${idInfo}`;
                    },
                    stock: (info) => {
                        // 현재통신사에 따른 MNO/MVNO 분류 (SK, KT, LG는 MNO, 그 외는 MVNO)
                        const currentTelecom = (info.현재통신사 || '').toLowerCase().trim();
                        const isMNO = ['sk', 'kt', 'lg'].includes(currentTelecom);
                        const telecomType = isMNO ? 'MNO' : 'MVNO';
                        
                        // 유심 발송 여부 (SK 이앤티와 동일한 로직)
                        const usimValue = info.유심 || '';
                        let usimDelivery = '';
                        
                        // 기존 또는 기존유심이 포함된 경우
                        if (/기존|기존유심/i.test(usimValue)) {
                            usimDelivery = 'X';
                        } else {
                            // 기존/기존유심이 없는 경우 발송 필요
                            if (/이심/i.test(usimValue)) {
                                usimDelivery = 'X'; // 이심인 경우 발송 불필요
                            } else {
                                usimDelivery = 'O'; // 일반 유심인 경우 발송 필요
                            }
                        }
                        
                        return `■ 택배 배송 요청 양식
* 개통유형 : ${telecomType} / ${info.가입유형 || ''}
* 매장명 : 라온아이
＊담당자명 : 김한결
＊개통자명 : ${info.가입자명 || info.고객명 || ''}
＊고객명 : ${info.가입자명 || info.고객명 || ''}
＊연락처 : ${info.개통번호 || info.전화번호 || ''}
＊주소 : ${info.배송주소지 || info.택배주소 || ''}
＊모델(색상 및 용량) : ${info.모델명 || ''} ${info.용량 || ''} / ${info.색상 || ''}
＊유심 발송 여부 : ${usimDelivery}`;
                    },
                    memo: (info) => {
                        const subscriptionType = info.가입유형 || '';
                        const currentTelecom = info.현재통신사 || '';
                        const name = info.고객명 || info.가입자명 || '';
                        // 생년월일 yymmdd 형식으로 변환
                        const birthDate = formatBirthDate(info.생년월일 || info.주민번호 || '');
                        const phone = info.개통번호 || info.전화번호 || '';
                        // 모델명 뒤에 용량 추가
                        const model = `${info.모델명 || ''} ${info.용량 || ''}`.trim();
                        const color = info.색상 || '';
                        const serialNumber = info.단말기일련번호 || '';
                        // 유심 정보 처리 (유심일련번호 우선, 없으면 유심 값 사용)
                        const usim = info.유심일련번호 || info.유심 || '';
                        const plan = info.요금제 || '';
                        
                        // 약정 정보 처리 (할인유형 / 약정개월수)
                        const discountType = info.할인유형 || '';
                        const contractMonths = info.약정개월수 || '';
                        const contractInfo = discountType && contractMonths ? `${discountType}${contractMonths}` : (discountType || contractMonths);
                        
                        // 할부 개월 & 현금완납 처리 (뒤에 최종구매가 추가)
                        let installmentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            installmentInfo = `현금완납 ${info.최종구매가 || ''}`;
                        } else if (info.할부현금여부 === '할부') {
                            installmentInfo = `${info.할부현금여부 || ''} ${info.할부개월수 || '24'} ${info.최종구매가 || ''}`;
                        } else {
                            installmentInfo = info.최종구매가 || '';
                        }
                        
                        // 할부원금 처리 (기재 안할시 현금완납)
                        let installmentPrincipal = '';
                        if (info.할부현금여부 === '할부') {
                            installmentPrincipal = info.최종구매가 || '';
                        } else {
                            installmentPrincipal = '현금완납';
                        }
                        
                        // 전환지원금 (MNP만 적용, 0이면 X 표시)
                        let transferSupport = '';
                        if (['번호이동', '번이'].includes(subscriptionType)) {
                            const transferAmount = info.전환지원금 || '';
                            transferSupport = (transferAmount === '0' || transferAmount === '') ? 'X' : transferAmount;
                        } else {
                            transferSupport = 'X';
                        }
                        
                        // 공시지원금, 추가지원금, 프리금액 - 0이면 X 표시
                        const publicSupport = (info.공시 === '0' || info.공시 === '') ? 'X' : (info.공시 || 'X');
                        const additionalSupport = (info.추지 === '0' || info.추지 === '') ? 'X' : (info.추지 || 'X');
                        const freeAmount = (info.프리할부 === '0' || info.프리할부 === '') ? 'X' : (info.프리할부 || 'X');
                        
                        // 보험/부가/복지 정보 통합 (부가서비스2 포함)
                        const insurance = info.보험 || '';
                        const addon = info.부가서비스 || '';
                        const addon2 = info.부가서비스2 || '';
                        const welfare = info.복지 || '';
                        let benefitInfo = [insurance, addon, addon2, welfare].filter(item => item && item.trim()).join(' / ');
                        if (!benefitInfo) benefitInfo = 'X';
                        
                        return `▶가입유형 / 전통신사 : ${subscriptionType} / ${currentTelecom}
▶고객명 : ${name}
▶생년월일 : ${birthDate}
▶개통번호 : ${phone}
▶모델명 / 색상 : ${model} / ${color}
▶일련번호 : ${serialNumber}
▶유심 (후청구여부 / 기재 없을시 후납) : ${usim}
▶요금제 / 요금제혜택 : ${plan}
▶약정 (공시 or 선약12 or 선약24) : ${contractInfo}
▶할부 개월 & 현금완납 : ${installmentInfo}
▶출고가 : ${info.출고가 || ''}
▶공시 지원금 : ${publicSupport}
▶추가 지원금 : ${additionalSupport}
▶프리 금액 : ${freeAmount}
▶전환 지원금 (MNP만 적용) : ${transferSupport}
▶할부원금 (기재 안할시 현금완납) : ${installmentPrincipal}
▶*보험 / *부가 / *복지 : ${benefitInfo}
▶클럽기변 진행 여부 : X
▶판매처 / 연락처 : 라온아이/010-4671-4834`;
                    }
                }
            },
            '큐브': {
                name: '큐브',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['큐브'],
                templates: {
                    openRequest: (info) => {
                        const telecom = info.현재통신사 || '';
                        let paymentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            paymentInfo = '★현금완납(' + info.최종구매가 + ')';
                        } else {
                            paymentInfo = `${info.할부현금여부 || ''} ${info.최종구매가 || ''}원`;
                        }
                        
                        // 유심 처리 로직 (이앤티와 동일)
                        const usimValue = info.유심 || '';
                        let usimType = '';
                        
                        // 기존 또는 기존유심이 포함된 경우
                        if (/기존|기존유심/i.test(usimValue)) {
                            usimType = 'X';
                        } else {
                            // 기존/기존유심이 없는 경우 후납으로 처리
                            if (/이심/i.test(usimValue)) {
                                usimType = '후납(이심)';
                            } else {
                                usimType = '후납';
                            }
                        }
                        
                        // 부가서비스 정보 구성
                        let addonInfo = '';
                        if (info.부가서비스 && info.보험) {
                            addonInfo = `${info.부가서비스} / ${info.보험}`;
                        } else if (info.부가서비스) {
                            addonInfo = info.부가서비스;
                        } else if (info.보험) {
                            addonInfo = info.보험;
                        }
                        
                        // 부가서비스2가 있으면 추가
                        if (info.부가서비스2 && info.부가서비스2.trim() !== '') {
                            addonInfo = addonInfo ? `${addonInfo} / ${info.부가서비스2}` : info.부가서비스2;
                        }
                        
                        return `■SK3 개통요청		
◎ 고객명 / 번호 : ${info.고객명 || ''} / ${info.전화번호 || ''}	
◎ 주민번호 : ${formatBirthDate(info.주민번호 || info.생년월일 || '')}	
◎ 통신사 : ${telecom}	
◎ 모델/색상 : ${info.모델명 || ''} ${info.용량 || ''} / ${info.색상 || ''}	
◎ 일련번호 : ${info.단말기일련번호 || ''}	
◎ 유심 일련번호 : ${info.유심일련번호 || ''}	
◎ 유심비용:	${usimType}	
◎ 요금제 / 혜택 : ${info.요금제 || ''}	
◎ 공시지원금 : ${info.공시 || '0'}	
◎ 추가지원금 : ${info.추지 || '0'}	
◎ 할부원금 : ${paymentInfo}
◎ 약정유형 : ${info.할인유형 || ''} ${info.약정개월수 || ''}
◎ 부가서비스 : ${addonInfo}`;
                    },
                    stockRequest: (info) => {
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 X, 그렇지 않으면 O
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimRequest = hasESim ? 'X' : 'O';
                        
                        return `★재고요청(큐브)
택배or퀵 :	
이름: ${info.고객명 || ''}
연락처 : ${info.전화번호 || ''}
주소 : ${info.택배주소 || info.배송주소지 || ''}
유심 : ${usimRequest}
모델명 : ${info.모델명 || ''} ${info.용량 || ''}
색상 : ${info.색상 || ''}`;
                    },
                    universe: (info) => {
                        const name = info['가입자명'] || info['고객명'] || '';
                        const contact = info['개통번호'] || info['전화번호'] || '';
                        const jumin = info['주민번호'] || info['생년월일'] || '';
                        
                        // 부가서비스에서 G마켓 또는 편의점&카페 확인
                        const addon1 = info['부가서비스'] || '';
                        const addon2 = info['부가서비스2'] || '';
                        const allAddons = `${addon1} ${addon2}`.toLowerCase();
                        
                        let universeType = '';
                        if (allAddons.includes('g마켓')) {
                            universeType = 'G마켓';
                        } else if (allAddons.includes('편의점') || allAddons.includes('카페')) {
                            universeType = '편의점&카페';
                        }
                        
                        if (universeType === 'G마켓') {
                            return `★우주패스 G마켓		
명의자 : ${name}		
생년월일 : ${jumin}		
개통번호 : ${contact}		
상품명(옵션) :G마켓+웨이브		
		
결제정보 : 기존자동이체 결제		
결제카드주 정보 : `;
                        } else if (universeType === '편의점&카페') {
                            return `★우주패스편의점&카페			
명의자 : ${name}			
생년월일 : ${jumin}			
개통번호 : ${contact}			
상품명(옵션) :편의점&카페 -웨이브			
			
결제정보 : 기존자동이체 결제			
결제카드주 정보 : `;
                        } else {
                            // 기본 양식 (부가서비스에 해당하는 항목이 없는 경우)
                            return `[큐브 우주패스양식]
고객명: ${name}
개통번호: ${contact}
주민번호: ${jumin}
모델명: ${info['모델명'] || ''}
색상: ${info['색상'] || ''}
가입유형: ${info['가입유형'] || ''}
요금제: ${info['요금제'] || ''}
현재통신사: ${info['현재통신사'] || ''}`;
                        }
                    }
                }
            },
            '나텔': {
                name: '나텔',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['나텔'],
                templates: {
                    stockRequest: (info) => {
                        // 기본 정보 처리
                        const naName = info['가입자명'] || info['고객명'] || '';
                        const naContact = info['개통번호'] || info['전화번호'] || '';
                        const naAddress = info['택배주소'] || info['배송주소지'] || '';
                        const naModel = info['모델명'] || '';
                        const naColor = info['색상'] || '';
                        
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 X, 그렇지 않으면 O
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimRequest = hasESim ? 'X' : 'O';
                        
                        // 배송요청 양식 (첫 번째 textarea)
                        return `택배요청	
	
주소 : ${naAddress}
수취인 : ${naName}
연락처 : ${naContact}
기종/색상: ${naModel} ${info.용량 || ''} / ${naColor}
유심 : ${usimRequest}`;
                    },
                    openRequest: (info) => {
                        // 기본 정보 처리
                        const naName = info['가입자명'] || info['고객명'] || '';
                        const naContact = info['개통번호'] || info['전화번호'] || '';
                        const naModel = info['모델명'] || '';
                        const naColor = info['색상'] || '';
                        const naPlan = info['요금제'] || '';
                        const naSubscriptionType = info['가입유형'] || '';
                        
                        // 나텔 선택약정 12개월 체크
                        if (info['공시선약여부'] === '선택약정' && info['약정개월수'] === '12개월') {
                            alert('나텔은 선택약정 24개월만 진행 가능합니다. 어드민 메모를 확인하세요. \n도우미 양식은 24개월로 자동 변환됩니다.');
                        }
                        
                        // 약정 정보 처리 (공시지원 또는 선택약정 + 개월수)
                        let contractInfo = '';
                        if (info['공시선약여부'] === '공시지원') {
                            contractInfo = `공시지원 ${info['약정개월수'] || '24개월'}`;
                        } else if (info['공시선약여부'] === '선택약정' || info['공시선약여부'] === '선약') {
                            contractInfo = `선택약정24개월`;
                        } else {
                            contractInfo = `약정없음`;
                        }
                        
                        // 선납 정보 처리 (프리할부 있으면 기재, 없거나 0이면 X)
                        const prepayInfo = info['프리할부'] && info['프리할부'] !== '0' ? info['프리할부'] : 'X';
                        
                        // 원금 정보 처리 (할부면 최종구매가, 현금이면 최종구매가(★현금완납))
                        const principalInfo = info['할부현금여부'] === '할부' ? info['최종구매가'] || '0' : `${info['최종구매가'] || '0'}(★현금완납)`;
                        
                        // 개월 정보 처리 (할부면 할부개월수, 현금이면 X)
                        const monthsInfo = info['할부현금여부'] === '할부' ? info['할부개월수'] || '24개월' : 'X';
                        
                        // 생년월일 또는 주민번호 처리
                        // const birthOrRegNum = info['생년월일'] || info['주민번호'] || '';
                        
                        // 생년월일/주민번호를 yymmdd 형태로 변환 (- 제거)
                        let birthOrRegNum = info['생년월일'] || info['주민번호'] || '';
                        if (birthOrRegNum) {
                            // - 제거하고 앞 6자리만 추출 (yymmdd)
                            birthOrRegNum = birthOrRegNum.replace(/-/g, '').substring(0, 6);
                        }
                        
                        // 부가서비스 정보 구성
                        let addonInfo = '';
                        if (info['부가서비스'] && info['부가서비스'] !== '무') {
                            addonInfo = info['부가서비스'];
                        }
                        
                        // 부가서비스2가 있으면 추가
                        if (info['부가서비스2'] && info['부가서비스2'].trim() !== '') {
                            addonInfo = addonInfo ? `${addonInfo} / ${info['부가서비스2']}` : info['부가서비스2'];
                        }
                        
                        // 부가서비스가 없으면 X
                        if (!addonInfo) {
                            addonInfo = 'X';
                        }
                        
                        return `개통요청 / 전문화	
유형: ${naSubscriptionType}
고객명 : ${naName}
생년월일 : ${birthOrRegNum}
번호 : ${naContact}
기종/색상 : ${naModel} ${info.용량 || ''} / ${naColor}
일련번호 : ${info['단말기일련번호'] || ''}
유심 : ${info['유심일련번호'] || ''}
요금제 : ${naPlan}
약정 : ${contractInfo}
선납 : ${prepayInfo}
원금 : ${principalInfo}	
개월 : ${monthsInfo}
부가 : ${addonInfo}
보험 : ${info['보험'] || 'X'}`;
                    }
                }
            },
            '카파': {
                name: '카파',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['카파'],
                templates: {
                    stockRequest: (info) => {
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 N, 그렇지 않으면 Y
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimRequest = hasESim ? 'X' : 'O';
                        
                        return `★ 단말기 배정요청 ★	
* 배송방법 (택배or퀵) :	
* 고객명 (수취인) : ${info.고객명 || ''}
* 연락처 : ${info.전화번호 || info.연락처 || ''}
* 주 소 : ${info.택배주소 || info.배송주소지 || ''}	 
* 모델명 : ${info.모델명 || ''}
* 용량 : ${info.용량 || ''}	 
* 색상 : ${info.색상 || ''}
* 판매유형 : ${info.가입유형 || ''}
* USIM 발송여부 : ${usimRequest}`;
                    },
                    openRequest: (info) => {
                        // 보험과 부가서비스를 위한 배열
                        const additionalServices = [];
                        
                        // 보험 정보 추가
                        const insurance = info.보험 || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(insurance);
                        }
                        
                        // 부가서비스 정보 추가
                        const addon = info.부가서비스 || '';
                        if (addon && addon !== '무') {
                            additionalServices.push(addon);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info.부가서비스2 || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(addon2);
                        }
                        
                        // 보험/부가서비스 정보 구성
                        const serviceInfo = additionalServices.length > 0 ? additionalServices.join(' / ') : 'X';
                        
                        return `★판매점명★에이치엘
개통유형>${info.가입유형 || ''}
고객명>${info.고객명 || ''}
개통번호>${info.전화번호 || info.연락처 || ''}
주민번호>${formatBirthDate(info.주민번호 || info.생년월일 || '')}
단말모델명>	${info.모델명 || ''} ${info.용량 || ''}
단말색상>${info.색상 || ''}
일련번호>${info.단말기일련번호 || ''}
유심번호>${info.유심일련번호 || ''}
요금제>${info.요금제 || ''}
부가서비스>${serviceInfo}
약정유형>${info.공시선약여부 || ''} ${info.약정개월수 || ''}
할부개월수>${info.할부현금여부 === '할부' ? (info.할부개월수 || '24') : 'X'}
프리할부>${info.프리할부 || ''}
할부원금>${info.할부현금여부 === '할부' ? (info.최종구매가 || '0') : '0'}
번호이동인증>	`;
                    }
                }
            },
            '삼보(온라인)': {
                name: '삼보(온라인)',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['삼보(온라인)'],
                templates: {
                    stockRequest: (info) => {
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 X, 그렇지 않으면 O
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimRequest = hasESim ? 'X' : 'O';
                        
                        return `★재고요청(삼보)
택배or퀵 : 택배
이름: ${info.고객명 || ''}
연락처 : ${info.전화번호 || ''}
주소 : ${info.택배주소 || info.배송주소지 || ''}
유심 : ${usimRequest}	
모델명 : ${info.모델명 || ''} ${info.용량 || ''}
색상 : ${info.색상 || ''}`;
                    },
                    openRequest: (info) => {
                        // 기타특이사항 구성
                        let specialNotes = '';
                        
                        // 할인유형 / 약정개월수
                        const discountType = info.할인유형 || info.공시선약여부 || '';
                        const contractMonths = info.약정개월수 || '';
                        if (discountType && contractMonths) {
                            specialNotes += `${discountType} ${contractMonths}`;
                        } else if (discountType) {
                            specialNotes += discountType;
                        }
                        
                        // 요금제
                        const plan = info.요금제 || '';
                        if (plan) {
                            specialNotes += specialNotes ? ` / ${plan}` : plan;
                        }
                        
                        // 할부/현금 정보
                        let paymentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            paymentInfo = `현금완납(${info.최종구매가 || ''})`;
                        } else if (info.할부현금여부 === '할부') {
                            paymentInfo = `할부${info.할부개월수 || '24개월'} (${info.최종구매가 || ''})`;
                        }
                        
                        if (paymentInfo) {
                            specialNotes += specialNotes ? ` / ${paymentInfo}` : paymentInfo;
                        }
                        
                        // 보험과 부가서비스를 위한 별도 배열
                        const additionalServices = [];
                        
                        // 보험 정보 추가
                        const insurance = info.보험 || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(insurance);
                        }
                        
                        // 부가서비스 정보 추가
                        const addon = info.부가서비스 || '';
                        if (addon && addon !== '무') {
                            additionalServices.push(addon);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info.부가서비스2 || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(addon2);
                        }
                        
                        // 보험/부가서비스가 있으면 줄바꿈 후 추가
                        if (additionalServices.length > 0) {
                            specialNotes += '\n' + additionalServices.join(' / ');
                        }
                        
                        // 현재 월을 2자리 형식으로 가져오기 (01, 02, ..., 12)
                        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
                        
                        // MNO/MVNO 구분 로직 (SK, KT, LG는 MNO, 그 외는 MVNO)
                        const currentCarrier = (info.현재통신사 || '').toLowerCase().trim();
                        const isMNO = ['sk', 'kt', 'lg'].includes(currentCarrier);
                        const carrierType = isMNO ? 'MNO' : 'MVNO';
                        
                        // 유심 선납/후납 처리
                        const usimValue = info.유심 || '';
                        let usimStatus = '';
                        
                        // 기존 또는 기존유심이 포함된 경우
                        if (/기존|기존유심/i.test(usimValue)) {
                            usimStatus = usimValue; // 원본 값 그대로 사용
                        } else {
                            // 기존/기존유심이 없는 경우 후납으로 처리
                            if (/이심/i.test(usimValue)) {
                                usimStatus = '후납(이심)';
                            } else {
                                usimStatus = '후납';
                            }
                        }
                        
                        return `★★ 메모 : 7 (${carrierType})  ★★
[T-GATE 무선 접수 양식 ${currentMonth}월 ★ ]
1. 고객명: ${info.고객명 || ''}
2. 전화번호: ${info.전화번호 || ''}
3. 주민번호(13자리): ${formatBirthDate(info.주민번호 || info.생년월일 || '')}
4. 법정대리인: ${info.법정대리인이름 || 'X'}
5. 법대주민번호(13자리): ${info.법정대리인주민번호 || 'X'}
6. 법대연락처: ${info.법정대리인연락처 || 'X'}
7. 전통신사 : ${info.현재통신사 || ''}
8. 모델명: ${info.모델명 || ''} ${info.용량 || ''}
9. 일련번호: ${info.단말기일련번호 || ''}
10. 유심번호(13자리): ${info.유심일련번호 || ''}
11. 유심 선납/후납: ${usimStatus}
12. 기타특이사항 : ${specialNotes}
13. 판매점명: 에이치엠씨
14. P코드: 에이치엠씨`;
                    }
                }
            },
            '밀리언': {
                name: '밀리언',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['밀리언'],
                templates: {
                    request: (info) => {
                        // 가입유형 + 할부현금여부 + '개통' 조합
                        const subscriptionType = info.가입유형 || '';
                        const paymentType = info.할부현금여부 || '';
                        const requestType = `${subscriptionType} ${paymentType}개통`;
                        
                        // 고객명 (고객명 또는 가입자명)
                        const customerName = info.고객명 || info.가입자명 || '';
                        
                        // 생년월일/주민번호
                        const birthOrId = info.생년월일 || info.주민번호 || '';
                        
                        // 개통번호/전화번호  
                        const phoneNumber = info.개통번호 || info.전화번호 || '';
                        
                        return `★신조요청★
${requestType}
${customerName}/${birthOrId}/${phoneNumber}`;
                    },
                    stock: (info) => {
                        // 유심 값 확인해서 기존유심 여부 결정
                        const usimValue = info.유심 || '';
                        const hasExistingUsim = /기존유심|기존/i.test(usimValue);
                        const customerNameSuffix = hasExistingUsim ? ' (기존유심재사용)' : '';
                        
                        return `★라온아이 배정요청
${info.고객명 || info.가입자명 || ''}${customerNameSuffix}`;
                    },
                    memo: (info) => {
                        // 밀리언 선택약정 12개월 체크
                        if (info['공시선약여부'] === '선택약정' && info['약정개월수'] === '12개월') {
                            alert('밀리언은 선택약정 24개월만 진행 가능합니다. 어드민 메모를 확인하세요. \n도우미 양식은 24개월로 자동 변환됩니다.');
                        }
                        
                        // 유심 상태 결정 (기존, 기존유심 문자열이 없으면 후청구, 있으면 기존유심재사용)
                        const usimValue = info.유심 || '';
                        const hasExistingUsim = /기존|기존유심/i.test(usimValue);
                        const usimStatus = hasExistingUsim ? '기존유심재사용' : '후청구';
                        
                        // 할부원금 처리
                        let paymentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            paymentInfo = `★현금완납(${info.최종구매가 || ''})`;
                        } else if (info.할부현금여부 === '할부') {
                            const priceInfo = info.최종구매가 ? `${info.최종구매가}` : '';
                            const monthInfo = info.할부개월수 ? ` / ${info.할부개월수}` : '';
                            paymentInfo = `${priceInfo}${monthInfo}`;
                            
                            // 프리할부가 있는 경우 추가
                            if (info.프리할부 && info.프리할부 !== '0') {
                                paymentInfo += ` (프리할부: ${info.프리할부})`;
                            }
                        } else {
                            paymentInfo = info.할부현금여부 || '';
                        }
                        
                        // 부가서비스 정리
                        const additionalServices = [];
                        if (info.부가서비스 && info.부가서비스 !== '무') {
                            additionalServices.push(info.부가서비스);
                        }
                        if (info.부가서비스2 && info.부가서비스2.trim() !== '') {
                            additionalServices.push(info.부가서비스2);
                        }
                        if (info.보험) {
                            additionalServices.push(info.보험);
                        }
                        const servicesText = additionalServices.length > 0 ? additionalServices.join(' / ') : '';
                        
                        return `개통요청(${info.가입유형 || ''})
현통신사 : ${info.현재통신사 || ''}
이름 : ${info.가입자명 || info.고객명 || ''}
주민번호 : ${formatBirthDate(info.주민번호 || info.생년월일 || '')}
개통번호 : ${info.개통번호 || info.전화번호 || ''}
구매기종 : ${info.모델명 || ''} ${info.용량 || ''} / ${info.색상 || ''}
유심 : ${usimStatus}
요금제 : ${info.요금제 || ''}
할부원금 (프리할부) / 개월수 : ${paymentInfo}
부가서비스 : ${servicesText}`;
                    }
                }
            },
            '장천': {
                name: '장천',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['장천'],
                templates: {
                    delivery: (info) => {
                        // 유심 여부 결정 (기존, 기존유심 텍스트가 포함되어 있으면 X, 그렇지 않으면 O)
                        const usimValue = info.유심 || '';
                        const hasExistingUsim = /기존|기존유심/i.test(usimValue);
                        const usimStatus = hasExistingUsim ? 'X' : 'O';
                        
                        return `■ 배송요청(택배)
▶고객명 : ${info.가입자명 || info.고객명 || ''}
▶모델 : ${info.모델명 || ''}${info.용량 ? info.용량 : ''} ${info.색상 || ''}
▶유심여부 : ${usimStatus}
▶배송지 : ${info.배송주소지 || info.택배주소 || ''}
▶연락처: ${info.개통번호 || info.전화번호 || ''}`;
                    },
                    open: (info) => {
                        // 미성년자 여부 확인
                        const isMinor = info.미성년자여부 === 'Y';
                        
                        // 현금/할부 정보 처리
                        let paymentInfo = '';
                        if (info.할부현금여부 === '현금') {
                            paymentInfo = `현금 ${info.최종구매가 || ''}`;
                        } else if (info.할부현금여부 === '할부') {
                            paymentInfo = `할부 ${info.할부개월수 || ''} ${info.최종구매가 || ''}`;
                        } else {
                            paymentInfo = info.할부현금여부 || '';
                        }
                        
                        // 약정 정보 처리
                        const contractInfo = info.공시선약여부 || info.할인유형 || '';
                        
                        // 현재통신사 인증값 처리
                        const carrierAuth = info.현재통신사 ? `${info.현재통신사} & 인증값` : '';
                        
                        // 보험과 부가서비스를 위한 배열
                        const additionalServices = [];
                        
                        // 보험 정보 추가
                        const insurance = info.보험 || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(insurance);
                        }
                        
                        // 부가서비스 정보 추가
                        const addon = info.부가서비스 || '';
                        if (addon && addon !== '무') {
                            additionalServices.push(addon);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info.부가서비스2 || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(addon2);
                        }
                        
                        // 보험/부가서비스 정보 구성
                        const serviceInfo = additionalServices.length > 0 ? additionalServices.join(' / ') : 'X';
                        
                        if (isMinor) {
                            // 미성년자 (청소년) 양식
                            return `[ 청소년개통요청 양식 ]
ㅇ고객명 : ${info.고객명 || info.가입자명 || ''}
ㅇ개통번호 : ${info.개통번호 || info.전화번호 || ''}
ㅇ주민번호(풀로) : ${info.주민번호 || info.생년월일 || ''}
ㅇ전통신사&인증값 : ${carrierAuth}
ㅇ법대이름 : ${info.법정대리인명 || info.보호자명 || ''}
ㅇ법대 연락처 : ${info.법정대리인연락처 || info.보호자연락처 || ''}
ㅇ법대 주민번호 : ${info.법정대리인주민번호 || info.보호자주민번호 || ''}
ㅇ고객청구주소 : ${info.청구주소 || info.배송주소지 || info.택배주소 || ''}
ㅇ자동이체 : ${info.자동이체 || ''}
ㅇ요금제 : ${info.요금제 || ''}
ㅇ약정(공시or선약) : ${contractInfo}
ㅇ할부 or 현금 : ${paymentInfo}
ㅇ고객선납 : ${info.프리할부 || 'X'}
ㅇ모델명 : ${info.모델명 || ''} ${info.용량 || ''} ${info.색상 || ''}
ㅇ일련번호 : ${info.단말기일련번호 || ''}
ㅇ유심번호 : ${info.유심일련번호 || ''}
ㅇ부가서비스 : ${serviceInfo}
ㅇ지정번호 : X
ㅇ복지 : X`;
                        } else {
                            // 성인 양식
                            return `[ 성인개통요청 양식 ]
ㅇ고객명 : ${info.고객명 || info.가입자명 || ''}
ㅇ개통번호 : ${info.개통번호 || info.전화번호 || ''}
ㅇ주민번호(풀로) : ${info.주민번호 || info.생년월일 || ''}
ㅇ전통신사&인증값 : ${carrierAuth}
ㅇ고객청구주소 : ${info.청구주소 || info.배송주소지 || info.택배주소 || ''}
ㅇ자동이체 : ${info.자동이체 || ''}
ㅇ요금제 : ${info.요금제 || ''}
ㅇ약정(공시or선약) : ${contractInfo}
ㅇ할부 or 현금 : ${paymentInfo}
ㅇ고객선납 : ${info.프리할부 || 'X'}
ㅇ모델명 : ${info.모델명 || ''} ${info.용량 || ''} ${info.색상 || ''}
ㅇ일련번호 : ${info.단말기일련번호 || ''}
ㅇ유심번호 : ${info.유심일련번호 || ''}
ㅇ부가서비스 : ${serviceInfo}
ㅇ복지 : X`;
                        }
                    }
                }
            },
            '삼보/엠디도매': {
                name: '삼보/엠디도매',
                type: 'normal',
                outputType: 'single',
                memo: agencyMemos['SK']['삼보/엠디도매'],
                template: (info) => `[삼보/엠디도매]\n${info.고객명}\n${info.모델명}\n${info.색상}\n${info.요금제}\n${info.가입유형}\n${info.할부현금여부} ${info.최종구매가}원`
            },
            '코웨어': {
                name: '코웨어',
                type: 'special',
                outputType: 'single',
                memo: agencyMemos['SK']['코웨어'],
                template: (info) => {
                    let result = `[개통요청]\n고객명 - ${info.고객명 || ''}\n주민번호 - ${info.주민번호 || info.생년월일 || ''}\n개통번호 - ${info.전화번호 || info.개통번호 || info.연락처 || ''}\n단말정보 - ${info.모델명 || ''} ${info.색상 || ''}\n일련번호 - ${info.단말기일련번호 || ''}\n요금제 - ${info.요금제 || ''}\n`;
                    
                    if (info.할부현금여부 === '할부') {
                        result += `할부 - ${info.할부개월수 || '24'}\n`;
                        if (info.프리할부 && info.프리할부 !== '0') {
                            result += `프리 - ${info.프리할부}\n`;
                        }
                        result += `할부원금 - ${info.최종구매가 || '0'}\n`;
                    } else if (info.할부현금여부 === '현금') {
                        result += `할부 - 0\n`;
                        result += `할부원금 - 0\n`;
                        result += `현금완납 - O\n`;
                    }
                    
                    if (info.공시선약여부 === '공시지원' || info.공시선약여부 === '선택약정' || info.공시선약여부 === '선약') {
                        result += `선약&공시 - ${info.공시선약여부} ${info.약정개월수 || '24'}\n`;
                    }
                    
                    result += `유심 - ${info.유심일련번호 || info.유심 || ''}\n`;
                    return result;
                }
            },
            '비앤컴': {
                name: '비앤컴',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['비앤컴'],
                templates: {
                    stockRequest: (info) => {
                        // 비앤컴 접수확인&신조요청 양식
                        const name = info['가입자명'] || info['고객명'] || '';
                        const jumin = info['주민번호'] || info['생년월일'] || '';
                        const phone = info['전화번호'] || info['개통번호'] || '';
                        const subscriptionType = info['가입유형'] || '';
                        
                        return `- ${subscriptionType}
ㅁSK조회양식
고객명 : ${name}
주민번호 : ${jumin}
전화번호 : ${phone}
${subscriptionType} 접수 확인 및 신조 부탁드립니다.`;
                    },
                    openRequest: (info) => {
                        // 비앤컴 개통요청 양식
                        const openName = info['고객명'] || info['가입자명'] || '';
                        const openJumin = info['주민번호'] || info['생년월일'] || '';
                        const openPhone = info['개통번호'] || info['전화번호'] || '';
                        const openSubscriptionType = info['가입유형'] || '';
                        const model = info['모델명'] || '';
                        const color = info['색상'] || '';
                        const serialNumber = info['단말기일련번호'] || '';
                        const usimNumber = info['유심일련번호'] || info['유심'] || '';
                        const plan = info['요금제'] || '';
                        const discountType = info['할인유형'] || '';
                        const contractMonths = info['약정개월수'] || '';
                        
                        // 부가서비스/보험/부가서비스2 조합
                        const additionalServices = [];
                        
                        // 부가서비스 정보 추가
                        const addonService = info['부가서비스'] || '';
                        if (addonService && addonService !== '무') {
                            additionalServices.push(addonService);
                        }
                        
                        // 보험 정보 추가
                        const insurance = info['보험'] || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(insurance);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info['부가서비스2'] || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(addon2);
                        }
                        
                        // 보험/부가서비스 정보 구성
                        const addon = additionalServices.length > 0 ? additionalServices.join(' / ') : '';
                        
                        // 할부원금/개월수 처리
                        let installmentInfo = '';
                        if (info['할부현금여부'] === '현금') {
                            installmentInfo = `★현금완납 / ${info['최종구매가'] || ''}`;
                        } else if (info['할부현금여부'] === '할부') {
                            installmentInfo = `${info['최종구매가'] || ''} / ${info['할부개월수'] || ''}`;
                        } else {
                            installmentInfo = `${info['최종구매가'] || ''}`;
                        }
                        
                        // 선납금 계산 (숫자 형태로 처리 후 콤마 포맷)
                        let prepayment = '0';
                        if (info['공시선약여부'] === '공시지원') {
                            // 콤마 제거 후 숫자로 변환
                            const gongsi = parseInt((info['공시'] || '0').replace(/,/g, '')) || 0;
                            const chuji = parseInt((info['추지'] || '0').replace(/,/g, '')) || 0;
                            const jeonhwan = parseInt((info['전환지원금'] || '0').replace(/,/g, '')) || 0;
                            const preFree = parseInt((info['프리할부'] || '0').replace(/,/g, '')) || 0;
                            
                            const total = gongsi + chuji + jeonhwan + preFree;
                            // 숫자를 콤마 형태로 포맷
                            prepayment = total.toLocaleString();
                        } else if (info['공시선약여부'] === '선택약정') {
                            prepayment = '0';
                        }
                        
                        return `ㅇ 개통요청 (제휴)/케이뱅크
고객명 : ${openName}
생년월일 : ${formatBirthDate(openJumin)}
개통번호 : ${openPhone}
가입유형 : ${openSubscriptionType}
모델명 : ${model} / ${color}
일련번호 : ${serialNumber}
유심번호 : ${usimNumber}
요금제 : ${plan}
약정유형(공시/선약)/개월수 : ${discountType} / ${contractMonths}
할부원금/개월수 : ${installmentInfo}
선납금 : ${prepayment}
부가서비스/보험 : ${addon}`;
                    }
                }
            },
            '이앤티': {
                name: '이앤티',
                type: 'special',
                outputType: 'split',
                memo: agencyMemos['SK']['이앤티'],
                templates: {
                    stockRequest: (info) => {
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 비구매, 그렇지 않으면 구매
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimStatus = hasESim ? '비구매' : '구매';
                        
                        return `▶배송방법(택배/퀵/내방) : 택배   
- 받는분 : ${info.고객명 || ''}
- 연락처 : ${info.전화번호 || ''}
- 주 소 : ${info.택배주소 || info.배송주소지 || ''}
▶모델명/색상 : ${info.모델명 || ''} ${info.용량 || ''} / ${info.색상 || ''}
▶기기일련 : ${info.단말기일련번호 || ''}
▶유심(구매/비구매) : ${usimStatus}`;
                    },
                    openRequest: (info) => {
                        // 지정번호 처리 (신규가입이 아니면 X)
                        const subscriptionType = info.가입유형 || '';
                        const designatedNumber = ['신규가입', '신규'].includes(subscriptionType) ? '' : 'X';
                        
                        // 할부선할인 처리 (프리할부가 있으면 프리할부 값, 없으면 X)
                        const installmentDiscount = (info.프리할부 && info.프리할부 !== '0') ? info.프리할부 : 'X';
                        
                        // 유심 처리 (즉납/후납/기존)
                        const usimValue = info.유심 || '';
                        let usimType = '';
                        
                        // 기존 또는 기존유심이 포함된 경우
                        if (/기존|기존유심/i.test(usimValue)) {
                            usimType = '기존';
                        } else {
                            // 기존/기존유심이 없는 경우 후납으로 처리
                            if (/이심/i.test(usimValue)) {
                                usimType = '후납(이심)';
                            } else {
                                usimType = '후납';
                            }
                        }
                        
                        // 공시/선약 처리
                        const contractType = info.공시선약여부 || info.할인유형 || '';
                        
                        // 공시지원인 경우 추가 정보 표시
                        let contractDisplayText = contractType;
                        if (contractType === '공시지원') {
                            contractDisplayText = `${contractType} ${info.약정개월수 || ''} (공시 ${info.공시 || ''} + 추지 ${info.추지 || ''})`;
                        } else if (contractType === '선택약정') {
                            contractDisplayText = `${contractType} ${info.약정개월수 || ''}`;
                        } else {
                            contractDisplayText = `${contractType} ${info.약정개월수 || ''}`;
                        }
                        
                        // 현금/할부 처리
                        let paymentType = '';
                        if (info.할부현금여부 === '현금') {
                            paymentType = `현금완납 ${info.최종구매가 || ''}`;
                        } else if (info.할부현금여부 === '할부') {
                            paymentType = `할부 ${info.할부개월수 || ''} ${info.최종구매가 || ''}`;
                        } else {
                            paymentType = info.할부현금여부 || '';
                        }
                        
                        // 보험과 부가서비스를 위한 배열
                        const additionalServices = [];
                        
                        // 부가서비스 정보 추가
                        const addon = info.부가서비스 || '';
                        if (addon && addon !== '무') {
                            additionalServices.push(addon);
                        }
                        
                        // 보험 정보 추가
                        const insurance = info.보험 || '';
                        if (insurance && insurance !== '무') {
                            additionalServices.push(insurance);
                        }
                        
                        // 부가서비스2 정보 추가
                        const addon2 = info.부가서비스2 || '';
                        if (addon2 && addon2.trim() !== '') {
                            additionalServices.push(addon2);
                        }
                        
                        // 보험/부가서비스 정보 구성
                        const serviceInfo = additionalServices.length > 0 ? additionalServices.join(' / ') : '';
                        
                        return `★정책명
▶판매점 : 신풍
▶고객명 : ${info.고객명 || ''}
▶개통번호 : ${info.전화번호 || ''}
▶주민번호 : ${formatBirthDate(info.주민번호 || info.생년월일 || '')}
▶전통신사 : ${info.현재통신사 || ''}
▶모델/색상 : ${info.모델명 || ''} ${info.용량 || ''} / ${info.색상 || ''}
▶단말일련번호 : ${info.단말기일련번호 || ''}
▶유심(즉납/후납/기존) : ${usimType}
▶유심일련번호 : ${info.유심일련번호 || ''}
▶공시/선약 : ${contractDisplayText}
▶현금/할부 : ${paymentType}
▶할부선할인 : ${installmentDiscount}
▶요금제 : ${info.요금제 || ''}
▶지정번호 : ${designatedNumber}
▶부가 : ${serviceInfo}
▶티게이트 접수 : `;
                    }
                }
            },
            '럭스': {
                name: '럭스',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['럭스'],
                templates: {
                    request: (info) => {
                        // 기본 정보 처리
                        const name = info['가입자명'] || info['고객명'] || '';
                        const contact = info['개통번호'] || info['전화번호'] || '';
                        const subscriptionType = info['가입유형'] || '';
                        
                        // 가입유형에 따른 접두사 결정
                        let prefix = '';
                        if (['기기변경', '보상기변', '기변'].includes(subscriptionType)) {
                            prefix = '기변';
                        } else if (['번호이동', '번이'].includes(subscriptionType)) {
                            prefix = '번이';
                        } else if (['신규가입', '신규'].includes(subscriptionType)) {
                            prefix = '신규';
                        }
                        
                        // 주민번호 유효성 검사 (번호이동 또는 신규가입인 경우에만)
                        const jumin = info['주민번호'] || info['생년월일'] || '';
                        let juminError = '';
                        if (['번호이동', '번이', '신규가입', '신규'].includes(subscriptionType)) {
                            const juminRegex = /^\d{6}-?\d{7}$/;
                            if (!juminRegex.test(jumin)) {
                                juminError = '\n※ 번호이동/신규가입시 주민번호 전체가 필요합니다.';
                            }
                        }
                        
                        return `[${prefix} 신조요청후 유키반려]
업체명: 에이치엘
고객명: ${name}
전화번호: ${contact}
주민번호: ${jumin}${juminError}`;
                    },

                    open: (info) => {
                        // 기존 럭스 개통요청 양식 (조건부)
                        const name = info['가입자명'] || info['고객명'] || '';
                        const contact = info['개통번호'] || info['전화번호'] || '';
                        const modelColor = `${info['모델명'] || ''} ${info['용량'] || ''} / ${info['색상'] || ''} / ${info['단말기일련번호'] || ''}`;
                        const plan = convertSKPlan(info['요금제'] || '', 'SK');
                        const subscriptionType = info['가입유형'] || '';
                        const subscriptionTypeWithCarrier = info['현재통신사'] ? `${subscriptionType}(${info['현재통신사']})` : subscriptionType;
                        
                        // 기존 조건부 로직 그대로 복원
                        if (info['공시선약여부'] === '공시지원' && info['할부현금여부'] === '현금') {
                            return `판매점명 : 에이치엘
고객명 : ${name}	
개통번호 : ${contact}	
모델명 / 색상 / 일련번호 : ${modelColor}	
유심 일련번호 :	${info['유심일련번호'] || ''}	
요금제명(혜택) : ${plan}	
개통유형 : ${subscriptionTypeWithCarrier}	
공시 ${info['약정개월수'] || '24개월'}		
현금완납		
		
출고가 ${info['출고가'] || ''}
공시지원 ${info['공시'] || ''}
추가지원 ${info['추지'] || ''}${info['전환지원금'] && info['전환지원금'] !== '0' ? `
전환지원금 ${info['전환지원금']}` : ''}
최종구매가 ${info['최종구매가'] || ''}
		
보험 / 부가서비스 : ${[info['보험'], info['부가서비스'], info['부가서비스2']].filter(item => item && item.trim()).join(' / ')}`;
                        } else if (info['공시선약여부'] === '공시지원' && info['할부현금여부'] === '할부') {
                            return `판매점명 : 에이치엘
고객명 : ${name}	
개통번호 : ${contact}	
모델명 / 색상 / 일련번호 : ${modelColor}	
유심 일련번호 :	${info['유심일련번호'] || ''}	
요금제명(혜택) : ${plan}	
개통유형 :	${subscriptionTypeWithCarrier}	
공시 ${info['약정개월수'] || '24개월'}		
할부 ${info['할부개월수'] || '24개월'}		
		
출고가 ${info['출고가'] || ''}
공시지원 ${info['공시'] || ''}
추가지원 ${info['추지'] || ''}${info['전환지원금'] && info['전환지원금'] !== '0' ? `
전환지원금 ${info['전환지원금']}` : ''}
프리할부 ${info['프리할부'] || ''}
최종구매가 ${info['최종구매가'] || ''}
		
보험 / 부가서비스 : ${[info['보험'], info['부가서비스'], info['부가서비스2']].filter(item => item && item.trim()).join(' / ')}`;
                        } else if ((info['공시선약여부'] === '선택약정' || info['공시선약여부'] === '선약') && info['할부현금여부'] === '현금') {
                            return `판매점명 : 에이치엘
고객명 : ${name}	
개통번호 : ${contact}	
모델명 / 색상 / 일련번호 : ${modelColor}	
유심 일련번호 :	${info['유심일련번호'] || ''}	
요금제명(혜택) : ${plan}	
개통유형 :	${subscriptionTypeWithCarrier}	
선약 ${info['약정개월수'] || '24개월'}		
현금완납		
		
출고가 ${info['출고가'] || ''}${info['전환지원금'] && info['전환지원금'] !== '0' ? `
전환지원금 ${info['전환지원금']}` : ''}
최종구매가 ${info['최종구매가'] || ''}
		
보험 / 부가서비스 : ${[info['보험'], info['부가서비스'], info['부가서비스2']].filter(item => item && item.trim()).join(' / ')}`;
                        } else if ((info['공시선약여부'] === '선택약정' || info['공시선약여부'] === '선약') && info['할부현금여부'] === '할부') {
                            return `판매점명 : 에이치엘
고객명 : ${name}	
개통번호 : ${contact}	
모델명 / 색상 / 일련번호 : ${modelColor}	
유심 일련번호 :	${info['유심일련번호'] || ''}	
요금제명(혜택) : ${plan}	
개통유형 : ${subscriptionTypeWithCarrier}	
선약 ${info['약정개월수'] || '24개월'}		
할부 ${info['할부개월수'] || '24개월'}		
		
출고가 ${info['출고가'] || ''}${info['전환지원금'] && info['전환지원금'] !== '0' ? `
전환지원금 ${info['전환지원금']}` : ''}
프리할부 ${info['프리할부'] || ''}
최종구매가 ${info['최종구매가'] || ''}
		
보험 / 부가서비스 : ${[info['보험'], info['부가서비스'], info['부가서비스2']].filter(item => item && item.trim()).join(' / ')}`;
                        } else {
                            return `[럭스] ${name}님 / ${info['모델명'] || ''} / ${info['색상'] || ''} / ${plan} / ${subscriptionTypeWithCarrier} / ${info['할부현금여부'] || ''} ${info['최종구매가'] || ''}`;
                        }
                    },
                    delivery: (info) => {
                        const name = info['가입자명'] || info['고객명'] || '';
                        const contact = info['개통번호'] || info['전화번호'] || '';
                        
                        // 이앤티와 동일한 유심 처리 로직
                        const usimValue = info['유심'] || '';
                        let simIncluded = '';
                        
                        // 기존 또는 기존유심이 포함된 경우
                        if (/기존|기존유심/i.test(usimValue)) {
                            simIncluded = 'N';
                        } else {
                            // 기존/기존유심이 없는 경우
                            if (/이심/i.test(usimValue)) {
                                simIncluded = 'N';
                            } else {
                                simIncluded = 'Y';
                            }
                        }
                        
                        return `□재고 요청서□
매장상호 : 에이치엘
고객명: ${name}
연락처: ${contact}
받을 주소: ${info['택배주소'] || info['배송주소지'] || ''}
퀵/택배: 택배
기종/색상: ${info['모델명'] || ''} ${info['용량'] || ''} / ${info['색상'] || ''}
유심동봉여부: ${simIncluded}`;
                    },
                    universe: (info) => {
                        // 우주패스 항목이 있는지 먼저 확인
                        const addon1 = info['부가서비스'] || '';
                        const addon2 = info['부가서비스2'] || '';
                        const addonText = `${addon1} ${addon2}`.toLowerCase();
                        const name = info['가입자명'] || info['고객명'] || '';
                        const contact = info['개통번호'] || info['전화번호'] || '';
                        
                        // 생년월일/주민번호를 yymmdd 형식으로 변환
                        const birthOrRegNum = info['주민번호'] || info['생년월일'] || '';
                        let formattedBirth = '';
                        if (birthOrRegNum) {
                            // - 제거하고 앞 6자리만 추출 (yymmdd)
                            formattedBirth = birthOrRegNum.replace(/-/g, '').substring(0, 6);
                        }
                        
                        // 우주패스 상품명 추출 (편의점&카페, 11번가, G마켓)
                        let productName = '';
                        if (addonText.includes('편의점') && addonText.includes('카페')) {
                            productName = '편의점 & 카페';
                        } else if (addonText.includes('11번가')) {
                            productName = '쇼핑 11번가';
                        } else if (addonText.includes('g마켓')) {
                            productName = '쇼핑 G마켓';
                        }
                        
                        // 추가옵션 추출 (괄호 안의 내용)
                        let additionalOption = '';
                        const parenthesesMatch = `${addon1} ${addon2}`.match(/\(([^)]+)\)/);
                        if (parenthesesMatch && parenthesesMatch[1]) {
                            additionalOption = parenthesesMatch[1].trim();
                        }
                        
                        return `[T우주패스 신청 양식]
1. 고객명 : ${name}
2. 생년월일 : ${formattedBirth}
3. 개통번호 : ${contact}
4. 상품명 (편의점 & 카페 / 쇼핑 11번가 / 쇼핑 G마켓 택1) : ${productName}
5. 추가옵션 (배민,유튜브 등) : ${additionalOption}
6. 결제정보 : 기존자동이체`;
                    }
                }
            },
            '한올': {
                name: '한올',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['한올'],
                templates: {
                                                 confirm: (info) => {
                                         // 한올 접수확인양식
                                         const customerName = info.고객명 || info.가입자명 || '';
                                         const birthOrRegNum = info.주민번호 || info.생년월일 || '';
                                         const phoneNumber = info.개통번호 || info.전화번호 || '';
                                         
                                         return `${customerName} / ${birthOrRegNum} / ${phoneNumber}
접수확인부탁드립니다.`;
                                     },
                                                 delivery: (info) => {
                                         // 한올 배송요청양식 (이앤티 유심 로직 적용)
                                         const customerName = info.고객명 || info.가입자명 || '';
                                         const phoneNumber = info.개통번호 || info.전화번호 || '';
                                         const address = info.배송주소지 || info.택배주소 || '';
                                         const model = info.모델명 || '';
                                         const capacity = info.용량 || '';
                                         const color = info.색상 || '';
                                         
                                         // 이앤티와 동일한 유심 발송 여부 로직
                                         const usimValue = info.유심 || '';
                                         let usimDelivery = '';
                                         
                                         // 기존 또는 기존유심이 포함된 경우
                                         if (/기존|기존유심/i.test(usimValue)) {
                                             usimDelivery = 'X';
                                         } else {
                                             // 기존/기존유심이 없는 경우
                                             if (/이심/i.test(usimValue)) {
                                                 usimDelivery = 'X'; // 이심인 경우 발송 불필요
                                             } else {
                                                 usimDelivery = 'O'; // 일반 유심인 경우 발송 필요
                                             }
                                         }
                                         
                                         return `■ 배송요청
＊배송방법 : 택배
＊고객명 : ${customerName}
＊연락처 : ${phoneNumber}
＊주소 : ${address}
＊모델(색상 및 용량) : ${model} ${capacity} / ${color}
＊일련번호 : 
＊유심발송 여부 : ${usimDelivery}`;
                                     },
                                                 open: (info) => {
                                         // 한올 개통요청양식
                                         const customerName = info.고객명 || info.가입자명 || '';
                                         const birthDate = formatBirthDate(info.주민번호 || info.생년월일 || '');
                                         const currentTelecom = info.현재통신사 || '';
                                         const model = info.모델명 || '';
                                         const capacity = info.용량 || '';
                                         const color = info.색상 || '';
                                         const serialNumber = info.단말기일련번호 || '';
                                         const plan = info.요금제 || '';
                                         const contractMonths = info.약정개월수 || '';
                                         const contractType = info.공시선약여부 || info.할인유형 || '';
                                         const joinType = info.가입유형 || '';
                                         const paymentType = info.할부현금여부 || '';
                                         const finalPrice = info.최종구매가 || '';
                                         const installmentMonths = info.할부개월수 || '';
                                         const freeLoan = info.프리할부 || '';
                                         const address = info.배송주소지 || info.택배주소 || '';
                                         const emergencyContact = info.개통번호 || info.전화번호 || '';
                                         const usimSerial = info.유심일련번호 || '';
                                         
                                         // 부가서비스 처리
                                         const services = [info.부가서비스, info.부가서비스2, info.보험]
                                             .filter(service => service && service.trim() && service !== '무')
                                             .join(' / ');
                                         
                                         // 현금 or 할부 처리
                                         const cashOrInstallment = `${paymentType} (${finalPrice})`;
                                         
                                         // 할부원금 및 프리금액 처리
                                         let installmentInfo = '';
                                         if (paymentType === '할부') {
                                             installmentInfo = `${paymentType}${installmentMonths} (${finalPrice})`;
                                             if (freeLoan && freeLoan !== '0') {
                                                 installmentInfo += ` / 프리할부 ${freeLoan}원`;
                                             }
                                         } else if (paymentType === '현금') {
                                             installmentInfo = 'X';
                                         } else {
                                             installmentInfo = paymentType ? `${paymentType} (${finalPrice})` : '';
                                         }
                                         
                                         return `◆ 개통 조건 : ${contractMonths} ${contractType} / ${joinType}
◆ 성함: ${customerName}
◆ 주민번호 13자리 : ${birthDate}
◆ 이전 통신사 : ${currentTelecom}
◆ 모델 : ${model}-${capacity}
◆ 색상 : ${color} / ${serialNumber}
◆ 요금제 : ${plan}
◆ 현금 or 할부 : ${cashOrInstallment}
◆ 할부원금및 프리금액 : ${installmentInfo}
◆ 주소 : ${address}
◆ 비상연락처 : ${emergencyContact}
◆ 부가서비스 : ${services || 'X'}
◆ 유심: ${usimSerial}
◆ 기타 : X`;
                                     }
                }
            }
        }
    },
    'KT': {
        name: 'KT',
        agencies: {
            '재희': {
                name: '재희',
                type: 'special',
                outputType: 'table',
                memo: agencyMemos['KT']['재희'],
                template: (info) => {
                    const additionalOutput = `${info.모델명 || ''} ${info.용량 || ''} / ${info.가입유형 || ''} ${info.할부현금여부 || ''}개통\n` +
                        `${info.고객명 || ''} / ${info.주민번호 || info.생년월일 || ''} / ${info.개통번호 || info.전화번호 || info.연락처 || ''}\n` +
                        `접수 확인 부탁드립니다.`;
                    return {
                        tableData: info,
                        additionalText: additionalOutput
                    };
                }
            },
            '오앤티': {
                name: '오앤티',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['KT']['오앤티'],
                templates: {
                    request: (info) => `★신조요청 ★
${info.가입유형 || ''} ${info.할부현금여부 || ''}개통
성함 : ${info.고객명 || info.가입자명 || ''}
주민번호 : ${info.주민번호 || info.생년월일 || ''}
개통번호 : ${info.개통번호 || info.전화번호 || ''}`,
                    delivery: (info) => {
                        // 유심 값에 '이심' 또는 '기존유심' 키워드가 있으면 비구매, 그렇지 않으면 구매
                        const usimValue = info.유심 || '';
                        const hasESim = /이심|기존유심/i.test(usimValue);
                        const usimStatus = hasESim ? 'X' : 'O';
                        
                        return `그룹 : 둘째
삼차점(판매점) : 라온아이
모델명 : ${info.모델명 || ''} ${info.용량 || ''}
색상 : ${info.색상 || ''}
일련번호 : ${info.단말기일련번호 || ''}
유심 : ${usimStatus}
배송유형 : 택배
운송장 :
고객명 : ${info.고객명 || info.가입자명 || ''}
연락처 : ${info.개통번호 || info.전화번호 || ''}
주소 : ${info.택배주소 || info.배송주소지 || ''}
할증/비할증 :
기타 :`;
                    },
                    open: (info) => `판매자 : 라온
판매자연락처 : 010-4671-4834

고객명 : ${info.고객명 || info.가입자명 || ''}
가입유형 : ${info.가입유형 || ''}${info.현재통신사 ? '(' + info.현재통신사 + ')' : ''}
생년월일 : ${info.생년월일 || info.주민번호 || ''}
개통번호 : ${info.개통번호 || info.전화번호 || ''}
모델명 : ${info.모델명 || ''} ${info.용량 || ''}
색상 : ${info.색상 || ''}
일련번호 : ${info.단말기일련번호 || ''}
요금제 : ${info.요금제 || ''}
유심 : ${info.유심일련번호 || ''}
현금/할부(개월수) : ${info.할부현금여부 === '현금' ? info.할부현금여부 + '완납' : info.할부현금여부 || ''}${info.할부현금여부 === '할부' ? '(' + (info.할부개월수 || '') + ')' : ''}
코스 : ${info.공시선약여부 || info.할인유형 || ''}${info.약정개월수 ? ' ' + info.약정개월수 : ''}
공시지원금 : ${info.공시 && info.공시 !== '0' ? info.공시 : 'X'}
추가지원금 : ${info.추지 && info.추지 !== '0' ? info.추지 : 'X'}
전환지원금 : ${info.전환지원금 && info.전환지원금 !== '0' ? info.전환지원금 : 'X'}
프리금액 : ${info.프리할부 && info.프리할부 !== '0' ? info.프리할부 : 'X'}
할부원금 : ${info.할부현금여부 || '' } ${info.최종구매가 || ''}
보험 : ${info.보험 || 'X'}
부가 : ${info.부가서비스 || 'X'}`
                }
            },
            '한올': {
                name: '한올',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['SK']['한올'],
                templates: {
                    confirm: (info) => {
                        // 한올 접수확인양식 템플릿 (추후 요청 예정)
                        return `[한올 접수확인양식]
고객명: ${info.고객명 || ''}
개통번호: ${info.개통번호 || info.전화번호 || ''}
모델명: ${info.모델명 || ''}
색상: ${info.색상 || ''}
가입유형: ${info.가입유형 || ''}`;
                    },
                    delivery: (info) => {
                        // 한올 배송요청양식 템플릿 (추후 요청 예정)
                        return `[한올 배송요청양식]
고객명: ${info.고객명 || ''}
연락처: ${info.개통번호 || info.전화번호 || ''}
주소: ${info.택배주소 || info.배송주소지 || ''}
모델명: ${info.모델명 || ''}
색상: ${info.색상 || ''}`;
                    },
                    open: (info) => {
                        // 한올 개통요청양식 템플릿 (추후 요청 예정)
                        return `[한올 개통요청양식]
고객명: ${info.고객명 || ''}
개통번호: ${info.개통번호 || info.전화번호 || ''}
주민번호: ${info.주민번호 || info.생년월일 || ''}
모델명: ${info.모델명 || ''}
색상: ${info.색상 || ''}
요금제: ${info.요금제 || ''}
가입유형: ${info.가입유형 || ''}`;
                    }
                }
            },
            '안산/이스턴': {
                name: '안산/이스턴',
                type: 'normal',
                outputType: 'single',
                memo: agencyMemos['KT']['안산/이스턴'],
                template: (info) => `[안산/이스턴] ${info.고객명 || ''} - ${info.모델명 || ''} - ${info.색상 || ''} - ${info.요금제 || ''} - ${info.가입유형 || ''} - ${info.할부현금여부 || ''} ${info.최종구매가 ? info.최종구매가 + '원' : ''}`,
                extensionForm: (info) => `[안산/이스턴-신청서연장]
고객명: ${info.고객명 || ''}
연락처: ${info.개통번호 || info.전화번호 || ''}
모델명: ${info.모델명 || ''}
색상: ${info.색상 || ''}
요금제: ${info.요금제 || ''}
가입유형: ${info.가입유형 || ''}
할부금액: ${info.할부현금여부 || ''} ${info.최종구매가 ? info.최종구매가 + '원' : ''}`
            },
            '신청서연장양식': {
                name: '신청서연장양식',
                type: 'normal',
                outputType: 'single',
                memo: '',
                template: (info) => `${info.고객명 || ''} / ${info.주민번호 || info.생년월일 || ''} / ${info.개통번호 || info.전화번호 || ''}`
            }
        }
    },
    'LG': {
        name: 'LG',
        agencies: {
            '소리': {
                name: '소리',
                type: 'special',
                outputType: 'table',
                memo: agencyMemos['LG']['소리'],
                template: (info) => {
                    const additionalOutput = `${info.모델명 || ''} / ${info.가입유형 || ''}\n` +
                        `${info.고객명 || ''} / ${info.주민번호 || info.생년월일 || ''} / ${info.개통번호 || info.전화번호 || info.연락처 || ''}\n` +
                        `접수 확인 및 신조 부탁드립니다.`;
                    return {
                        tableData: info,
                        additionalText: additionalOutput
                    };
                }
            },
            '제이/휴넷': {
                name: '제이/휴넷',
                type: 'special',
                outputType: 'multi',
                memo: agencyMemos['LG']['제이/휴넷'],
                templates: {
                    confirm: (info) => `★ 접수 확인 요청드립니다.
▶고객명 : ${info.고객명 || ''}
▶생년월일 : ${info.생년월일 || info.주민번호 || ''}
▶개통번호 : ${info.개통번호 || info.전화번호 || ''}
▶가입유형 : ${info.가입유형 || ''}
▶모델명 : ${info.모델명 || ''}`,
                    delivery: (info) => `■배송요청■

▶업체명 : 위즈케이
▶배송방법(택배/퀵/내방) : 택배
- 받는분 : ${info.고객명 || ''}
- 연락처 : ${info.개통번호 || info.전화번호 || ''}
- 주 소 : ${info.택배주소 || info.배송주소지 || ''}
▶모델명/색상 : ${info.모델명 || ''}/${info.색상 || ''}
▶기기일련 : ${info.단말기일련번호 || ''}
▶유심(구매/비구매) : ${info.유심 || ''}`,
                    open: (info) => `▶판매처 : 위즈케이
▶가입유형 : ${info.가입유형 || ''}
▶고객명 : ${info.고객명 || ''}
▶생년월일 : ${info.생년월일 || info.주민번호 || ''}
▶개통번호 : ${info.개통번호 || info.전화번호 || ''}
▶법대 : ${info.법정대리인이름 || ''}
▶모델명/색상 : ${info.모델명 || ''}/${info.색상 || ''}
▶단말일련 : ${info.단말기일련번호 || ''}
▶유심모델/일련 : ${info.유심 || ''}/${info.유심일련번호 || ''}
▶요금제 : ${info.요금제 || ''}
▶공시/선약(12/24): ${info.공시선약여부 || ''}${info.약정개월수 ? '(' + info.약정개월수 + ')' : ''}
▶추가지원금(15%) : ${info.추지 || ''}
▶전환지원금: ${info.전환지원금 && info.전환지원금 !== '0' ? info.전환지원금 : 'X'}
▶할부(개월)/현금 : ${info.할부현금여부 === '할부' ? `할부(${info.할부개월수 || '24개월'})` : info.할부현금여부 === '현금' ? '현금' : ''}
▶출고가 : ${info.출고가 || ''}
▶프리(고객선납) : ${info.프리할부 && info.프리할부 !== '0' ? info.프리할부 : 'X'}
▶할부원금 : ${info.최종구매가 || ''}
▶부가서비스 : ${info.부가서비스 && info.부가서비스 !== '무' ? info.부가서비스 : 'X'}
▶보험유무 : ${info.보험 || 'X'}`
                }
            },
            '신청서연장양식': {
                name: '신청서연장양식',
                type: 'normal',
                outputType: 'single',
                memo: '',
                template: (info) => `${info.고객명 || ''} / ${info.주민번호 || info.생년월일 || ''} / ${info.개통번호 || info.전화번호 || ''}`
            }
        }
    }
}; 