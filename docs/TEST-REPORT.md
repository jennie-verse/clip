# Clip 검토 결과 (Test Report)

릴리즈: 2026-09-05 첫 릴리즈 (`APP_BUILD = 2026.09.05-release1`, `sw.js` CACHE = `clip-v1-2026.09.05-release1`)

이 문서는 세 구간으로 나눕니다.
- **통과(Passed)** — 자동 테스트/이 환경에서 직접 확인 완료
- **첫 릴리즈 동작** — 이번에 새로 들어간 fresh-start 데이터 초기화 설명
- **Pending** — 데스크톱 환경에서는 검증 수단이 없어 실기기 확인이 필요함

---

## 통과 (Passed)

### 자동 테스트

`node --test tests/` 실행 결과, `tests/journal.test.cjs`의 11개 테스트 전부 통과.

| 항목 | 결과 |
|---|---|
| journal opt-in은 일반 sync와 독립적이며 기본값 off | ✅ |
| projection에 Clip 레코드 전체가 담기되 인증 데이터는 없음 | ✅ |
| content-off projection의 중립성 및 활동 원장(ledger) 당일 병합 | ✅ |
| redaction이 Clip 본문을 지우고, 백업 원장 복원이 추가적/제한적으로 동작 | ✅ |
| projection 제목 대체(fallback) 및 tombstone의 생성일 유지 | ✅ |
| 모든 주요 Clip 변경 경로가 로컬 저장 이후에만 큐에 들어감 | ✅ |
| Pages 소유권 이전 가능, custom domain에서는 sync 명시적 중단 | ✅ |
| shortcut URL이 현재 배포 경로와 query를 유지 | ✅ |
| merge 시 최신 항목 유지, 더 최신 tombstone이 우선 | ✅ |
| retention이 고정핀 항목은 보존하고 만료된 비고정 항목만 제거 | ✅ |
| 백업 복원이 항목을 교체하고 retention 시계를 리셋하며 삭제 내역을 기록 | ✅ |

전체: 11 tests, 11 pass, 0 fail (duration 약 61ms)

### 수동 확인 (로컬 환경)

| 항목 | 결과 |
|---|---|
| Clips: Paste/Write/카드 탭 복사/검색/핀/편집/전체 보기/메뉴 | ✅ |
| 타입 자동 감지 (url/email/phone/number/long/text) | ✅ |
| `?add=` URL 진입 처리 | ✅ 로컬에서 쿼리 파라미터로 직접 재현 |
| 새로고침 후 데이터 유지 | ✅ |
| JSON 백업 내보내기/복원, CSV 내보내기 | ✅ |
| `sw.js` 캐시 버전과 `app.js`의 `APP_BUILD`가 릴리즈 스탬프로 일치 | ✅ |

---

## 첫 릴리즈 동작 — fresh-start 데이터 초기화

`app.js`의 `runFreshStartReset()`이 앱 시작 시 1회 실행됩니다. `clip.freshStart.v1` 마커가 없으면 이 앱 소유의 localStorage 키만 지우고 마커를 남겨, 이후 실행에서는 다시 지우지 않습니다. 다른 앱/공유 저장소(`shared/v1`) 키에는 영향을 주지 않는 것을 코드로 확인했습니다.

---

## Pending — 실기기에서 확인 필요

| 항목 | 왜 여기서 확인이 안 되는가 |
|---|---|
| **Service Worker 업데이트 반영 (기존 홈 화면 설치본)** | 이번이 첫 릴리즈이므로 실기기에 설치된 이전 버전이 없습니다. 다음 업데이트부터 홈 화면에 이미 추가된 아이콘이 새 `CACHE` 버전으로 정상 전환되는지 실기기에서 확인해야 합니다. |
| **Add to Home Screen / standalone 실행** | `navigator.standalone` 분기는 코드로 확인했지만, 실제 홈 화면 추가 후 Safari/홈 화면 앱 두 실행 모드의 동작은 iPhone/iPad에서 확인이 필요합니다. |
| **iOS 단축어(`?add=`) 실제 연동** | URL 파라미터 처리는 로컬 쿼리로 재현했지만, 실제 iOS 단축어 앱에서 호출되는지는 실기기 확인이 필요합니다. |
| **GitHub 동기화 실제 왕복 (토큰 사용)** | 이번 검토에는 sync 토큰을 넣지 않아 실제 네트워크 요청이 발생하지 않았습니다. 코드 경로만 검증했으며, 실제 API 응답은 Settings → Sync now로 확인해야 합니다. |
| **비행기 모드 완전 오프라인** | 로컬에서 서버를 내려 캐시로 화면이 뜨는 것은 확인했지만, 실제 iOS 비행기 모드·셀룰러 전환은 별도 확인이 필요합니다. |


## 2026-09-08 안정성 개선 검증

- 수정: 저장 실패 시 편집 내용 보존·재시도와 오류 알림 정리, 업데이트 시 기존 Clips 보존.
- 로컬 회귀 검사 및 JavaScript 문법 검사: 통과.
- Chromium 1280×900 / 390×844: 주요 조작, 재시작 후 기존 데이터 보존, 화면·페이지 오류 검사 통과.
- Service Worker를 통한 오프라인 앱 재실행: 통과.
- 실제 iPhone/iPad Safari, iCloud 공유, 실제 비공개 GitHub 데이터 동기화: 실기기 확인 필요.


## 2026-09-08 추가 안정성 검토 (review2)

- 변경: 저장 실패 시 고정·삭제·정리·백업 복원·전체 삭제·설정·동기화 병합을 되돌리고 성공 알림/Journal 발행을 차단. 업로드 중 편집·고정한 항목은 자동 정리에서 보호.
- 검증: 전체 기존 테스트 및 추가 회귀 테스트, JavaScript 구문 검사. 격리된 Chromium에서 데스크톱 1280×900/모바일 390×844 저장·새로고침·실패 복구 검증. Browser plugin not available; bundled Playwright 사용.
- 주입 검증: localStorage 용량 초과 후 데이터 유지 및 삭제 발행 차단.
- 한계: 실제 iPhone Safari/Home Screen 및 개인 계정의 실서버 동기화는 직접 시험하지 않음.
