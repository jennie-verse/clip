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


## 2026-11-12 폴더블(iPhone Duo)·Mac 최적화 (foldable1)

- 변경: 화면 폭 기준 레이아웃(760px 이상에서 카드 2열·추가 버튼 2열, 시트 폭 정리), 가장자리 당김 방지(overscroll), 더블탭 지연 제거(touch-action), Mac 전용 hover 표시와 `/` 키로 검색 이동. 저장 데이터·키·동기화 형식·색상은 그대로. 빌드 표시와 캐시 이름은 `2026.11.12-foldable1`로 통일.
- 검증: 기존 테스트 + 새 레이아웃 테스트(`tests/layout.test.cjs`)와 JavaScript 구문 검사 통과. Chromium(Playwright) 360×780 / 840×760 / 1000×700 / 1440×900에서 메인·설정 화면 가로 넘침 없음, 1000→360 폭 변경 후에도 넘침 없음. 콘솔의 404 한 건은 이 저장소 밖 `../shared/` 파일(로컬 서버에는 없음)로 기존과 동일.
- 한계: 실제 iPhone Duo 접기/펼치기 확인은 사용자가 quill 앱에서만 했고, 이 앱(Clip)은 아직 실기기 확인이 필요합니다.

## 2026-11-12 폴더블 2차 조정: 실측 크기 반영 (foldable2)
- 실측: 접은 세로 466x678, 펼친 세로 669x951(주 사용), 펼친 가로 951x669. 1차의 760px 기준은 669px을 놓쳐서, 펼친 세로에서 폰 배치로 보였습니다.
- 변경: 카드 2열·Paste/Write 2열·가운데 정렬 시트(폭 상한)를 "태블릿 세로" 구간 `(min-width: 640px) and (min-height: 560px)`로 이동. 높이 조건 덕분에 접은 가로 678x466은 폰 배치를 유지합니다. Clip에는 사이드 레일·분할 화면(넓은 구간)이 원래 없어 그대로 둘 규칙이 없습니다. 고정/스티키 바는 이미 safe-area 여백을 더하고 있어 수정하지 않았습니다. 빌드/캐시 이름은 `2026.11.12-foldable2`.
- 확인: `node --test tests/*.test.cjs` 16개 통과, `node --check app.js`/`sw.js` 통과. Playwright로 466x678, 678x466, 669x951, 951x669, 1440x900에서 메인·설정 화면 가로 넘침 없음, 콘솔 오류는 404 하나뿐(자원 1개, 앱 동작 무관).
- 실기기 확인 필요: 클립이 있는 상태의 카드 2열 모습(스크린샷은 빈 상태), 큰 safe-area 여백(위 ~82px)에서의 헤더·시트, 접은/펼친 전환.

## 2026-11-13 위쪽 안전영역 수정 (foldable3)
- 문제: 시뮬레이션한 위쪽 안전영역 82px에서 아래쪽 시트(설정 등 키 큰 시트)의 머리글이 상태바 영역(예: 669x951에서 y=57)까지 올라갔습니다.
- 수정: `.sheet`의 `max-height`를 `min(94%, calc(100% - var(--sat)))`로 제한. 안전영역이 0이면 기존 94%와 같습니다. 빌드/캐시 이름 `2026.11.12-foldable3`.
- 확인: 안전영역 82/34px을 대입한 사본에서 5개 크기의 모든 시트·메뉴·확인창·토스트를 측정. 실기기는 확인하지 않았습니다.

## 2026-11-17 Duo 전체 점검 (`2026.11.17-duocheck1`)

