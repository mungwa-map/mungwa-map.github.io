// ===== 상세 지도 데이터 =====
// 각 지역 클릭 시 표시되는 SVG 상세 지도 (구/군 경계, 하천, 산, 랜드마크, 작품 위치)
// viewBox: 0 0 400 500

const DETAIL_MAPS = {

  // ================================================================
  // 서울특별시
  // ================================================================
  seoul: {
    viewBox: '0 0 400 500',
    districts: [
      // 북쪽 ~ 북서
      {
        name: '은평구',
        path: 'M 60,70 L 110,58 L 130,80 L 120,115 L 80,120 L 58,100 Z',
        labelX: 88, labelY: 95
      },
      {
        name: '서대문구',
        path: 'M 110,58 L 155,52 L 170,75 L 155,100 L 130,100 L 120,115 L 80,120 L 95,95 Z',
        labelX: 128, labelY: 83
      },
      {
        name: '종로구',
        path: 'M 155,52 L 215,48 L 235,65 L 220,90 L 190,95 L 170,90 L 155,75 Z',
        labelX: 193, labelY: 73
      },
      {
        name: '중구',
        path: 'M 190,95 L 220,90 L 235,110 L 220,130 L 195,128 L 175,115 Z',
        labelX: 204, labelY: 112
      },
      {
        name: '성북구',
        path: 'M 215,48 L 270,45 L 285,70 L 270,95 L 235,95 L 220,90 L 235,65 Z',
        labelX: 252, labelY: 73
      },
      {
        name: '동대문구',
        path: 'M 235,95 L 270,95 L 280,120 L 260,135 L 235,130 L 220,130 L 235,110 Z',
        labelX: 254, labelY: 115
      },
      {
        name: '용산구',
        path: 'M 155,100 L 175,115 L 195,128 L 220,130 L 215,155 L 185,165 L 155,155 L 140,130 Z',
        labelX: 181, labelY: 140
      },
      {
        name: '마포구',
        path: 'M 80,120 L 120,115 L 130,100 L 155,100 L 140,130 L 125,155 L 85,155 L 65,138 Z',
        labelX: 107, labelY: 133
      },
      {
        name: '영등포구',
        path: 'M 65,138 L 85,155 L 90,185 L 65,198 L 42,185 L 40,158 Z',
        labelX: 64, labelY: 172
      },
      {
        name: '강서구',
        path: 'M 30,118 L 65,108 L 80,120 L 65,138 L 40,158 L 20,145 L 18,128 Z',
        labelX: 46, labelY: 132
      },
      {
        name: '서초구',
        path: 'M 155,155 L 185,165 L 215,155 L 240,170 L 245,210 L 210,230 L 165,225 L 145,200 L 148,170 Z',
        labelX: 193, labelY: 193
      },
      {
        name: '강남구',
        path: 'M 215,155 L 260,148 L 290,165 L 295,205 L 270,230 L 245,235 L 245,210 L 240,170 Z',
        labelX: 262, labelY: 192
      },
      {
        name: '송파구',
        path: 'M 260,148 L 310,145 L 335,175 L 330,215 L 295,225 L 270,230 L 295,205 L 290,165 Z',
        labelX: 303, labelY: 188
      },
      {
        name: '관악구',
        path: 'M 90,185 L 115,178 L 145,182 L 148,200 L 145,228 L 110,240 L 78,228 L 68,205 Z',
        labelX: 112, labelY: 210
      }
    ],
    rivers: [
      {
        // 한강 — 서→동 (y≈240 선)
        name: '한강',
        path: 'M 18,248 C 60,240 120,235 180,242 C 240,250 300,248 360,242 C 390,238 400,236 400,236',
        labelX: 190, labelY: 233
      },
      {
        // 청계천 — 종로 남쪽
        name: '청계천',
        path: 'M 120,160 C 160,155 200,152 240,158 C 270,162 300,168 330,175',
        labelX: 218, labelY: 148
      }
    ],
    mountains: [
      { name: '북한산', x: 140, y: 55 },
      { name: '남산',   x: 195, y: 128 },
      { name: '인왕산', x: 138, y: 68 },
      { name: '관악산', x: 100, y: 225 }
    ],
    landmarks: [
      { name: '경복궁',  x: 175, y: 72 },
      { name: '광화문',  x: 185, y: 82 },
      { name: '서울역',  x: 163, y: 125 },
      { name: '명동',    x: 205, y: 138 }
    ],
    workPositions: {
      'lit-1': { x: 115, y: 72 },   // 서시 — 연희동·서대문구
      'lit-2': { x: 210, y: 62 },   // 날개 — 종로 미쓰코시
      'lit-3': { x: 225, y: 118 }   // 서울 1964년 겨울 — 중구·종로
    }
  },

  // ================================================================
  // 대구광역시
  // ================================================================
  daegu: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '북구',
        path: 'M 110,60 L 200,52 L 260,58 L 270,100 L 240,125 L 190,130 L 140,125 L 108,100 Z',
        labelX: 188, labelY: 93
      },
      {
        name: '동구',
        path: 'M 200,52 L 280,42 L 340,70 L 350,140 L 310,165 L 270,160 L 240,125 L 260,58 Z',
        labelX: 290, labelY: 105
      },
      {
        name: '중구',
        path: 'M 140,125 L 190,130 L 240,125 L 255,165 L 230,185 L 190,188 L 155,178 L 138,155 Z',
        labelX: 192, labelY: 158
      },
      {
        name: '서구',
        path: 'M 72,110 L 108,100 L 140,125 L 138,155 L 118,175 L 85,170 L 62,148 Z',
        labelX: 100, labelY: 143
      },
      {
        name: '남구',
        path: 'M 138,155 L 155,178 L 190,188 L 230,185 L 240,215 L 205,235 L 165,230 L 135,210 L 125,182 Z',
        labelX: 183, labelY: 207
      },
      {
        name: '수성구',
        path: 'M 240,125 L 270,160 L 310,165 L 330,210 L 295,250 L 255,255 L 230,230 L 240,215 L 230,185 L 255,165 Z',
        labelX: 283, labelY: 200
      },
      {
        name: '달서구',
        path: 'M 62,148 L 85,170 L 118,175 L 125,182 L 135,210 L 110,240 L 68,248 L 40,220 L 38,178 Z',
        labelX: 82, labelY: 205
      }
    ],
    rivers: [
      {
        // 신천 — 북→남 (x≈200 부근)
        name: '신천',
        path: 'M 220,55 C 218,100 215,150 210,200 C 207,240 200,280 195,320',
        labelX: 225, labelY: 180
      },
      {
        // 금호강 — 북구 상단 동→서
        name: '금호강',
        path: 'M 60,88 C 110,78 170,72 230,70 C 280,68 330,72 370,82',
        labelX: 188, labelY: 68
      }
    ],
    mountains: [
      { name: '팔공산', x: 195, y: 58 },
      { name: '앞산',   x: 188, y: 228 }
    ],
    landmarks: [
      { name: '서문시장', x: 148, y: 158 },
      { name: '동성로',   x: 200, y: 158 }
    ],
    workPositions: {
      'lit-26': { x: 200, y: 160 }   // 빼앗긴 들에도 봄은 오는가 — 중구
    }
  },

  // ================================================================
  // 광주광역시
  // ================================================================
  gwangju: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '북구',
        path: 'M 80,55 L 200,45 L 300,55 L 315,130 L 270,150 L 210,155 L 155,148 L 100,140 L 78,100 Z',
        labelX: 195, labelY: 100
      },
      {
        name: '동구',
        path: 'M 155,148 L 210,155 L 270,150 L 280,210 L 250,240 L 200,248 L 160,238 L 145,195 Z',
        labelX: 210, labelY: 200
      },
      {
        name: '서구',
        path: 'M 78,140 L 100,140 L 155,148 L 145,195 L 130,230 L 88,240 L 58,215 L 55,175 Z',
        labelX: 103, labelY: 190
      },
      {
        name: '남구',
        path: 'M 130,230 L 145,195 L 160,238 L 200,248 L 210,285 L 175,308 L 138,298 L 118,268 Z',
        labelX: 165, labelY: 268
      },
      {
        name: '광산구',
        path: 'M 30,128 L 78,100 L 78,140 L 55,175 L 58,215 L 35,230 L 12,210 L 10,162 Z',
        labelX: 42, labelY: 170
      }
    ],
    rivers: [
      {
        // 영산강 — 광산구 ~ 서구 통과
        name: '영산강',
        path: 'M 10,190 C 42,185 75,182 108,178 C 140,175 165,170 192,172 C 215,174 235,180 255,188',
        labelX: 120, labelY: 168
      }
    ],
    mountains: [
      { name: '무등산', x: 300, y: 100 }
    ],
    landmarks: [
      { name: '전남도청',  x: 215, y: 218 },
      { name: '5·18광장', x: 200, y: 232 }
    ],
    workPositions: {
      'lit-19': { x: 210, y: 215 }   // 소년이 온다 — 동구 전남도청
    }
  },

  // ================================================================
  // 부산광역시
  // ================================================================
  busan: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '북구',
        path: 'M 70,55 L 175,48 L 210,70 L 195,110 L 145,118 L 90,112 L 65,88 Z',
        labelX: 137, labelY: 85
      },
      {
        name: '동래구',
        path: 'M 175,48 L 255,42 L 285,72 L 270,110 L 230,120 L 195,110 L 210,70 Z',
        labelX: 235, labelY: 85
      },
      {
        name: '해운대구',
        path: 'M 255,42 L 330,38 L 368,75 L 360,130 L 320,148 L 280,140 L 270,110 L 285,72 Z',
        labelX: 318, labelY: 95
      },
      {
        name: '부산진구',
        path: 'M 90,112 L 145,118 L 195,110 L 230,120 L 225,165 L 185,180 L 140,175 L 98,158 Z',
        labelX: 163, labelY: 148
      },
      {
        name: '동구',
        path: 'M 185,180 L 225,165 L 250,185 L 245,225 L 215,240 L 185,228 L 170,205 Z',
        labelX: 213, labelY: 208
      },
      {
        name: '중구',
        path: 'M 140,195 L 170,205 L 185,228 L 170,252 L 145,258 L 120,245 L 115,218 Z',
        labelX: 148, labelY: 228
      },
      {
        name: '영도구',
        path: 'M 120,268 L 148,258 L 172,268 L 178,308 L 155,338 L 118,332 L 100,305 L 102,278 Z',
        labelX: 140, labelY: 305
      },
      {
        name: '남구',
        path: 'M 185,228 L 215,240 L 245,258 L 248,298 L 218,325 L 180,318 L 165,285 L 170,255 Z',
        labelX: 208, labelY: 282
      },
      {
        name: '사하구',
        path: 'M 55,195 L 98,158 L 140,175 L 140,215 L 120,245 L 88,268 L 55,255 L 38,225 Z',
        labelX: 88, labelY: 215
      }
    ],
    rivers: [
      {
        // 낙동강 — 서쪽 경계
        name: '낙동강',
        path: 'M 28,42 C 30,90 32,150 35,210 C 38,260 42,310 48,355',
        labelX: 14, labelY: 200
      },
      {
        // 수영강 — 해운대쪽
        name: '수영강',
        path: 'M 310,48 C 305,90 298,130 290,165 C 284,195 278,220 272,248',
        labelX: 318, labelY: 148
      }
    ],
    mountains: [
      { name: '금정산', x: 130, y: 60 }
    ],
    landmarks: [
      { name: '부산역',   x: 158, y: 210 },
      { name: '광복동',   x: 145, y: 238 },
      { name: '영도다리', x: 148, y: 262 }
    ],
    workPositions: {
      'lit-27': { x: 155, y: 230 }   // 광장 — 중구·원도심·영도
    }
  },

  // ================================================================
  // 울산광역시
  // ================================================================
  ulsan: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '북구',
        path: 'M 145,45 L 255,38 L 310,72 L 300,130 L 250,145 L 195,138 L 148,120 L 132,80 Z',
        labelX: 222, labelY: 95
      },
      {
        name: '중구',
        path: 'M 132,120 L 195,138 L 250,145 L 258,198 L 220,220 L 175,218 L 145,195 L 130,162 Z',
        labelX: 195, labelY: 180
      },
      {
        name: '동구',
        path: 'M 250,145 L 300,130 L 340,160 L 348,220 L 315,258 L 275,260 L 258,222 L 258,198 Z',
        labelX: 305, labelY: 200
      },
      {
        name: '남구',
        path: 'M 145,195 L 175,218 L 220,220 L 258,222 L 265,275 L 230,308 L 185,310 L 150,285 L 132,248 Z',
        labelX: 200, labelY: 262
      },
      {
        name: '울주군',
        path: 'M 42,92 L 132,80 L 148,120 L 130,162 L 132,248 L 100,288 L 58,298 L 28,262 L 18,195 L 22,130 Z',
        labelX: 78, labelY: 192
      }
    ],
    rivers: [
      {
        // 태화강 — 울주군 서쪽에서 동쪽 남구로
        name: '태화강',
        path: 'M 38,210 C 80,205 130,202 178,205 C 220,208 255,215 285,225',
        labelX: 155, labelY: 198
      }
    ],
    mountains: [
      { name: '영남알프스', x: 52, y: 155 },
      { name: '문수산',     x: 148, y: 252 }
    ],
    landmarks: [
      { name: '처용암',   x: 75, y: 278 },
      { name: '울산항',   x: 322, y: 235 },
      { name: '태화강역', x: 185, y: 225 }
    ],
    workPositions: {
      'lit-28': { x: 75, y: 278 }   // 처용가 — 울주군 처용암
    }
  },

  // ================================================================
  // 인천광역시
  // ================================================================
  incheon: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '부평구',
        path: 'M 168,55 L 248,48 L 275,85 L 258,125 L 208,130 L 168,115 L 155,80 Z',
        labelX: 215, labelY: 92
      },
      {
        name: '계양구',
        path: 'M 82,48 L 168,55 L 155,80 L 140,110 L 100,115 L 68,98 L 62,70 Z',
        labelX: 112, labelY: 82
      },
      {
        name: '서구',
        path: 'M 52,108 L 100,115 L 140,110 L 168,115 L 165,165 L 138,195 L 90,200 L 48,178 L 38,145 Z',
        labelX: 102, labelY: 158
      },
      {
        name: '중구',
        path: 'M 48,200 L 90,200 L 120,215 L 118,258 L 88,278 L 52,268 L 32,245 L 35,218 Z',
        labelX: 76, labelY: 240
      },
      {
        name: '동구',
        path: 'M 120,215 L 165,205 L 195,222 L 192,260 L 162,278 L 130,272 L 118,252 Z',
        labelX: 156, labelY: 248
      },
      {
        name: '남동구',
        path: 'M 165,165 L 208,155 L 258,162 L 270,215 L 248,255 L 208,265 L 170,258 L 150,225 L 158,192 Z',
        labelX: 210, labelY: 212
      },
      {
        name: '연수구',
        path: 'M 150,258 L 170,258 L 208,265 L 215,308 L 188,338 L 152,330 L 130,300 L 132,272 Z',
        labelX: 174, labelY: 300
      }
    ],
    rivers: [
      {
        // 경인 아라뱃길 (서→동)
        name: '아라뱃길',
        path: 'M 28,158 C 65,152 108,148 148,148 C 185,148 218,150 248,152',
        labelX: 138, labelY: 142
      }
    ],
    mountains: [
      { name: '계양산', x: 112, y: 78 }
    ],
    landmarks: [
      { name: '차이나타운', x: 75, y: 248 },
      { name: '월미도',     x: 38, y: 268 },
      { name: '인천항',     x: 60, y: 275 }
    ],
    workPositions: {}
  },

  // ================================================================
  // 대전광역시
  // ================================================================
  daejeon: {
    viewBox: '0 0 400 500',
    districts: [
      {
        name: '유성구',
        path: 'M 42,55 L 158,45 L 195,78 L 188,145 L 138,162 L 85,155 L 45,130 L 30,90 Z',
        labelX: 113, labelY: 108
      },
      {
        name: '서구',
        path: 'M 42,140 L 85,155 L 138,162 L 148,215 L 120,248 L 72,252 L 38,228 L 28,185 Z',
        labelX: 85, labelY: 200
      },
      {
        name: '중구',
        path: 'M 138,162 L 188,155 L 228,168 L 238,218 L 210,248 L 168,252 L 148,228 L 148,215 Z',
        labelX: 188, labelY: 208
      },
      {
        name: '동구',
        path: 'M 188,145 L 258,135 L 308,162 L 315,225 L 285,258 L 238,262 L 225,228 L 238,218 L 228,168 Z',
        labelX: 262, labelY: 200
      },
      {
        name: '대덕구',
        path: 'M 158,45 L 248,38 L 310,72 L 308,140 L 258,148 L 195,145 L 188,145 L 195,78 Z',
        labelX: 255, labelY: 100
      }
    ],
    rivers: [
      {
        // 갑천 — 유성구→서구 남쪽
        name: '갑천',
        path: 'M 100,48 C 105,90 108,135 110,175 C 112,210 115,240 118,268',
        labelX: 88, labelY: 155
      },
      {
        // 대전천 — 중구 동쪽
        name: '대전천',
        path: 'M 218,80 C 215,120 212,162 210,200 C 208,228 206,255 205,278',
        labelX: 228, labelY: 145
      }
    ],
    mountains: [
      { name: '계족산', x: 275, y: 78 },
      { name: '보문산', x: 195, y: 255 }
    ],
    landmarks: [
      { name: '대전역',   x: 242, y: 198 },
      { name: '엑스포과학공원', x: 130, y: 138 }
    ],
    workPositions: {}
  },

  // ================================================================
  // 세종특별자치시
  // ================================================================
  sejong: {
    viewBox: '0 0 400 500',
    districts: [
      // 세종시는 구 없이 읍·면 단위
      {
        name: '조치원읍',
        path: 'M 145,55 L 230,48 L 258,88 L 240,130 L 185,138 L 148,120 L 132,85 Z',
        labelX: 193, labelY: 95
      },
      {
        name: '연기면',
        path: 'M 148,130 L 185,138 L 240,145 L 252,190 L 220,218 L 172,215 L 145,188 L 138,158 Z',
        labelX: 192, labelY: 178
      },
      {
        name: '전동면',
        path: 'M 240,145 L 305,138 L 338,175 L 325,225 L 282,242 L 248,232 L 238,200 L 252,190 Z',
        labelX: 290, labelY: 192
      },
      {
        name: '금남면',
        path: 'M 80,155 L 138,145 L 145,188 L 130,228 L 92,242 L 60,225 L 52,192 Z',
        labelX: 98, labelY: 198
      },
      {
        name: '소정면',
        path: 'M 58,88 L 132,85 L 148,120 L 138,145 L 80,155 L 48,132 L 38,105 Z',
        labelX: 92, labelY: 118
      }
    ],
    rivers: [
      {
        // 금강 — 서쪽에서 중앙 관통
        name: '금강',
        path: 'M 18,195 C 55,185 95,178 138,175 C 180,172 222,172 262,178 C 298,184 332,192 365,202',
        labelX: 185, labelY: 165
      }
    ],
    mountains: [
      { name: '전월산', x: 215, y: 268 }
    ],
    landmarks: [
      { name: '세종청사',  x: 185, y: 205 },
      { name: '조치원역', x: 192, y: 105 }
    ],
    workPositions: {}
  },

  // ================================================================
  // 세분화 지역 (시·군)
  // ================================================================

  chuncheon: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '춘천시내', path: 'M140,170 L260,165 L270,250 L250,300 L145,305 L130,240Z', labelX: 200, labelY: 240 },
      { name: '신북읍', path: 'M100,40 L300,35 L290,120 L260,165 L140,170 L110,125Z', labelX: 200, labelY: 100 },
      { name: '동면', path: 'M260,165 L370,130 L380,280 L270,250Z', labelX: 325, labelY: 210 },
      { name: '남면', path: 'M130,305 L250,300 L260,400 L180,430 L110,390Z', labelX: 190, labelY: 365 },
      { name: '서면', path: 'M20,140 L110,125 L140,170 L130,240 L145,305 L110,390 L30,350 L15,220Z', labelX: 72, labelY: 260 },
      { name: '신동면', path: 'M250,300 L380,280 L395,420 L260,400Z', labelX: 320, labelY: 355 }
    ],
    rivers: [
      { name: '소양강', path: 'M340,50 C300,100 270,140 240,200 C220,240 200,280 180,330', labelX: 290, labelY: 110 },
      { name: '북한강', path: 'M20,300 C80,310 140,280 200,290 C260,300 300,320 360,340', labelX: 100, labelY: 295 }
    ],
    mountains: [
      { name: '봉의산', x: 215, y: 215 },
      { name: '삼악산', x: 200, y: 450 }
    ],
    landmarks: [
      { name: '소양댐', x: 290, y: 135 },
      { name: '남이섬', x: 170, y: 440 },
      { name: '춘천역', x: 195, y: 265 },
      { name: '김유정역', x: 310, y: 340 }
    ],
    workPositions: { 'lit-5': { x: 330, y: 370 } }
  },

  bongpyeong: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '봉평면', path: 'M120,150 L280,145 L290,260 L125,265Z', labelX: 200, labelY: 210 },
      { name: '평창읍', path: 'M80,310 L280,305 L290,420 L75,425Z', labelX: 180, labelY: 370 },
      { name: '대화면', path: 'M15,100 L120,150 L125,265 L80,310 L20,280Z', labelX: 65, labelY: 210 },
      { name: '진부면', path: 'M280,145 L385,140 L380,305 L280,305Z', labelX: 330, labelY: 225 },
      { name: '용평면', path: 'M280,30 L385,25 L385,140 L280,145Z', labelX: 330, labelY: 90 }
    ],
    rivers: [
      { name: '흥정천', path: 'M180,80 C190,140 200,200 195,260 C190,320 185,380 180,440', labelX: 215, labelY: 160 }
    ],
    mountains: [
      { name: '오대산', x: 350, y: 250 },
      { name: '발왕산', x: 330, y: 55 }
    ],
    landmarks: [
      { name: '봉평장터', x: 180, y: 190 },
      { name: '이효석문학관', x: 220, y: 220 },
      { name: '용평리조트', x: 340, y: 75 }
    ],
    workPositions: { 'lit-4': { x: 200, y: 200 } }
  },

  gangneung: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '강릉시내', path: 'M140,140 L310,130 L320,250 L300,290 L145,295 L130,230Z', labelX: 225, labelY: 220 },
      { name: '주문진읍', path: 'M200,20 L330,15 L340,130 L310,130 L200,135Z', labelX: 268, labelY: 80 },
      { name: '성산면', path: 'M20,100 L140,140 L130,230 L25,200Z', labelX: 78, labelY: 165 },
      { name: '옥계면', path: 'M130,340 L300,330 L310,460 L120,465Z', labelX: 215, labelY: 400 },
      { name: '왕산면', path: 'M20,250 L130,230 L145,295 L130,340 L120,465 L25,460Z', labelX: 72, labelY: 370 }
    ],
    rivers: [
      { name: '남대천', path: 'M60,220 C100,230 160,240 220,250 C280,260 320,265 370,270', labelX: 130, labelY: 225 }
    ],
    mountains: [{ name: '대관령', x: 55, y: 140 }],
    landmarks: [
      { name: '경포대', x: 310, y: 165 },
      { name: '오죽헌', x: 280, y: 190 },
      { name: '정동진', x: 335, y: 350 }
    ],
    workPositions: { 'lit-29': { x: 305, y: 175 } }
  },

  gyeongju: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '경주시내', path: 'M130,160 L270,155 L280,270 L135,275Z', labelX: 205, labelY: 220 },
      { name: '안강읍', path: 'M100,40 L270,35 L270,155 L130,160Z', labelX: 185, labelY: 100 },
      { name: '감포읍', path: 'M270,155 L380,120 L390,290 L280,270Z', labelX: 335, labelY: 210 },
      { name: '외동읍', path: 'M100,330 L280,325 L290,440 L95,445Z', labelX: 190, labelY: 385 },
      { name: '건천읍', path: 'M20,110 L100,40 L130,160 L135,275 L100,330 L25,300Z', labelX: 70, labelY: 210 },
      { name: '양북면', path: 'M270,35 L380,30 L380,120 L270,155Z', labelX: 325, labelY: 80 }
    ],
    rivers: [
      { name: '형산강', path: 'M15,180 C80,190 150,200 220,210 C280,218 340,225 400,230', labelX: 95, labelY: 188 }
    ],
    mountains: [
      { name: '토함산', x: 340, y: 170 },
      { name: '남산', x: 200, y: 300 }
    ],
    landmarks: [
      { name: '불국사', x: 315, y: 195 },
      { name: '석굴암', x: 350, y: 155 },
      { name: '대릉원', x: 200, y: 195 },
      { name: '동리목월문학관', x: 230, y: 250 }
    ],
    workPositions: { 'lit-11': { x: 205, y: 230 }, 'lit-12': { x: 255, y: 225 } }
  },

  andong: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '안동시내', path: 'M130,160 L270,155 L280,280 L135,285Z', labelX: 200, labelY: 225 },
      { name: '풍천면', path: 'M15,120 L130,160 L135,285 L100,340 L20,310Z', labelX: 70, labelY: 240 },
      { name: '도산면', path: 'M270,40 L385,35 L380,200 L270,155Z', labelX: 325, labelY: 120 },
      { name: '예안면', path: 'M270,155 L380,200 L375,340 L280,280Z', labelX: 328, labelY: 260 },
      { name: '임하면', path: 'M135,285 L280,280 L290,420 L130,425Z', labelX: 210, labelY: 355 }
    ],
    rivers: [
      { name: '낙동강', path: 'M20,160 C80,180 160,195 230,200 C300,205 350,210 400,215', labelX: 120, labelY: 180 }
    ],
    mountains: [{ name: '학가산', x: 50, y: 160 }],
    landmarks: [
      { name: '하회마을', x: 55, y: 270 },
      { name: '도산서원', x: 330, y: 100 },
      { name: '이육사문학관', x: 310, y: 130 }
    ],
    workPositions: { 'lit-30': { x: 325, y: 115 } }
  },

  hadong: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '하동읍', path: 'M120,280 L280,275 L290,380 L115,385Z', labelX: 200, labelY: 335 },
      { name: '화개면', path: 'M100,40 L260,35 L250,150 L90,155Z', labelX: 175, labelY: 100 },
      { name: '악양면', path: 'M90,155 L250,150 L260,275 L120,280Z', labelX: 175, labelY: 220 },
      { name: '청암면', path: 'M260,35 L385,60 L380,280 L280,275 L250,150Z', labelX: 320, labelY: 170 },
      { name: '금남면', path: 'M115,385 L290,380 L300,470 L110,475Z', labelX: 205, labelY: 430 }
    ],
    rivers: [
      { name: '섬진강', path: 'M30,30 C35,100 40,180 50,260 C55,330 60,400 65,470', labelX: 25, labelY: 200 }
    ],
    mountains: [{ name: '지리산', x: 170, y: 55 }],
    landmarks: [
      { name: '화개장터', x: 160, y: 120 },
      { name: '최참판댁', x: 155, y: 200 },
      { name: '쌍계사', x: 200, y: 80 }
    ],
    workPositions: { 'lit-20': { x: 175, y: 215 } }
  },

  tongyeong: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '통영시내', path: 'M110,130 L280,125 L290,240 L270,280 L115,285 L100,230Z', labelX: 195, labelY: 210 },
      { name: '광도면', path: 'M80,30 L310,25 L280,125 L110,130Z', labelX: 195, labelY: 80 },
      { name: '미륵도', path: 'M130,330 L270,325 L285,440 L125,445Z', labelX: 200, labelY: 390 },
      { name: '산양읍', path: 'M15,200 L100,230 L115,285 L90,350 L20,340Z', labelX: 60, labelY: 280 },
      { name: '용남면', path: 'M270,280 L380,260 L375,380 L270,325Z', labelX: 325, labelY: 320 }
    ],
    rivers: [],
    mountains: [{ name: '미륵산', x: 200, y: 350 }],
    landmarks: [
      { name: '강구안', x: 190, y: 200 },
      { name: '동피랑', x: 220, y: 180 },
      { name: '유치환기념관', x: 240, y: 220 }
    ],
    workPositions: { 'lit-21': { x: 250, y: 245 } }
  },

  gunsan: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '군산시내', path: 'M120,150 L280,145 L290,270 L125,275Z', labelX: 200, labelY: 215 },
      { name: '옥서면', path: 'M15,130 L120,150 L125,275 L80,310 L20,290Z', labelX: 65, labelY: 220 },
      { name: '성산면', path: 'M280,145 L385,140 L380,310 L290,270Z', labelX: 335, labelY: 225 },
      { name: '나포면', path: 'M120,310 L290,305 L300,430 L115,435Z', labelX: 205, labelY: 375 },
      { name: '옥도면', path: 'M30,350 L120,310 L125,275 L80,310Z', labelX: 78, labelY: 330 }
    ],
    rivers: [
      { name: '금강', path: 'M0,70 C80,65 180,60 280,55 C340,52 370,50 400,48', labelX: 200, labelY: 50 }
    ],
    mountains: [],
    landmarks: [
      { name: '내항', x: 150, y: 170 },
      { name: '채만식문학관', x: 230, y: 200 },
      { name: '근대역사박물관', x: 180, y: 195 }
    ],
    workPositions: { 'lit-14': { x: 185, y: 178 } }
  },

  namwon: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '남원시내', path: 'M110,160 L260,155 L270,280 L115,285Z', labelX: 188, labelY: 225 },
      { name: '운봉읍', path: 'M260,40 L380,35 L370,155 L260,155Z', labelX: 318, labelY: 100 },
      { name: '산내면', path: 'M260,155 L370,155 L380,310 L270,280Z', labelX: 322, labelY: 235 },
      { name: '주천면', path: 'M15,120 L110,160 L115,285 L80,350 L20,330Z', labelX: 62, labelY: 240 },
      { name: '인월면', path: 'M270,280 L380,310 L375,440 L260,420Z', labelX: 325, labelY: 370 }
    ],
    rivers: [
      { name: '요천', path: 'M100,120 C140,170 180,220 200,280 C215,330 225,380 230,440', labelX: 135, labelY: 165 }
    ],
    mountains: [{ name: '지리산', x: 340, y: 180 }],
    landmarks: [
      { name: '광한루', x: 180, y: 200 },
      { name: '춘향테마파크', x: 210, y: 230 }
    ],
    workPositions: { 'lit-15': { x: 195, y: 215 } }
  },

  gochang: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '고창읍', path: 'M120,140 L270,135 L280,260 L125,265Z', labelX: 200, labelY: 200 },
      { name: '상하면', path: 'M110,310 L280,305 L290,420 L105,425Z', labelX: 195, labelY: 370 },
      { name: '아산면', path: 'M15,110 L120,140 L125,265 L110,310 L20,290Z', labelX: 65, labelY: 210 },
      { name: '신림면', path: 'M270,135 L385,130 L380,305 L280,260Z', labelX: 330, labelY: 220 },
      { name: '무장면', path: 'M20,290 L110,310 L105,425 L30,440Z', labelX: 65, labelY: 370 }
    ],
    rivers: [],
    mountains: [{ name: '선운산', x: 60, y: 350 }],
    landmarks: [
      { name: '고창읍성', x: 190, y: 180 },
      { name: '선운사', x: 75, y: 380 },
      { name: '서정주생가', x: 220, y: 210 }
    ],
    workPositions: { 'lit-16': { x: 215, y: 200 } }
  },

  beolgyo: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '벌교읍', path: 'M160,150 L300,145 L310,270 L165,275Z', labelX: 235, labelY: 215 },
      { name: '순천시내', path: 'M15,100 L160,150 L165,275 L120,320 L20,290Z', labelX: 85, labelY: 210 },
      { name: '별량면', path: 'M300,145 L390,140 L385,310 L310,270Z', labelX: 345, labelY: 230 },
      { name: '낙안면', path: 'M120,320 L280,315 L290,430 L115,435Z', labelX: 200, labelY: 380 },
      { name: '조례동', path: 'M20,290 L120,320 L115,435 L25,430Z', labelX: 68, labelY: 375 }
    ],
    rivers: [
      { name: '벌교천', path: 'M230,100 C235,160 238,220 240,280 C242,340 244,400 245,460', labelX: 260, labelY: 160 }
    ],
    mountains: [{ name: '조계산', x: 50, y: 145 }],
    landmarks: [
      { name: '소화다리', x: 235, y: 195 },
      { name: '벌교홍교', x: 260, y: 220 },
      { name: '순천만', x: 300, y: 400 },
      { name: '낙안읍성', x: 195, y: 365 }
    ],
    workPositions: { 'lit-17': { x: 215, y: 195 }, 'lit-18': { x: 250, y: 250 } }
  },

  mokpo: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '목포시내', path: 'M130,130 L280,125 L290,250 L135,255Z', labelX: 208, labelY: 195 },
      { name: '용당동', path: 'M280,125 L380,160 L370,290 L290,250Z', labelX: 330, labelY: 215 },
      { name: '산정동', path: 'M100,40 L280,35 L280,125 L130,130Z', labelX: 190, labelY: 85 },
      { name: '하당동', path: 'M120,300 L290,295 L300,400 L115,405Z', labelX: 205, labelY: 355 },
      { name: '유달동', path: 'M20,120 L130,130 L135,255 L120,300 L25,280Z', labelX: 72, labelY: 210 }
    ],
    rivers: [],
    mountains: [{ name: '유달산', x: 65, y: 180 }],
    landmarks: [
      { name: '목포근대역사관', x: 200, y: 170 },
      { name: '해상케이블카', x: 75, y: 230 }
    ],
    workPositions: { 'lit-31': { x: 210, y: 185 } }
  },

  okcheon: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '옥천읍', path: 'M120,160 L280,155 L290,280 L125,285Z', labelX: 200, labelY: 225 },
      { name: '청성면', path: 'M80,30 L300,25 L280,155 L120,160Z', labelX: 190, labelY: 95 },
      { name: '군서면', path: 'M15,130 L120,160 L125,285 L80,340 L20,320Z', labelX: 65, labelY: 240 },
      { name: '이원면', path: 'M280,155 L385,130 L380,320 L290,280Z', labelX: 335, labelY: 235 },
      { name: '안남면', path: 'M80,340 L290,330 L300,460 L75,465Z', labelX: 188, labelY: 400 }
    ],
    rivers: [
      { name: '금강', path: 'M10,200 C60,205 120,210 180,215 C240,220 300,225 400,230', labelX: 50, labelY: 198 }
    ],
    mountains: [{ name: '장룡산', x: 340, y: 180 }],
    landmarks: [
      { name: '정지용생가', x: 195, y: 205 },
      { name: '정지용문학관', x: 220, y: 235 }
    ],
    workPositions: { 'lit-6': { x: 205, y: 215 } }
  },

  buyeo: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '부여읍', path: 'M110,150 L260,145 L270,270 L115,275Z', labelX: 188, labelY: 215 },
      { name: '규암면', path: 'M15,120 L110,150 L115,275 L80,330 L20,310Z', labelX: 60, labelY: 230 },
      { name: '석성면', path: 'M260,145 L380,140 L375,310 L270,270Z', labelX: 322, labelY: 230 },
      { name: '초촌면', path: 'M80,330 L270,320 L280,440 L75,445Z', labelX: 178, labelY: 385 },
      { name: '임천면', path: 'M270,270 L375,310 L370,440 L280,440 L270,320Z', labelX: 325, labelY: 370 }
    ],
    rivers: [
      { name: '백마강', path: 'M50,40 C55,100 60,170 65,230 C70,290 75,360 80,440', labelX: 35, labelY: 180 }
    ],
    mountains: [{ name: '부소산', x: 90, y: 155 }],
    landmarks: [
      { name: '정림사지', x: 190, y: 195 },
      { name: '궁남지', x: 210, y: 240 },
      { name: '낙화암', x: 80, y: 185 }
    ],
    workPositions: { 'lit-10': { x: 195, y: 210 } }
  },

  yangpyeong: {
    viewBox: '0 0 400 500',
    districts: [
      { name: '양평읍', path: 'M140,160 L270,155 L280,280 L145,285Z', labelX: 208, labelY: 225 },
      { name: '서종면', path: 'M15,120 L140,160 L145,285 L100,340 L20,310Z', labelX: 75, labelY: 235 },
      { name: '용문면', path: 'M270,155 L385,150 L380,320 L280,280Z', labelX: 330, labelY: 240 },
      { name: '지평면', path: 'M280,280 L380,320 L375,450 L270,420Z', labelX: 330, labelY: 375 },
      { name: '강상면', path: 'M100,340 L270,330 L270,420 L95,425Z', labelX: 182, labelY: 380 }
    ],
    rivers: [
      { name: '남한강', path: 'M0,380 C80,375 160,365 240,370 C320,375 360,380 400,385', labelX: 200, labelY: 362 }
    ],
    mountains: [{ name: '용문산', x: 350, y: 195 }],
    landmarks: [
      { name: '소나기마을', x: 80, y: 210 },
      { name: '용문사', x: 340, y: 230 },
      { name: '세미원', x: 155, y: 265 }
    ],
    workPositions: { 'lit-25': { x: 85, y: 220 } }
  },

  jeju: {
    viewBox: '0 0 400 450',
    districts: [
      { name: '제주시', path: 'M40,50 L360,45 L355,175 L45,180Z', labelX: 200, labelY: 120 },
      { name: '서귀포시', path: 'M45,265 L355,260 L360,400 L40,405Z', labelX: 200, labelY: 340 },
      { name: '한림읍', path: 'M15,50 L40,50 L45,180 L45,265 L40,405 L15,400Z', labelX: 30, labelY: 230 },
      { name: '성산읍', path: 'M355,45 L390,50 L385,400 L360,400 L355,260 L355,175Z', labelX: 373, labelY: 230 },
      { name: '조천읍', path: 'M250,45 L355,45 L355,175 L250,180Z', labelX: 305, labelY: 115 }
    ],
    rivers: [],
    mountains: [{ name: '한라산', x: 200, y: 220 }],
    landmarks: [
      { name: '성산일출봉', x: 378, y: 200 },
      { name: '천지연폭포', x: 195, y: 370 },
      { name: '4·3평화공원', x: 270, y: 130 }
    ],
    workPositions: { 'lit-23': { x: 265, y: 115 }, 'lit-24': { x: 200, y: 350 } }
  }

};
