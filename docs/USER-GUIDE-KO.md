# Clip 사용 방법

화면의 메뉴 이름은 영문 그대로 병기합니다. 예: 설정(Settings) → 텍스트 크기(Text size)

## 1. 홈 화면에 추가하기 (iPhone / iPhone Duo / iPad, Mac Safari도 동일)

1. Safari에서 Clip 주소를 엽니다.
2. 아래쪽 공유(Share) 버튼을 누릅니다.
3. 홈 화면에 추가(Add to Home Screen)를 선택합니다.
4. 이름을 확인하고 추가(Add)를 누릅니다.

이후로는 홈 화면 아이콘으로 바로 실행할 수 있습니다(standalone 앱처럼 동작).

## 2. Clips — 다시 꺼내 쓸 문구

- **클립보드에서 담기(Paste from clipboard)**: 다른 앱에서 복사한 내용을 그대로 저장합니다.
- **직접 입력(Write)**: 라벨(Label)과 내용을 입력해 저장합니다.
- 카드를 탭하면 **클립보드로 복사**되고, 7일 카운트다운이 다시 시작됩니다.
- 카드의 `⋯` 메뉴에서 핀(Pin) · 복사(Copy) · 편집(Edit) · 전체 보기(View full text) · 삭제(Delete)를 할 수 있습니다.
- URL·이메일·전화번호는 자동으로 종류가 표시되고, 종류에 맞는 메뉴(링크 열기 등)가 추가로 나타납니다.
- 같은 내용을 다시 담으면(중복) 새로 쌓지 않고 맨 위로 올립니다. 설정(Settings) → Clips → Merge duplicates에서 끌 수 있습니다.

화면에는 탭바 없이 Clips 하나만 있습니다. 생각을 비워내고 싶다면 today 앱의 Note를 쓰세요.

## 3. 핀(Pin)

- 계속 보관하고 싶은 항목은 `⋯` 메뉴에서 **Pin**을 누르세요.
- 핀을 꽂은 항목은 7일 카운트다운이 멈추고, 맨 위 **Pinned** 구역에 모입니다.
- 핀은 최대 50개까지 꽂을 수 있습니다. 더 꽂으려면 먼저 하나를 해제(Unpin)해야 합니다.

## 4. 검색

- 검색창은 현재 목록 안에서만 검색합니다.

## 5. 단축어(Shortcut)로 빠르게 담기

다른 앱에서 복사한 글을 Clip으로 보내는 iOS 단축어입니다. 한 번 만들어 두면 아래 흐름으로 저장됩니다.

```
복사(Copy) → 단축어 실행 → Clip의 Paste 시트에서 두 번 탭 → 저장
```

설정(Settings) → Shortcut에서 주소를 복사하거나, **How to make one**을 눌러 단계별 안내를 확인할 수 있습니다.

### 5-1. 단축어 만들기 (길이 제한 없음, 권장)

1. 단축어(Shortcuts) 앱을 열고 오른쪽 위의 `+`를 누릅니다.
2. **URL 열기(Open URLs)** 동작 하나를 추가하고, 주소를 `https://jennie-verse.github.io/clip/?paste=1`로 입력합니다. 주소 뒤에는 아무것도 붙이지 않습니다.
3. 이름을 `Add to Clip`으로 저장합니다.
4. 실행 방법을 하나 등록합니다: 홈 화면에 추가(Add to Home Screen) · 뒷면 탭(Back Tap) · 제어 센터(Control Center).

이미 **클립보드 가져오기(Get Clipboard)** → **클립보드에 복사(Copy to Clipboard)** → **URL 열기(Open URLs)**로 만든 단축어가 있다면 **그대로 쓰면 됩니다**(다시 만들 필요 없음). 앞의 두 동작은 이제 필요 없지만 해롭지도 않습니다.

### 5-2. 사용하는 순서

1. 담고 싶은 글을 복사합니다.
2. 단축어 `Add to Clip`을 실행합니다. Safari에서 Clip이 열리고 **Paste** 시트가 나타납니다.
3. **Paste from clipboard** 버튼을 누르고, iOS가 띄우는 작은 **붙여넣기(Paste)** 말풍선을 한 번 더 누르면 저장됩니다.
4. 말풍선을 누르지 않고 닫았다면 시트에 안내가 뜹니다. 버튼을 다시 누르면 됩니다. 직접 입력하려면 **Write it by hand instead**를 누르세요.

### 5-3. 왜 두 번 눌러야 하나요?

iOS는 웹페이지가 사용자 몰래 클립보드를 읽지 못하게 막습니다. 웹페이지는 사용자가 화면을 직접 탭한 뒤에만 클립보드를 읽을 수 있고, 그때도 iOS가 **붙여넣기(Paste)** 확인 말풍선을 띄웁니다. 단축어가 주소를 여는 순간에는 사용자의 탭이 없으므로, Clip이 열리자마자 자동으로 읽는 방식은 iOS에서 성공할 수 없습니다.

