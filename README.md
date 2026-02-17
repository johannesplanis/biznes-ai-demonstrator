# Golden Milky wAI — demonstrator

Mobilny demonstrator webowy przedstawiający główną ścieżkę produktu:

1. wybór jednej z 3 predefiniowanych krów,
2. upload zdjęcia USG,
3. podgląd zdjęcia,
4. deterministyczny (lokalny) wynik algorytmu: współczynnik mleczności, faza laktacji i prognoza kg/dzień.

## Uruchomienie lokalne

Najprościej uruchomić statyczny serwer w katalogu projektu:

```bash
python3 -m http.server 4173
```

Następnie otwórz `http://localhost:4173`.

## Deploy

Repo zawiera workflow `.github/workflows/deploy.yml`, który publikuje zawartość repo na GitHub Pages po pushu do gałęzi `main`.
