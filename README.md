# Golden Milky wAI — demonstrator

Mobilny demonstrator webowy przedstawiający główną ścieżkę produktu:

1. ekran startowy (splash, 1.5s),
2. menu główne,
3. przejście do listy 3 predefiniowanych krów,
4. upload zdjęcia USG i automatyczny podgląd,
5. deterministyczny (lokalny) wynik algorytmu: współczynnik mleczności, faza laktacji i prognoza kg/dzień,
6. zakończenie badania i powrót do listy krów.

## Uruchomienie lokalne

```bash
python3 -m http.server 4173
```

Następnie otwórz `http://localhost:4173`.

## Deploy

Repo zawiera workflow `.github/workflows/deploy.yml`, który publikuje zawartość repo na GitHub Pages po pushu do gałęzi `main`.
