# Just To Do

React + TypeScript + Chakra UI로 만든 모바일 반응형 Todo 웹 앱입니다.

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | 19 |
| TypeScript | 6 |
| Chakra UI | 3 |
| Vite | 8 |

## 주요 기능

- **할 일 추가** — 입력창에 내용 작성 후 Enter 키 또는 `+` 버튼으로 추가
- **완료 체크** — 체크박스 클릭으로 완료/미완료 토글
- **인라인 수정** — 수정 버튼 클릭 후 Enter로 저장, Escape로 취소
- **삭제** — 항목별 삭제 버튼
- **완료 항목 일괄 삭제** — 하단 "완료 항목 삭제" 버튼
- **필터** — 전체 / 진행 중 / 완료 탭 전환
- **다크 모드** — 우측 상단 버튼으로 토글, 시스템 설정 자동 감지
- **데이터 영속성** — localStorage에 저장되어 새로고침 후에도 유지
- **모바일 반응형** — 모든 화면 크기에서 동작

## 프로젝트 구조

```
src/
├── types/
│   └── todo.ts              # Todo, FilterType 타입 정의
├── hooks/
│   ├── useTodos.ts          # CRUD, 필터, localStorage 로직
│   └── useColorMode.ts      # 다크/라이트 모드 (시스템 설정 감지 + localStorage 저장)
├── components/
│   ├── TodoInput.tsx        # 입력창 + 추가 버튼
│   ├── TodoItem.tsx         # 체크박스, 인라인 수정, 삭제
│   ├── TodoFilter.tsx       # 전체 / 진행 중 / 완료 필터
│   └── TodoStats.tsx        # 남은 항목 수 + 완료 항목 일괄 삭제
└── App.tsx                  # 전체 레이아웃 조합
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
