# Clip 사용 방법

화면의 메뉴 이름은 영문 그대로 병기합니다. 예: 설정(Settings) → 텍스트 크기(Text size)

## 1. 홈 화면에 추가하기 (iPhone / iPad)

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

클립보드는 다른 앱의 내용을 앱이 스스로 가져올 방법이 없어 iOS 단축어가 필요합니다.

설정(Settings) → Shortcut에서 주소를 복사하거나, **How to make one**을 눌러 단계별 안내를 확인하세요. 완성되면 아래 흐름으로 동작합니다.

```
복사(Copy) → 단축어 실행 → Clip에 자동 저장
```

단축어의 저장 주소는 `https://jennie-verse.github.io/clip/?add=`로 설정하세요.

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
