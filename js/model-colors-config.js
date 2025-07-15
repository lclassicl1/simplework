// 모델별 출시색상 데이터
const MODEL_COLORS = {
    // 아이폰 시리즈
    "아이폰16": ["울트라마린 <span class='color-dot' style='background-color: #1E3A8A;'></span>", "틸 <span class='color-dot' style='background-color: #0F766E;'></span>", "핑크 <span class='color-dot' style='background-color: #F472B6;'></span>", "화이트 <span class='color-dot' style='background-color: #FFFFFF;'></span>", "블랙 <span class='color-dot' style='background-color: #000000;'></span>"],
    "아이폰16플러스": ["울트라 마린 <span class='color-dot' style='background-color: #1E3A8A;'></span>", "틸 <span class='color-dot' style='background-color: #0F766E;'></span>", "핑크 <span class='color-dot' style='background-color: #F472B6;'></span>", "화이트 <span class='color-dot' style='background-color: #FFFFFF;'></span>", "블랙 <span class='color-dot' style='background-color: #000000;'></span>"],
    "아이폰16프로": ["데저트 티타늄 <span class='color-dot' style='background-color: #D2B48C;'></span>", "내추럴 티타늄 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "화이트 티타늄 <span class='color-dot' style='background-color: #F5F5F5;'></span>", "블랙 티타늄 <span class='color-dot' style='background-color: #1F2937;'></span>"],
    "아이폰16프로맥스": ["데저트 티타늄 <span class='color-dot' style='background-color: #D2B48C;'></span>", "내추럴 티타늄 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "화이트 티타늄 <span class='color-dot' style='background-color: #F5F5F5;'></span>", "블랙 티타늄 <span class='color-dot' style='background-color: #1F2937;'></span>"],
    
    // 갤럭시 시리즈
    "갤럭시S24": ["코발트 바이올렛 <span class='color-dot' style='background-color: #7C3AED;'></span>", "앰버 옐로우 <span class='color-dot' style='background-color: #F59E0B;'></span>", "마블 그레이 <span class='color-dot' style='background-color: #6B7280;'></span>", "오닉스 블랙 <span class='color-dot' style='background-color: #1F2937;'></span>"],
    "갤럭시S24+": ["코발트 바이올렛 <span class='color-dot' style='background-color: #7C3AED;'></span>", "앰버 옐로우 <span class='color-dot' style='background-color: #F59E0B;'></span>", "마블 그레이 <span class='color-dot' style='background-color: #6B7280;'></span>", "오닉스 블랙 <span class='color-dot' style='background-color: #1F2937;'></span>"],
    "갤럭시S24울트라": ["티타늄 바이올렛 <span class='color-dot' style='background-color: #7C3AED;'></span>", "티타늄 옐로우 <span class='color-dot' style='background-color: #F59E0B;'></span>", "티타늄 그레이 <span class='color-dot' style='background-color: #6B7280;'></span>", "티타늄 블랙 <span class='color-dot' style='background-color: #1F2937;'></span>"],
    "갤럭시S25": ["실버 쉐도우 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "네이비 <span class='color-dot' style='background-color: #000080;'></span>", "아이스블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "민트 <span class='color-dot' style='background-color: #10B981;'></span>"],
    "갤럭시S25+": ["실버 쉐도우 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "네이비 <span class='color-dot' style='background-color: #000080;'></span>", "아이스블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "민트 <span class='color-dot' style='background-color: #10B981;'></span>"],
    "갤럭시S25울트라": ["티타늄 실버 블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "티타늄 블랙 <span class='color-dot' style='background-color: #000000;'></span>", "티타늄 그레이 <span class='color-dot' style='background-color: #6B7280;'></span>", "티타늄 화이트실버 <span class='color-dot' style='background-color: #F5F5F5;'></span>"],
    "갤럭시S25엣지": ["티타늄 실버 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "티타늄 아이스블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "티타늄 제트블랙 <span class='color-dot' style='background-color: #000000;'></span>"],
    
    
    // 갤럭시 Z 시리즈
    "갤럭시Z폴드7": ["블루 쉐도우 <span class='color-dot' style='background-color: #1E3A8A;'></span>", "실버 쉐도우 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "제트 블랙 <span class='color-dot' style='background-color: #000000;'></span>"],
    "갤럭시Z폴드6": ["핑크 <span class='color-dot' style='background-color: #fab1b1;'></span>", "실버 쉐도우 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "네이비 <span class='color-dot' style='background-color: #000080;'></span>"],
    "갤럭시Z폴드5": ["크림 <span class='color-dot' style='background-color: #FEF3C7;'></span>", "아이스 블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "팬텀 블랙 <span class='color-dot' style='background-color: #000000;'></span>"],
    "갤럭시Z플립7": ["블루 쉐도우 <span class='color-dot' style='background-color: #1E3A8A;'></span>", "제트 블랙 <span class='color-dot' style='background-color: #000000;'></span>", "코랄 레드 <span class='color-dot' style='background-color: #FF6B6B;'></span>"],
    "갤럭시Z플립6": ["블루 <span class='color-dot' style='background-color: #007AFF;'></span>", "실버 쉐도우 <span class='color-dot' style='background-color: #C0C0C0;'></span>", "옐로우 <span class='color-dot' style='background-color: #F59E0B;'></span>", "민트 <span class='color-dot' style='background-color: #10B981;'></span>"],
    "갤럭시Z플립5": ["그래파이트 <span class='color-dot' style='background-color: #374151;'></span>", "크림 <span class='color-dot' style='background-color: #FEF3C7;'></span>", "라벤더 <span class='color-dot' style='background-color: #E879F9;'></span>", "민트 <span class='color-dot' style='background-color: #10B981;'></span>"],
    
    // 갤럭시 A 시리즈
    "갤럭시A16": ["라이트 그린 <span class='color-dot' style='background-color: #90EE90;'></span>", "블랙 <span class='color-dot' style='background-color: #000000;'></span>", "라이트 그레이 <span class='color-dot' style='background-color: #D3D3D3;'></span>"],
    "갤럭시퀀텀5": ["어썸 네이비 <span class='color-dot' style='background-color: #000080;'></span>", "어썸 아이스블루 <span class='color-dot' style='background-color: #87CEEB;'></span>", "어썸 라일락 <span class='color-dot' style='background-color: #E6E6FA;'></span>", "어썸 레몬 <span class='color-dot' style='background-color: #FFFACD;'></span>"],

    //갤럭시 M 시리즈
    "갤럭시와이드8": ["블랙 <span class='color-dot' style='background-color: #000000;'></span>", "라이트 핑크 <span class='color-dot' style='background-color: #FFB6C1;'></span>", "라이트 그린 <span class='color-dot' style='background-color: #90EE90;'></span>"]
    
};

 