- 문제: 시트 머리줄(Cancel/Save/Close)의 좌우 여백이 고정 12px라, 접힌 가로(678×466)에서 안전영역 안으로 들어왔습니다.
- 수정: 시트 머리줄 좌우 여백을 `max(12px, var(--sar/--sal))`로 바꿨습니다(세로 화면은 변화 없음). 빌드/캐시 이름 `clip-v1-2026.11.17-duocheck1`.
- 검증: `node --test tests/*.test.cjs` 18/18(회귀 테스트 1개 추가), `node --check app.js sw.js` 통과. 클립 14개(고정 3, 한글·긴 URL·이메일·전화·긴 글 포함)를 채운 상태로 접힘 세로·펼침 세로(카드 2열)·펼침 가로의 목록·검색·카드 메뉴·Write·Settings를 확인했습니다. Playwright(Chromium)로 접힘 세로 466×678·접힘 가로 678×466·펼침 세로 669×951·펼침 가로 951×669·Mac 1440×900에 안전영역(세로 위 82/아래 34px, 가로 좌우 59~82px 가정)을 넣고 각 화면의 주요 버튼(삭제·파일 선택 제외, 앱당 최대 14개)을 하나씩 눌러 가로 넘침·겹침·안전영역 침범·콘솔 오류를 측정했고, 글자 크기 6px·17px에서도 확인했습니다.
- 한계: 이 환경에는 iPhone Duo(WebKit) 실기기가 없어 Chromium으로만 확인했습니다. 가로 안전영역 값은 실측하지 않은 가정값입니다. 실기기에서 접기/펼치기와 가로 화면을 한 번씩 확인해 주세요.

## 2026-11-19 단축어(Shortcuts) 붙여넣기 오류 수정 (`2026.11.19-shortcutpaste1`)

- 증상: 단축어를 실행해 Clip이 열리면 `Could not read the clipboard. Paste it below instead.` 알림과 빈 Write 시트가 뜨고, 아무것도 저장되지 않았습니다.
- 확인한 단축어: iCloud 링크의 단축어 `clip`은 **클립보드 가져오기(Get Clipboard)** → **클립보드에 복사(Copy to Clipboard)** → **URL 열기(Open URLs)** `https://jennie-verse.github.io/clip/?paste=1` 세 동작이었고, 앱 안의 안내와 정확히 같은 구조였습니다. 단축어 쪽에는 고칠 곳이 없었습니다.
- 원인: `?paste=1`로 열리면 앱이 페이지가 로드되자마자 `navigator.clipboard.readText()`를 불렀습니다. iOS(WebKit)는 사용자 탭(제스처) 밖에서 클립보드를 읽으려는 호출을 즉시 거부하고, 탭 안에서도 iOS의 **Paste** 확인 말풍선을 눌러야만 읽게 해 줍니다([WebKit: Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/)). 단축어가 주소를 여는 순간에는 사용자의 탭이 없으므로, 이 자동 읽기는 iOS에서 성공할 수 없는 구조였습니다. 첫 릴리즈의 Pending 목록(실제 단축어 연동은 실기기 확인 필요)에 있던 부분이 그대로 드러난 것입니다.
- 수정: `?paste=1`로 열리면 읽으려 하지 않고 **Paste 시트**(버튼 하나)를 엽니다. 사용자가 버튼을 탭하면 그 탭 안에서 `readText()`를 즉시 호출하고(그 앞에 `await` 없음), iOS의 Paste 말풍선을 누르면 저장됩니다. 말풍선을 닫으면 시트가 열린 채 다시 누르라는 안내가 뜨고, 클립보드에 글이 없으면 그 사실을 시트에 알려 줍니다. 기존 단축어는 **다시 만들 필요가 없습니다**. 메인 화면의 Paste from clipboard 버튼, `?add=` 진입, 저장 데이터·키는 그대로입니다.
- 안내 정정: 설정(Settings) → Shortcut와 How to make one의 "클립보드를 직접 읽어 탭 한 번에 저장" 설명이 사실과 달라서 고쳤습니다(두 번 탭이 필요한 이유, 기존 단축어 유지 방법, 탭 없는 `?add=` 방식의 한계 포함). `docs/USER-GUIDE-KO.md` 5장도 `?add=`만 안내하던 내용을 현재 방식으로 다시 썼습니다.
- 재현: 배포돼 있던 `2026.11.17-duocheck1`을, WebKit 규칙(탭 밖 읽기 즉시 거부 · 탭 안은 Paste 확인 뒤 허용)을 흉내 낸 Chromium에서 `?paste=1`로 열었더니 사용자가 보내 주신 화면(빈 Write 시트 + 같은 문구의 알림)이 그대로 나왔고, `readText()`는 탭 밖(`gesture: false`)에서 불렸습니다.
- 검증:
  - `node --test tests/*.test.cjs` 29/29 통과(기존 18 + 신규 `tests/shortcut.test.cjs` 11). 원래 버그를 되살린 복사본에서는 신규 테스트 8개가 실패하는 것을 확인했습니다(테스트가 실제로 버그를 잡습니다). `node --check app.js sw.js` 통과.
  - Chromium(Playwright) 실제 화면 24개 점검: 수정 전 재현, `?paste=1` → Paste 시트(로드 시 읽기 0회) → 탭 안에서 읽기 → 저장 → 새로고침 후 유지, 말풍선 닫기 후 재시도, 빈 클립보드, "Write it by hand instead", 메인 Paste 버튼, Mac 키보드(Enter), `?add=` 유지. 콘솔·페이지 오류 0건.
  - 화면 83개 점검: 접힘 세로 466×678 · 접힘 가로 678×466 · 펼침 세로 669×951 · 펼침 가로 951×669 · Mac 1440×900에 안전영역(세로 위 82/아래 34px, 가로 좌우 82px 가정)을 넣고, 글자 크기 6px·17px 단계에서도 가로 넘침·글자 잘림·44px 미만 터치 영역·안전영역 침범이 없음을 측정했습니다. 설정·가이드 시트의 주소 표시도 확인했습니다.
  - 업데이트 경로 9개 점검: 옛 버전이 설치된 상태에서 새 버전을 배포하면 **첫 실행은 옛 버전 코드로 열리고**(캐시 우선), 약 2초 뒤 새 Service Worker가 설치되어 옛 캐시가 지워지며, **두 번째 실행부터** 새 버전이 적용됩니다. 비행기 모드(오프라인)에서도 `?paste=1`이 Paste 시트로 열립니다.
