# Just To Do

React + TypeScript + Chakra UI로 만든 모바일 반응형 Todo 웹 앱입니다.

**배포 주소:** https://just-to-do-henna.vercel.app/

## 컨셉

> "더 많이 하게 만드는 앱이 아니라, 덜 하게 만드는 앱"

할 일을 무조건 많이 처리하는 것이 아니라, **지금 나의 에너지 상태에 맞게** 적절한 할 일을 골라 완료하는 경험을 만들고자 했습니다.

오늘 지쳐있다면 쉬운 것 하나만 해도 충분하고, 집중이 잘 되는 날엔 깊은 작업에 에너지를 쏟을 수 있도록 합니다.

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | 19 |
| TypeScript | 6 |
| Chakra UI | 3 |
| Vite | 8 |

## 주요 기능

### 에너지 기반 추천
- **컨디션 선택** — 😵‍💫 지침 / 😐 보통 / 🔥 집중됨 중 오늘 상태를 선택
- **오늘 모드** — 선택한 에너지에 맞게 "지금 하면 좋은 것", "부담 없는 것", "미뤄도 되는 것"으로 분류해서 보여줌
- **과부하 방지** — 할 일이 많아도 오늘 집중할 개수를 에너지에 따라 제한

### 할 일 관리
- **추가 / 완료 / 수정 / 삭제** — 기본 CRUD
- **난이도 · 예상 시간 · 집중도 설정** — 할 일에 메타 정보를 추가해 추천 정확도를 높임
- **하위 할 일** — 각 할 일 아래에 하위 항목을 무한 depth로 추가 가능. 큰 작업을 잘게 쪼개서 시작 부담을 줄임
- **드래그 앤 드롭** — 순서 변경 및 다른 항목의 하위로 이동 가능
- **필터** — 전체 / 진행 중 / 완료 탭 전환
- **완료 항목 일괄 삭제**

### 기타
- **연속 완료 스트릭** — 매일 할 일을 완료하면 🔥 연속 일수 표시
- **온보딩** — 최초 실행 시 앱 사용법을 단계별로 안내
- **다크 모드** — 토글 버튼으로 전환
- **데이터 영속성** — localStorage에 저장되어 새로고침 후에도 유지
- **모바일 반응형** — 모든 화면 크기에서 동작

## 배포

소규모 개인 프로젝트이고 별도 백엔드가 없는 정적 앱이라 **Vercel**을 선택했습니다. GitHub 연동 후 `main` 브랜치 푸시 시 자동 배포됩니다.

## 프로젝트 구조

```
src/
├── types/
│   ├── todo.ts              # Todo, TaskMeta, FilterType 타입
│   ├── energy.ts            # EnergyLevel, ENERGY_CONFIG, ScoredTodo 타입
│   └── handlers.ts          # TreeHandlers 타입
├── hooks/
│   ├── useTodos.ts          # 트리 구조 CRUD, 필터, localStorage
│   ├── useEnergy.ts         # 에너지 상태 관리
│   ├── useStreak.ts         # 연속 완료 스트릭 추적
│   └── useColorMode.ts      # 다크/라이트 모드
├── lib/
│   └── recommendation.ts    # 에너지 기반 추천 엔진 (순수 함수)
├── components/
│   ├── Onboarding.tsx       # 최초 실행 온보딩 (6단계)
│   ├── EnergySelector.tsx   # 에너지 상태 선택 버튼
│   ├── TodayView.tsx        # 오늘 모드 추천 뷰
│   ├── TaskCard.tsx         # 추천 할 일 카드
│   ├── TodoInput.tsx        # 할 일 입력창 + MetaInput
│   ├── MetaInput.tsx        # 난이도·시간·집중도 입력
│   ├── TodoList.tsx         # 트리 목록 + 드래그 앤 드롭
│   ├── TodoItem.tsx         # 할 일 단일 항목 (수정·삭제·하위 추가)
│   ├── TodoFilter.tsx       # 필터 탭
│   └── TodoStats.tsx        # 통계 + 완료 항목 일괄 삭제
└── App.tsx                  # 전체 레이아웃
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```
