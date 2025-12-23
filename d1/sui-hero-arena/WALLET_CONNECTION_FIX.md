# Wallet Connection Troubleshooting Guide

## Masalah: Tidak Bisa Konek Wallet

### Solusi Cepat:

#### 1. **Install Sui Wallet Browser Extension**
   - Chrome/Edge/Brave: https://chromewebstore.google.com/detail/sui-wallet/opti/publish
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/sui-wallet/

#### 2. **Clear Browser Cache & Local Storage**
   ```javascript
   // Run in browser console (F12)
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

#### 3. **Verify Network Configuration**
   - Check file: `src/index.tsx`
   - Pastikan network default adalah 'testnet'
   - Testnet RPC harus accessible

#### 4. **Check Contract Package ID**
   - File: `src/config/contract.ts`
   - Pastikan PACKAGE_ID sudah di-deploy ke testnet
   - Jika belum ada, deploy Move package terlebih dahulu:
   ```bash
   cd d1/sui_hero
   sui move build
   sui client publish --gas-budget 100000000
   ```
   - Copy Package ID dari output dan update di `src/config/contract.ts`

#### 5. **Verify WalletConnect Component**
   - Component `src/components/WalletConnect.tsx` menggunakan `ConnectButton` dari `@mysten/dapp-kit`
   - Button harus muncul di navbar
   - Jika tidak muncul, check browser console untuk error

### Common Errors & Solutions:

| Error | Solusi |
|-------|--------|
| "No provider found" | Wallet extension belum di-install |
| "Network not supported" | Network setting tidak sesuai di `src/index.tsx` |
| "Package not found" | Contract Package ID di `contract.ts` tidak valid |
| "User rejected" | User cancel action di wallet |

### Debug Mode:

Tambahkan console logs di `src/index.tsx`:
```typescript
console.log('Network Config:', networkConfig);
console.log('Default Network: testnet');
```

Tambahkan di `src/App.tsx`:
```typescript
useEffect(() => {
  console.log('Current Account:', currentAccount);
}, [currentAccount]);
```

### Testing Wallet Connection:

1. Buka aplikasi di browser
2. Klik tombol "Connect" di navbar kanan
3. Pilih akun dari wallet
4. Wallet approve request
5. Lihat address muncul di navbar

---

## Fitur Battle History (Baru)

Battle results sekarang terekam di **HISTORY** tab dengan:
- Nama 2 hero yang bertarung
- Pemenang atau hasil draw
- Jumlah round yang dimainkan
- Waktu battle

Semua log (training + battle) ditampilkan dengan timestamp sorted terbaru di atas.