- 한계 / Pending(실기기에서 확인 필요):
  - iPhone Duo Safari에서 실제 단축어 → Paste 시트 → iOS의 **Paste 말풍선** → 저장까지 한 번 돌려 보기. 말풍선의 모양·위치는 iOS가 정하며, 이 환경에서는 WebKit 문서의 규칙을 흉내 냈을 뿐 실제 iOS를 쓰지 못했습니다.
  - Mac Safari에서 Paste 시트의 확인 메뉴(키보드 ⌘V 또는 Paste 항목).
  - 배포 직후 업데이트: Safari에서 Clip을 한 번 열어 둔 뒤 설정(Settings) → `App version`이 새 버전인지 확인하고, 홈 화면 앱은 두 번 열어 반영되는지 확인.
  - 아주 긴 주소(`?add=`)가 iOS에서 실제로 어느 길이부터 잘리는지는 이 환경에서 검증하지 못했습니다(안내 문구는 "잘릴 수 있다"로 표현).

## 2026-11-19 추가 검토와 보강 (`2026.11.19-shortcutpaste2`)

바로 앞의 수정(`shortcutpaste1`)이 실제 사용에서 문제없는지 의심하는 눈으로 다시 점검했습니다.

- 확인했고 문제 없는 것
  - **업데이트가 기기에 전달되는지**: WebKit 소스(`SWServerRegistration::shouldSoftUpdate`)는 모든 일반 이동(navigation)마다 서비스 워커 갱신 확인을 예약하고(1초 뒤), `sw.js`는 HTTP 캐시를 거치지 않고 새로 받습니다. 그래서 "배포 직후 첫 실행은 옛 버전, 몇 초 뒤 새 버전이 설치되어 다음 실행부터 적용"이라는 USER-GUIDE-KO 5-7의 안내가 iOS에서도 맞습니다. 옛 버전 두 가지(`duocheck1`, `shortcutpaste1`)에서 `shortcutpaste2`로 넘어가는 경로를 각각 시뮬레이션했습니다(점검 9개씩 통과).
  - **엣지 케이스 13개**(iOS 규칙을 흉내 낸 Chromium): 25,000자 클립보드(앞 20,000자 저장 + 경고), HTML·script 문자열이 실행되지 않고 글자 그대로 표시, 같은 글 반복(새로 쌓지 않고 맨 위로), 빠른 더블탭(한 개만 저장), 공백뿐인 클립보드, 한글+이모지+CRLF(줄바꿈 정규화), 키보드(Tab은 시트 안에서만 순환·Escape로 닫기·Space로 붙여넣기), 대화상자 이름·설명·live region·중복 id 없음, 모션 줄이기에서 애니메이션 꺼짐.
