// ===== 지역 설정 (17개 시·도) =====
const REGIONS = {
  seoul: {
    id: 'seoul',
    name: '서울특별시',
    shortName: '서울',
    description: '근현대 문학의 중심지. 수많은 시인과 소설가들이 이곳에서 작품 활동을 했다.'
  },
  gyeonggi: {
    id: 'gyeonggi',
    name: '경기도',
    shortName: '경기',
    description: '수도를 둘러싼 넓은 들녘. 소나기가 내리던 양평, 실학의 고장 수원.'
  },
  incheon: {
    id: 'incheon',
    name: '인천광역시',
    shortName: '인천',
    description: '바다와 하늘을 잇는 관문. 개항의 역사가 서린 항구 도시.'
  },
  gangwon: {
    id: 'gangwon',
    name: '강원특별자치도',
    shortName: '강원',
    description: '산과 자연이 빚어낸 서정의 고장. 메밀꽃과 동백꽃의 무대.'
  },
  chungbuk: {
    id: 'chungbuk',
    name: '충청북도',
    shortName: '충북',
    description: '내륙의 고요한 문학 정원. 정지용의 향수가 시작된 곳.'
  },
  sejong: {
    id: 'sejong',
    name: '세종특별자치시',
    shortName: '세종',
    description: '새로운 행정수도. 금강이 흐르는 미래의 도시.'
  },
  chungnam: {
    id: 'chungnam',
    name: '충청남도',
    shortName: '충남',
    description: '충절과 낭만이 흐르는 문학의 터전.'
  },
  daejeon: {
    id: 'daejeon',
    name: '대전광역시',
    shortName: '대전',
    description: '과학과 교통의 도시. 한밭에서 피어나는 문화.'
  },
  gyeongbuk: {
    id: 'gyeongbuk',
    name: '경상북도',
    shortName: '경북',
    description: '천년 고도의 이야기. 신라의 땅에서 피어난 문학.'
  },
  daegu: {
    id: 'daegu',
    name: '대구광역시',
    shortName: '대구',
    description: '분지의 뜨거운 열정. 저항 문학과 근대의 기억.'
  },
  jeonbuk: {
    id: 'jeonbuk',
    name: '전북특별자치도',
    shortName: '전북',
    description: '판소리와 한의 문학이 살아 숨 쉬는 곳.'
  },
  gwangju: {
    id: 'gwangju',
    name: '광주광역시',
    shortName: '광주',
    description: '민주와 예술의 도시. 5월의 기억을 품은 문학의 성지.'
  },
  jeonnam: {
    id: 'jeonnam',
    name: '전라남도',
    shortName: '전남',
    description: '남도의 정서와 역사가 깃든 문학의 고향.'
  },
  ulsan: {
    id: 'ulsan',
    name: '울산광역시',
    shortName: '울산',
    description: '고래와 바다의 도시. 처용의 전설이 살아 있는 곳.'
  },
  gyeongnam: {
    id: 'gyeongnam',
    name: '경상남도',
    shortName: '경남',
    description: '바다와 강이 만나는 곳, 대하소설의 무대.'
  },
  busan: {
    id: 'busan',
    name: '부산광역시',
    shortName: '부산',
    description: '피란의 기억과 바다의 낭만이 공존하는 항구 도시.'
  },
  jeju: {
    id: 'jeju',
    name: '제주특별자치도',
    shortName: '제주',
    description: '바람과 돌과 바다의 섬. 아픈 역사를 품은 문학의 섬.'
  }
};

