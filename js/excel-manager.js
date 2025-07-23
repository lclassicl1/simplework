/**
 * Excel Manager - 엑셀 파일 처리 및 다운로드 관리
 * 
 * 주요 기능:
 * - 엑셀 파일 업로드 및 데이터 추출
 * - 배송준비중 상태 필터링
 * - 대리점별 배송요청 양식 생성
 * - 엑셀 스타일링 및 다운로드
 */

class ExcelManager {
    constructor() {
        console.log('🔧 ExcelManager 생성자 실행');
        this.initializeEventListeners();
    }

    /**
     * 엑셀 파일 관련 이벤트 리스너 초기화
     */
    initializeEventListeners() {
        console.log('📋 ExcelManager 이벤트 리스너 초기화');
        
        // 첫 번째 엑셀 파일 처리 (접수확인/신조요청 양식)
        const excelFile1 = document.getElementById('excelFile');
        if (excelFile1) {
            excelFile1.addEventListener('change', (e) => this.handleExcelFile1(e));
            console.log('✅ excelFile 이벤트 리스너 등록 완료');
        } else {
            console.warn('⚠️ excelFile 엘리먼트를 찾을 수 없습니다');
        }
        
        // 두 번째 엑셀 파일 처리 (배송요청 엑셀 생성)
        const excelFile2 = document.getElementById('excelFile2');
        if (excelFile2) {
            excelFile2.addEventListener('change', (e) => this.handleExcelFile2(e));
            console.log('✅ excelFile2 이벤트 리스너 등록 완료');
        } else {
            console.warn('⚠️ excelFile2 엘리먼트를 찾을 수 없습니다');
        }
    }

