# GitHub Pages 배포 방법

GitHub 사용 경험이 많지 않아도 따라 할 수 있도록 순서대로 적었습니다.

## 배포 정보 (이미 완료됨)

- 저장소: `github.com/jennie-verse/clip` (Public)
- 배포 주소: `https://jennie-verse.github.io/clip/`
- 배포 방식: GitHub Actions (Pages) — `main` 브랜치에 올라간 그대로 배포됩니다
- 이전 이름은 `tide`였습니다. 옛 저장소 `github.com/jennie-verse/tide`는 Archive 처리되어 읽기 전용으로 남아 있습니다.

## 폴더 안의 파일을 다시 배포하고 싶을 때

1. 이 폴더(`clip/`) 전체를 `github.com/jennie-verse/clip` 저장소에 업로드(commit + push)합니다.
   - 폴더 구조를 그대로 유지하세요. 압축을 풀었을 때 `clip/clip/` 처럼 폴더가 한 겹 더 생기면 안 됩니다.
   - 저장소 최상위에 `index.html`이 바로 보여야 합니다.
2. 저장소(Repository) → 설정(Settings) → Pages 메뉴로 이동합니다.
3. Source를 **GitHub Actions** 로 지정합니다.
4. 몇 분 뒤 `https://jennie-verse.github.io/clip/` 접속해 화면이 뜨는지 확인합니다.

## 새 버전을 올릴 때 꼭 확인할 것

- `app.js`나 `app.css`를 고쳤다면 `sw.js`의 `CACHE` 이름(`clip-v1` → `clip-v2` 등)을 반드시 함께 올립니다. 그래야 이미 홈 화면에 설치된 기기에서도 새 버전이 적용됩니다.
- `shared/` 폴더는 여러 앱이 함께 쓰는 고정 규칙이 있는 폴더입니다. `shared/v1/`은 절대 수정하지 마세요. `shared/v2/journal.js`는 새 앱(clip 등) 추가처럼 하위 호환을 지키는 변경만 허용됩니다.

## iPhone / iPad에서 확인하기

1. Safari에서 `https://jennie-verse.github.io/clip/` 접속
2. 공유(Share) → 홈 화면에 추가(Add to Home Screen)
3. 홈 화면 아이콘으로 실행해 정상 동작 확인

## tide에서 clip으로 넘어가기 (사용자가 직접 할 일)

1. 홈 화면에서 기존 Tide 아이콘을 삭제합니다.
2. Safari에서 `https://jennie-verse.github.io/clip/`을 열고 공유(Share) → 홈 화면에 추가(Add to Home Screen)로 새로 설치합니다.
3. 설정(Settings) → Sync에서 GitHub Personal Access Token을 다시 입력합니다. 주소가 바뀌면 브라우저 저장소(localStorage)가 새로 시작되기 때문에, 기존 tide에 넣어 둔 토큰이 clip에는 남아 있지 않습니다.
4. `?add=` 주소를 쓰는 iOS 단축어(Shortcuts)가 있다면 주소를 아래처럼 바꿉니다.

```
이전: https://jennie-verse.github.io/tide/?add=
이후: https://jennie-verse.github.io/clip/?add=
```

설정(Settings) → Shortcut → **How to make one**에서도 같은 안내를 볼 수 있습니다.

기존 Dump(생각 비워내기) 데이터는 이전되지 않습니다 — clip에는 Clips 기능만 남았습니다. 이관 없이 이전 tide 저장소와 함께 버려집니다.

## 기기 간 동기화 토큰

Settings → Sync에서 GitHub Personal Access Token을 입력해야 동기화가 켜집니다. tide에서 쓰던 토큰과 **같은 토큰**을 그대로 쓸 수 있습니다(저장소 `webapp-data`에 대한 접근 권한만 있으면 됩니다). 새로 발급해야 한다면 GitHub → Settings → Developer settings → Personal access tokens에서 `webapp-data` 저장소에 대한 Contents 읽기·쓰기 권한으로 만드세요.