// ===== 문학 작품 데이터 =====
const LITERARY_DATA = [
  // ── 서울 ──
  {
    id: 'lit-1',
    region: 'seoul',
    title: '서시',
    author: '윤동주',
    year: 1941,
    genre: '시',
    location: '서울 연희동 (연세대학교)',
    excerpt: '죽는 날까지 하늘을 우러러\n한 점 부끄럼이 없기를,\n잎새에 이는 바람에도\n나는 괴로워했다.',
    description: '윤동주 시인이 연희전문학교 재학 시절 쓴 대표작. 식민지 시대 지식인의 양심과 자기 성찰을 담았다. 연세대학교 캠퍼스에는 윤동주 시비와 기념관이 있다.'
  },
  {
    id: 'lit-2',
    region: 'seoul',
    title: '날개',
    author: '이상',
    year: 1936,
    genre: '소설',
    location: '서울 종로 일대',
    excerpt: '박제가 되어 버린 천재를 아시오?',
    description: '이상이 경성(서울) 종로 일대를 배경으로 쓴 심리 소설. 미쓰코시 백화점(현 신세계백화점) 옥상에서의 유명한 결말 — "날개야 다시 돋아라" — 이 인상적이다.'
  },
  {
    id: 'lit-3',
    region: 'seoul',
    title: '서울, 1964년 겨울',
    author: '김승옥',
    year: 1965,
    genre: '소설',
    location: '서울 종로 · 명동',
    excerpt: '1960년대 겨울밤, 서울 거리에서 우연히 만난 세 남자의 하룻밤.',
    description: '산업화 시대 서울의 소외와 고독을 감각적 문체로 그려낸 한국 모더니즘 소설의 대표작. 동인문학상 수상작.'
  },

  // ── 경기 ──
  {
    id: 'lit-25',
    region: 'gyeonggi',
    title: '소나기',
    author: '황순원',
    year: 1953,
    genre: '소설',
    location: '양평',
    excerpt: '소녀가 개울가에서 세수를 하고 있었다.',
    description: '소년과 소녀의 짧고 아름다운 만남을 그린 단편의 걸작. 양평군에 황순원문학촌 소나기마을이 있다.'
  },

  // ── 강원도 ──
  {
    id: 'lit-4',
    region: 'gangwon',
    title: '메밀꽃 필 무렵',
    author: '이효석',
    year: 1936,
    genre: '소설',
    location: '평창 봉평',
    excerpt: '산허리는 온통 메밀밭이어서 피기 시작한 꽃이 소금을 뿌린 듯이 흐붓한 달빛에 숨이 막힐 지경이다.',
    description: '봉평 장터를 배경으로 장돌뱅이의 인생과 인연을 서정적으로 그린 단편. 봉평에는 이효석문학관과 메밀꽃 축제가 매년 열린다.'
  },
  {
    id: 'lit-5',
    region: 'gangwon',
    title: '동백꽃',
    author: '김유정',
    year: 1936,
    genre: '소설',
    location: '춘천 실레마을',
    excerpt: '그리고 뒤에서 따라오던 점순이가 나의 등을 떠밀었다.\n나는 그대로 노란 동백꽃 속으로 폭 파묻혀 버렸다.',
    description: '춘천을 배경으로 시골 소년소녀의 순박한 사랑을 해학적으로 그린 단편. 춘천 실레마을에 김유정문학촌이 있다.'
  },

  // ── 충청북도 ──
  {
    id: 'lit-6',
    region: 'chungbuk',
    title: '향수',
    author: '정지용',
    year: 1927,
    genre: '시',
    location: '옥천',
    excerpt: '넓은 벌 동쪽 끝으로\n옛이야기 지줄대는 실개천이 회돌아 나가고,\n얼룩백이 황소가\n해설피 금빛 게으른 울음을 우는 곳',
    description: '정지용 시인의 고향 옥천의 풍경을 그린 시. 한국인이 가장 사랑하는 시 중 하나로, 옥천에 정지용문학관이 있다.'
  },
  {
    id: 'lit-7',
    region: 'chungbuk',
    title: '관촌수필',
    author: '이문구',
    year: 1977,
    genre: '소설',
    location: '보은 관촌',
    excerpt: '산업화 시대에 사라져가는 충북 농촌 마을의 사계절과 사람들.',
    description: '산업화 시대에 사라져가는 농촌 공동체의 모습을 토속적인 언어로 기록한 연작 소설. 보은군 관촌이 실제 배경이다.'
  },

  // ── 충청남도 ──
  {
    id: 'lit-8',
    region: 'chungnam',
    title: '님의 침묵',
    author: '한용운',
    year: 1926,
    genre: '시',
    location: '공주 · 부여',
    excerpt: '님은 갔습니다.\n아아, 사랑하는 나의 님은 갔습니다.\n푸른 산빛을 깨치고 단풍나무 숲을 향하여 난\n작은 길을 걸어서, 차마 떨치고 갔습니다.',
    description: '만해 한용운의 대표 시집. "님"에 대한 그리움은 조국 독립에 대한 염원으로도 읽힌다. 충남 공주 마곡사 등지에서 수행하며 집필했다.'
  },
  {
    id: 'lit-9',
    region: 'chungnam',
    title: '상록수',
    author: '심훈',
    year: 1935,
    genre: '소설',
    location: '당진',
    excerpt: '농촌 계몽 운동에 헌신하는 두 청년의 사랑과 희생.',
    description: '실제 농촌 계몽 운동가 최용신을 모델로 한 소설. 심훈이 당진 필경사에서 집필했으며, 당진에 심훈기념관이 있다.'
  },
  {
    id: 'lit-10',
    region: 'chungnam',
    title: '껍데기는 가라',
    author: '신동엽',
    year: 1967,
    genre: '시',
    location: '부여',
    excerpt: '껍데기는 가라.\n사월도 알맹이만 남고\n껍데기는 가라.',
    description: '4·19 혁명의 정신을 노래한 참여시의 대표작. 부여 출신 신동엽 시인의 저항 정신이 담겨 있다.'
  },

  // ── 경상북도 ──
  {
    id: 'lit-11',
    region: 'gyeongbuk',
    title: '무녀도',
    author: '김동리',
    year: 1936,
    genre: '소설',
    location: '경주',
    excerpt: '무당 모화와 기독교인 아들 사이의 신앙 갈등.',
    description: '토착 신앙과 외래 종교의 충돌을 통해 한국적 정체성을 탐구한 작품. 경주의 토속적 분위기가 배경이다.'
  },
  {
    id: 'lit-12',
    region: 'gyeongbuk',
    title: '나그네',
    author: '박목월',
    year: 1946,
    genre: '시',
    location: '경주',
    excerpt: '강나루 건너서\n밀밭 길을\n구름에 달 가듯이\n가는 나그네',
    description: '한국 자연시의 대표작. 경주 출신 박목월 시인이 그린 향토적 서정의 극치.'
  },
  {
    id: 'lit-13',
    region: 'gyeongbuk',
    title: '승무',
    author: '조지훈',
    year: 1940,
    genre: '시',
    location: '영양',
    excerpt: '얇은 사 하이얀 고깔은\n고이 접어서 나빌레라.',
    description: '승무하는 여인의 모습을 한국적 미의식으로 형상화한 시. 영양 출신 조지훈의 전통미 탐구가 돋보인다.'
  },

  // ── 대구 ──
  {
    id: 'lit-26',
    region: 'daegu',
    title: '빼앗긴 들에도 봄은 오는가',
    author: '이상화',
    year: 1926,
    genre: '시',
    location: '대구 중구',
    excerpt: '지금은 남의 땅 — 빼앗긴 들에도 봄은 오는가?',
    description: '일제강점기 저항시의 대표작. 대구 출신 이상화 시인의 고택이 대구 중구에 보존되어 있다.'
  },

  // ── 전라북도 ──
  {
    id: 'lit-14',
    region: 'jeonbuk',
    title: '탁류',
    author: '채만식',
    year: 1938,
    genre: '소설',
    location: '군산',
    excerpt: '금강 하구 군산을 배경으로 식민지 시대 조선인의 삶을 그린 장편.',
    description: '일제강점기 군산의 사회상을 통해 식민지 현실을 풍자한 리얼리즘 소설. 군산 근대역사박물관 근처가 소설의 무대이다.'
  },
  {
    id: 'lit-15',
    region: 'jeonbuk',
    title: '혼불',
    author: '최명희',
    year: 1996,
    genre: '소설',
    location: '남원',
    excerpt: '조선 말기 남원 양반가의 며느리 삶을 통해 한국 여성의 역사를 조명한 대하소설.',
    description: '17년간 집필된 전 10권의 대하소설. 남원의 풍습과 언어를 정밀하게 기록한 한국어의 보고(寶庫)로 평가된다.'
  },
  {
    id: 'lit-16',
    region: 'jeonbuk',
    title: '국화 옆에서',
    author: '서정주',
    year: 1948,
    genre: '시',
    location: '고창',
    excerpt: '한 송이의 국화꽃을 피우기 위해\n봄부터 소쩍새는\n그렇게 울었나 보다.',
    description: '미당 서정주의 대표작. 꽃 한 송이에 담긴 시간과 인고를 노래했다. 고창에 미당시문학관이 있다.'
  },

  // ── 광주 ──
  {
    id: 'lit-19',
    region: 'gwangju',
    title: '소년이 온다',
    author: '한강',
    year: 2014,
    genre: '소설',
    location: '광주',
    excerpt: '1980년 5월 광주, 열다섯 살 소년의 눈으로 본 그날의 기록.',
    description: '5·18 광주민주화운동을 다룬 소설. 노벨문학상 수상 작가 한강이 광주의 아픔을 문학으로 승화시킨 작품.'
  },

  // ── 전라남도 ──
  {
    id: 'lit-17',
    region: 'jeonnam',
    title: '태백산맥',
    author: '조정래',
    year: 1989,
    genre: '소설',
    location: '보성 벌교',
    excerpt: '해방 후 좌우 이념 대립의 비극을 벌교를 중심으로 그린 대하소설.',
    description: '전 10권의 대하소설로, 여순사건부터 6·25전쟁까지를 다룬다. 벌교에 태백산맥문학관이 있으며 소설 속 장소들을 탐방할 수 있다.'
  },
  {
    id: 'lit-18',
    region: 'jeonnam',
    title: '무진기행',
    author: '김승옥',
    year: 1964,
    genre: '소설',
    location: '순천 (무진)',
    excerpt: '안개의 도시 무진으로 떠나는 한 남자의 내면 여행.',
    description: '안개로 가득한 가상의 도시 "무진"을 배경으로 한 모더니즘 소설의 걸작. 무진의 모델은 순천·벌교 일대로 알려져 있다.'
  },

  // ── 울산 ──
  {
    id: 'lit-28',
    region: 'ulsan',
    title: '처용가',
    author: '작자 미상',
    year: 879,
    genre: '향가',
    location: '울산 개운포',
    excerpt: '서라벌 달 밝은 밤에\n밤들이 노닐다가\n들어와 자리를 보니\n다리가 넷이로구나.',
    description: '신라 헌강왕 때의 향가. 처용이 울산 개운포에서 나타났다는 삼국유사의 기록이 전한다. 울산의 처용문화제가 이를 기념한다.'
  },

  // ── 경상남도 ──
  {
    id: 'lit-20',
    region: 'gyeongnam',
    title: '토지',
    author: '박경리',
    year: 1994,
    genre: '소설',
    location: '하동 악양',
    excerpt: '구한말부터 해방까지, 하동 평사리를 배경으로 펼쳐지는 민족의 대서사시.',
    description: '전 16권, 26년간 집필된 한국 문학 최대의 대하소설. 하동 악양면에 토지문학관과 최참판댁이 복원되어 있다.'
  },
  {
    id: 'lit-21',
    region: 'gyeongnam',
    title: '깃발',
    author: '유치환',
    year: 1936,
    genre: '시',
    location: '통영',
    excerpt: '이것은 소리 없는 아우성.\n저 푸른 해원(海原)을 향하여 흔드는\n영원한 노스탤지어의 손수건.',
    description: '통영 출신 청마 유치환의 대표작. 바다를 바라보며 쓴 이 시는 한국 서정시의 정수로 꼽힌다.'
  },
  {
    id: 'lit-22',
    region: 'gyeongnam',
    title: '마당 깊은 집',
    author: '김원일',
    year: 1988,
    genre: '소설',
    location: '김해 진영',
    excerpt: '전쟁 후 피난민들이 모여 사는 마당 깊은 집, 한 소년의 성장기.',
    description: '6·25 전쟁 직후 진영의 한 대가족 집을 배경으로, 전쟁이 남긴 상처와 삶의 회복을 그린 성장소설.'
  },

  // ── 부산 ──
  {
    id: 'lit-27',
    region: 'busan',
    title: '광장',
    author: '최인훈',
    year: 1961,
    genre: '소설',
    location: '부산항',
    excerpt: '그는 남쪽도 아니고, 북쪽도 아닌 제삼국을 택했다.',
    description: '남북 분단의 비극을 지식인의 내면으로 그린 관념 소설. 주인공이 부산항에서 중립국행 배를 타는 장면은 분단 문학의 상징이다.'
  },

  // ── 제주도 ──
  {
    id: 'lit-23',
    region: 'jeju',
    title: '순이 삼촌',
    author: '현기영',
    year: 1978,
    genre: '소설',
    location: '제주',
    excerpt: '제주 4·3 사건의 비극을 한 마을의 기억을 통해 증언한 소설.',
    description: '4·3 사건을 정면으로 다룬 최초의 소설. 발표 당시 작가가 연행될 정도로 금기시되던 역사를 문학으로 기록했다.'
  },
  {
    id: 'lit-24',
    region: 'jeju',
    title: '이어도',
    author: '이청준',
    year: 1974,
    genre: '소설',
    location: '제주 바다',
    excerpt: '제주 바다 너머 전설의 섬 이어도를 찾아 떠나는 이야기.',
    description: '제주 해녀들 사이에 전해지는 전설의 섬 이어도를 소재로, 이상향에 대한 인간의 갈망을 그린 소설.'
  }
];
