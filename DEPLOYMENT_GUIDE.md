# 🚀 Firebase Hosting Deployment Guide

## Prerequisites
- Node.js installed
- Firebase CLI installed
- Firebase project: `marketplace-3d57c`

---

## 📦 Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

---

## 🔐 Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser to authenticate with Google.

---

## 🏗️ Step 3: Build Your Project

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

---

## 🚀 Step 4: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your site will be live at: `https://marketplace-3d57c.web.app`

---

## 🌐 Step 5: Connect Your Custom Domain

### In Firebase Console:

1. Go to: https://console.firebase.google.com/project/marketplace-3d57c/hosting
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Firebase will provide DNS records to add

### DNS Configuration:

#### For Root Domain (yourdomain.com):
Add these **A records** to your DNS provider:

```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195
```

#### For WWW Subdomain (www.yourdomain.com):
Add this **CNAME record**:

```
Type: CNAME
Name: www
Value: marketplace-3d57c.web.app
```

### SSL Certificate:
- Firebase automatically provisions a free SSL certificate
- Takes 24-48 hours after DNS propagation
- Your site will be accessible via HTTPS

---

## 🔄 Future Deployments

After initial setup, deploy updates with:

```bash
npm run build && firebase deploy --only hosting
```

---

## 🎯 Quick Deploy Script

Add this to your `package.json` scripts:

```json
"scripts": {
  "deploy": "npm run build && firebase deploy --only hosting",
  "deploy:preview": "npm run build && firebase hosting:channel:deploy preview"
}
```

Then deploy with:
```bash
npm run deploy
```

---

## 🧪 Preview Deployments (Optional)

Test changes before going live:

```bash
npm run build
firebase hosting:channel:deploy preview
```

This creates a temporary URL for testing.

---

## 📊 Monitoring

View your site analytics and performance:
- Firebase Console: https://console.firebase.google.com/project/marketplace-3d57c/hosting
- Google Analytics: Already integrated with ID `G-BKVRGZ5CMY`

---

## 🔧 Troubleshooting

### Build fails:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Deploy fails:
```bash
firebase logout
firebase login
firebase deploy --only hosting
```

### Custom domain not working:
- Wait 24-48 hours for DNS propagation
- Verify DNS records with: `nslookup yourdomain.com`
- Check Firebase Console for verification status

---

## 📝 Environment Variables

Your `.env.local` file is NOT deployed (it's in `.gitignore`).

Environment variables are built into the production bundle during `npm run build`.

Make sure all Firebase credentials are in `.env.local` before building.

---

## ✅ Deployment Checklist

- [ ] Build succeeds locally (`npm run build`)
- [ ] Test production build locally (`npm run preview`)
- [ ] Firebase CLI installed and logged in
- [ ] Deploy to Firebase (`firebase deploy --only hosting`)
- [ ] Test live site at `.web.app` URL
- [ ] Add custom domain in Firebase Console
- [ ] Configure DNS records at domain provider
- [ ] Wait for SSL certificate (24-48 hours)
- [ ] Test custom domain with HTTPS

---

## 🎉 Your Site Will Be Live At:

- **Firebase URL**: https://marketplace-3d57c.web.app
- **Custom Domain**: https://yourdomain.com (after DNS setup)

---

## 💡 Pro Tips

1. **Always test locally first**: `npm run build && npm run preview`
2. **Use preview channels**: Test changes before production
3. **Monitor performance**: Check Firebase Console regularly
4. **Set up CI/CD**: Automate deployments with GitHub Actions
5. **Backup before deploy**: Firebase keeps previous versions

---

## 🆘 Need Help?

- Firebase Docs: https://firebase.google.com/docs/hosting
- Firebase Support: https://firebase.google.com/support
- Check deployment logs: `firebase hosting:channel:list`
