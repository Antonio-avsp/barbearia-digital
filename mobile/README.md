# Barbearia Mobile (Expo)

Aplicativo React Native com Expo para listar serviços da Barbearia Digital consumindo API REST pública.

## Requisitos
- Node.js 18+
- Expo Go no celular (opcional)

## Executar
```bash
cd mobile
npm install
npm run start
```

Depois:
- pressione `a` para Android Emulator
- pressione `i` para iOS Simulator
- ou escaneie QR Code no Expo Go.

## Estrutura
- `components/`: componentes reutilizáveis (card e status)
- `screens/`: tela principal da listagem
- `services/`: integração HTTP
- `styles/`: tema compartilhado
- `App.js`: ponto de entrada
