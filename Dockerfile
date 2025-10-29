# Gunakan base image Debian terbaru (bullseye atau bookworm)
FROM node:lts-bullseye

# Install dependency yang dibutuhkan
RUN apt-get update && \
    apt-get install -y \
        ffmpeg \
        imagemagick \
        webp && \
    rm -rf /var/lib/apt/lists/*

# Salin file package.json dulu agar cache npm bisa efisien
COPY package.json ./

# Install dependensi Node.js
RUN npm install

# Salin semua file proyek
COPY . .

# Jalankan aplikasi
CMD ["npm", "start"]
