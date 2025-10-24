# eSalaire - Application de Gestion des Bulletins de Salaire

Application web moderne pour la consultation et la gestion des bulletins de salaire des employés Sonatel.

## 🚀 Fonctionnalités

- ✅ Authentification sécurisée avec JWT
- ✅ Consultation des bulletins de salaire
- ✅ Détails complets des composantes salariales
- ✅ Historique des connexions
- ✅ Interface responsive et moderne
- ✅ Base de données MySQL

## 📋 Prérequis

- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet

\`\`\`bash
git clone <repository-url>
cd esalaire-app
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configuration de la base de données

Créez une base de données MySQL :

\`\`\`sql
CREATE DATABASE esalaire;
\`\`\`

### 4. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

\`\`\`env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=esalaire

# Session Secret (générez une clé aléatoire sécurisée)
SESSION_SECRET=your-super-secret-key-change-this-in-production
\`\`\`

### 5. Initialiser la base de données

Exécutez le script de configuration pour créer les tables et insérer les données de test :

\`\`\`bash
npm run dev
\`\`\`

Puis dans un autre terminal :

\`\`\`bash
npx tsx scripts/run-mysql-setup.ts
\`\`\`

## 🎯 Utilisation

### Démarrer le serveur de développement

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Comptes de test

Après l'initialisation de la base de données, vous pouvez vous connecter avec :

**Compte 1:**
- Identifiant: `SOPH001`
- Mot de passe: `password123`

**Compte 2:**
- Identifiant: `DEMO001`
- Mot de passe: `demo123`

## 📁 Structure du projet

\`\`\`
esalaire-app/
├── app/                      # Pages Next.js
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentification
│   │   ├── bulletins/       # Gestion des bulletins
│   │   └── user/            # Profil utilisateur
│   ├── dashboard/           # Page d'accueil
│   ├── bulletins/           # Liste et détails des bulletins
│   ├── compte/              # Page compte
│   └── parametres/          # Paramètres
├── components/              # Composants React
│   ├── ui/                  # Composants UI (shadcn)
│   ├── auth-guard.tsx       # Protection des routes
│   └── dashboard-layout.tsx # Layout principal
├── lib/                     # Utilitaires
│   ├── db.ts               # Configuration MySQL
│   ├── session.ts          # Gestion des sessions JWT
│   └── types.ts            # Types TypeScript
├── scripts/                 # Scripts de configuration
│   ├── 01-create-tables.sql
│   ├── 02-seed-data.sql
│   └── run-mysql-setup.ts
└── public/                  # Fichiers statiques
\`\`\`

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Sessions sécurisées avec JWT
- Cookies HTTP-only
- Protection CSRF
- Validation des entrées
- Row Level Security sur les données

## 🗄️ Schéma de base de données

### Tables principales

- **users** - Informations des employés
- **bulletins** - Bulletins de salaire
- **salary_components** - Composantes du salaire
- **deductions** - Retenues et cotisations
- **connection_logs** - Historique des connexions

## 🚀 Déploiement

### Build de production

\`\`\`bash
npm run build
npm start
\`\`\`

### Variables d'environnement en production

Assurez-vous de configurer toutes les variables d'environnement sur votre plateforme de déploiement (Vercel, Railway, etc.)

## 📝 Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Créer un build de production
- `npm start` - Démarrer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est la propriété de Sonatel.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
# esalaire-vercel