- 찾아서 고친 것
  1. **공유 시트(Share Sheet)로 실행하면 공유한 글이 아니라 이전에 복사해 둔 클립보드가 저장됩니다.** 사용자의 단축어는 `Show in Share Sheet`가 켜져 있는데 `Get Clipboard`만 쓰고 공유 입력(`Shortcut Input`)을 쓰지 않기 때문입니다. 앱이 아니라 단축어 쪽 문제라서, Apple 문서([입력 제한](https://support.apple.com/guide/shortcuts/apd8195f96d6/ios): 입력 액션의 `If there's no input`을 `Get Clipboard`로 두면 입력이 없을 때 클립보드를 입력으로 씀)로 확인한 방법을 안내 시트 4단계와 USER-GUIDE-KO 5-3에 추가했습니다.
  2. 안내 시트의 "앞의 두 동작은 해롭지 않다"는 표현이 과해서 고쳤습니다(예: 클립보드가 비어 있을 때 `Copy to Clipboard`가 단축어를 멈출 수 있음. 직접 확인하지는 못해 표현을 낮췄습니다).
  3. Paste 실패 안내에 "말풍선이 안 뜨면 Write it by hand instead"라는 출구를 추가했습니다.
  4. 배포가 `Found 0 artifact(s)` 등으로 실패했을 때 `Re-run failed jobs` 대신 `Run workflow`로 새로 실행하라는 안내를 GITHUB-PAGES-KO에 추가했습니다.
- 검증: `node --test tests/*.test.cjs` 29/29, `node --check app.js sw.js` 통과. Chromium 실제 화면 점검 24개, 화면 83개(5개 크기 · 안전영역 · 글자 6/17px), 엣지 케이스 13개, 업데이트 경로 9개×2 모두 통과(콘솔·페이지 오류 0건). 빌드/캐시 이름 `clip-v1-2026.11.19-shortcutpaste2`.
- 한계 / Pending(실기기에서 확인 필요): 앞의 `shortcutpaste1` 항목과 같습니다. 특히 iPhone Duo Safari에서 실제 단축어 → Paste 시트 → iOS **Paste 말풍선** → 저장, 그리고 4단계(공유 시트용 단축어)의 메뉴 이름·동작은 Apple 문서로만 확인했고 실기기에서 한 번 따라 해 봐야 합니다.

## 2026-11-19 자동 저장(`?add=`) 확인과 안내 우선순위 정정 (`2026.11.19-shortcutauto1`)

계기: "단축어를 누르면 자동으로 Clip에 저장되는 것이 원래 방식이 맞는지 확인해 달라"는 요청.

- 확인한 사실
  1. **자동 저장이 원래 설계가 맞습니다.** 첫 릴리즈의 안내(앱 안 안내 시트와 USER-GUIDE-KO)부터 "Copy → one tap → saved automatically / 복사 → 단축어 실행 → Clip에 자동 저장"이 약속이었고, 이것이 실제로 되는 방식은 **URL Encode + Open URLs의 `?add=`**입니다(cove의 `Save to cove`도 같은 방식). 첫 릴리즈가 "권장"으로 안내한 `?paste=1`(클립보드 방식)은 iOS가 웹페이지의 자동 클립보드 읽기를 막아서 구조적으로 자동 저장이 불가능해, 약속과 맞지 않는 레시피였습니다. `shortcutpaste1`·`shortcutpaste2`는 그 방식이 최소한 두 번 탭으로 동작하게 고쳤지만, 안내의 우선순위는 여전히 `?paste=1` 쪽이었습니다.
  2. **`?add=` 자동 저장은 어떤 빌드에서도 똑같이 됩니다.** 단축어가 만들어 내는 주소(한글·줄바꿈·`& + = ? # %`·HTML·이모지 등)로 `2026.11.17-duocheck1`, `shortcutpaste1`, 현재 빌드를 각각 열어, 탭 없이·시트 없이·클립보드 읽기 없이 정확히 저장되는 것을 확인했습니다(점검 57개).
  3. **주소 길이의 실제 한계를 측정했습니다.** GitHub Pages 서버는 요청 주소가 **8,192바이트 이상이면 `414 Error: URI Too Long`**으로 거부합니다(8,185바이트까지 허용, 180KB는 502). 한글은 글자당 9바이트로 늘어나 **한글 약 900자 / 영문 약 6,000자**가 대략의 한계입니다. 다만 Service Worker가 이미 Clip을 제공 중이면 이동 요청을 서버에 보내지 않고 캐시로 답하므로, 20,000자(앱 저장 한도, 주소 약 180KB)까지도 자동 저장됩니다(Chromium). 한계는 "처음 열었거나 사이트 데이터를 지운 직후"에만 걸립니다.
  4. **"iOS가 긴 주소를 잘라낸다"는 기존 설명의 근거를 찾지 못했습니다.** Apple 문서에는 Open URLs 동작의 길이 제한이 없고(문서의 250자 제한은 `shortcuts://` 주소에만 해당), WebKit이 4,096자에서 자르는 것은 주소창 표시뿐입니다. 코드·안내의 해당 표현을 "중간에 잘릴 수 있다"로 낮추고, 잘림을 알아채면(`%`로 끝남) 경고하는 기능은 그대로 둡니다.
- 고친 것
  1. 안내 우선순위: **자동 저장(`?add=`)이 먼저**, 긴 글용 `?paste=1`(두 번 탭)은 그 뒤. 안내 시트는 cove와 같은 Get Clipboard → URL Encode → Text → Open URLs 방식으로 다시 썼고, 공유 시트용(4단계)도 `URL Encode`가 `Shortcut Input`을 받는 방식으로 맞췄습니다.
  2. 설정(Settings) → Shortcut에 **주소 두 개**(자동 `?add=`, 긴 글 `?paste=1`)와 각각의 Copy address 버튼.
  3. 잘림 경고 문구에서 근거 없는 "iOS의 URL 한계" 표현 삭제. USER-GUIDE-KO 5장 재작성(5-1 자동 저장 · 5-3 공유 시트 · 5-4 긴 글 · 5-6 예전 `?paste=1` 단축어).
- 검증: `node --test tests/*.test.cjs` 35/35(자동 경로 테스트 6개와 주소·버튼 배선 검사 추가), `node --check app.js sw.js` 통과. Chromium 실제 화면 점검 24개 · 화면 83개 · 엣지 케이스 13개 · 자동 저장 57개 · Copy 버튼 5개 · 업데이트 경로 9개×2 통과, 콘솔·페이지 오류 0건. 빌드/캐시 이름 `clip-v1-2026.11.19-shortcutauto1`.
- 한계 / Pending(실기기에서 확인 필요): iPhone Duo에서 5-1대로 만든 단축어가 실제로 자동 저장하는지(이 환경에는 iOS가 없어 단축어를 실행하지 못했고, 단축어가 만들 주소를 브라우저로 재현했습니다), 5-3의 공유 시트용 변경, 그리고 iOS 쪽 주소 길이 한계(긴 글을 실제로 보내 보기).

## 2026-11-19 단축어 만드는 순서 재검토와 보강 (`2026.11.19-shortcutauto2`)

계기: 사용자가 단축어를 다시 만들기 전에 한 번 더 검토해 달라고 요청.

- 근거로 확인한 것 (Apple 단축어 사용자 설명서 iOS 26·27판, 실제로 내보낸 단축어 파일, 포럼 사례)
  - **변수 이름**: URL Encode 동작(`is.workflow.actions.urlencode`)의 출력 이름은 `URL Encoded Text`입니다(실제 내보낸 단축어 파일과 Keyboard Maestro 포럼 글에서 확인).
  - **텍스트 칸에 변수 넣기**: 텍스트 칸을 누르면 Variables 막대와 키보드가 나오고, **Select Variable**을 누르면 각 동작 아래에 파란 토큰이 보이며, 그것을 누르면 커서 위치에 들어갑니다(Apple "Use variables").
  - **만들기·이름·동작 추가·테스트**: `+` → New Shortcut → Rename → Add Action / Search Actions → Done, 테스트는 ▶(Apple "Create a custom shortcut").
  - **공유 시트**: Details → Show in Share Sheet, 입력 카드의 If there's no input → Get Clipboard(Apple "Limit the input for a shortcut").
  - **공백은 `%20`**: 단축어로 만든 주소의 실제 사례(Obsidian 포럼 글의 `content=你%20好`, r/shortcuts의 `Citizens%20%26%20Saints`)로 확인했습니다.
- 찾아서 고친 것
  1. **안내 시트의 실행 방법 두 군데가 옛 iOS 기준이라 틀려 있었습니다.** 홈 화면은 "Share → Add to Home Screen"이 아니라 단축어의 **Details → Add to Home Screen → Add**, 제어 센터는 "Settings → Control Center"가 아니라 **제어 센터 → 왼쪽 위 + → Add a Control → Shortcut → Choose**입니다(Apple "Add a shortcut to the Home Screen", "Use Control Center to run shortcuts"). Back Tap 경로(Settings → Accessibility → Touch → Back Tap)는 맞았습니다.
  2. 단축어 만드는 순서를 화면 조작 단위로 구체화했습니다(Rename, Add Action, Search Actions, Select Variable, Done). 주소는 직접 치지 않고 **Copy address로 붙여넣게** 해 자동 대문자·자동 고침으로 주소가 바뀌는 것을 막고, `Copy test line` 버튼과 "If something is off" 문제 해결 목록을 추가했습니다.
  3. **`+` 처리**: URL Encode가 `+`를 `%2B`로 바꾸는지는 문서에서 확인하지 못했습니다. 공백이 `%20`으로 쓰이므로 주소 속의 맨 `+`는 공백이 아니라 더하기 기호입니다. 그래서 `?add=`·`?label=`을 읽을 때 맨 `+`를 `%2B`로 바꿔 두도록 앱을 고쳤습니다(전화번호 `+82 10-…` 보호). 단축어가 `+`를 인코딩하든 그대로 두든 같은 글이 저장됩니다.
- 검증: `node --test tests/*.test.cjs` 36/36(`+` 테스트와 테스트 문장 일치 검사 추가). Chromium 실제 화면 점검 24개 · 화면 83개 · 엣지 케이스 13개 · 자동 저장 59개(`+82` 두 가지 인코딩 포함) · Copy 버튼 6개 · 업데이트 경로 9개×2 통과, 콘솔·페이지 오류 0건. 빌드/캐시 이름 `clip-v1-2026.11.19-shortcutauto2`.
- 한계 / Pending(실기기에서 확인 필요): 이 환경에는 iOS가 없어 단축어를 직접 만들거나 실행하지 못했습니다. 위 순서는 Apple 문서의 조작 설명과 실제 단축어 파일 구조에 맞춘 것이고, 최신 iOS 화면의 글자 모양은 사용자의 기기에서 한 번 따라 해 봐야 합니다. `URL Encode`가 `+`를 실제로 어떻게 쓰는지는 위 테스트 문장(`+` 포함)으로 사용자가 직접 확인할 수 있습니다.