    /**
     * 첫 번째 엑셀 파일 처리 (접수확인/신조요청 양식)
     */
    handleExcelFile1(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('📁 첫 번째 엑셀 파일 처리 시작:', file.name);
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // XLSX 라이브러리 확인
                if (typeof XLSX === 'undefined') {
                    console.error('❌ XLSX 라이브러리가 로드되지 않았습니다');
                    alert('XLSX 라이브러리가 로드되지 않았습니다. 페이지를 새로고침 해주세요.');
                    return;
                }
                
                const data = e.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary',
                    cellDates: true,
                    cellNF: true,
                    cellText: false,
                    WTF: false
                });
                
                console.log('=== 엑셀 파일 분석 결과 ===');
                console.log('워크북 정보:', {
                    '시트 이름들': workbook.SheetNames,
                    '전체 워크북 데이터': workbook
                });
                
                // 첫 번째 시트 데이터 가져오기
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // 시트 데이터를 배열로 변환
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
                    header: 1,
                    raw: false,
                    defval: '',
                    blankrows: false
                });
                
                // 중요 열 데이터 추출 (10번, 75번 열)
                console.log('=== 중요 열 데이터 분석 ===');
                
                // 헤더 정보 출력
                console.log('1. 중요 열 헤더 정보:');
                console.log('10번 열:', {
                    '헤더1': jsonData[0][9] || '빈 값',
                    '헤더2': jsonData[1][9] || '빈 값'
                });
                console.log('75번 열:', {
                    '헤더1': jsonData[0][74] || '빈 값',
                    '헤더2': jsonData[1][74] || '빈 값'
                });
                
                // 정규식 패턴 정의
                const patterns = {
                    '전화번호': /\*{1,2}(?:전화번호|개통번호)\s*[-\s:：]+\s*(010[-\s]?\d{3,4}[-\s]?\d{4})/,
                    '모델명': /\*{1,2}모델명\s*[-\s:：]+\s*([^*\n]+?)(?=\s+\*{1,2}|$)/,
                    '색상': /\*{1,2}색상\s*[-\s:：]+\s*([^\n\/]+?)(?=\s*\/|\s+\*{1,2}|$)/,
                    '고객명': /\*{1,2}고객명\s*[-\s:：]+\s*([^*\n\/]+?)(?=\s+\*{1,2}|$)/,
                    '주민번호': /\*{1,2}(?:주민번호|생년월일)\s*[-\s:：]+\s*([^*\n\/]+?)(?=\s+\*{1,2}|$)/
                };

                // 실제 데이터 추출 및 가공 (3행부터)
                const extractedData = jsonData.slice(2)
                    .filter(row => row[74]) // 75번 열에 데이터가 있는 행만 필터링
                    .map((row, index) => {
                        const text = row[74] || '';
                        const info = {};
                        
                        // 각 패턴에 맞게 정보 추출
                        Object.entries(patterns).forEach(([key, pattern]) => {
                            const match = text.match(pattern);
                            if (match && match[1]) {
                                let value = match[1].trim();
                                
                                // 전화번호인 경우 표준 형식으로 변환
                                if (key === '전화번호') {
                                    const numbers = value.replace(/\D/g, '');
                                    if (numbers.length === 11 && numbers.startsWith('010')) {
                                        value = `${numbers.slice(0,3)}-${numbers.slice(3,7)}-${numbers.slice(7)}`;
                                        console.log(`전화번호 형식 변환: ${match[1]} → ${value}`);
                                    }
                                }
                                
                                info[key] = value;
                            }
                        });
                        
                        // 모델명 변환 적용 (펫네임 → 실제 모델명)
                        if (info['모델명']) {
                            const originalModelName = info['모델명'];
                            if (typeof window.convertModelName === 'function') {
                                info['모델명'] = window.convertModelName(info['모델명']);
                                console.log(`엑셀 처리 - 모델명 변환: ${originalModelName} → ${info['모델명']}`);
                            } else if (typeof convertModelName === 'function') {
                                info['모델명'] = convertModelName(info['모델명']);
                                console.log(`엑셀 처리 - 모델명 변환: ${originalModelName} → ${info['모델명']}`);
                            }
                        }
                        
                        // 10번 열 데이터 처리 (보상기변 -> 기기변경)
                        const col10Value = row[9] === '보상기변' ? '기기변경' : (row[9] || '');
                        
                        // 템플릿 형식으로 출력
                        const formattedResult = `${info['고객명'] || ''} / ${info['전화번호'] || ''} / ${info['주민번호'] || ''} / ${info['모델명'] || ''} / ${info['색상'] || ''} / ${col10Value}`;
                        
                        return {
                            '행번호': index + 3,
                            '추출결과': formattedResult
                        };
                    });
                
                console.log('2. 추출된 데이터:', extractedData);
                
                // 데이터 요약
                console.log('3. 데이터 요약:', {
                    '총 데이터 행 수': extractedData.length,
                    '빈 값이 아닌 10번열 데이터 수': extractedData.filter(row => row['10번열']).length,
                    '빈 값이 아닌 75번열 데이터 수': extractedData.length
                });
                
                // 추출 결과만 따로 출력
                console.log('4. 추출 결과 목록:');
                const outputText = extractedData.map(row => row['추출결과']).join('\n');
                
                // textarea에 결과 출력
                const outputTextArea = document.getElementById('outputText');
                if (outputTextArea) {
                    outputTextArea.value = outputText;
                }
                
                // 추출 건수 표시
                const extractCountElement = document.getElementById('extractCount');
                if (extractCountElement) {
                    extractCountElement.textContent = `${extractedData.length}건 추출 완료`;
                }
                
                // 성공 메시지 표시
                alert('엑셀 파일이 성공적으로 변환되었습니다.');
                
            } catch (error) {
                console.error('엑셀 파일 처리 중 오류 발생:', error);
                alert('엑셀 파일 처리 중 오류가 발생했습니다: ' + error.message);
            }
        };
        
        reader.onerror = (error) => {
            console.error('파일 읽기 오류:', error);
            alert('파일을 읽는 중 오류가 발생했습니다.');
        };
        
        reader.readAsBinaryString(file);
    }

    /**
     * 두 번째 엑셀 파일 처리 (배송요청 엑셀 생성) - 배송준비중 필터링 포함
     */
    handleExcelFile2(e) {
        // 통신사와 대리점 선택 여부 확인
        const telecomSelect = document.getElementById('telecom');
        const agencySelect = document.getElementById('agency');
        const selectedTelecom = telecomSelect ? telecomSelect.value : '';
        const selectedAgency = agencySelect ? agencySelect.value : '';
        
        if (!selectedTelecom || !selectedAgency) {
            alert('통신사와 대리점을 모두 선택해주세요!');
            e.target.value = '';
            return;
        }
        
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('📁 두 번째 엑셀 파일 처리 시작 (배송요청용):', file.name);
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // XLSX 라이브러리 확인
                if (typeof XLSX === 'undefined') {
                    console.error('❌ XLSX 라이브러리가 로드되지 않았습니다');
                    alert('XLSX 라이브러리가 로드되지 않았습니다. 페이지를 새로고침 해주세요.');
                    return;
                }
                
                const data = e.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary',
                    cellDates: true,
                    cellNF: true,
                    cellText: false,
                    WTF: false
                });
                
                console.log('=== 새로운 엑셀 파일 분석 결과 ===');
                console.log('워크북 정보:', {
                    '시트 이름들': workbook.SheetNames,
                    '전체 워크북 데이터': workbook
                });
                
                // 첫 번째 시트 데이터 가져오기
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // 시트 데이터를 배열로 변환
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
                    header: 1,
                    raw: false,
                    defval: '',
                    blankrows: false
                });
                
                // 배송요청 양식 생성을 위한 처리
                console.log(`=== ${selectedAgency} 배송요청 양식 처리 중 ===`);
                console.log('전체 시트 데이터:', jsonData);
                
                // 정규식 패턴 정의 (배송요청용으로 개선)
                const deliveryPatterns = {
                    '전화번호': /\*{1,2}(?:전화번호|개통번호)\s*[-\s:：]+\s*(010[-\s]?\d{3,4}[-\s]?\d{4})/,
                    '모델명': /\*{1,2}모델명\s*[-\s:：]+\s*([^*\n]+?)(?=\s+\*{1,2}|$)/,
                    '색상': /\*{1,2}색상\s*[-\s:：]+\s*([^\n\/]+?)(?=\s*\/|\s+\*{1,2}|$)/,
                    '고객명': /\*{1,2}고객명\s*[-\s:：]+\s*([^*\n\/]+?)(?=\s+\*{1,2}|$)/,
                    '주민번호': /\*{1,2}(?:주민번호|생년월일)\s*[-\s:：]+\s*([^*\n\/]+?)(?=\s+\*{1,2}|$)/,
                    // 택배주소에서 주소와 연락처를 분리
                    '택배주소': /\*{1,2}택\s*배\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*([^/]+?)(?=\s*\/\s*010-|\s+\*{1,2}|$)/i,
                    '택배연락처': /\*{1,2}택\s*배\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*[^/]+?\s*\/\s*(010-\d{3,4}-\d{4})/i,
                    '배송주소지': /\*{1,2}(?:택\s*배|배\s*송)\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*([^/]+?)(?=\s*\/\s*010-|\s+\*{1,2}|$)/i,
                    '배송연락처': /\*{1,2}(?:택\s*배|배\s*송)\s*(?:주\s*소|주\s*소\s*지)?\s*[-:：]\s*[^/]+?\s*\/\s*(010-\d{3,4}-\d{4})/i,
                    '유심': /\*{1,2}(?:유\s*심|이\s*심)\s*[-:：]\s*([^*\n]+?)(?=\s+\*{1,2}|$)/i
                };

                // 배송요청 데이터 추출 및 가공 (2행부터 - 헤더 1행 제외)
                const processedData = jsonData.slice(2) // 3행부터 시작 (헤더 2행 제외)
                    .filter(row => {
                        // 75번 열에 데이터가 있고, 70번 열이 "배송준비중"인 행만 필터링
                        const hasData = row[74]; // 75번 열에 데이터 있는지 확인
                        const deliveryStatus = row[69] || ''; // 70번 열의 배송 상태
                        const isReady = deliveryStatus.includes('배송준비중');
                        
                        console.log(`행 필터링 체크 - 75번 열 데이터: ${hasData ? '있음' : '없음'}, 70번 열 상태: "${deliveryStatus}", 배송준비중 여부: ${isReady}`);
                        
                        return hasData && isReady;
                    })
                    .map((row, index) => {
                        const text = row[74] || '';
                        const info = {};
                        
                        // 각 패턴에 맞게 정보 추출
                        Object.entries(deliveryPatterns).forEach(([key, pattern]) => {
                            const match = text.match(pattern);
                            if (match && match[1]) {
                                let value = match[1].trim();
                                
                                // 전화번호인 경우 표준 형식으로 변환
                                if (key === '전화번호') {
                                    const numbers = value.replace(/\D/g, '');
                                    if (numbers.length === 11 && numbers.startsWith('010')) {
                                        value = `${numbers.slice(0,3)}-${numbers.slice(3,7)}-${numbers.slice(7)}`;
                                        console.log(`배송처리 전화번호 형식 변환: ${match[1]} → ${value}`);
                                    }
                                }
                                
                                info[key] = value;
                            }
                        });
                        
                        // 모델명 변환 적용 (펫네임 → 실제 모델명)
                        if (info['모델명']) {
                            const originalModelName = info['모델명'];
                            if (typeof window.convertModelName === 'function') {
                                info['모델명'] = window.convertModelName(info['모델명']);
                                console.log(`${selectedAgency} 배송 처리 - 모델명 변환: ${originalModelName} → ${info['모델명']}`);
                            } else if (typeof convertModelName === 'function') {
                                info['모델명'] = convertModelName(info['모델명']);
                                console.log(`${selectedAgency} 배송 처리 - 모델명 변환: ${originalModelName} → ${info['모델명']}`);
                            }
                        }
                        
                        // 택배주소와 배송주소지, 연락처 통합 처리
                        const address = info['택배주소'] || info['배송주소지'] || '';
                        const deliveryContact = info['택배연락처'] || info['배송연락처'] || '';
                        
                        // 유심 정보 가공 처리
                        let usimStatus = '';
                        let esimStatus = 'N';
                        
                        if (info['유심']) {
                            const usimValue = info['유심'].toLowerCase();
                            console.log(`[${index + 1}번째 행] 유심 원본 데이터: "${info['유심']}"`);
                            
                            if (usimValue.includes('7,700') || usimValue.includes('후납')) {
                                usimStatus = '유심 구매';
                                esimStatus = 'N';
                                console.log(`[${index + 1}번째 행] 유심 가공 결과: ${usimStatus} / 이심: ${esimStatus} (7,700원 또는 후납 감지)`);
                            } else if (usimValue.includes('기존유심') || usimValue.includes('기존')) {
                                usimStatus = '유심 비구매';
                                esimStatus = 'N';
                                console.log(`[${index + 1}번째 행] 유심 가공 결과: ${usimStatus} / 이심: ${esimStatus} (기존유심 감지)`);
                            } else if (usimValue.includes('이심')) {
                                usimStatus = '유심 비구매';
                                esimStatus = 'Y';
                                console.log(`[${index + 1}번째 행] 유심 가공 결과: ${usimStatus} / 이심: ${esimStatus} (이심 감지)`);
                            } else {
                                usimStatus = '유심 구매';
                                esimStatus = 'N';
                                console.log(`[${index + 1}번째 행] 유심 가공 결과: ${usimStatus} / 이심: ${esimStatus} (기타/기본값)`);
                            }
                        } else {
                            usimStatus = '유심 구매';
                            esimStatus = 'N';
                            console.log(`[${index + 1}번째 행] 유심 정보 없음 - 기본값: ${usimStatus} / 이심: ${esimStatus}`);
                        }
                        
                        // 대리점별 배송요청 양식 적용
                        let formattedResult = '';
                        
                        if (selectedTelecom === 'SK' && selectedAgency === '나텔') {
                            // SK 나텔 전용 양식: 고객명/전화번호/모델명/색상/주소/유심상태/이심여부/가입유형
                            let joinType = '';
                            const col10Value = row[9]; // 10번열 (0-based index이므로 9)
                            if (col10Value) {
                                joinType = col10Value === '보상기변' ? '기기변경' : col10Value;
                            }
                            formattedResult = `${info['고객명'] || ''} / ${info['전화번호'] || ''} / ${info['모델명'] || ''} / ${info['색상'] || ''} / ${address} / ${usimStatus} / 이심:${esimStatus} / ${joinType}`;
                        } else {
                            // 기본 양식: 고객명/전화번호/모델명/색상/주소/유심상태/이심여부
                            formattedResult = `${info['고객명'] || ''} / ${info['전화번호'] || ''} / ${info['모델명'] || ''} / ${info['색상'] || ''} / ${address} / ${usimStatus} / 이심:${esimStatus}`;
                        }
                        
                        // 최종 가공된 결과값 로깅
                        console.log(`[${index + 1}번째 행] 최종 결과: ${formattedResult}`);
                        console.log('─'.repeat(80)); // 구분선
                        
                        return formattedResult;
                    })
                    .filter(result => result.trim()); // 빈 결과 제외
                
                console.log('배송요청 데이터 추출 완료:', processedData);
                
                // 결과를 textarea에 출력
                const outputTextArea = document.getElementById('outputText');
                if (outputTextArea) {
                    outputTextArea.value = processedData.join('\n');
                }
                
                // 추출 건수 및 성공 메시지를 alert로 표시
                const extractCount = processedData.length;
                alert(`어드민 엑셀파일의 배송준비중 상태인 \n총 ${extractCount}건을 ${selectedTelecom}의 ${selectedAgency} 배송요청 엑셀로 변환 완료. \n다운로드 버튼을 누르세요.`);
                
                // 배송요청양식 다운로드 버튼 표시
                const downloadBtn = document.getElementById('downloadDeliveryBtn');
                if (downloadBtn && processedData.length > 0) {
                    downloadBtn.style.display = 'inline-block';
                    downloadBtn.setAttribute('data-telecom', selectedTelecom);
                    downloadBtn.setAttribute('data-agency', selectedAgency);
                    downloadBtn.setAttribute('data-count', extractCount);
                }
                
            } catch (error) {
                console.error('엑셀 파일 처리 중 오류 발생:', error);
                alert('엑셀 파일 처리 중 오류가 발생했습니다: ' + error.message);
            }
        };
        
        reader.onerror = (error) => {
            console.error('파일 읽기 오류:', error);
            alert('파일을 읽는 중 오류가 발생했습니다.');
        };
        
        reader.readAsBinaryString(file);
    }

    /**
     * 배송요청 엑셀 다운로드 (Static 메서드) - 완전한 대리점별 양식 지원
     */
    static downloadDeliveryExcel() {
        const outputText = document.getElementById('outputText').value;
        const downloadBtn = document.getElementById('downloadDeliveryBtn');
        
        if (!outputText.trim()) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }
        
        // 현재 선택된 통신사와 대리점명 가져오기 (버튼의 data 속성 우선)
        const selectedTelecom = downloadBtn.getAttribute('data-telecom') || 
                              (document.getElementById('telecom') ? document.getElementById('telecom').value : '');
        const selectedAgency = downloadBtn.getAttribute('data-agency') || 
                             (document.getElementById('agency') ? document.getElementById('agency').value : '대리점');
        
        // 현재 날짜 생성
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        // 파일명 생성 (대리점별 다른 형식)
        let fileName = '';
        if (selectedAgency === '나텔') {
            // 나텔은 "(나텔) 배송요청양식 mmdd" 형식 (괄호 뒤 공백 추가)
            fileName = `(나텔) 배송요청양식 ${month}${day}.xlsx`;
        } else if (selectedTelecom === 'SK' && selectedAgency === '삼보(온라인)') {
            // SK 삼보(온라인)은 "삼보 매칭요청 독산 mm-dd" 형식
            fileName = `삼보 매칭요청 독산 ${month}-${day}.xlsx`;
        } else {
            // 다른 대리점은 기존 형식 유지
            const dateString = `${year}${month}${day}`;
            fileName = `${selectedAgency}_${dateString}_배송요청.xlsx`;
        }
        
        try {
            // textarea의 데이터를 행별로 분할
            const rows = outputText.split('\n').filter(row => row.trim());
            
            // 엑셀 데이터 구성
            let excelData = [];
            
            // 대리점별 헤더 구성 (통신사와 대리점 모두 검증)
            if (selectedTelecom === 'SK' && selectedAgency === '나텔') {
                // SK 나텔 전용 헤더
                excelData.push(['이름', '주소', '연락처', '모델명', '색상', '유심', '가입유형', '비고', '일련번호(나텔)', '유심번호(나텔)', '송장번호(나텔)', '비고']);
                // 나텔 양식 데이터 처리
                rows.forEach(row => {
                    const columns = row.split(' / ').map(col => col.trim().replace('이심:', ''));
                    // 나텔 양식에 맞게 데이터 재배열: 고객명/전화번호/모델명/색상/주소/유심상태/이심여부/가입유형
                    // → 이름/주소/연락처/모델명/색상/유심/가입유형/비고/일련번호(나텔)/유심번호(나텔)/송장번호(나텔)/비고
                    
                    const customerName = columns[0] || '';
                    const phoneNumber = columns[1] || '';
                    const modelName = columns[2] || '';
                    const color = columns[3] || '';
                    const address = columns[4] || '';
                    const simStatus = columns[5] || '';
                    const esimStatus = columns[6] || '';
                    const joinType = columns[7] || ''; // 가입유형 (8번째 항목)
                    
                    // 유심 상태 변환 (O/X로만 표시)
                    let simText = '';
                    if (esimStatus === 'Y') {
                        simText = 'X'; // 이심이 Y면 유심 비구매
                    } else if (simStatus.includes('구매')) {
                        simText = 'O';
                    } else if (simStatus.includes('비구매')) {
                        simText = 'X';
                    } else {
                        simText = 'O'; // 기본값
                    }
                    
                    // 비고란 처리 (이심이 Y이고 유심이 X인 경우 "이심" 표시)
                    let memo = '';
                    if (esimStatus === 'Y' && simText === 'X') {
                        memo = '이심';
                    }
                    
                    const reorderedColumns = [
                        customerName, // 이름
                        address, // 주소
                        phoneNumber, // 연락처
                        modelName, // 모델명
                        color, // 색상
                        simText, // 유심 (O/X)
                        joinType, // 가입유형
                        memo, // 비고 (이심 표시)
                        '', // 일련번호(나텔) - 나텔에서 작성
                        '', // 유심번호(나텔) - 나텔에서 작성
                        '', // 송장번호(나텔) - 나텔에서 작성
                        '' // 비고 - 나텔에서 작성
                    ];
                    excelData.push(reorderedColumns);
                });
            } else if (selectedTelecom === 'SK' && (selectedAgency === '삼보(온라인)' || selectedAgency === '삼보/엠디도매')) {
                // SK 삼보 전용 헤더
                excelData.push(['수취인명', '수취인 전화번호', '수취인 이동통신', '수취인 주소', '색상', '주문상품명', '기타', '단말기일련번호']);
                // 삼보 양식 데이터 처리
                rows.forEach(row => {
                    const columns = row.split(' / ').map(col => col.trim().replace('이심:', ''));
                    // 삼보 양식에 맞게 데이터 재배열: 고객명/전화번호/모델명/색상/주소/유심상태/이심여부
                    // → 수취인명/수취인전화번호/수취인이동통신/수취인주소/색상/주문상품명/기타/단말기일련번호
                    
                    const phoneNumber = columns[1] || '';
                    const simStatus = columns[5] || '';
                    const esimStatus = columns[6] || '';
                    
                    // 유심 상태 변환
                    let simText = '';
                    // 이심이 Y인 경우 무조건 유심 비구매로 처리
                    if (esimStatus === 'Y') {
                        simText = '유심X(비구매)';
                    } else if (simStatus.includes('구매')) {
                        simText = '유심O(구매)';
                    } else if (simStatus.includes('비구매')) {
                        simText = '유심X(비구매)';
                    } else {
                        simText = simStatus;
                    }
                    
                    // 단말기일련번호 컬럼 처리 (이심이 Y면 "이심" 표시)
                    let serialNumber = '';
                    if (esimStatus === 'Y') {
                        serialNumber = '이심';
                    }
                    
                    const reorderedColumns = [
                        columns[0] || '', // 수취인명 (고객명)
                        phoneNumber, // 수취인 전화번호 (전화번호)
                        phoneNumber, // 수취인 이동통신 (전화번호와 동일)
                        columns[4] || '', // 수취인 주소 (주소)
                        columns[3] || '', // 색상
                        columns[2] || '', // 주문상품명 (모델명)
                        simText, // 기타 (유심상태 변환)
                        serialNumber // 단말기일련번호 (이심 Y면 "이심")
                    ];
                    excelData.push(reorderedColumns);
                });
            } else {
                // 기본 양식 헤더: 고객명/전화번호/모델명/색상/주소/유심상태/이심여부
                excelData.push(['고객명', '전화번호', '모델명', '색상', '주소', '유심상태', '이심여부']);
                
                // 기본 양식 데이터 처리 (/ 구분, 이심: 제거)
                rows.forEach(row => {
                    const columns = row.split(' / ').map(col => col.trim().replace('이심:', ''));
                    excelData.push(columns);
                });
            }
            
            // 워크북 생성
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);
            
            // 대리점별 스타일링 적용
            ExcelManager.applyExcelStyling(worksheet, excelData, selectedTelecom, selectedAgency);
            
            // 워크시트를 워크북에 추가
            XLSX.utils.book_append_sheet(workbook, worksheet, '배송요청');
            
            // 파일 다운로드
            XLSX.writeFile(workbook, fileName);
            
            console.log(`${selectedTelecom} ${selectedAgency} 엑셀 파일 다운로드 완료: ${fileName}`);
            console.log(`총 ${rows.length}건의 데이터가 포함되었습니다.`);
            
        } catch (error) {
            console.error('엑셀 다운로드 중 오류 발생:', error);
            alert('엑셀 다운로드 중 오류가 발생했습니다: ' + error.message);
        }
    }

    /**
     * 대리점별 엑셀 스타일링 적용 (Static 메서드) - 완전한 실제 스타일링
     */
    static applyExcelStyling(worksheet, excelData, selectedTelecom, selectedAgency) {
        // 대리점별 헤더 스타일링 적용 (통신사와 대리점 모두 검증)
        if (selectedTelecom === 'SK' && selectedAgency === '나텔') {
            // 나텔 전용 스타일링 (12개 컬럼)
            const natelGrayHeaderStyle = {
                fill: { fgColor: { rgb: "D3D3D3" } }, // 회색 배경 (A~G 컬럼)
                font: { sz: 11, bold: true }, // 11pt 폰트, 굵게
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            const natelYellowHeaderStyle = {
                fill: { fgColor: { rgb: "FFFF00" } }, // 노란색 배경 (H~L 컬럼)
                font: { sz: 11, bold: true }, // 11pt 폰트, 굵게
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            const natelDataStyle = {
                font: { sz: 11 }, // 11pt 폰트
                alignment: { horizontal: "center", vertical: "center" }, // 중앙 정렬
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            // 헤더 컬럼 (나텔 12개 컬럼)
            const natelColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
            
            // 헤더 셀에 스타일 적용
            natelColumns.forEach((col, index) => {
                const cellAddress = col + '1';
                if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: excelData[0][index] };
                
                // A~G 컬럼(이름~비고)은 회색, H~L 컬럼(일련번호(나텔)~비고)은 노란색
                if (index <= 6) { // A~G (0~6 인덱스)
                    worksheet[cellAddress].s = natelGrayHeaderStyle;
                } else { // H~L (7~11 인덱스)
                    worksheet[cellAddress].s = natelYellowHeaderStyle;
                }
            });
            
            // 데이터 셀에 스타일 적용 (2행부터)
            for (let row = 2; row <= excelData.length; row++) {
                natelColumns.forEach(col => {
                    const cellAddress = col + row;
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = natelDataStyle;
                    }
                });
            }
        } else if (selectedTelecom === 'SK' && (selectedAgency === '삼보(온라인)' || selectedAgency === '삼보/엠디도매')) {
            // 헤더 스타일 정의
            const yellowHeaderStyle = {
                fill: { fgColor: { rgb: "FFFF00" } }, // 노란색 배경
                font: { sz: 11, bold: true }, // 11pt 폰트, 굵게
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            const grayHeaderStyle = {
                fill: { fgColor: { rgb: "D3D3D3" } }, // 회색 배경
                font: { sz: 11, bold: true }, // 11pt 폰트, 굵게
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            // 일반 데이터 스타일
            const dataStyle = {
                font: { sz: 11 }, // 11pt 폰트
                alignment: { horizontal: "center", vertical: "center" }, // 중앙 정렬
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            // 헤더 셀에 스타일 적용
            const headerColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            headerColumns.forEach((col, index) => {
                const cellAddress = col + '1';
                if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: excelData[0][index] };
                
                // 수취인명부터 주문상품명까지 노란색 (A~F), 나머지는 회색 (G~H)
                if (index <= 5) {
                    worksheet[cellAddress].s = yellowHeaderStyle;
                } else {
                    worksheet[cellAddress].s = grayHeaderStyle;
                }
            });
            
            // 데이터 셀에 스타일 적용 (2행부터)
            for (let row = 2; row <= excelData.length; row++) {
                headerColumns.forEach(col => {
                    const cellAddress = col + row;
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = dataStyle;
                    }
                });
            }
        } else {
            // 기본 양식에도 스타일링 적용
            const basicHeaderStyle = {
                font: { sz: 11, bold: true }, // 11pt 폰트, 굵게
                alignment: { horizontal: "center", vertical: "center" }, // 중앙 정렬
                fill: { fgColor: { rgb: "E6E6FA" } }, // 연한 보라색 배경
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            const basicDataStyle = {
                font: { sz: 11 }, // 11pt 폰트
                alignment: { horizontal: "center", vertical: "center" }, // 중앙 정렬
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
            
            // 헤더 컬럼 (기본 양식 7개 컬럼)
            const basicColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            
            // 헤더 셀에 스타일 적용
            basicColumns.forEach((col, index) => {
                const cellAddress = col + '1';
                if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: excelData[0][index] };
                worksheet[cellAddress].s = basicHeaderStyle;
            });
            
            // 데이터 셀에 스타일 적용 (2행부터)
            for (let row = 2; row <= excelData.length; row++) {
                basicColumns.forEach(col => {
                    const cellAddress = col + row;
                    if (worksheet[cellAddress]) {
                        worksheet[cellAddress].s = basicDataStyle;
                    }
                });
            }
        }
        
        // 컬럼 너비 자동 조정 (텍스트 길이에 맞게)
        const colWidths = [];
        excelData[0].forEach((header, index) => {
            let maxWidth = header ? header.toString().length : 0;
            excelData.forEach(row => {
                if (row[index]) {
                    const cellLength = row[index].toString().length;
                    if (cellLength > maxWidth) {
                        maxWidth = cellLength;
                    }
                }
            });
            // 텍스트 길이에 따라 적절한 너비 설정 (최소 8, 최대 40)
            const adjustedWidth = Math.max(8, Math.min(maxWidth + 3, 40));
            colWidths.push({ wch: adjustedWidth });
        });
        worksheet['!cols'] = colWidths;
        
        // 행 높이 설정 (40으로 고정)
        const rowHeights = [];
        for (let i = 0; i < excelData.length; i++) {
            rowHeights.push({ hpt: 40 }); // 40pt 높이
        }
        worksheet['!rows'] = rowHeights;
        
        console.log(`${selectedTelecom} ${selectedAgency} 엑셀 스타일링 완료`);
    }
} 

// 전역 함수로 노출 (기존 HTML에서 호출하는 함수들)
function downloadDeliveryExcel() {
    ExcelManager.downloadDeliveryExcel();
}

// 엑셀 관련 초기화 함수 (clear 함수에서 호출)
function clearExcelInputs() {
    const excelFile1 = document.getElementById('excelFile');
    const excelFile2 = document.getElementById('excelFile2');
    const downloadBtn = document.getElementById('downloadDeliveryBtn');
    
    if (excelFile1) excelFile1.value = '';
    if (excelFile2) excelFile2.value = '';
    
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
        downloadBtn.removeAttribute('data-telecom');
        downloadBtn.removeAttribute('data-agency');
        downloadBtn.removeAttribute('data-count');
    }
}

// window 객체에 할당
window.downloadDeliveryExcel = downloadDeliveryExcel;
window.clearExcelInputs = clearExcelInputs;

// DOM이 로드되면 ExcelManager 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 ExcelManager 초기화 시작');
    
    // XLSX 라이브러리 확인
    if (typeof XLSX === 'undefined') {
        console.warn('⚠️ XLSX 라이브러리가 아직 로드되지 않았습니다. 잠시 후 다시 확인하겠습니다.');
        
        // 2초 후 재시도
        setTimeout(() => {
            if (typeof XLSX === 'undefined') {
                console.error('❌ XLSX 라이브러리를 찾을 수 없습니다');
            } else {
                console.log('✅ XLSX 라이브러리 로드 확인됨');
                new ExcelManager();
            }
        }, 2000);
    } else {
        console.log('✅ XLSX 라이브러리 이미 로드됨');
        new ExcelManager();
    }
});

console.log('📄 excel-manager.js 파일 로드 완료'); 