# Utilisez une image de base contenant Node.js pour construire votre application React
FROM node:alpine as build

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tous les fichiers de l'application dans le conteneur
COPY . ./

# Construisez l'application React
RUN npm run build

# Utilisez une image de base légère pour exécuter votre application React
FROM nginx:alpine

# Copiez les fichiers construits de l'application React dans le répertoire public de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposez le port 80 pour accéder à votre application via le navigateur
EXPOSE 80

# Commande pour démarrer le serveur Nginx
CMD ["nginx", "-g", "daemon off;"]