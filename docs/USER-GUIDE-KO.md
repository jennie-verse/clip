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

## 5. 단축어(Shortcuts)로 자동 저장

다른 앱에서 복사한 글을 **단축어를 한 번 누르면 Clip에 자동으로 저장**하는 방법입니다. 한 번 만들어 두면 아래 흐름으로 동작합니다.

```
복사(Copy) → 단축어 실행 → Clip이 Safari에서 열리며 자동 저장("Saved." 표시)
```

설정(Settings) → Shortcut에서 주소를 복사하거나, **How to make one**을 눌러 같은 순서의 안내를 앱 안에서 볼 수 있습니다. cove의 `Save to cove` 단축어와 같은 방식(URL 인코딩 + 주소 열기)입니다. 아래 메뉴 이름은 iOS 26·27의 영문 화면과 Apple 단축어 사용자 설명서 기준입니다.

### 5-1. 자동 저장 단축어 만들기 (권장)

먼저 Clip 설정(Settings) → Shortcut의 **첫 번째** 주소 아래 **Copy address**를 눌러 주소를 복사해 둡니다. 주소는 `https://jennie-verse.github.io/clip/?add=`로 끝나야 합니다(`?paste=1`로 끝나는 두 번째 주소가 아닙니다).

1. 단축어(Shortcuts) 앱에서 `+`를 누르고, **New Shortcut** → **Rename**을 눌러 `Add to Clip`을 입력한 뒤 확인합니다.
2. **Add Action**을 누르고 `Get Clipboard`를 검색해 선택합니다.
3. 아래쪽 **Search Actions**를 눌러 `URL Encode`를 검색해 선택합니다. 모드는 **Encode** 그대로 둡니다. 복사한 글이 주소 안에 안전하게 실려 가도록 바꿔 줍니다.
4. `Text`를 검색해 선택합니다. 텍스트 칸을 누르고 복사해 둔 주소를 붙여넣습니다. 직접 치지 말고 붙여넣으세요(자동 대문자·자동 고침으로 주소가 바뀌는 것을 막습니다). 커서는 맨 끝에 둡니다.
5. 같은 칸에서 키보드 위의 **Select Variable**을 누르고, **URL Encode** 아래의 파란 **URL Encoded Text** 토큰을 누릅니다. `=` 바로 뒤에 파란 알약 모양으로 들어갑니다.
6. `Open URLs`를 검색해 선택합니다. 칸에 파란 **Text** 알약이 들어 있어야 합니다. 비어 있으면 칸을 눌러 **Select Variable**을 고르고 파란 **Text** 토큰을 누릅니다.
7. **Done**을 누릅니다.

완성된 모습은 이렇습니다.

```
Get Clipboard → URL Encode → Text(https://jennie-verse.github.io/clip/?add=[URL Encoded Text]) → Open URLs([Text])
```

### 5-2. 테스트하기

1. Clip 설정(Settings) → Shortcut → **How to make one**의 **2 · Test it**에서 **Copy test line**을 누르면 `테스트 clip & 100% + 한글`이 복사됩니다(다른 앱에서 이 문장을 직접 복사해도 됩니다). `&`, `%`, `+`, 한글이 모두 들어 있어서 보통 깨지기 쉬운 글자를 한 번에 확인합니다.
2. 단축어 편집 화면의 ▶를 누르거나 단축어 목록에서 `Add to Clip`을 누릅니다.
3. Safari에서 Clip이 열리고 **Saved.**가 보이며, 맨 위 카드가 복사한 문장과 **똑같으면** 성공입니다. 결과는 Safari의 Clip에서 확인하세요(홈 화면 앱에는 바로 보이지 않습니다. 5-9 참고).

### 5-3. 실행 방법 등록하기 (하나 고르세요)

- **홈 화면**: 단축어를 열고 **Details**를 눌러 **Add to Home Screen** → **Add**.
- **뒷면 탭(Back Tap)**: Settings → Accessibility → Touch → Back Tap → Double Tap → 아래 **Shortcuts** 영역에서 `Add to Clip`.
- **제어 센터(Control Center)**: 제어 센터를 열고 왼쪽 위 `+` → **Add a Control** → **Shortcut** → **Choose** → `Add to Clip`.

### 5-4. 공유 시트(Share Sheet)에서도 실행한다면 (선택)

공유 시트에서 단축어를 실행하면 단축어는 공유한 글·링크를 입력(Shortcut Input)으로 받습니다. 5-1의 단축어는 **Get Clipboard**를 쓰므로 그 입력을 무시하고 **이전에 복사해 둔 클립보드**를 저장합니다. 공유한 항목이 저장되게 하려면 단축어를 이렇게 고칩니다.

1. 단축어를 열고 **Details**에서 **Show in Share Sheet**를 켭니다. 맨 위에 **Receive … from Share Sheet** 카드가 생깁니다(이미 켜져 있으면 건너뜁니다).
2. 그 카드의 **If there's no input**에서 **Continue**를 눌러 **Get Clipboard**로 바꿉니다. 공유 없이 직접 실행하면 클립보드를 입력으로 씁니다.
3. **Get Clipboard** 동작은 지우고, **URL Encode**의 입력을 **Shortcut Input**으로 둡니다.

이렇게 하면 공유 시트에서는 공유한 항목이, 직접 실행할 때는 현재 클립보드가 자동으로 저장됩니다.