`2026.11.19-shortcutpaste1` 이전 버전은 그 자동 읽기를 시도해서, 단축어를 실행할 때마다 `Could not read the clipboard. Paste it below instead.` 알림과 빈 Write 시트가 떴습니다. 이 버전부터는 자동으로 읽지 않고 Paste 시트의 버튼 탭으로 읽습니다. 확인 말풍선은 iOS가 띄우는 것이라 웹앱이 건너뛸 수 없습니다.

### 5-4. 짧은 글만 담는다면 — 탭 없이 바로 저장 (선택)

**클립보드 가져오기(Get Clipboard)** → **URL 인코딩(URL Encode)** → **URL 열기(Open URLs)** 순서로 만들고, 열 주소를 `https://jennie-verse.github.io/clip/?add=` 뒤에 인코딩된 텍스트를 붙인 것으로 정합니다. 탭 없이 바로 저장됩니다. 다만 아주 긴 주소는 Clip에 닿기 전에 잘릴 수 있어 긴 글은 끝이 잘려서 올 수 있습니다(Clip이 알아챌 수 있으면 경고를 띄웁니다). 긴 글은 5-1의 방법을 쓰세요.

### 5-5. 저장 위치 — Safari와 홈 화면 앱은 따로입니다

단축어는 Clip을 **Safari**에서 엽니다. iOS는 Safari와 홈 화면 앱의 저장 공간을 분리하므로, 단축어로 담은 글은 홈 화면 앱에 바로 보이지 않습니다. 동기화(Sync)를 켜거나, 설정(Settings)에서 **Import from the other mode**를 사용하세요.

### 5-6. 새 버전을 배포한 직후에는 한 번 열어 두세요

Clip은 오프라인에서도 열리도록 기기에 저장해 둔 파일을 먼저 사용합니다. 그래서 새 버전을 배포한 직후 **첫 실행은 옛 버전으로 열리고**, 몇 초 뒤 새 버전이 설치되어 **그다음 실행부터** 적용됩니다.

1. Safari에서 Clip을 한 번 열고 몇 초 기다립니다(홈 화면 앱은 두 번 열어 보세요).
2. 설정(Settings) 맨 아래의 `App version`이 `2026.11.19-shortcutpaste1`(또는 더 새로운 버전)인지 확인합니다.
3. 그다음 단축어를 실행합니다.

## 6. 보관 기간(Retention)

- 설정(Settings) → Retention에서 7 / 14 / 30일 또는 Never(정리 안 함) 중 고를 수 있습니다.
- 손대지 않은 지 3일 이하로 남으면 카드에 작은 회색 `Nd` 표시가 뜹니다.
- Never로 두면 자동 정리가 꺼집니다. 이때는 **Clear expired now** 버튼으로 직접 정리해야 합니다.
- 정리된 항목은 기기 간 동기화가 켜져 있을 때만 GitHub에 보관(archive)된 뒤 지워집니다. 동기화가 꺼져 있으면, 수동으로 정리할 때 백업을 먼저 받으라는 안내가 뜹니다.

## 7. 기기 간 동기화(Sync) — 선택 사항

iPhone과 iPad처럼 여러 기기를 함께 쓰신다면 설정(Settings) → Sync에서 다음을 진행하세요.

1. GitHub Personal Access Token을 준비합니다(비공개 저장소 `webapp-data`에 대한 읽기·쓰기 권한 필요).
2. Token 칸에 붙여넣고 **Save token**을 누릅니다.
3. 이 기기·앱의 이름(예: iphone safari, ipad app)을 입력하고 **Save name**을 누릅니다.
4. **Turn on sync** 체크박스를 켭니다.

기기를 새로 추가할 때마다 그 기기에서 Token을 새로 입력해야 합니다.

## 8. 백업과 복원

- 설정(Settings) → Backup → **Export JSON backup**으로 전체 데이터를 파일로 저장합니다. iCloud Drive에 저장해 두는 것을 권합니다.
- **Restore from JSON**으로 이전 백업을 불러올 수 있습니다. 지금 있는 데이터는 백업 파일 내용으로 완전히 바뀝니다.
- 오래된 백업을 복원해도 항목이 즉시 사라지지 않습니다 — 복원 시각부터 7일이 새로 시작됩니다.
- **Export CSV**로 표 형태 내보내기도 가능합니다(다시 가져오기는 지원하지 않음).

## 9. 전체 삭제(Delete all)

설정(Settings) → Danger zone → **Delete all**. 핀을 꽂은 항목도 함께 지워지며, 되돌리기 어려우니 먼저 백업을 권합니다.

## 10. Daybook Journal

- Clip을 복사·편집·핀 변경하면 생성일 record와 별도로 실제 사용한 날짜의 activity가 기록됩니다.
- **Upload content to private Journal**을 끄면 pending record도 업로드 전에 정제됩니다. 날짜 범위의 **Remove content**는 현재 projection만 비본문으로 바꾸며 Git 과거 이력은 남을 수 있습니다.
- Journal이 꺼져 있어도 90일 메타데이터 activity는 이 기기에만 보관되고, JSON 백업/복원에 선택 필드로 포함됩니다. **Clear captured activity**로 이 원장만 지울 수 있습니다.
- Settings → Include in journal을 켜야 Daybook에 이 앱의 기록이 나타납니다.
