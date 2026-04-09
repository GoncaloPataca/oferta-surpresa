# Oferta Surpresa 🎁

Um envelope digital para oferecer como prendinha de aniversário.

## Como funciona

Abre `index.html` no browser, clica no envelope e vê a mensagem de aniversário aparecer com confetis! 🎉

## Estrutura

```
oferta-surpresa/
├── index.html          # Página principal
├── styles.css          # Estilos e animações
├── script.js           # Lógica (abertura do envelope + confetis)
└── .github/
    └── workflows/
        └── deploy.yml  # Deploy automático para GitHub Pages
```

## Personalizar

Edita as mensagens directamente em `index.html`:

- **`.letter__body`** — o texto dentro da carta
- **`.card__title`** e **`.card__message`** — o cartão final que aparece depois de abrir o envelope
- **`.letter__signature`** — a assinatura

## Deploy no GitHub Pages

1. Cria um repositório no GitHub e faz push deste código para o branch `main`.
2. Vai a **Settings → Pages** no teu repositório.
3. Em **Source**, selecciona **GitHub Actions**.
4. Na próxima vez que fizeres push para `main`, o workflow faz o deploy automaticamente.
5. O site fica disponível em `https://<o-teu-usuario>.github.io/<nome-do-repositorio>/`.