### 5-5. 긴 글은 이렇게 (탭 두 번)

자동 저장은 글을 **주소에 실어서** 보내므로, 글이 아주 길면 주소가 너무 길어집니다. GitHub Pages 서버는 주소 전체가 **8,192바이트 이상**이면 `Error: URI Too Long`(414)으로 거부합니다(2026-11-19 실제 서버에서 측정). 한글은 한 글자가 9바이트로 늘어나므로 **한글 약 900자, 영문 약 6,000자**가 대략의 한계입니다.

다만 이 거부는 Clip이 Safari에 **아직 설치되기 전(처음 열었거나 사이트 데이터를 지운 뒤)**에만 일어납니다. 이미 설치돼 있으면 Service Worker가 서버를 거치지 않고 열기 때문에, Chromium 점검에서는 앱의 저장 한도인 20,000자(주소 약 180KB)까지 자동 저장됐습니다. iOS 쪽 길이 한계는 Apple 문서에 없고 직접 확인하지도 못했습니다. 긴 글이 들어오지 않으면 아래 중 하나를 쓰세요.

- Clip 첫 화면에서 **Paste from clipboard**를 누릅니다(글을 다시 복사한 뒤).
- 두 번째 단축어를 만듭니다. **Open URLs** 하나만 두고 주소를 `https://jennie-verse.github.io/clip/?paste=1`로 입력합니다(설정의 두 번째 **Copy address**로 복사). 실행하면 **Paste** 시트가 뜨고, **Paste from clipboard**를 누른 뒤 iOS가 띄우는 작은 **Paste** 말풍선을 한 번 더 누르면 저장됩니다.

### 5-6. 왜 긴 글은 두 번 눌러야 하나요?

iOS는 웹페이지가 사용자 몰래 클립보드를 읽지 못하게 막습니다. 웹페이지는 사용자가 화면을 직접 탭한 뒤에만 클립보드를 읽을 수 있고, 그때도 iOS가 **Paste** 확인 말풍선을 띄웁니다. 단축어가 주소를 여는 순간에는 사용자의 탭이 없으므로 `?paste=1` 방식은 자동으로 저장할 수 없고, 글을 주소에 싣는 5-1의 방식만 자동으로 저장됩니다.

### 5-7. 문제가 생기면

- **"Nothing to add — the clip was empty."**가 뜬다: 클립보드가 비어 있었거나, Text 칸에 파란 **URL Encoded Text** 알약이 없습니다(5-1의 5번).
- **저장된 카드에 `URL Encoded Text`라는 글자가 그대로 있다**(또는 주소처럼 보인다): 변수를 글자로 쳐 넣은 것입니다. 지우고 **Select Variable**로 다시 넣습니다.
- **`Error: URI Too Long` 페이지가 뜬다**: 글이 이 방식에 비해 너무 깁니다. 5-5를 보세요.
- **저장은 됐는데 `+`가 공백으로 보인다**: 앱을 `App version` `2026.11.19-shortcutauto2` 이상으로 갱신하면 맨 `+`도 그대로 저장됩니다(5-10).
- **이 단축어가 아니라 예전 `?paste=1` 단축어를 쓰고 있다**: 5-8을 보세요.

### 5-8. `?paste=1`로 만든 단축어를 쓰고 계셨다면

**Get Clipboard** → **Copy to Clipboard** → **Open URLs**(`…/clip/?paste=1`)로 만든 단축어는 자동으로 저장되지 않습니다. 이 단축어로 Clip을 열면 `Could not read the clipboard. Paste it below instead.` 알림이 뜨던 것이 `2026.11.19-shortcutpaste1` 이전 버전의 문제였고, 지금은 Paste 시트가 열려 5-5의 두 번 탭으로 저장됩니다. 원래처럼 자동으로 저장하려면 5-1처럼 새로 만드세요. 예전 단축어는 이름을 `Add long text to Clip` 같은 것으로 바꿔 긴 글용으로 남겨 두면 됩니다.

### 5-9. 저장 위치 — Safari와 홈 화면 앱은 따로입니다

단축어는 Clip을 **Safari**에서 엽니다. iOS는 Safari와 홈 화면 앱의 저장 공간을 분리하므로, 단축어로 담은 글은 홈 화면 앱에 바로 보이지 않습니다. 동기화(Sync)를 켜거나, 설정(Settings)에서 **Import from the other mode**를 사용하세요.

### 5-10. 새 버전을 배포한 직후에는

Clip은 오프라인에서도 열리도록 기기에 저장해 둔 파일을 먼저 사용합니다. 그래서 새 버전을 배포한 직후 **첫 실행은 옛 버전으로 열리고**, 몇 초 뒤 새 버전이 설치되어 **그다음 실행부터** 적용됩니다. 자동 저장(`?add=`)은 어떤 버전에서든 똑같이 동작하므로 이 때문에 막히지는 않습니다. 바뀐 안내 화면이나 Paste 시트, `+` 보정을 쓰려면 Safari에서 Clip을 한 번 열어 몇 초 기다린 뒤(홈 화면 앱은 두 번), 설정(Settings) 맨 아래의 `App version`이 `2026.11.19-shortcutauto2`(또는 더 새로운 버전)인지 확인하세요.

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
